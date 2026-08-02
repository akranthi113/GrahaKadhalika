const HEADERS = {
  'User-Agent': 'GrahaKadhalika/1.0',
}

export async function geocodePlace(place) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}&limit=1`
  const response = await fetch(url, {
    headers: HEADERS,
  })

  if (!response.ok) {
    throw new Error('Geocoding failed')
  }

  const data = await response.json()

  if (data.length === 0) {
    throw new Error('Place not found')
  }

  return {
    latitude: parseFloat(data[0].lat),
    longitude: parseFloat(data[0].lon),
  }
}

const PLACE_TYPES = new Set(['city', 'town', 'village', 'borough', 'suburb', 'municipality', 'state', 'administrative', 'county'])

export async function searchPlaces(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=12&addressdetails=1`
  const response = await fetch(url, {
    headers: HEADERS,
  })

  if (!response.ok) {
    throw new Error('Place search failed')
  }

  const data = await response.json()

  const seen = new Set()
  const results = []

  for (const place of data) {
    const name = place?.display_name
    if (!name) continue

    const type = place?.type || place?.addresstype || ''
    const isPlace = PLACE_TYPES.has(type)

    const key = name.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)

    results.push({
      name,
      type,
      isPlace,
      latitude: parseFloat(place.lat),
      longitude: parseFloat(place.lon),
    })
  }

  return results.sort((a, b) => (b.isPlace ? 1 : 0) - (a.isPlace ? 1 : 0))
}
