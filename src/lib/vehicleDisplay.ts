const archivedCovers: Record<string, string> = {
  'audi-rs4': '/media/vehicle-audi-rs4-1.jpg',
  'vw-multivan-highline': '/media/vehicle-multivan-1.jpg',
  'jaguar-xj-sovereign': '/media/vehicle-jaguar-1.jpg',
  'skoda-octavia-rs-mk1': '/media/vehicle-octavia-1.jpg',
}

export function vehicleImageFor(vehicle: { slug: string; cover?: string }) {
  return archivedCovers[vehicle.slug] || vehicle.cover
}

export function vehicleStatusLabel(status: string) {
  return status === 'reserved' ? 'Rezervováno' : status === 'sold' ? 'Prodáno' : 'V nabídce'
}

export function vehiclePrice(price?: number) {
  return price ? `${new Intl.NumberFormat('cs-CZ').format(price)} Kč` : 'Cena na dotaz'
}

export function vehicleSubtitle(value?: string) {
  return value?.replaceAll(/\s*\u00b7\s*/g, ', ')
}
