import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'

registerSW({ immediate: true })

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
