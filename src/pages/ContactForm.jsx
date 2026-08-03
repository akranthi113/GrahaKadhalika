import { useState, useEffect, useRef } from 'react'
import emailjs from '@emailjs/browser'
import { supabase } from '../utils/supabaseClient'
import { geocodePlace, searchPlaces } from '../utils/geocoding'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import './ContactForm.css'

const INITIAL_FORM = {
  name: '',
  dob: '',
  tob: '',
  pob: '',
  latitude: '',
  longitude: '',
  email: '',
  issue: '',
}

export default function ContactForm() {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [status, setStatus] = useState({ type: '', text: '' })
  const [submitting, setSubmitting] = useState(false)
  const debounceTimer = useRef(null)

  useDocumentMeta({
    title: 'Contact Us - GrahaKadhalika',
    description:
      'Contact GrahaKadhalika for a free Vedic astrology consultation. Share your birth details and your questions and we will get back to you with an analysis.',
  })

  useEffect(() => () => clearTimeout(debounceTimer.current), [])

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setStatus({ type: '', text: '' })
  }

  function searchPlaceSuggestions(query) {
    if (!query.trim() || query.trim().length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      setActiveIndex(-1)
      return
    }

    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(async () => {
      try {
        const results = await searchPlaces(query.trim())
        setSuggestions(results)
        setShowSuggestions(results.length > 0)
        setActiveIndex(0)
      } catch {
        setSuggestions([])
        setShowSuggestions(false)
        setActiveIndex(-1)
      }
    }, 300)
  }

  function handlePlaceChange(e) {
    handleChange(e)
    searchPlaceSuggestions(e.target.value)
  }

  function selectPlace(place) {
    setFormData({
      ...formData,
      pob: place.name,
      latitude: place.latitude.toString(),
      longitude: place.longitude.toString(),
    })
    setSuggestions([])
    setShowSuggestions(false)
    setActiveIndex(-1)
  }

  function handleSuggestionKeyDown(e) {
    if (e.key === 'Escape') {
      setShowSuggestions(false)
      setActiveIndex(-1)
      return
    }

    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length)
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      selectPlace(suggestions[activeIndex])
    }
  }

  function handlePlaceBlur(e) {
    const wrap = e.currentTarget.parentElement
    if (!wrap || !wrap.contains(e.relatedTarget)) {
      setShowSuggestions(false)
      setActiveIndex(-1)
    }
  }

  async function handleGeocode() {
    if (!formData.pob) return
    setSubmitting(true)
    try {
      const { latitude, longitude } = await geocodePlace(formData.pob)
      setFormData({
        ...formData,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      })
    } catch {
      setStatus({ type: 'error', text: 'Could not find that place. Please type the place name again.' })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setStatus({ type: '', text: '' })

    const email = formData.email.trim()
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!emailValid) {
      setStatus({ type: 'error', text: 'Please enter a valid email address.' })
      setSubmitting(false)
      return
    }

    let payload = { ...formData, email }
    if (!payload.latitude || !payload.longitude) {
      try {
        const coords = await geocodePlace(payload.pob)
        payload = { ...payload, latitude: coords.latitude.toString(), longitude: coords.longitude.toString() }
      } catch {
        // Place lookup is best-effort; the request can still be saved without coordinates.
      }
    }

    const insertPayload = {
      name: payload.name,
      dob: payload.dob,
      tob: payload.tob,
      pob: payload.pob,
      latitude: payload.latitude ? parseFloat(payload.latitude) : null,
      longitude: payload.longitude ? parseFloat(payload.longitude) : null,
      email: payload.email,
      issue: payload.issue,
    }

    const { error: insertError } = await supabase.from('contact_requests').insert([insertPayload])

    if (insertError) {
      setStatus({
        type: 'error',
        text: 'Failed to submit your request. ' + (insertError.message || 'Please try again later.'),
      })
      setSubmitting(false)
      return
    }

    const emailSent = await sendKundliEmail(payload)

    if (emailSent) {
      setStatus({
        type: 'success',
        text: 'Your consultation request has been received! A copy has been sent to your email and our astrologers will get back to you soon.',
      })
    } else {
      setStatus({
        type: 'success',
        text: 'Your consultation request has been received! Our astrologers will get back to you soon.',
      })
    }

    setFormData(INITIAL_FORM)
    setSubmitting(false)
  }

  return (
    <main className="contact-page">
      <div className="contact-container">
        <nav className="contact-breadcrumb" aria-label="Breadcrumb">
          <a href="#/">← Back to Home</a>
        </nav>

        <header className="contact-header">
          <h1>Contact Us</h1>
          <p>
            Request a free Vedic astrology consultation. Share your birth details and your question,
            and we will prepare a personalised reading for you.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="contact-form" noValidate>
          <div className="contact-form-group">
            <label htmlFor="contact-name">Name</label>
            <input
              type="text"
              id="contact-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="contact-form-row">
            <div className="contact-form-group">
              <label htmlFor="contact-dob">Date of Birth</label>
              <input
                type="date"
                id="contact-dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>

            <div className="contact-form-group">
              <label htmlFor="contact-tob">Time of Birth</label>
              <input
                type="time"
                id="contact-tob"
                name="tob"
                value={formData.tob}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="contact-form-group">
            <label htmlFor="contact-pob">Place of Birth</label>
            <div className="contact-place-row">
              <div className="contact-place-wrap">
                <input
                  type="text"
                  id="contact-pob"
                  name="pob"
                  value={formData.pob}
                  onChange={handlePlaceChange}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  onBlur={handlePlaceBlur}
                  onKeyDown={handleSuggestionKeyDown}
                  placeholder="e.g. New Delhi, India"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={showSuggestions && suggestions.length > 0}
                  required
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="contact-suggestions" role="listbox">
                    {suggestions.map((suggestion, i) => (
                      <li key={i} role="presentation">
                        <button
                          type="button"
                          role="option"
                          aria-selected={i === activeIndex}
                          className={i === activeIndex ? 'active' : ''}
                          onMouseDown={() => selectPlace(suggestion)}
                          onClick={() => selectPlace(suggestion)}
                          onMouseEnter={() => setActiveIndex(i)}
                        >
                          <span className="contact-suggestion-name">{suggestion.name}</span>
                          {suggestion.isPlace && suggestion.type && (
                            <span className="contact-suggestion-type">{suggestion.type}</span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                type="button"
                onClick={handleGeocode}
                disabled={submitting || !formData.pob}
                className="contact-geocode-btn"
              >
                {submitting ? 'Finding...' : 'Find'}
              </button>
            </div>
            <p className="contact-hint">
              {formData.latitude && formData.longitude
                ? `Coordinates set: ${formData.latitude}, ${formData.longitude}`
                : 'Pick from suggestions or press Find to auto-locate this place.'}
            </p>
          </div>

          <div className="contact-form-group">
            <label htmlFor="contact-email">Email</label>
            <input
              type="email"
              id="contact-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="contact-form-group">
            <label htmlFor="contact-issue">Your Question / Issue</label>
            <textarea
              id="contact-issue"
              name="issue"
              value={formData.issue}
              onChange={handleChange}
              rows={6}
              placeholder="Describe your question or the issue you would like guidance on..."
              required
            />
          </div>

          <button type="submit" className="primary contact-submit" disabled={submitting}>
            {submitting && <span className="spinner" aria-hidden="true" />}
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>

          {status.text && (
            <p className={`form-message ${status.type}`} role={status.type === 'error' ? 'alert' : 'status'}>
              {status.text}
            </p>
          )}
        </form>
      </div>
    </main>
  )
}

async function sendKundliEmail({ name, dob, tob, pob, latitude, longitude, email, issue }) {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

  if (!serviceId || !templateId || !publicKey) {
    console.warn('EmailJS is not configured. Skipping email confirmation.')
    return false
  }

  try {
    await emailjs.send(
      serviceId,
      templateId,
      {
        to_email: email,
        from_name: name,
        dob,
        tob,
        pob,
        latitude: latitude || 'Not provided',
        longitude: longitude || 'Not provided',
        message: issue,
      },
      { publicKey }
    )
    return true
  } catch (err) {
    console.warn('EmailJS send failed:', err)
    return false
  }
}