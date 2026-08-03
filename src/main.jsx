import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const ghRedirect = sessionStorage.getItem('gh_pages_redirect')
if (ghRedirect) {
  sessionStorage.removeItem('gh_pages_redirect')
  window.history.replaceState(null, '', ghRedirect)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
