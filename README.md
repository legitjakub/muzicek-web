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
- Scrollové efekty řídí `src/scripts/motion.ts` a `src/styles/motion.css`. Jsou progresivní: při vypnutém JavaScriptu zůstává obsah viditelný, při nastavení „omezit pohyb“ se animace a automatické video vypnou. Horizontální galerie na telefonu funguje jako běžná posuvná galerie.
