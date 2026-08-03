import { Link } from 'react-router-dom'
import './Footer.css'

const legalLinks = [
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
  { to: '/accessibility', label: 'Accessibility' },
  { to: '/brand', label: 'Brand' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <Link to="/" className="footer-logo">GrahaKadhalika</Link>
        <nav className="footer-links" aria-label="Legal links">
          {legalLinks.map((link) => (
            <Link key={link.to} to={link.to} className="footer-link">{link.label}</Link>
          ))}
        </nav>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} GrahaKadhalika · Free Vedic Astrology Consultation</span>
      </div>
    </footer>
  )
}

