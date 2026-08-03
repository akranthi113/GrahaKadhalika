import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Mission from './pages/Mission'
import KundliGenerator from './pages/KundliGenerator'
import ChartPlayground from './pages/ChartPlayground'
import ContactForm from './pages/ContactForm'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Accessibility from './pages/Accessibility'
import Brand from './pages/Brand'
import Auth from './components/Auth'
import Dashboard from './pages/Dashboard'
import Blogs from './pages/Blogs'
import BlogDetail from './pages/BlogDetail'
import NotFound from './pages/NotFound'
import { supabase } from './utils/supabaseClient'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="loading">
        <span className="spinner" aria-hidden="true" />
        Checking your session...
      </div>
    )
  }
  if (!user) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />
  }
  return children
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/kundli" element={<KundliGenerator />} />
        <Route path="/charts" element={<ChartPlayground />} />
         <Route path="/contact" element={<ContactForm />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/accessibility" element={<Accessibility />} />
        <Route path="/brand" element={<Brand />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
