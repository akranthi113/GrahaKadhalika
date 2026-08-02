import { useState, useEffect, useRef } from 'react'

import { Link } from 'react-router-dom'

import ChartDisplay from '../components/ChartDisplay'

import VedicChartDisplay from '../components/VedicChartDisplay'

import VimsottariDasaTable from '../components/VimsottariDasaTable'

import { calculateBirthChart } from '../utils/chartCalculator'

import { geocodePlace, searchPlaces } from '../utils/geocoding'

import { useDocumentMeta } from '../hooks/useDocumentMeta'

import './KundliGenerator.css'



const INITIAL_FORM = {

  birth_date: '',

  birth_time: '',

  birth_place: '',

  birth_latitude: '',

  birth_longitude: '',

  timezone: 'UTC',

}



const TZ_OPTIONS = [

  { value: 'UTC', offset: 0 },

  { value: 'Asia/Kolkata', offset: 5.5 },

  { value: 'America/New_York', offset: -5 },

  { value: 'America/Los_Angeles', offset: -8 },

  { value: 'Europe/London', offset: 0 },

  { value: 'Asia/Tokyo', offset: 9 },

]



function timezoneForLongitude(longitude) {

  const estimatedOffset = Math.round(longitude / 15)

  if (estimatedOffset === 0) return 'Europe/London'

  let best = TZ_OPTIONS[0].value

  let bestDiff = Infinity

  for (const tz of TZ_OPTIONS) {

    const diff = Math.abs(tz.offset - estimatedOffset)

    if (diff < bestDiff) {

      bestDiff = diff

      best = tz.value

    }

  }

  return best

}



