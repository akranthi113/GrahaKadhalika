import SouthIndianChart from './SouthIndianChart'
import './ChartDisplay.css'

export default function ChartDisplay({ chartData }) {
  if (!chartData) return null

  // Safely extract quick summary metrics if available
  const lagna = chartData?.ascendant?.sign || chartData?.lagna?.sign || null
  const moonSign = chartData?.planets?.find(p => p.name === 'Moon')?.sign || null
  const sunSign = chartData?.planets?.find(p => p.name === 'Sun')?.sign || null

  return (
    <div className="chart-display">
      <div className="chart-header">
        <h2>Your Natal Chart</h2>
        <p className="chart-subtitle">South Indian Style Rasi Chart</p>
      </div>

      {(lagna || moonSign || sunSign) && (
        <div className="chart-quick-stats">
          {lagna && (
            <div className="stat-badge lagna-badge">
              <span className="stat-label">Lagna</span>
              <span className="stat-value">{lagna}</span>
            </div>
          )}
          {moonSign && (
            <div className="stat-badge moon-badge">
              <span className="stat-label">Moon</span>
              <span className="stat-value">{moonSign}</span>
            </div>
          )}
          {sunSign && (
            <div className="stat-badge sun-badge">
              <span className="stat-label">Sun</span>
              <span className="stat-value">{sunSign}</span>
            </div>
          )}
        </div>
      )}

      <div className="chart-container">
        <SouthIndianChart chartData={chartData} />
      </div>
    </div>
  )
}