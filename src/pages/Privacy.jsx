import { Link } from 'react-router-dom'
import LegalPage from '../components/LegalPage'

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="How GrahaKadhalika collects, uses, and protects your personal data when you generate a kundli or request a free astrology consultation."
      lastUpdated="03 August 2026"
    >
      <p>
        GrahaKadhalika (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates the
        <a href="https://grahakadhalika.com/" rel="noreferrer"> https://grahakadhalika.com/ </a>
        website (the &ldquo;Service&rdquo;). This Privacy Policy explains what personal information we
        collect when you use the Service, why we collect it, and how we protect it.
      </p>
      <p>
        This is a personal, non-commercial passion project offering free Vedic astrology guidance. We
        never sell your data and do not use it for marketing.
      </p>

      <h2>1. Information we collect</h2>
      <p>To generate your birth chart and respond to your consultation request, we may collect:</p>
      <ul>
        <li>
          <strong>Birth details you enter:</strong> your full name, email address, date of birth, time
          of birth, and place of birth (plus the latitude/longitude we derive so we can calculate
          accurate planetary positions).
        </li>
        <li>
          <strong>Your question or issue:</strong> the free-text description you optionally include in
          the Contact Us form.
        </li>
        <li>
          <strong>Blog content (optional):</strong> if you log in and save a blog post through the
          dashboard, that text is stored under your account.
        </li>
        <li>
          <strong>Approximate location:</strong> we geocode the place you enter to obtain coordinates
          for the chart calculation.
        </li>
        <li>
          <strong>Chat conversations:</strong> if you use the Tawk.to live chat widget, your messages
          and a chat identifier may be processed by Tawk.to (see &ldquo;Sharing with third
          parties&rdquo;).
        </li>
        <li>
          <strong>Account data (optional):</strong> if you create a dashboard account, we store your
          email and a securely hashed password managed by Supabase Auth. Passwords are never stored in
          plain text.
        </li>
      </ul>

      <h2>2. How we use your information</h2>
      <ul>
        <li>To calculate and display your Vedic (Lahiri) birth chart, houses, planets, and Dasha.</li>
        <li>To respond to your consultation request and keep a record of your message.</li>
        <li>To authenticate you if you log in to manage blog posts.</li>
        <li>To improve the accuracy of our calculations and fix bugs (we do not build behavior
          profiles).</li>
      </ul>

      <h2>3. How your data is stored</h2>
      <p>
        All personal data is stored on <strong>Supabase</strong> (a PostgreSQL database hosted in
        secure data centers). Data in transit is encrypted (HTTPS). Birth details and messages remain
        private to our team and are never shared for commercial purposes.
      </p>

      <h2>4. How long we keep your data</h2>
      <ul>
        <li>
          <strong>Birth details and consultation messages:</strong> kept for as long as needed to
          provide the service and respond to your request, and for record-keeping thereafter.
        </li>
        <li>
          <strong>Blog posts and account data:</strong> retained until you delete them or request
          account deletion.
        </li>
      </ul>
      You may ask us to correct or delete your data at any time (see &ldquo;Your rights&rdquo;).

      <h2>5. Sharing with third parties</h2>
      <p>We do not sell, trade, or rent your personal information. We share data only with trusted
        service providers that help run the site:</p>
      <ul>
        <li>
          <strong>Supabase:</strong> database and authentication hosting. Supabase collects standard
          usage analytics; see the{' '}
          <a href="https://supabase.com/privacy">Supabase Privacy Policy</a>.
        </li>
        <li>
          <strong>Tawk.to:</strong> powers the live chat widget and may set cookies. Your chat
          conversation may be visible to Tawk.to in order to deliver real-time support. See the{' '}
          <a href="https://www.tawk.to/privacy-policy/">Tawk.to Privacy Policy</a>.
        </li>
        <li>
          <strong>EmailJS:</strong> used only to send you a copy of your consultation request when you
          submit the Contact Us form (and only if you have not disabled that option). No marketing
          emails are ever sent. See the{' '}
          <a href="https://www.emailjs.com/legal/privacy-policy/">EmailJS Privacy Policy</a>.
        </li>
        <li>
          <strong>Vercel / GitHub Pages:</strong> host the static website files and basic performance
          logs. No personal birth data is uploaded to them.
        </li>
      </ul>
      We require these providers to protect your data and to use it only to provide services to us.

      <h2>6. Cookies and tracking</h2>
      <p>
        This site does not set its own analytics cookies. The Tawk.to widget may set cookies so that
        live chat works and can greet you on future visits; you can disable cookies in your browser,
        though live chat may then be unavailable.
      </p>

      <h2>7. Your rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li><strong>Access</strong> — ask what personal data we hold about you.</li>
        <li><strong>Rectification</strong> — request correction of inaccurate data.</li>
        <li><strong>Erasure</strong> — ask us to delete your data (subject to legitimate business needs).</li>
        <li><strong>Object / restrict</strong> — ask us to stop processing your data.</li>
      </ul>
      To exercise these rights, Contact Us using the form below and we will respond promptly.

      <h2>8. Children's privacy</h2>
      <p>
        The Service is not offered knowingly to children under 13. If we learn we have collected
        personal data from a child under 13, we will delete it. Please see our Age requirement under the
        Terms of Use.
      </p>

      <h2>9. Links to other sites</h2>
      <p>
        Our site may contain links to third-party websites (for example, Supabase, Tawk.to, or
        EmailJS). This Privacy Policy does not cover those services — please read their own policies.
      </p>

      <h2>10. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. Any change will be posted here with a revised
        &ldquo;Last updated&rdquo; date.
      </p>

      <div className="legal-contact">
        <strong>Contact us about privacy</strong>
        <p>
          Email or write to us via the{' '}
          <Link to="/contact">Contact Us form</Link> and we will reply as soon as possible.
        </p>
      </div>
    </LegalPage>
  )
}