export default function KundliGenerator() {

  useDocumentMeta({
    title: 'Free Kundli Generator - GrahaKadhalika',
    description:
      'Generate your free Vedic kundli online. Enter birth details to calculate a sidereal Lahiri chart with South Indian layout, planet, house and vimsottari dasa analysis.',
  })

  const [formData, setFormData] = useState(INITIAL_FORM)

  const [geocoding, setGeocoding] = useState(false)

  const [geocodeError, setGeocodeError] = useState('')

  const [suggestions, setSuggestions] = useState([])

  const [showSuggestions, setShowSuggestions] = useState(false)

  const [activeIndex, setActiveIndex] = useState(-1)

  const [chartData, setChartData] = useState(null)

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState('')

  const debounceTimer = useRef(null)

  const resultsRef = useRef(null)



  useEffect(() => () => clearTimeout(debounceTimer.current), [])



  useEffect(() => {

    if (chartData && resultsRef.current) {

      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })

    }

  }, [chartData])



  function handleChange(e) {

    setFormData({ ...formData, [e.target.name]: e.target.value })

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

      birth_place: place.name,

      birth_latitude: place.latitude.toString(),

      birth_longitude: place.longitude.toString(),

      timezone: timezoneForLongitude(place.longitude),

    })

    setSuggestions([])

    setShowSuggestions(false)

    setActiveIndex(-1)

    setGeocodeError('')

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

    if (!formData.birth_place) return



    setGeocoding(true)

    setGeocodeError('')

    setSuggestions([])

    setShowSuggestions(false)



    try {

      const { latitude, longitude } = await geocodePlace(formData.birth_place)

      setFormData({

        ...formData,

        birth_latitude: latitude.toString(),

        birth_longitude: longitude.toString(),

        timezone: timezoneForLongitude(longitude),

      })

    } catch (geocodeErr) {

      setGeocodeError(geocodeErr.message)

    } finally {

      setGeocoding(false)

    }

  }



  async function handleChartSubmit(e) {

    e.preventDefault()

    setLoading(true)

    setError('')

    try {

      let submitted = { ...formData }

      const hasLat = submitted.birth_latitude !== '' && !isNaN(parseFloat(submitted.birth_latitude))

      const hasLng = submitted.birth_longitude !== '' && !isNaN(parseFloat(submitted.birth_longitude))

      if (!hasLat || !hasLng) {

        if (!submitted.birth_place) {

          throw new Error('Please enter a birth place, or open the coordinates panel and fill in latitude/longitude.')

        }

        setGeocoding(true)

        setGeocodeError('')

        setSuggestions([])

        setShowSuggestions(false)

        const { latitude, longitude } = await geocodePlace(submitted.birth_place)

        submitted = {
          ...submitted,
          birth_latitude: latitude.toString(),
          birth_longitude: longitude.toString(),
          timezone: timezoneForLongitude(longitude),
        }

        setFormData(submitted)

      }

      const chart = await calculateBirthChart(
        submitted.birth_date,
        submitted.birth_time,
        parseFloat(submitted.birth_latitude),
        parseFloat(submitted.birth_longitude),
        submitted.timezone
      )

      setChartData(chart)

    } catch (calcErr) {

      setError(calcErr.message)

    } finally {

      setLoading(false)

      setGeocoding(false)

    }

  }






  return (

    <main className="kundli">

      <div className="kundli-container">

        <nav className="kundli-breadcrumb" aria-label="Breadcrumb">

          <Link to="/">← Back to Home</Link>

        </nav>



        <header className="kundli-header">

          <h1>Kundli Generator</h1>

          <p>Enter your birth details to calculate your Vedic birth chart.</p>

        </header>



        <form onSubmit={handleChartSubmit} className="kundli-form">

          <div className="kundli-form-columns">

            <div className="kundli-form-col">

              <div className="form-group">

                <label htmlFor="birth_date">Birth Date</label>

                <input

                  type="date"

                  id="birth_date"

                  name="birth_date"

                  value={formData.birth_date}

                  onChange={handleChange}

                  required

                />

              </div>

              <div className="form-group">

                <label htmlFor="birth_time">Birth Time</label>

                <input

                  type="time"

                  id="birth_time"

                  name="birth_time"

                  value={formData.birth_time}

                  onChange={handleChange}

                  required

                />

              </div>

              <div className="form-group">

                <label htmlFor="birth_place">Birth Place</label>

                <div className="place-input-row">

                  <div className="place-input-wrap">

                    <input

                      type="text"

                      id="birth_place"

                      name="birth_place"

                      placeholder="e.g. New Delhi, India"

                      value={formData.birth_place}

                      onChange={handlePlaceChange}

                      onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}

                      onBlur={handlePlaceBlur}

                      onKeyDown={handleSuggestionKeyDown}

                      role="combobox"

                      aria-autocomplete="list"

                      aria-expanded={showSuggestions && suggestions.length > 0}

                      aria-controls="place-suggestions-listbox"

                      aria-activedescendant={

                        activeIndex >= 0 ? `place-suggestion-${activeIndex}` : undefined

                      }

                      autoComplete="off"

                    />

                    {showSuggestions && suggestions.length > 0 && (

                      <ul className="place-suggestions" id="place-suggestions-listbox" role="listbox">

                        {suggestions.map((suggestion, i) => (

                          <li key={i} role="presentation">

                            <button

                              type="button"

                              id={`place-suggestion-${i}`}

                              role="option"

                              aria-selected={i === activeIndex}

                              className={`place-suggestion${i === activeIndex ? ' active' : ''}`}

                              onMouseDown={() => selectPlace(suggestion)}

                              onClick={() => selectPlace(suggestion)}

                              onMouseEnter={() => setActiveIndex(i)}

                            >

                              <span className="place-suggestion-name">{suggestion.name}</span>

                              {suggestion.isPlace && suggestion.type && (

                                <span className="place-suggestion-type">{suggestion.type}</span>

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

                    disabled={geocoding || !formData.birth_place}

                    className="geocode-btn"

                  >

                    {geocoding ? 'Finding...' : 'Find'}

                  </button>

                </div>

                {geocodeError && <p className="geocode-error">{geocodeError}</p>}

              </div>

              <details className="kundli-coords-details">

                <summary>Manually enter coordinates (optional)</summary>

                <div className="form-group">

                  <label htmlFor="birth_latitude">Latitude</label>

                  <input

                    type="number"

                    step="any"

                    id="birth_latitude"

                    name="birth_latitude"

                    placeholder="e.g. 28.6139"

                    value={formData.birth_latitude}

                    onChange={handleChange}

                  />

                </div>

                <div className="form-group">

                  <label htmlFor="birth_longitude">Longitude</label>

                  <input

                    type="number"

                    step="any"

                    id="birth_longitude"

                    name="birth_longitude"

                    placeholder="e.g. 77.2090"

                    value={formData.birth_longitude}

                    onChange={handleChange}

                  />

                </div>

              </details>

            </div>



            <div className="kundli-form-col">

              <div className="form-group">

                <label htmlFor="timezone">Timezone</label>

                <select

                  id="timezone"

                  name="timezone"

                  value={formData.timezone}

                  onChange={handleChange}

                >

                  <option value="UTC">UTC</option>

                  <option value="Asia/Kolkata">IST (India)</option>

                  <option value="America/New_York">EST (New York)</option>

                  <option value="America/Los_Angeles">PST (Los Angeles)</option>

                  <option value="Europe/London">GMT (London)</option>

                  <option value="Asia/Tokyo">JST (Tokyo)</option>

                </select>

              </div>

            </div>

          </div>



          <button type="submit" className="primary kundli-submit" disabled={loading}>

            {loading ? (

              <>

                <span className="spinner" aria-hidden="true" />

                Calculating...

              </>

            ) : (

              'Calculate Chart'

            )}

          </button>

        </form>



        {error && (

          <div className="error-banner" role="alert">

            {error}

          </div>

        )}



        {chartData && (

          <div className="kundli-results" ref={resultsRef}>

            <ChartDisplay chartData={chartData} />

            <VedicChartDisplay chartData={chartData} houses={chartData.houses} />

            <VimsottariDasaTable chartData={chartData} />

          </div>

        )}

      </div>

    </main>

  )

}