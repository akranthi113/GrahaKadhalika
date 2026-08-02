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

export async function searchPlaces(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=6&addressdetails=1`
  const response = await fetch(url, {
    headers: HEADERS,
  })

  if (!response.ok) {
    throw new Error('Place search failed')
  }

  const data = await response.json()

  return data.map((place) => ({
    name: place.display_name,
    latitude: parseFloat(place.lat),
    longitude: parseFloat(place.lon),
  }))
}
