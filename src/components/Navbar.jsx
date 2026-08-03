import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'
import './Navbar.css'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  function closeMenu() {
    setMenuOpen(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    closeMenu()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          GrahaKadhalika
        </Link>
        <button
          type="button"
          className={`navbar-toggle${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="navbar-links"
          aria-label="Toggle navigation menu"
        >
          <span className="toggle-bar" />
          <span className="toggle-bar" />
          <span className="toggle-bar" />
        </button>
        <div id="navbar-links" className={`navbar-links${menuOpen ? ' open' : ''}`}>
          <NavLink
            to="/kundli"
            onClick={closeMenu}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Kundli Generator
          </NavLink>
          <NavLink
            to="/charts"
            onClick={closeMenu}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Chart Playground
          </NavLink>
          <NavLink
            to="/blogs"
            onClick={closeMenu}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Blogs
          </NavLink>
          <NavLink
            to="/mission"
            onClick={closeMenu}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Mission
          </NavLink>
          <NavLink
            to="/about"
            onClick={closeMenu}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            onClick={closeMenu}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Contact Us
          </NavLink>
          {user ? (
            <>
              <NavLink
                to="/dashboard"
                onClick={closeMenu}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                Dashboard
              </NavLink>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <NavLink
              to="/auth"
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? 'login-link active' : 'login-link')}
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  )
}
