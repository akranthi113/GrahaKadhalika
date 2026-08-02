import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'
import './Navbar.css'

export default function Navbar() {
  const [user, setUser] = useState(null)
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

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          GrahaKadhalika
        </Link>
        <div className="navbar-links">
          <NavLink
            to="/kundli"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Kundli Generator
          </NavLink>
          <NavLink
            to="/charts"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Chart Playground
          </NavLink>
          <NavLink
            to="/blogs"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Blogs
          </NavLink>
          <NavLink
            to="/mission"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Mission
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            About
          </NavLink>
          {user ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                Dashboard
              </NavLink>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <NavLink
              to="/auth"
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
