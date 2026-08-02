import { calculateChart, setSwissEphemeris, ZODIAC_SIGNS } from '@astrologer/astro-core'
import SwissEphemeris from '@swisseph/browser'
import { DateTime } from 'luxon'

let sweInstance = null

async function getSwissEphemeris() {
  if (!sweInstance) {
    sweInstance = new SwissEphemeris()
    await sweInstance.init()
    setSwissEphemeris(sweInstance)
    try {
      await sweInstance.loadStandardEphemeris()
    } catch (e) {
      console.warn('Failed to load standard ephemeris from CDN:', e)
    }
  }
  return sweInstance
}

const SIDEREAL_BODIES = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn',
  'Uranus', 'Neptune', 'Pluto', 'MeanNode', 'SouthNode',
]

const SIGN_ABBR = ['Ar', 'Ta', 'Ti', 'Cn', 'Le', 'Vi', 'Li', 'Sc', 'Sg', 'Cp', 'Aq', 'Pi']

function shiftLongitude(lon, ayanamsa) {
  return (lon - ayanamsa + 360) % 360
}

function assignHouse(lon, cusps) {
  const l = (lon + 360) % 360
  for (let i = 0; i < cusps.length; i++) {
    const start = cusps[i]
    const end = cusps[(i + 1) % cusps.length]
    if (start < end) {
      if (l >= start && l < end) return i + 1
    } else if (l >= start || l < end) {
      return i + 1
    }
  }
  return 1
}

export async function calculateBirthChart(birthDate, birthTime, latitude, longitude, timezone = 'UTC') {
  const swe = await getSwissEphemeris()

  const local = DateTime.fromISO(`${birthDate}T${birthTime}`, { zone: timezone })
  const utcDate = local.isValid ? local.toUTC().toISO() : `${birthDate}T${birthTime}`

  const input = {
    date: utcDate,
    location: {
      latitude,
      longitude,
    },
    houseSystem: 'P',
    zodiacType: 'Sidereal',
    siderealMode: 1,
    perspective: 'Geocentric',
    bodies: SIDEREAL_BODIES,
  }

  const chartData = calculateChart(input)

  const jd = swe.dateToJulianDay(new Date(utcDate))
  const ayanamsa = swe.getAyanamsa(jd)
  const shift = (lon) => shiftLongitude(lon, ayanamsa)

  chartData.angles.Asc = shift(chartData.angles.Asc)
  chartData.angles.MC = shift(chartData.angles.MC)
  chartData.angles.Dsc = shift(chartData.angles.Dsc)
  chartData.angles.IC = shift(chartData.angles.IC)

  const ascSignIdx = Math.floor(chartData.angles.Asc / 30) % 12

  const cusps = chartData.houses.map((h) => shift(h.longitude))
  chartData.houses.forEach((h, i) => {
    const lon = cusps[i]
    const sign = ZODIAC_SIGNS[Math.floor(lon / 30) % 12]
    h.longitude = lon
    h.degree = lon % 30
    h.sign = sign.name
    h.emoji = sign.emoji
  })

  chartData.bodies.forEach((body) => {
    body.bhava = assignHouse(body.longitude, cusps)
    const signIdx = Math.floor(body.longitude / 30) % 12
    body.house = ((signIdx - ascSignIdx + 12) % 12) + 1
    body.sign = ZODIAC_SIGNS[signIdx].name
    body.signAbbr = SIGN_ABBR[signIdx]
  })

  chartData.meta.ayanamsa = ayanamsa

  return chartData
}
