import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import './NotFound.css'

export default function NotFound() {
  useDocumentMeta({
    title: 'Page Not Found - GrahaKadhalika',
    description: 'The page you are looking for could not be found.',
  })

  return (
    <main className="not-found">
      <div className="not-found-card">
        <h1>404</h1>
        <p>This page seems to have drifted out of orbit.</p>
        <Link to="/" className="empty-cta">Back to Home</Link>
      </div>
    </main>
  )
}
