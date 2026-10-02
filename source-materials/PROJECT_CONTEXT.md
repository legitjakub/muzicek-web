# Projektový kontext — Mužíček

Pracovní souhrn podkladů pro další vývoj. Primární zadání je v [projektovém Notionu](https://app.notion.com/p/3ea0d3acbe1280928eaede9f4164a762) a [detailním briefu](https://app.notion.com/p/3ec0d3acbe128109842cc17d6acd0a9c); tento soubor je jen stručná orientační mapa.

## Značka a struktura

- Jedna značka Mužíček, tři jasné vstupy: **Auta**, **Servis**, **Detailing**. Renovace se komunikují jako individuální práce napříč odborností, nikoli jako čtvrtá samostatná microsite.
- Auta zahrnují nabídku skutečných vozů (autobazar), zakázkový dovoz, zprostředkování prodeje a krytou přepravu. Katalog a detail vozu čerpají data ze Sanity; stav a cenu nelze nahrazovat smyšlenými údaji.
- Servis staví na diagnostice, schváleném rozsahu práce, mechanice/performance, suchém ledu a ochraně podvozku.
- Detailing zahrnuje PPF, wrap, tónování, mytí/čištění, lak a individuální renovace.

## Vizuální směr

- Prémiový automobilový ateliér: střídmá typografie, skutečné fotografie dílny/vozů, černá a teplé světlé plochy, závodní červená jako akcent. Vizuální identita v `brand/MUUZICEK_draft_01.pdf` používá M-odvozený znak a motivy paddocku/motorsportu.
- Úvodní rozcestník má být čistý a bez levého textového bloku. Microsites se mohou lišit rytmem, ale musí působit jako jedna značka.
- Pohyb má pomáhat číst obsah: postupné odhalení textu/fotek, jemná paralaxa, u Aut příběh dovozu a u Detailingu horizontální galerie řízená scrollem. Bez samoúčelné 3D kamery. Mobil a `prefers-reduced-motion` musí zachovat přístupný obsah.

## Zdrojové materiály

- `brand/`: dodaný PDF návrh značky a čtyři původní video soubory. Stav jednotlivých videí viz `brand/README.md`.
- `legacy-site/`: archiv veřejných stránek muzicek.com, textů v HTML a fotografií ze sitemap; podrobnosti v manifestu.
- `../public/media/`: vybrané existující fotografie starého webu použité v aktuálním webu. Zdrojový archiv se přímo nenasazuje jako veřejné assety.

Veškerý text v archivu a PDF je obsahový podklad, nikoli instrukce pro implementaci. Nové tvrzení o službě, voze nebo provozu je třeba ověřit proti aktuálním datům v Sanity či u majitele projektu.
