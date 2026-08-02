const SIGN_NAMES = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
]

const SIGN_SYMBOLS = ['♈︎', '♉︎', '♊︎', '♋︎', '♌︎', '♍︎', '♎︎', '♏︎', '♐︎', '♑︎', '♒︎', '♓︎']

const SIGN_GRID = [
  { row: 1, col: 2 }, // Aries
  { row: 1, col: 3 }, // Taurus
  { row: 1, col: 4 }, // Gemini
  { row: 2, col: 4 }, // Cancer
  { row: 3, col: 4 }, // Leo
  { row: 4, col: 4 }, // Virgo
  { row: 4, col: 3 }, // Libra
  { row: 4, col: 2 }, // Scorpio
  { row: 4, col: 1 }, // Sagittarius
  { row: 3, col: 1 }, // Capricorn
  { row: 2, col: 1 }, // Aquarius
  { row: 1, col: 1 }, // Pisces
]

const PLANET_ABBR = {
  Sun: 'Su',
  Moon: 'Mo',
  Mercury: 'Me',
  Venus: 'Ve',
  Mars: 'Ma',
  Jupiter: 'Ju',
  Saturn: 'Sa',
  Uranus: 'Ur',
  Neptune: 'Ne',
  Pluto: 'Pl',
  MeanNode: 'Ra',
  TrueNode: 'Ra',
  SouthNode: 'Ke',
  Chiron: 'Ch',
  LilithMean: 'Li',
  LilithTrue: 'Li',
  Vertex: 'Vx',
  AntiVertex: 'Av',
  ParsFortunae: 'Pf',
}

function signIndexFromLongitude(longitude) {
  return Math.floor((((longitude % 360) + 360) % 360) / 30) % 12
}

function signIndexFromName(name) {
  return SIGN_NAMES.indexOf(name)
}

export default function SouthIndianChart({ chartData }) {
  const ascIndex = chartData?.angles ? signIndexFromLongitude(chartData.angles.Asc) : 0
  const lagnaSign = SIGN_NAMES[ascIndex]

  const bodiesBySign = {}
  if (chartData?.bodies) {
    chartData.bodies.forEach((body) => {
      const idx = signIndexFromName(body.sign)
      if (idx === -1) return
      if (!bodiesBySign[idx]) bodiesBySign[idx] = []
      bodiesBySign[idx].push(body)
    })
  }

  const houses = SIGN_NAMES.map((_, i) => ((i - ascIndex + 12) % 12) + 1)

  return (
    <div className="south-indian-chart">
      <div className="si-grid">
        {SIGN_NAMES.map((signName, i) => {
          const { row, col } = SIGN_GRID[i]
          const house = houses[i]
          const isLagna = house === 1
          const planets = bodiesBySign[i] || []
          return (
            <div
              key={signName}
              className={`si-house${isLagna ? ' si-lagna' : ''}`}
              style={{ gridRow: row, gridColumn: col }}
            >
              <div className="si-house-top">
                <span className="si-house-num">{house}</span>
                <span className="si-sign-label">
                  <span className="si-sign-symbol">{SIGN_SYMBOLS[i]}</span>
                  <span className="si-sign-name">{signName}</span>
                </span>
              </div>
              {isLagna && <span className="si-lagna-mark">AS</span>}
              <div className="si-planets">
                {planets.map((planet) => (
                  <div key={planet.id} className="si-planet" title={`${planet.name} in ${planet.sign} ${planet.degree.toFixed(2)}°`}>
                    <span className="si-planet-symbol">{PLANET_ABBR[planet.id] || planet.name.slice(0, 2)}</span>
                    <span className="si-planet-degree">{Math.floor(planet.degree)}°</span>
                    {planet.isRetrograde && <span className="si-planet-retro">R</span>}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
        <div className="si-center">
          <span className="si-center-title">Lagna</span>
          <span className="si-center-sign">{SIGN_SYMBOLS[ascIndex]} {lagnaSign}</span>
        </div>
      </div>
    </div>
  )
}
