export const contact = {
  phone: '+420 775 911 005', phoneHref: 'tel:+420775911005', email: 'info@muzicek.com',
  street: 'Podzimní 10', zip: '466 01', city: 'Jablonec nad Nisou', hours: 'Po–Pá 8:00–17:00',
  instagram: 'https://www.instagram.com/muzicek_car_detailing/',
}

export type WorldKey = 'auta' | 'servis' | 'detailing'

export const worlds: {
  key: WorldKey; num: string; label: string; title: string[]; href: string; statement: string; tags: string[]; cta: string
  image: string; pos: string; accent: string
}[] = [
  {
    key: 'auta', num: '01', label: 'Auta', title: ['Auta'], href: '/auta/', cta: 'Vstoupit do Aut',
    statement: 'Výběr, dovoz, prodej a krytá přeprava. Od prvního odkazu po předání klíčů.',
    tags: ['Vozy v nabídce', 'Dovoz', 'Prodej', 'Přeprava'], image: 'gt4-hall', pos: '50% 60%', accent: 'Showroom',
  },
  {
    key: 'servis', num: '02', label: 'Servis', title: ['Servis', '& Performance'], href: '/servis/', cta: 'Vstoupit do dílny',
    statement: 'Nejdřív příčina, potom řešení. Diagnostika, mechanika, performance, suchý led a ochrana podvozku.',
    tags: ['Servis', 'Diagnostika', 'Suchý led', 'Podvozek'], image: 'caliper', pos: '40% 50%', accent: 'Dílna',
  },
  {
    key: 'detailing', num: '03', label: 'Detailing', title: ['Detailing', '& Ochrana'], href: '/detailing/', cta: 'Vstoupit do studia',
    statement: 'PPF, wrap, tónování, lak a renovace. Ochrana začíná přípravou povrchu.',
    tags: ['PPF', 'Wrap', 'Tónování', 'Lak', 'Renovace'], image: 'film-peel', pos: '55% 50%', accent: 'Studio',
  },
]

export const worldByKey = Object.fromEntries(worlds.map((w) => [w.key, w])) as Record<WorldKey, (typeof worlds)[number]>
