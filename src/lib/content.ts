import {sanity} from './sanity'

export type Area = {title: string; slug: string; shortDescription: string; heroTitle?: string; heroText?: string}
export type Step = {title: string; text?: string}
export type Service = {
  _id: string; title: string; slug: string; summary: string; introTitle?: string; details?: string
  benefits?: string[]; duration?: string; priceNote?: string; process?: Step[]; area: string
}
export type Vehicle = {
  title: string; slug: string; subtitle?: string; price?: number; year?: number; mileage?: number; fuel?: string
  transmission?: string; drivetrain?: string; power?: string; engine?: string; inspection?: string; vatDeductible?: boolean
  status: string; cover?: string; description?: string; equipment?: string[]; featured?: boolean
}

let cache: Promise<{areas: Area[]; services: Service[]; vehicles: Vehicle[]}> | undefined

// One Sanity round-trip per build, shared by every page.
export function getContent() {
  cache ??= sanity.fetch<{areas: Area[]; services: Service[]; vehicles: Vehicle[]}>(`{
    "areas": *[_type=="businessArea"]|order(order asc){title,"slug":slug.current,shortDescription,heroTitle,heroText},
    "services": *[_type=="service"]|order(area->order asc,order asc){_id,title,"slug":slug.current,summary,introTitle,details,benefits,duration,priceNote,process,"area":area->slug.current},
    "vehicles": *[_type=="vehicle"]|order(featured desc,_createdAt desc){title,"slug":slug.current,subtitle,price,year,mileage,fuel,transmission,drivetrain,power,engine,inspection,vatDeductible,status,featured,"cover":coverImage.asset->url,"description":pt::text(description),equipment}
  }`)
  return cache
}

export const czk = (n?: number) => (n ? `${new Intl.NumberFormat('cs-CZ').format(n)} Kč` : 'Cena na dotaz')
export const km = (n?: number) => (n || n === 0 ? `${new Intl.NumberFormat('cs-CZ').format(n)} km` : undefined)
export const statusLabel = (s: string) => (s === 'reserved' ? 'Rezervováno' : s === 'sold' ? 'Prodáno' : 'V nabídce')
