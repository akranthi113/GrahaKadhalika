import { useState, useRef } from 'react'
import { DateTime } from 'luxon'
import { useScrollableFade } from '../hooks/useScrollableFade'
import './VimsottariDasaTable.css'

const DASA_SEQUENCE = [
  { id: 'Ketu', abbr: 'Ke', years: 7 },
  { id: 'Venus', abbr: 'Ve', years: 20 },
  { id: 'Sun', abbr: 'Su', years: 6 },
  { id: 'Moon', abbr: 'Mo', years: 10 },
  { id: 'Mars', abbr: 'Ma', years: 7 },
  { id: 'Rahu', abbr: 'Ra', years: 18 },
  { id: 'Jupiter', abbr: 'Ju', years: 16 },
  { id: 'Saturn', abbr: 'Sa', years: 19 },
  { id: 'Mercury', abbr: 'Me', years: 17 },
]

const NAKSHATRA_NAMES = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu',
  'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta',
  'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyestha', 'Mula', 'Purva Ashadha',
  'Uttara Ashadha', 'Shravan', 'Dhanishtha', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati',
]

const NAK_SPAN = 360 / 27
const TOTAL = 120

function formatDuration(years) {
  const totalDays = years * 365.25
  const y = Math.floor(totalDays / 365.25)
  const rem = totalDays - y * 365.25
  const m = Math.floor(rem / 30.4375)
  const d = Math.round(rem - m * 30.4375)
  return `${y}y ${m}m ${d}d`
}

function computeDasaPeriods(chartData) {
  const moon = chartData.bodies.find((b) => b.id === 'Moon')
  if (!moon) return null

  const moonLon = ((moon.longitude % 360) + 360) % 360
  const nakIndex = Math.floor(moonLon / NAK_SPAN) % 27
  const fraction = (moonLon % NAK_SPAN) / NAK_SPAN
  const firstAbbr = DASA_SEQUENCE[nakIndex % 9].abbr
  const startIdx = DASA_SEQUENCE.findIndex((d) => d.abbr === firstAbbr)

  const birthDT = chartData.meta?.date ? DateTime.fromISO(chartData.meta.date) : null
  const now = DateTime.now()

  const rows = []
  let elapsedDays = 0

  for (let i = 0; i < 9; i++) {
    const dasa = DASA_SEQUENCE[(startIdx + i) % 9]
    const years = i === 0 ? (1 - fraction) * dasa.years : dasa.years

    const startDT = birthDT ? birthDT.plus({ days: elapsedDays }) : null
    elapsedDays += years * 365.25
    const endDT = birthDT ? birthDT.plus({ days: elapsedDays }) : null

    const subs = []
    let subElapsed = 0
    for (let j = 0; j < 9; j++) {
      const sub = DASA_SEQUENCE[(startIdx + i + j) % 9]
      const subYears = (years * sub.years) / TOTAL
      const subStart = startDT ? startDT.plus({ days: subElapsed }) : null
      subElapsed += subYears * 365.25
      const subEnd = startDT ? startDT.plus({ days: subElapsed }) : null
      subs.push({
        abbr: sub.abbr,
        id: sub.id,
        years: subYears.toFixed(2),
        duration: formatDuration(subYears),
        start: subStart ? subStart.toISODate() : '',
        end: subEnd ? subEnd.toISODate() : '',
      })
    }

    rows.push({
      abbr: dasa.abbr,
      id: dasa.id,
      years: years.toFixed(2),
      duration: formatDuration(years),
      start: startDT ? startDT.toISODate() : '',
      end: endDT ? endDT.toISODate() : '',
      subs,
      isCurrent: Boolean(startDT && endDT && now >= startDT && now <= endDT),
    })
  }

  return {
    nakIndex,
    nakName: NAKSHATRA_NAMES[nakIndex],
    nakLord: firstAbbr,
    rows,
  }
}

export default function VimsottariDasaTable({ chartData }) {
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const mainTableRef = useRef(null)
  const subTableRef = useRef(null)
  useScrollableFade(mainTableRef, [chartData, selectedIndex])
  useScrollableFade(subTableRef, [chartData, selectedIndex])

  const dasa = computeDasaPeriods(chartData)
  if (!dasa) return null

  const currentIndex = dasa.rows.findIndex((r) => r.isCurrent)
  const activeIndex = selectedIndex === -1 ? (currentIndex >= 0 ? currentIndex : 0) : selectedIndex
  const selected = dasa.rows[activeIndex]

  return (
    <div className="table-container dasa-table">
      <h3>Vimsottari Dasa Periods</h3>
      <p className="dasa-meta">
        Janma Nakshatra: <strong>{dasa.nakName}</strong> (lord {dasa.nakLord})
      </p>
      <div className="table-scroll" ref={mainTableRef}>
        <table className="vedic-table dasa-table-inner">
          <thead>
            <tr>
              <th>Planet / Lord</th>
              <th>Dasa Period</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Antardasa</th>
            </tr>
          </thead>
          <tbody>
            {dasa.rows.map((row, i) => (
              <tr
                key={i}
                onClick={() => setSelectedIndex(i)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedIndex(i)}
                tabIndex={0}
                role="button"
                aria-pressed={activeIndex === i}
                className={[
                  row.isCurrent ? 'dasa-current' : '',
                  activeIndex === i ? 'dasa-selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <td data-label="Planet / Lord">
                  <span className="dasa-lord">{row.abbr}</span> {row.id}
                </td>
                <td data-label="Dasa Period">{row.years} yrs</td>
                <td data-label="Start Date">{row.start}</td>
                <td data-label="End Date">{row.end}</td>
                <td data-label="Antardasa" className="dasa-antardasa-cell">
                  {activeIndex === i ? (
                    <span className="dasa-active-tag">Showing ▼</span>
                  ) : (
                    <span className="dasa-click-hint">Click to view</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="dasa-antardasa">
          <h4>
            Antardasa of {selected.abbr} ({selected.id}) · {selected.start} — {selected.end}
          </h4>
          <div className="table-scroll" ref={subTableRef}>
            <table className="vedic-table dasa-sub-table">
              <thead>
                <tr>
                  <th>Planet / Lord</th>
                  <th>Period</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                </tr>
              </thead>
              <tbody>
                {selected.subs.map((sub, j) => (
                  <tr key={j}>
                    <td data-label="Planet / Lord">
                      <span className="dasa-lord">{sub.abbr}</span> {sub.id}
                    </td>
                    <td data-label="Period">{sub.years} yrs</td>
                    <td data-label="Start Date">{sub.start}</td>
                    <td data-label="End Date">{sub.end}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="dasa-note">
        Dasa periods are calculated from the Moon&apos;s nakshatra at birth. Click a mahadasha row to
        view its antardasha breakdown.
      </p>
    </div>
  )
}
