// Curated photography per vehicle (ids from scripts/optimize-images.mjs). Vehicle facts come from Sanity.
type Shot = {id: string; alt: string}
export type VehicleMedia = {cover: string; hero: string; heroPos?: string; chapters: {title: string; shots: Shot[]}[]}

const s = (id: string, alt: string): Shot => ({id, alt})

export const vehicleMedia: Record<string, VehicleMedia> = {
  'audi-rs4': {
    cover: 'rs4-1', hero: 'rs4-2', heroPos: '50% 62%',
    chapters: [
      {title: 'Exteriér', shots: [s('rs4-1', 'Audi RS4 Avant, pohled zepředu'), s('rs4-3', 'Audi RS4 Avant, zadní tříčtvrteční pohled'), s('rs4-4', 'Audi RS4 Avant v showroomu'), s('rs4-6', 'Audi RS4 Avant zezadu'), s('rs4-5', 'Zadní část Audi RS4 Avant'), s('rs4-7', 'Kolo Audi RS4 Avant s karbon-keramickou brzdou')]},
      {title: 'Interiér', shots: [s('rs4-8', 'Interiér Audi RS4 Avant, otevřené dveře'), s('rs4-9', 'Přístrojová deska Audi RS4 Avant'), s('rs4-10', 'Sportovní sedadlo Audi RS4 Avant'), s('rs4-11', 'Středový tunel Audi RS4 Avant'), s('rs4-12', 'Palubní deska Audi RS4 Avant')]},
    ],
  },
  'jaguar-xj-sovereign': {
    cover: 'jaguar-2', hero: 'jaguar-6', heroPos: '50% 60%',
    chapters: [
      {title: 'Exteriér', shots: [s('jaguar-2', 'Jaguar XJ Sovereign z boku'), s('jaguar-1', 'Jaguar XJ Sovereign zepředu'), s('jaguar-3', 'Jaguar XJ Sovereign zezadu'), s('jaguar-7', 'Maska Jaguaru XJ Sovereign'), s('jaguar-8', 'Detail zrcátka'), s('jaguar-14', 'Kolo Jaguaru XJ Sovereign')]},
      {title: 'Interiér', shots: [s('jaguar-9', 'Interiér Jaguaru XJ, otevřené dveře'), s('jaguar-10', 'Dřevěný obklad palubní desky'), s('jaguar-11', 'Přístroje Jaguaru XJ'), s('jaguar-12', 'Zadní sedadla Jaguaru XJ')]},
      {title: 'Technika', shots: [s('jaguar-13', 'Dvanáctiválec 5.3 V12'), s('jaguar-5', 'Zadní část s označením V12')]},
    ],
  },
  'vw-multivan-highline': {
    cover: 'multivan-1', hero: 'multivan-3', heroPos: '50% 60%',
    chapters: [
      {title: 'Exteriér', shots: [s('multivan-1', 'Volkswagen Multivan T6.1, pohled zepředu'), s('multivan-2', 'Multivan T6.1 Highline zepředu'), s('multivan-3', 'Multivan T6.1 v showroomu'), s('multivan-4', 'Multivan T6.1 zezadu'), s('multivan-6', 'Multivan T6.1 zezadu z boku'), s('multivan-15', 'Kolo Multivanu T6.1')]},
      {title: 'Interiér', shots: [s('multivan-8', 'Přední sedadla Multivanu'), s('multivan-9', 'Kokpit Multivanu'), s('multivan-10', 'Palubní deska Multivanu'), s('multivan-11', 'Digitální přístroje Multivanu'), s('multivan-12', 'Infotainment Multivanu'), s('multivan-13', 'Zadní sedadla'), s('multivan-14', 'Stolek v kabině'), s('multivan-7', 'Zavazadlový prostor')]},
      {title: 'Technika', shots: [s('multivan-16', 'Motorový prostor 2.0 TDI')]},
    ],
  },
  'skoda-octavia-rs-mk1': {
    cover: 'octavia-1', hero: 'octavia-3', heroPos: '50% 62%',
    chapters: [
      {title: 'Exteriér', shots: [s('octavia-1', 'Škoda Octavia RS Mk1, přední tříčtvrteční pohled'), s('octavia-2', 'Škoda Octavia RS zepředu'), s('octavia-4', 'Škoda Octavia RS zezadu z boku'), s('octavia-5', 'Škoda Octavia RS zezadu'), s('octavia-6', 'Škoda Octavia RS, zadní část'), s('octavia-7', 'Kolo s limetkovým třmenem')]},
      {title: 'Interiér', shots: [s('octavia-8', 'Interiér Octavie RS'), s('octavia-9', 'Kožená sedadla Octavie RS'), s('octavia-10', 'Řadicí páka, manuální 6st.'), s('octavia-11', 'Přístroje Octavie RS')]},
      {title: 'Technika', shots: [s('octavia-12', 'Motor 1.8T'), s('octavia-13', 'Podvozek zespodu'), s('octavia-14', 'Zavěšení a pružiny'), s('octavia-15', 'Spodek vozu na zvedáku')]},
    ],
  },
}

export const coverFor = (slug: string) => vehicleMedia[slug]?.cover
