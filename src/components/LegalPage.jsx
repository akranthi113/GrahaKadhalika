import { useDocumentMeta } from '../hooks/useDocumentMeta'
import './LegalPage.css'

export default function LegalPage({ title, description, lastUpdated, children }) {
  useDocumentMeta({
    title: `${title} - GrahaKadhalika`,
    description: description || `Read the ${title} for GrahaKadhalika, a free Vedic astrology consultation platform.`,
  })

  return (
    <main className="legal-page" id="legal-content">
      <section className="legal-hero">
        <h1>{title}</h1>
        {lastUpdated ? (
          <p className="legal-last-updated">Last updated: {lastUpdated}</p>
        ) : null}
      </section>
      <div className="legal-body">{children}</div>
    </main>
  )
}
