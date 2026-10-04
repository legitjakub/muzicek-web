# MUŽÍČEK — hub & microsites redesign

Working document: audit → map → concept → section plan → motion map → responsive → implementation notes.
Notion (project + detailed spec) is behind a login and could not be opened from the build environment; decisions follow
`source-materials/PROJECT_CONTEXT.md`, the legacy site archive and the brief in this task. **Please re-check against Notion.**

## 1. Current-state analysis (before)

| Area | What it did | Verdict |
|---|---|---|
| Hub `/` | One screen: 3 text rows over a background that cross-faded on hover / every 5.6 s | Not a journey. Hover-driven (dead on touch), no scroll narrative, no brand intro, rows read as a menu |
| `/auta/` | Split hero (text left, photo right) → route list → inventory list → image+text → sticky story → 3-image rail → CTA | The generic "hero → list → image+text → list → CTA" rhythm. Hero image sat in a half-column |
| `/servis/` | Full hero → 4-fact band → ledger → mosaic → image+text → CTA | Best of the three, but facts band and mosaic were static; no workshop narrative |
| `/detailing/` | Split hero with video → statement → service paths → horizontal gallery → CTA | Video as 40 % column, gallery of unrelated images, no surface/material idea |
| `/{area}/{service}` | Same template for all 9 services: split hero, intro, 3-column dark evidence strip, related list, form | Identical for cars / workshop / detailing; 3-column strip cropped photos badly |
| `/auta/vozy/` + detail | Row list with thumbnails; detail = split hero, data table, 3-image grid | Ecommerce-ish list; only 3 of ~25 available photos per car used |
| Projects | **Did not exist** — even though the legacy site has a full 25-photo Audi RS6 project and a Corvette ZR1 renovation film | Biggest missed opportunity |
| Motion | IntersectionObserver fade-ups, one rAF parallax, one horizontal gallery | Same fade-up on everything; no scroll-scrubbed state |
| Assets | ~40 MB of 1.2 MB JPEGs in `public/`, no responsive sizes, no dimensions (CLS risk) | Replaced by a pipeline |

## 2. Route / microsite map

```
/                                   hub: brand intro → sticky 3-world selector → manifesto → featured project
/auta/                              01 CARS landing
  /auta/vozy/                       inventory (editorial spreads, not cards)
  /auta/vozy/{audi-rs4|vw-multivan-highline|jaguar-xj-sovereign|skoda-octavia-rs-mk1}/
  /auta/{dovoz-vozidel|prodej-vaseho-vozu|preprava-vozidel}/
/servis/                            02 SERVICE & PERFORMANCE landing
  /servis/{servis-a-performance|suchy-led|antikorozni-ochrana-podvozku}/
/detailing/                         03 DETAILING & PROTECTION landing
  /detailing/{ppf|wrap-folie|tonovani-skel|cisteni-a-myti|lesteni-a-ochrana-laku|individualni-renovace}/
/realizace/                         NEW  projects index
  /realizace/audi-rs6/              NEW  project story (data-driven: src/data/projects.ts)
```
All previous URLs and every legacy redirect are preserved (`astro.config.mjs`); `/audi-rs6` and `/galerie` now redirect to the new project pages.

## 3. Problems found (summary)
Generic rhythm; half-width hero images; no scroll-linked storytelling; cards/lists as the default; one template for nine services;
no projects; hover-only hub; weak imagery pipeline; three different header systems; inline pixel-pinned layout CSS hard to evolve.

## 4. Redesigned hub — concept

*One cinematic stage → three automotive worlds.* After a 100 svh brand intro (the real hall, one statement) a 420 vh track
holds a single sticky 100 svh stage. Native scroll only — progress is read, never hijacked.

