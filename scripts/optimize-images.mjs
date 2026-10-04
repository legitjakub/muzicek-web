// Builds the optimised photo set used by the site.
// Sources: source-materials/photos (curated originals) and the legacy archive in source-materials.
// Output : public/img/<id>-1600.webp, <id>-800.webp and src/data/images.json (size + dominant colour).
import sharp from 'sharp'
import {readdirSync, mkdirSync, writeFileSync, existsSync} from 'node:fs'
import {join} from 'node:path'

const root = new URL('..', import.meta.url).pathname
const legacy = join(root, 'source-materials/legacy-site/assets')
const legacyFiles = readdirSync(legacy)
const L = (n) => join(legacy, legacyFiles.find((f) => f.startsWith(String(n).padStart(3, '0') + '-')))
const M = (f) => join(root, 'source-materials/photos/media', f)
const I = (f) => join(root, 'source-materials/photos/images', f)

const range = (prefix, from, to) => Object.fromEntries(Array.from({length: to - from + 1}, (_, i) => [`${prefix}-${i + 1}`, L(from + i)]))
const pick = (prefix, nums) => Object.fromEntries(nums.map((n, i) => [`${prefix}-${i + 1}`, L(n)]))

const sources = {
  // atelier & brand
  hala: M('hala.jpg'), 'gt4-hall': I('import.jpg'), 'hands-wrench': I('service.jpg'), 'van-trailer': I('transport.jpg'),
  'porsche-lift': I('studio-security.jpg'), 'porsche-911-front': M('atelier.jpg'), 'van-field': L(12),
  'film-corvette': join(root, 'source-materials/film-corvette-poster.jpg'),
  // detailing
  'ppf-door': M('ppf-work.jpg'), 'ppf-m3': M('ppf-film.jpg'), 'film-peel': L(75), 'film-door': L(74), 'alfa-detail': M('alfa-4c-detail.jpg'), 'alfa-4c': M('alfa-4c.jpg'),
  defender: M('defender-v8.jpg'), 'amg-gt-yellow': M('amg-yellow.jpg'), 'aston-vanquish': M('aston-vanquish.jpg'), 'm3-cover': I('bmw-m3.jpg'), 'm3-grille': M('bmw-m3-touring.jpg'),
  'gtr-nismo': M('gtr-nismo.jpg'), merak: M('maserati-merak.jpg'), escort: M('ford-escort.jpg'), impreza: M('impreza-prodrive.jpg'), 'mercedes-gtr': I('mercedes-gtr.jpg'), volvo: M('volvo-v60.jpg'), 'porsche-cabin': M('porsche-pair.jpg'),
  'polish-worker': L(54), 'polish-m3': L(55), 'worker-interior': L(53), 'worker-lamp': L(49),
  'tint-1': L(79), 'tint-2': L(80), 'tint-3': L(81), 'tint-4': L(82), 'tint-5': L(83), 'tint-6': L(84), hail: L(85),
  // service
  caliper: L(60), 'wrench-brake': L(68), battery: L(69), 'cayman-wing': M('service-cayman.jpg'), 'm2-rear': M('service-bmw-m2.jpg'), 'cayenne-exhaust': M('service-cayenne.jpg'),
  'dry-ice-1': M('dry-ice-1.jpg'), 'dry-ice-3': M('dry-ice-3.jpg'), 'dry-ice-4': M('dry-ice-4.jpg'), 'dry-ice-5': L(77), 'dry-ice-6': L(78),
  // projects
  ...range('rs6', 89, 112),
  // vehicles
  ...range('rs4', 198, 209),
  ...pick('jaguar', [144, 145, 146, 147, 148, 149, 150, 151, 153, 156, 157, 158, 166, 167]),
  ...pick('octavia', [114, 115, 116, 117, 118, 119, 120, 121, 122, 124, 126, 128, 129, 130, 133, 136]),
  ...pick('multivan', [169, 170, 171, 172, 173, 174, 175, 176, 177, 179, 180, 182, 191, 193, 195, 197]),
}

mkdirSync(join(root, 'public/img'), {recursive: true})
const meta = {}
for (const [id, file] of Object.entries(sources)) {
  if (!existsSync(file)) throw new Error(`missing ${id}: ${file}`)
  const img = sharp(file).rotate()
  const {width, height} = await img.metadata()
  const {dominant, channels} = await img.clone().resize(24, 24, {fit: 'cover'}).stats()
  const avg = channels.map((c) => Math.round(c.mean))
  for (const w of [1600, 800]) {
    if (existsSync(join(root, `public/img/${id}-${w}.webp`)) && process.env.FORCE !== '1') continue
    await sharp(file).rotate().resize({width: Math.min(w, width), withoutEnlargement: true}).webp({quality: w === 1600 ? 70 : 66, effort: 5}).toFile(join(root, `public/img/${id}-${w}.webp`))
  }
  meta[id] = {w: width, h: height, c: `rgb(${avg.join(',')})`, max: Math.min(1600, width)}
}
mkdirSync(join(root, 'src/data'), {recursive: true})
writeFileSync(join(root, 'src/data/images.json'), JSON.stringify(meta, null, 1))
console.log(Object.keys(meta).length, 'images')
