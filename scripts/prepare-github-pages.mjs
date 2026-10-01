import { readFile, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { extname, join } from 'node:path';

const outputDirectory = fileURLToPath(new URL('../dist/', import.meta.url));
const prefix = '/muzicek-web';
const textExtensions = new Set(['.html', '.css', '.js', '.json', '.xml']);

async function rewriteDirectory(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      await rewriteDirectory(path);
      continue;
    }

    if (!textExtensions.has(extname(entry.name))) continue;

    const original = await readFile(path, 'utf8');
    const rewritten = original
      .replaceAll('href="/', `href="${prefix}/`)
      .replaceAll("href='/", `href='${prefix}/`)
      .replaceAll('src="/', `src="${prefix}/`)
      .replaceAll("src='/", `src='${prefix}/`)
      .replaceAll('content="url=/', `content="url=${prefix}/`)
      .replaceAll('url(/', `url(${prefix}/`)
      .replaceAll('url("/', `url("${prefix}/`)
      .replaceAll("url('/", `url('${prefix}/`)
      .replaceAll(`${prefix}${prefix}/`, `${prefix}/`);

    if (rewritten !== original) await writeFile(path, rewritten);
  }
}

await rewriteDirectory(outputDirectory);