- Three full-bleed photographs that change **character**, not just text: showroom (Cayman GT4) → mechanical macro (carbon-ceramic caliper) → surface macro (PPF film).
- World *n+1* **wipes in from the bottom** (clip-path) while the image settles from a wider lens; world *n* sinks, zooms and darkens.
- Titles are masked lines: the outgoing title is cropped away upward, the incoming one rises line-by-line (second line lags). Statement, tags and CTA follow with a delayed fade.
- Per-world treatment: Cars natural & bright · Servis desaturated + corner registration marks · Detailing saturated + a single specular pass crossing the frame.
- Right-hand index **01 Auta / 02 Servis / 03 Detailing** with a progress hairline; items are links (click → smooth-scroll to that state; ↑↓←→ move between them).
- Each title is also a normal link to its microsite; only the active world is focusable (`inert` on the rest).
- After state 3 the sticky stage releases and the page continues (manifesto with layered parallax photos, featured RS6 project, footer).
- **Mobile / tablet-portrait / reduced motion / no-JS**: no pinning. Each world is a 100 svh block, image dominant, real links visible, text reveals on entry.

## 5. Cars — art direction (bright, clean, editorial)
Warm paper `#f1efe9`, ink black, Instrument Serif for headlines, Barlow Condensed for labels/numerics. Showroom light, generous space.
Signature: **showroom sequence** — pinned stage, each vehicle wipes in from the right while spec rows and price swap; ticks 01–04 are links.
Inventory never appears as cards: every car is a full spread with 4 key figures.

## 6. Service — art direction (technical, mechanical)
Near-black `#0d0f11`, steel hairlines, uppercase Barlow Condensed, understated corner ticks and numbered "standards" (no HUD).
Signature: **sticky workshop bench** — a mechanical image on the left changes (battery check → caliper → wrench → finished M2) with a vertical wipe and a scan line, while the four working stages cross-fade on the right with a gauge. Plus: spec-sheet ledger (duration / pricing note from Sanity), dry-ice slit that opens to full frame, annotated underbody strip.

## 7. Detailing — art direction (surface, light, material)
Studio grey `#e3e5e5` alternating with graphite. Signature: **film sequence** — four real photographs (peel → door → application → tint) separated by a bright specular edge that tracks a horizontal wipe; captions step with it. Plus: a light pass over the paint macro, expanding service strips (focus/hover widens one strip, every strip is a link), a lazily-played process video, RS6 evidence block.

## 8. Section-by-section

**Hub** — intro (hall photo, statement) · selector (3 states) · manifesto (sticky text + 3 layered parallax photos) · featured RS6 (frame opens on scroll).
**Cars** — hero (frame opens, serif title) · word-by-word statement · showroom sequence · three routes as asymmetric rows (60/40, 40/60, wide) · "frame opens" interruption (hand-over) · process with a drawn line · pinned horizontal reel of real cars · calm CTA + form.
**Servis** — hero with linked spec strip · brand statement · sticky bench · ledger · dry-ice slit · "Podvozek, který je vidět" strip · CTA.
**Detailing** — hero (surface wipe) · "read the surface" (30/70, sticky text + oversized image) · film sequence · service strips · process video · RS6 evidence · Corvette film (click-to-load) · CTA.
**Service detail (×9)** — hero with duration/price facts · oversized intro title + numbered benefits · full-bleed photo · stepped process (line colours as you read) · optional PPF video · image + cross-link (RS6 for PPF/lak/tint) · related services as rows · form. Typography follows the world (serif in Cars, condensed in the others).
**Inventory** — compact hero · alternating spreads · "we'll find it" CTA. **Vehicle** — hero with price/state · 8 figures · story (word reveal) · chapters (Exteriér / Interiér / Technika) in asymmetric galleries · equipment list · next vehicle · inquiry (car pre-filled) · `Car` JSON-LD.
**Realizace** — hero · RS6 lead spread · "Z dílny" pinned reel (each photo links to its service) · Corvette film · cars teaser · form. **Project** — hero with year/engine/power · numbered care list linked to services · pinned exterior rail · interior grid · technical full-bleed · services used · form.

## 9. Motion map (what animates, and why)

