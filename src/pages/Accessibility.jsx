import { Link } from 'react-router-dom'
import LegalPage from '../components/LegalPage'

export default function Accessibility() {
  return (
    <LegalPage
      title="Accessibility Statement"
      description="GrahaKadhalika is committed to making its free Vedic astrology service accessible to everyone, including people with disabilities."
      lastUpdated="03 August 2026"
    >
      <p>
        GrahaKadhalika is committed to making its service accessible to everyone, including people
        with disabilities. We aim to meet <strong>Web Content Accessibility Guidelines (WCAG) 2.1
        Level AA</strong> and to keep improving the accessibility of this website.
      </p>

      <h2>Standards and methods</h2>
      <ul>
        <li>
          We build pages with semantic HTML (headings, landmarks, lists) and use ARIA attributes where
          needed so that screen readers can navigate the content.
        </li>
        <li>
          The site supports keyboard navigation, and focusable elements show a visible focus indicator.
        </li>
        <li>
          We provide sufficient color contrast and resizable text, and we avoid conveying information
          through color alone.
        </li>
        <li>
          Interactive controls such as the Kundli form and Dasha periods are keyboard operable.
        </li>
      </ul>

      <h2>Known limitations</h2>
      <p>While we work to make this site inclusive, please note the following known limitations:</p>
      <ul>
        <li>
          <strong>Birth charts and planetary diagrams are image/SVG-based</strong> and are visual by
          nature. They are not fully readable by screen readers, and detailed alt text for complex
          charts is limited. We are working to add richer descriptions over time.
        </li>
        <li>
          <strong>The Dasha periods view</strong> groups many nested date ranges. While it is
          keyboard navigable and has ARIA labels, a linear screen reader may need to step through many
          rows to reach the desired period.
        </li>
        <li>
          <strong>The live chat widget (Tawk.to)</strong> is provided by a third party and is not
          fully under our control; its accessibility is governed by Tawk.to.
        </li>
      </ul>

      <h2>Feedback and contact</h2>
      <p>
        If you encounter an accessibility barrier on this site, or if you need any information in an
        alternative format, please let         us know using the{' '}
        <Link to="/contact">Contact Us form</Link>. We will respond promptly and strive
        to provide the information within a reasonable time.
      </p>

      <div className="legal-contact">
        <strong>Report an accessibility issue</strong>
        <p>
          Include a description of the problem and the page URL. We will do our best to resolve it.
        </p>
      </div>
    </LegalPage>
  )
}
