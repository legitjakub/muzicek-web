# Redesign v2 — proč je to pořád „obyčejné“ a co s tím

## Diagnóza (co jsem viděl na vlastních screenshotech)

| # | Problém | Kde |
|---|---|---|
| A | **Jedna kompozice pořád dokola.** Každý hero = velký nadpis vlevo dole, vlasová čára, perex vlevo, odkazy vpravo. Auta, Servis, Detailing i 9 detailů vypadají stejně. | všechny hero |
| B | **Vlasové řádky jsou nové karty.** Benefity, kroky, „péče od nás“, výbava, ledger, související služby – vše je seznam s čárou mezi řádky. | detaily, RS6, vozy, Servis |
| C | **Fotky jsou vždy obdélníky** s maskou a 7 % parallaxe. Žádné prolínání typu a fotky, překryvy, výřezy, popisky přímo na fotce. | všude |
| D | **Typografie bez šoku.** Všechno je „velké“, nic není *extrémní* (žádný text přes celou šířku, žádné měřítkové kontrasty, žádný kinetický text). | všude |
| E | **Sekce jsou izolované plochy** – žádný přechod barvy/světla mezi nimi, stránka se „nevyvíjí“. | všude |
| F | **Jen scroll.** Žádný moment, který reaguje na kurzor/dotek. | všude |
| G | **Závěr je pokaždé stejný** (nadpis + formulář). | všude |

## Princip v2: každý svět dostane jeden vlastní vizuální *prostředek*

- **Auta → typ a číslo jako kus karoserie**: kinetický serif, veliké číslice, „výřezy“ ve slovech.
- **Servis → technický výkres**: popisky s odkazovými čarami přímo na fotce, měřicí kříže, kinetické obrysové značky, formulář jako *zakázkový list*.
- **Detailing → světlo**: inspekční lampa, která sleduje kurzor (na dotyku se hýbe se scrollem), výřezy písmen oknem do laku.

## Vlna 1 (tohle teď dělám)

1. **Hub – intro**: obří MUŽÍČEK, jehož písmena jsou „okna“ do jasné fotky haly (zbytek ztmavený).
2. **Hub – stage**: odometr 01→02→03 (číslice se převalují se scrollem) + jemný pohyb fotky za kurzorem.
3. **Kinetické pásy textu** (řízené scrollem, ne animace na pozadí): Auta = kurzíva v serifu, Servis = obrys vs. plná výplň v protisměru (značky), Detailing = materiály.
4. **Servis – „Anatomie brzdy“**: fotka kotouče s popisky a čarami, které se kreslí (jen to, co je na fotce vidět).
5. **Detailing – inspekční lampa** přes makro laku (kurzor / scroll).
6. **Hero kompozice podle světa**: Servis = nadpis nahoře + pás dole; Detailing = nadpis vpravo; Auta = nadpis centrovaný v dolní třetině s vertikálním popiskem.
7. **Přechody mezi sekcemi** (Auta: papír → inkoust před „předáním“; Servis: bench → světlý pás; Detailing: studio → grafit už funguje).
8. **Různé závěry**: Servis = *zakázkový list* (číslovaná pole), Auta = list papíru s velkým serifem, Detailing = osvětlený panel.
9. **Cars reel jako filmový pás** (perforace, čísla políček).

## Vlna 2 (po tvém schválení vlny 1)
- Přepsat „hairline seznamy“ v detailech služeb na 3 různé formy podle světa (Auta: velké číslice + serif věty; Servis: tabulka parametrů; Detailing: vrstvy, které se skládají).
- Skutečné fotky před/po, až je klient dodá (slider je připravený v plánu, ne v kódu).
- Krátká smyčka videa v hero každého světa (≤ 2 MB).
- Per-vozidlo odometr (rok / km / kW / cena se převalují při změně vozu).

## Pravidla
Žádné nové knihovny; stále jen `transform` / `opacity` / `clip-path` / CSS proměnné; vše musí fungovat bez JS a při omezeném pohybu; žádná vymyšlená fakta v popiscích.
