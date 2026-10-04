// Realizace. Only facts published on the legacy site are used here.
// Fields marked "k ověření" in docs/CONTENT-GAPS.md are intentionally absent until the client supplies them.
export type Project = {
  slug: string; title: string; year: string; engine: string; power: string; lede: string
  hero: string; heroPos?: string
  care: {t: string; service: string}[]
  exterior: {id: string; alt: string}[]
  interior: {id: string; alt: string}[]
  technical: {id: string; alt: string}[]
}

export const projects: Project[] = [
  {
    slug: 'audi-rs6', title: 'Audi RS6 Avant', year: '2021', engine: '4.0 TFSI V8', power: '591 HP',
    lede: 'Nový výkonný kombík, který od nás dostal kompletní péči: renovaci laku, PPF na celý lak i vybrané díly interiéru a keramickou ochranu.',
    hero: 'rs6-11', heroPos: '50% 62%',
    care: [
      {t: 'Dekontaminace a renovace laku', service: 'lesteni-a-ochrana-laku'},
      {t: 'PPF full polep laku', service: 'ppf'},
      {t: 'PPF na přední sklo, displej a lakované díly interiéru', service: 'ppf'},
      {t: 'Keramická ochrana kol, brzdových třmenů a podběhů', service: 'lesteni-a-ochrana-laku'},
      {t: 'Keramická ochrana skel', service: 'lesteni-a-ochrana-laku'},
    ],
    exterior: [
      {id: 'rs6-1', alt: 'Audi RS6 Avant zepředu v showroomu'}, {id: 'rs6-2', alt: 'Audi RS6 Avant, přední tříčtvrteční pohled'}, {id: 'rs6-11', alt: 'Audi RS6 Avant, zadní tříčtvrteční pohled'},
      {id: 'rs6-12', alt: 'Audi RS6 Avant zezadu'}, {id: 'rs6-16', alt: 'Audi RS6 Avant v hale'}, {id: 'rs6-13', alt: 'Detail přední masky Audi RS6'}, {id: 'rs6-14', alt: 'Kolo Audi RS6 s červeným třmenem'},
    ],
    interior: [
      {id: 'rs6-3', alt: 'Interiér Audi RS6 Avant'}, {id: 'rs6-4', alt: 'Sportovní sedadla Audi RS6'}, {id: 'rs6-7', alt: 'Středový tunel Audi RS6'}, {id: 'rs6-8', alt: 'Digitální přístroje Audi RS6'},
      {id: 'rs6-9', alt: 'Čalounění dveří Audi RS6'}, {id: 'rs6-6', alt: 'Kokpit Audi RS6'}, {id: 'rs6-17', alt: 'Klíč na prošívaném sedadle'}, {id: 'rs6-18', alt: 'Zadní sedadla Audi RS6'},
    ],
    technical: [
      {id: 'rs6-15', alt: 'Motorový prostor Audi RS6 s V8 4.0 TFSI'}, {id: 'rs6-21', alt: 'Zavazadlový prostor Audi RS6 Avant'}, {id: 'rs6-22', alt: 'Detail prahu a lišty'},
    ],
  },
]

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug)
