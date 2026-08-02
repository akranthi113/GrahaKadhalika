import { Link } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found-card">
        <h1>404</h1>
        <p>This page seems to have drifted out of orbit.</p>
        <Link to="/" className="empty-cta">Back to Home</Link>
      </div>
    </div>
  )
}
