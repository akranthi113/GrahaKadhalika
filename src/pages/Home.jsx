import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import './Home.css'

export default function Home() {
  const [chatNote, setChatNote] = useState('')

  useDocumentMeta({
    title: 'GrahaKadhalika - Free Vedic Astrology Consultation & Kundli Generator',
    description:
      'GrahaKadhalika offers 100% free Vedic astrology consultation. Generate your sidereal Lahiri kundli, explore South Indian rasi charts, and get detailed planet, house and dasa analysis.',
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'GrahaKadhalika',
        url: 'https://grahakadhalika.com/',
        description:
          'Free Vedic astrology consultations with authentic kundli generation and detailed planet, house and dasa analysis.',
      },
      {
        '@type': 'Organization',
        name: 'GrahaKadhalika',
        url: 'https://grahakadhalika.com/',
        slogan: '100% Free Astrology Consultation',
      },
    ],
  }

  function handleChatClick() {
    setChatNote(
      'Please click on the chat button at the right-hand corner below to start the conversation and ask. ' +
        'We will respond to it, so please wait and keep your tab open so that anytime we respond you will get the message. ' +
        'Just ask your questions.'
    )
  }

  return (
    <main className="home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="hero">
        <p className="hero-tagline">
          Astrology gives you a way to understand life—not to control it.
        </p>
        <h1>GrahaKadhalika</h1>
        <p className="hero-subtitle">
          Discover authentic Vedic astrological guidance that helps you understand yourself,
          recognize opportunities, and make better decisions through the power of free will.
        </p>

        <div className="hero-free-badge">
          <h2>100% FREE ASTROLOGY CONSULTATION</h2>
          <p>
            Every consultation on GrahaKadhalika is provided completely free of charge. This website
            is a passion project and a personal hobby, created to share astrological knowledge and
            help people without expecting anything in return.
          </p>
          <p className="hero-free-note">
            Your future is shaped by your choices. Astrology simply helps illuminate the path.
          </p>
          <div className="hero-ctas">
            <Link to="/kundli" className="landing-cta">
              Kundli Generator
            </Link>
            <button onClick={handleChatClick} className="landing-cta landing-cta-secondary">
              Chat Consultation
            </button>
          </div>
          {chatNote && (
            <p className="hero-chat-note" role="status">{chatNote}</p>
          )}
        </div>
      </section>

      <section className="landing-features">
        <div className="feature">
          <h3>Vedic Kundli</h3>
          <p>
            Sidereal Lahiri chart with whole-sign houses and Placidus bhavas, shown in a classic
            South Indian layout.
          </p>
        </div>
        <div className="feature">
          <h3>Detailed Tables</h3>
          <p>
            Planet and house analysis with nakshatra, sign lord, star lord, and sub lord for every
            graha.
          </p>
        </div>
        <div className="feature">
          <h3>AI Insights</h3>
          <p>
            Get a personalized reading covering personality, love, career, and life timing — powered
            by AI.
          </p>
        </div>
      </section>

      <section className="landing-story">
        <p className="landing-story-eyebrow">Who We Are</p>
        <h2>Astrology deserves more respect than a rushed, five-minute reading.</h2>
        <p className="landing-story-text">
          GrahaKadhalika is a lifelong passion project — not a business. Every chart gets time,
          patience, and an integrated analysis across Vedic, KP, Jaimini, and Western systems,
          completely free, because we believe guidance shouldn&apos;t only be for those who can pay.
        </p>
        <div className="landing-story-actions">
          <Link to="/about" className="landing-cta">About Us</Link>
          <Link to="/mission" className="landing-cta landing-cta-secondary">Our Mission</Link>
        </div>
      </section>

      <section className="landing-playground">
        <h2>Explore Chart Playgrounds</h2>
        <p>
          Try interactive standalone charts — a 3D North Indian chart, a sidereal playground, and an
          enhanced South Indian chart.
        </p>
        <Link to="/charts" className="landing-cta landing-cta-secondary">
          Explore Chart Playgrounds
        </Link>
      </section>
    </main>
  )
}
