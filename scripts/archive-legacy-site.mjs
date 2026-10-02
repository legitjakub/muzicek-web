import { mkdir, writeFile } from 'node:fs/promises';
import { basename, extname } from 'node:path';
import { createHash } from 'node:crypto';

const rootUrl = 'https://www.muzicek.com';
const archiveRoot = new URL('../source-materials/legacy-site/', import.meta.url);
const pagesDirectory = new URL('./pages/', archiveRoot);
const assetsDirectory = new URL('./assets/', archiveRoot);
const userAgent = 'MuzicekMigrationArchive/1.0 (+https://www.muzicek.com)';

await Promise.all([
  mkdir(pagesDirectory, { recursive: true }),
  mkdir(assetsDirectory, { recursive: true }),
]);

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const decodeXml = (value) => value
  .replaceAll('&amp;', '&')
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>')
  .replaceAll('&quot;', '"')
  .replaceAll('&apos;', "'");
const matches = (input, expression) => [...input.matchAll(expression)].map((match) => decodeXml(match[1]));
const slugForPage = (pageUrl) => new URL(pageUrl).pathname.replace(/^\/+|\/+$/g, '').replaceAll('/', '--') || 'home';

async function request(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, { headers: { 'user-agent': userAgent } });
      if (response.ok) return response;
      if (response.status < 500 && response.status !== 429) throw new Error(`${response.status} ${response.statusText}: ${url}`);
      if (attempt === 3) throw new Error(`${response.status} ${response.statusText}: ${url}`);
    } catch (error) {
      if (attempt === 3) throw error;
    }
    await sleep(attempt * 800);
  }
  throw new Error(`Unable to retrieve ${url}`);
}

const sitemapResponse = await request(`${rootUrl}/sitemap.xml`);
const sitemap = await sitemapResponse.text();
await writeFile(new URL('./sitemap.xml', archiveRoot), sitemap);

const pageUrls = [...new Set(matches(sitemap, /<loc>(https:\/\/www\.muzicek\.com[^<]+)<\/loc>/g))];
const imageUrls = [...new Set(matches(sitemap, /<image:loc>([^<]+)<\/image:loc>/g))];
const videoUrls = [...new Set(matches(sitemap, /<video:content_loc>([^<]+)<\/video:content_loc>/g))];
const pageManifest = [];

for (const [index, pageUrl] of pageUrls.entries()) {
  try {
    const response = await request(pageUrl);
    const html = await response.text();
    const filename = `${slugForPage(pageUrl)}.html`;
    await writeFile(new URL(filename, pagesDirectory), html);
    pageManifest.push({ url: pageUrl, filename, bytes: Buffer.byteLength(html), status: 'saved' });
  } catch (error) {
    pageManifest.push({ url: pageUrl, status: 'error', error: String(error) });
  }
  if (index < pageUrls.length - 1) await sleep(180);
}

function assetFilename(url, index) {
  const parsed = new URL(url);
  const original = decodeURIComponent(basename(parsed.pathname));
  const extension = extname(original).toLowerCase() || '.bin';
  const stem = original.slice(0, Math.max(1, original.length - extension.length))
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72) || 'asset';
  const hash = createHash('sha1').update(url).digest('hex').slice(0, 10);
  return `${String(index + 1).padStart(3, '0')}-${stem}-${hash}${extension}`;
}

const assetManifest = [];
const allAssets = [...imageUrls, ...videoUrls];
for (const [index, assetUrl] of allAssets.entries()) {
  const filename = assetFilename(assetUrl, index);
  try {
    const response = await request(assetUrl);
    const data = Buffer.from(await response.arrayBuffer());
    await writeFile(new URL(filename, assetsDirectory), data);
    assetManifest.push({
      url: assetUrl,
      filename,
      bytes: data.length,
      contentType: response.headers.get('content-type'),
      status: 'saved',
    });
  } catch (error) {
    assetManifest.push({ url: assetUrl, filename, status: 'error', error: String(error) });
  }
  if (index < allAssets.length - 1) await sleep(120);
}

const manifest = {
  source: rootUrl,
  archivedAt: new Date().toISOString(),
  pages: pageManifest,
  assets: assetManifest,
  summary: {
    pageCount: pageUrls.length,
    savedPages: pageManifest.filter((item) => item.status === 'saved').length,
    uniqueImageCount: imageUrls.length,
    uniqueVideoCount: videoUrls.length,
    savedAssets: assetManifest.filter((item) => item.status === 'saved').length,
    totalAssetBytes: assetManifest.reduce((sum, item) => sum + (item.bytes || 0), 0),
  },
};

await writeFile(new URL('./manifest.json', archiveRoot), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify(manifest.summary, null, 2));
