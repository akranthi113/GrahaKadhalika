import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import './ChartPlayground.css'

const base = import.meta.env.BASE_URL

const CHARTS = [
  {
    id: 'northindian3d',
    title: 'North Indian 3D Chart',
    description: 'An interactive 3D rendering of the North Indian style birth chart. Rotate and explore the houses from any angle.',
    href: `${base}charts/northindian3d.html`,
    tag: '3D',
  },
  {
    id: 'sideeral2',
    title: 'Sidereal Astrology Playground',
    description: 'A hands-on playground for sidereal calculations — explore planetary positions and settings in real time.',
    href: `${base}charts/sideeral2.3.html`,
    tag: 'Playground',
  },
  {
    id: 'vedic-enhanced',
    title: 'South Indian Enhanced Chart',
    description: 'A detailed South Indian layout with enhanced planet and house information for deeper Vedic study.',
    href: `${base}charts/vedic_chart_enhanced.html`,
    tag: 'South Indian',
  },
]

export default function ChartPlayground() {
  useDocumentMeta({
    title: 'Vedic Chart Playground - GrahaKadhalika',
    description:
      'Explore interactive Vedic chart visualizations: a 3D North Indian chart, a sidereal astrology playground, and an enhanced South Indian chart.',
  })

  return (
    <main className="playground">
      <div className="playground-container">
        <nav className="playground-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">← Back to Home</Link>
        </nav>

        <header className="playground-header">
          <h1>Chart Playground</h1>
          <p>
            Explore standalone Vedic chart visualizations. Pick a chart and it opens in a new tab.
          </p>
        </header>

        <div className="playground-grid">
          {CHARTS.map((chart) => (
            <article key={chart.id} className="playground-card">
              <span className="playground-tag">{chart.tag}</span>
              <h2>{chart.title}</h2>
              <p>{chart.description}</p>
              <a
                href={chart.href}
                target="_blank"
                rel="noopener noreferrer"
                className="playground-open"
              >
                Open Chart
              </a>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
