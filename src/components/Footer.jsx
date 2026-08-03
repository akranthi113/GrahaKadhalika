import { Link, NavLink } from 'react-router-dom'
import './Footer.css'

const footerLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/mission', label: 'Mission' },
  { to: '/kundli', label: 'Kundli Generator' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/blogs', label: 'Blogs' },
]

const legalLinks = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms of Use' },
  { to: '/accessibility', label: 'Accessibility' },
  { to: '/brand', label: 'Brand Guidelines' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">GrahaKadhalika</Link>
          <p className="footer-tagline">100% Free Vedic Astrology Consultation</p>
        </div>

        <div className="footer-nav">
          <div className="footer-group">
            <h4>Explore</h4>
            <ul>
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} className="footer-link">{link.label}</NavLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-group">
            <h4>Legal</h4>
            <ul>
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} className="footer-link">{link.label}</NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} GrahaKadhalika. All rights reserved.</span>
          <span className="footer-copy">Built as a free, non-commercial passion project.</span>
        </div>
      </div>
    </footer>
  )
}
