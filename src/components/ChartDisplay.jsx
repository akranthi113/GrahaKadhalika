import SouthIndianChart from './SouthIndianChart'
import './ChartDisplay.css'

export default function ChartDisplay({ chartData }) {
  if (!chartData) return null

  return (
    <div className="chart-display">
      <h2>Your Natal Chart</h2>
      <div className="chart-container">
        <SouthIndianChart chartData={chartData} />
      </div>
    </div>
  )
}
