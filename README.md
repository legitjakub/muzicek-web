# Mužíček

Web pro Mužíček Car Detailing v Jablonci nad Nisou. Úvodní rozcestník propojuje tři samostatné části: Auta, Servis a Detailing.

Veřejná verze webu: [legitjakub.github.io/muzicek-web](https://legitjakub.github.io/muzicek-web/)

## Technologie

- Astro
- Sanity CMS

## Lokální vývoj

```sh
npm ci
npx astro dev --background
```

Server lze zkontrolovat pomocí `npx astro dev status`, výpis získat přes `npx astro dev logs` a ukončit příkazem `npx astro dev stop`.

Produkční sestavení:

```sh
npm run build
```

## Obsah a vizuální podklady

- Nabídka vozů a obsah servisních stránek se načítá ze Sanity. Katalog vypisuje reálné vozy; vybrané lokální fotografie pocházejí ze starého webu.
- Původní web (27 HTML stránek a 217 obrázků) uchovává [`source-materials/`](source-materials/README.md). Archiv lze obnovit příkazem `npm run archive:legacy`. Dodaný návrh identity a originální videa zůstávají lokálně v ignorované složce `source-materials/brand/`, protože tento repozitář je veřejný.
- Fotografie se generují příkazem `npm run images` (`scripts/optimize-images.mjs`, originály v `source-materials/photos/`) do `public/img/`.
- Pohyb řídí `src/scripts/core.ts` (jedna rAF smyčka, scroll → CSS proměnné, nativní scroll se nikdy neblokuje). Je progresivní: bez JavaScriptu, na telefonu a při „omezit pohyb“ se sekce zobrazí jako běžné bloky bez pinování.
- Návrh, mapa pohybu a plán: [`docs/REDESIGN.md`](docs/REDESIGN.md). Chybějící podklady od klienta: [`docs/CONTENT-GAPS.md`](docs/CONTENT-GAPS.md).