| Where | Technique | Purpose |
|---|---|---|
| Hub intro | Image settles from 1.2× + darkened; line-masked h1 | Cinematic arrival, one confident reveal |
| Hub selector | Scrubbed `--in/--out` per world: bottom wipe, lens settle, cropped titles, delayed copy, specular pass | One stage transforming between worlds |
| Hub nav | Progress hairline + `aria-current`, click/arrow scroll | Orientation, non-scroll access |
| Hub featured | Clip frame opens with scroll | Makes the project feel like a chapter break |
| Cars hero | Frame opens (clip) + lens settle | "Entering the showroom" |
| Cars statement | Words light up with scroll | Reading pace = scroll pace |
| Cars showroom | Pinned: right-edge wipe + spec swap | Product sequence with matching data |
| Cars paths | Masked image reveal + parallax, staggered list | Asymmetric editorial rows |
| Cars process | Line draws, steps light in order | Progression |
| Cars reel | Pinned horizontal rail | Filmstrip, justified by image count |
| Servis hero | Shutter (top→down clip), staggered strip | Workshop door opening |
| Servis bench | Pinned: vertical wipe + scan line + gauge | Process as inspection |
| Servis ice | Vertical slit → full frame | Pressure/steam "opening" |
| Servis lift | Horizontal mask reveals | Technical evidence |
| Detailing hero | Studio panel wipes off with a light edge | Surface being revealed |
| Detailing read | Parallax + light pass | Reading paint in side light |
| Detailing film | Pinned: wipe with specular edge | Film laid layer by layer |
| Detailing strips | Flex-grow on hover/focus | Choose-by-intent without cards |
| Detailing video | Plays only when ≥35 % visible | Performance + honesty |
| Contact blocks | Plain line reveal, no scroll-scrub | Calm end of page |

All of it is driven by one rAF loop reading `getBoundingClientRect()` for sections near the viewport and writing CSS variables
(`--p`, `--s`, `--in`, `--out`, `--hx`, `--py`). Only `transform`, `opacity` and `clip-path` are animated.

## 10. Responsive behaviour
- ≥ 900 px and motion allowed: pinned tracks (hub, showroom, bench, film sequence, horizontal rails).
- < 900 px, tablet portrait, `prefers-reduced-motion`, or no JS: **no pinning**. States stack as normal blocks (hub worlds 100 svh each; showroom = one spread per car; bench = images then steps; rails = native horizontal swipe with snap).
- `prefers-reduced-motion`: reveal states are never applied (`html.rm`), parallax off, video not autoplayed (controls shown), hero animations off.
- Header hides on scroll down, returns on scroll up; full-screen menu lists every world, service and the inventory (crawlable links).

## 11. Assets & content preserved
Sanity: areas, services (copy, benefits, duration, price notes), vehicles (all facts). Legacy archive: RS6 care list, "Od roku 2014…" intro, renovation text,
contact data. Photography: all curated public photos + 60 more from the archive (`scripts/optimize-images.mjs`). Contact form (mailto flow). Corvette ZR1 film (click-to-load, privacy-enhanced embed).

## 12. Removed
Half-width hero layouts · three-column "evidence" strip · hover-driven hub · five different per-page CSS systems with fixed pixel offsets · `MicrositeHeader`, `ArrowIcon`, `MotionDirector`, `vehicleDisplay`, old `motion.ts/css` · 40 MB of un-sized JPEGs from `public/` (originals moved to `source-materials/photos/`).

## 13. Implementation notes
- Astro static, Sanity at build (memoised: one round trip). No animation library: ~6 KB gz of own JS (`src/scripts/core.ts`) — chosen over GSAP/ScrollTrigger because the only features needed are progress → CSS variables and `position: sticky`; keeps INP trivial.
- Images: `npm run images` → `public/img/{id}-1600|800.webp` + `src/data/images.json` (dimensions + dominant colour so every `<img>` has width/height/placeholder). Self-hosted fonts (Barlow Condensed, Instrument Serif, Inter Tight) with latin + latin-ext preload.
- Measured on a production build with 1.6 Mbit throttling: **LCP 0.4–0.8 s desktop, 0.35–1.9 s mobile; CLS 0**.
- SEO: all copy is real HTML (split headings keep an `sr-only` full-text twin), one `h1` per page, canonical, OG, `AutomotiveBusiness`, `Service`, `Car` JSON-LD, crawlable menu.
- Honesty rules: no invented numbers, awards, testimonials or prices. Anything that needs client confirmation is in `docs/CONTENT-GAPS.md`.
