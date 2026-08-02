import './VedicChartDisplay.css'

export default function VedicChartDisplay({ chartData, houses }) {
  if (!chartData) return null

  const { bodies = [] } = chartData

  const zodiacSigns = ['Ar', 'Ta', 'Ti', 'Cn', 'Le', 'Vi', 'Li', 'Sc', 'Sg', 'Cp', 'Aq', 'Pi']
  const signLords = ['Ma', 'Ve', 'Me', 'Mo', 'Su', 'Me', 'Ve', 'Ma', 'Ju', 'Sa', 'Sa', 'Ju']
  const planetLabels = {
    Sun: 'Su', Moon: 'Mo', Mercury: 'Me', Venus: 'Ve',
    Mars: 'Ma', Jupiter: 'Ju', Saturn: 'Sa',
    MeanNode: 'Ra', SouthNode: 'Ke',
  }

  const nakshatraLords = [
    'Ke', 'Ve', 'Su', 'Mo', 'Ma', 'Ma', 'Ju', 'Sa', 'Me',
    'Ke', 'Ve', 'Su', 'Mo', 'Ma', 'Ra', 'Ju', 'Sa', 'Ma',
    'Ke', 'Ve', 'Su', 'Mo', 'Ma', 'Sa', 'Ju', 'Ma', 'Me'
  ]

  const nakshatraNames = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu',
    'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta',
    'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyestha', 'Mula', 'Purva Ashadha',
    'Uttara Ashadha', 'Shravan', 'Dhanishtha', 'Shatabhisha', 'Purva Bhadrapada',
    'Uttara Bhadrapada', 'Revati'
  ]

  const dashaPeriods = { Ke: 7, Ve: 20, Su: 6, Mo: 10, Ma: 7, Ju: 16, Sa: 19, Me: 17, Ra: 18 }
  const dashaOrder = ['Ke', 'Ve', 'Su', 'Mo', 'Ma', 'Ju', 'Sa', 'Me', 'Ra']

  const formatPosition = (deg) => {
    const d = Math.floor(deg)
    const remaining = (deg - d) * 60
    const min = Math.floor(remaining)
    const sec = Math.round((remaining - min) * 60)
    return `${d}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  const getNakshatra = (longitude) => {
    const index = Math.floor(longitude / 13.33333)
    const pos = longitude % 13.33333
    return {
      name: nakshatraNames[index],
      index,
      lord: nakshatraLords[index],
      pos,
    }
  }

  const getSubLord = (planetLongitude, nakshatraLord) => {
    const totalPeriod = dashaOrder.reduce((sum, p) => sum + dashaPeriods[p], 0)
    const nakshatraLordIndex = dashaOrder.indexOf(nakshatraLord)

    const subPeriodPoint = (planetLongitude % 13.33333) / 13.33333 * totalPeriod

    let cumulative = 0
    for (let i = 0; i < dashaOrder.length; i++) {
      const lord = dashaOrder[(nakshatraLordIndex + i) % dashaOrder.length]
      cumulative += dashaPeriods[lord]
      if (subPeriodPoint <= cumulative) {
        return lord
      }
    }
    return dashaOrder[nakshatraLordIndex]
  }

  const getSignLord = (sign) => {
    const idx = zodiacSigns.indexOf(sign)
    return idx >= 0 ? signLords[idx] : ''
  }

  const planetRows = bodies.map((planet) => {
    const nakshatraInfo = getNakshatra(planet.longitude)
    const signAbbr = planet.signAbbr || planet.sign
    const signLord = getSignLord(signAbbr)
    const starLord = nakshatraInfo.lord
    const subLord = getSubLord(planet.longitude, starLord)

    return {
      planet: planetLabels[planet.id] || planet.id,
      sign: signAbbr,
      position: formatPosition(planet.longitude % 30),
      house: planet.house,
      bhava: planet.bhava,
      star: `${nakshatraInfo.name} (${nakshatraInfo.index + 1})`,
      signLord,
      starLord,
      subLord,
      ssLord: '-',
      sssLord: '-',
    }
  })

  return (
    <div className="vedic-chart-display">
      <h2>Vedic Chart Analysis</h2>

      <div className="chart-tables">
        <div className="table-container">
          <h3>Planet Analysis</h3>
          <div className="table-scroll">
          <table className="vedic-table">
            <thead>
              <tr>
                <th>Planet</th>
                <th>Sign</th>
                <th>Position</th>
                <th>House</th>
                <th>Bhava</th>
                <th>Star</th>
                <th>Sign Lord</th>
                <th>Star Lord</th>
                <th>Sub Lord</th>
                <th>SS Lord</th>
                <th>SSS Lord</th>
              </tr>
            </thead>
            <tbody>
              {planetRows.map((row, i) => (
                <tr key={i}>
                  <td>{row.planet}</td>
                  <td>{row.sign}</td>
                  <td>{row.position}</td>
                  <td>{row.house}</td>
                  <td>{row.bhava}</td>
                  <td>{row.star}</td>
                  <td>{row.signLord}</td>
                  <td>{row.starLord}</td>
                  <td>{row.subLord}</td>
                  <td>{row.ssLord}</td>
                  <td>{row.sssLord}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        {houses && (
          <div className="table-container">
            <h3>House Analysis</h3>
            <div className="table-scroll">
            <table className="vedic-table">
              <thead>
                <tr>
                  <th>House</th>
                  <th>Sign</th>
                  <th>Position</th>
                  <th>Star</th>
                  <th>Sign Lord</th>
                  <th>Star Lord</th>
                  <th>Sub Lord</th>
                  <th>SS Lord</th>
                  <th>SSS Lord</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 12 }, (_, i) => {
                  const cusp = houses && houses[i]
                  if (!cusp) return null
                  const signIdx = Math.floor(cusp.longitude / 30) % 12
                  const signAbbrev = zodiacSigns[signIdx]
                  const signLord = signLords[signIdx]
                  const nakshatraInfo = getNakshatra(cusp.longitude)
                  const subLord = getSubLord(cusp.longitude, nakshatraInfo.lord)

                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{signAbbrev}</td>
                      <td>{formatPosition(cusp.longitude % 30)}</td>
                      <td>{nakshatraInfo.name}</td>
                      <td>{signLord}</td>
                      <td>{nakshatraInfo.lord}</td>
                      <td>{subLord}</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}