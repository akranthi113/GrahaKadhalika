import { Link } from 'react-router-dom'
import LegalPage from '../components/LegalPage'

const COLORS = [
  { name: 'Primary', hex: '#6366f1' },
  { name: 'Primary Dark', hex: '#4f46e5' },
  { name: 'Secondary', hex: '#a855f7' },
  { name: 'Accent', hex: '#ec4899' },
  { name: 'Background', hex: '#f5f7fb' },
  { name: 'Surface', hex: '#ffffff' },
  { name: 'Text', hex: '#1e293b' },
  { name: 'Text (muted)', hex: '#5b6b7f' },
  { name: 'Border', hex: '#e3e8ef' },
]

export default function Brand() {
  return (
    <LegalPage
      title="Brand Guidelines"
      description="Usage rules for the GrahaKadhalika name, logo, colors, and typography."
    >
      <p>
        GrahaKadhalika is provided as a free public service. These guidelines explain how to use our
        name, logo, colors, and typography. If you are a partner or wish to reference the project,
        please follow them. For other partnership or press requests, use the{' '}
        <Link to="/contact">Contact Us form</Link>.
      </p>

      <h2>Name and logo</h2>
      <p>
        The wordmark is <strong>GrahaKadhalika</strong>. The logo combines a planetary glyph mark with
        the wordmark. Please always use the current version in{' '}
        <code className="legal-code">/public/logo.png</code> or{' '}
        <code className="legal-code">/logo.png</code> as supplied.
      </p>

      <h3>Clear space</h3>
      <p>
        Keep a clear area around the logo equal to <strong>half the logo height</strong> on every
        side. Do not let any other graphic, type, or edge enter this space.
      </p>

      <h3>Minimum size</h3>
      <p>
        The logo must always be legible. Display it at a minimum of <strong>48 pixels wide</strong> on
        screen, and do not scale it up beyond its original aspect ratio.
      </p>

      <h3>Do and Don&apos;t</h3>
      <div className="legal-brand-grid">
        <div>
          <strong>Do</strong>
          <ul>
            <li>Use the logo only on light backgrounds for maximum contrast.</li>
            <li>Keep the original colors and proportions.</li>
            <li>Link the logo to the homepage (<code>https://grahakadhalika.com/</code>).</li>
            <li>Show sufficient clear space around the logo.</li>
          </ul>
        </div>
        <div>
          <strong>Don&apos;t</strong>
          <ul>
            <li>Recolor, recolor gradients, or change logo colors.</li>
            <li>Stretch, squeeze, or rotate the logo.</li>
            <li>Add drop shadows, outlines, or other effects.</li>
            <li>Remove, alter, or cover any part of the wordmark.</li>
            <li>Use the logo to imply endorsement of unrelated products or services.</li>
          </ul>
        </div>
      </div>

      <h2>Color palette</h2>
      <p>These are the brand colors used throughout the site:</p>
      <div className="legal-brand-grid">
        {COLORS.map((c) => (
          <div key={c.name} className="legal-color">
            <span
              className="legal-color-swatch"
              style={{ backgroundColor: c.hex }}
              aria-label={c.name}
            />
            <span className="legal-color-name">{c.name}</span>
            <span className="legal-color-hex">{c.hex}</span>
          </div>
        ))}
      </div>
      <p>
        Use <strong>Primary</strong> for the most prominent actions (buttons, links),{' '}
        <strong>Secondary</strong> for supporting accents, and <strong>Accent</strong> sparingly for
        highlights. Surface and border colors are used for backgrounds and card outlines.
      </p>

      <h2>Typography</h2>
      <ul>
        <li>
          <strong>Font family:</strong> Inter (self-hosted via Google Fonts), sans-serif.
        </li>
        <li>
          <strong>Headings:</strong> weight 600&ndash;700, responsive sizes (for example the homepage
          h1 is 2.25rem on desktop).
        </li>
        <li>
          <strong>Body text:</strong> weight 400, 0.95rem&ndash;1rem, line height 1.6.
        </li>
        <li>
          <strong>Accent text:</strong> weight 500&ndash;700, in Primary color.
        </li>
      </ul>

      <h2>Tone of voice</h2>
      <p>GrahaKadhalika should always sound:</p>
      <ul>
        <li>Spiritual and respectful of Vedic tradition.</li>
        <li>Knowledgeable and accurate in astrological explanation.</li>
        <li>Approachable and free from fear or pressure.</li>
        <li>Honest that astrology is guidance, never a substitute for professional advice.</li>
      </ul>

      <h2>Imagery style</h2>
      <p>
        Keep visuals focused on birth charts, planetary diagrams, and simple diagrams. We avoid
        decorative stock photography and keep a calm, minimal aesthetic consistent with the rest of
        the site.
      </p>

      <div className="legal-contact">
        <strong>Brand / partnership inquiries</strong>
        <p>
          For uses not covered here, please get in touch through the{' '}
          <Link to="/contact">Contact Us form</Link>.
        </p>
      </div>
    </LegalPage>
  )
}
