# Content to confirm / supply (client)

Nothing below is invented on the site; these are the places where the design is ready for richer content.

1. **Project stories** (`src/data/projects.ts`): for each realisation we need — customer goal, starting condition, issues found, hours/duration, before/after photo *pairs*. Only the Audi RS6 care list and photos are currently available. A before/after slider is deliberately **not** shipped until real pairs exist.
2. **More projects**: Corvette ZR1 renovation currently exists only as a film. Photos + facts would allow a full project page.
3. **Notion brief**: could not be opened (login). Please compare naming (e.g. "Detailing & Ochrana") and any must-have sections.
4. **Film posters**: the Corvette poster is the first YouTube frame (a talking-head). A hero still from the film would be better.
5. **Brand assets**: original videos/PDF live in the ignored `source-materials/brand/`. A short (≤ 8 s, ≤ 2 MB) loop for each world hero would be a drop-in upgrade.
6. **Business facts shown**: address, hours, phone, e-mail, Instagram handle — taken from the legacy contact page; confirm they are current. IČO/DIČ intentionally not shown.
7. **Price notes** (Sanity `priceNote`) are shown as written, e.g. "Drobné aplikace od 2 490 Kč".
8. **Vehicle photos**: only vehicles with archived photo sets get galleries (RS4, Multivan, Jaguar, Octavia). A new vehicle needs an entry in `src/data/vehicleMedia.ts`.
