import { Link } from 'react-router-dom'
import LegalPage from '../components/LegalPage'

export default function Terms() {
  return (
    <LegalPage
      title="Terms of Use"
      description="Terms of use for GrahaKadhalika, a free Vedic astrology and kundli generation service, covering your rights and responsibilities on the site."
      lastUpdated="03 August 2026"
    >
      <p>
        These Terms of Use (&ldquo;Terms&rdquo;) govern your access to and use of GrahaKadhalika
        (the &ldquo;Service&rdquo;, available at{' '}
        <a href="https://grahakadhalika.com/" rel="noreferrer">
          https://grahakadhalika.com/
        </a>
        ). Please read them carefully before using the Service.
      </p>

      <h2>1. Eligibility</h2>
      <p>
        You must be <strong>at least 18 years old</strong> to use this Service, or use it under the
        supervision of a parent or guardian if you are a minor. By using the Service, you represent
        that you meet this requirement. If you are under 18, please ask a parent or guardian to help
        you use the Service.
      </p>

      <h2>2. The service</h2>
      <p>
        GrahaKadhalika is a free, personal project that generates a Vedic (Lahiri) birth chart and
        offers astrology guidance and consultations at no charge. We do not guarantee that the Service
        will be available, uninterrupted, or error-free at any time, and live chat consultations
        depend on when a volunteer is available.
      </p>

      <h2>3. Astrology disclaimer</h2>
      <p>
        <strong>The content we provide is for educational and entertainment purposes only. It is not
        professional advice &mdash; medical, legal, financial, or otherwise.</strong> Birth charts,
        Dasha analyses, and consultations are generated through standard Vedic methods and
        interpretations; they are not a substitute for qualified professional counsel. You should
        always seek independent professional advice for decisions that could affect your health,
        finances, relationships, or legal standing. Do not act solely on information provided here.
      </p>

      <h2>4. Accuracy</h2>
      <p>
        While we aim to calculate charts accurately using the Lahiri ayanamsa, astrology is a
        interpretive tradition and calculations may contain errors or approximations. We do not
        warrant that any chart or analysis is complete, reliable, or error-free.
      </p>
      <h2>5. User responsibilities</h2>
      <p>
        You agree to: (a) provide accurate birth details and contact information; (b) use the Service
        respectfully and lawfully; and (c) not submit content that is false, defamatory, abusive,
        hateful, harassing, or otherwise objectionable.
      </p>
      <h2>6. Your content</h2>
      <p>
        You retain ownership of any content you submit (such as blog posts or messages). By submitting
        content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and
        distribute it solely to provide and promote the Service. We are not responsible for the
        accuracy of any user-submitted content. We may remove any content at our sole discretion
        without notice.
      </p>

      <h2>7. Accounts</h2>
      <p>
        You are responsible for maintaining the confidentiality of your account and password, and for
        all activities that occur under your account. Notify us immediately of any unauthorized use.
        We are not liable for any loss or damage arising from your failure to protect your credentials.
      </p>

      <h2>8. Intellectual property</h2>
      <p>
        All content, charts, layouts, graphics, logos, software, and text on this site (other than
        user-submitted content) are the property of GrahaKadhalika or its licensors and are protected
        by copyright, trademark, and other laws. You may view and download material for personal,
        non-commercial use only, in accordance with our{' '}
        <Link to="/brand">Brand Guidelines</Link>. The underlying software uses third-party libraries
        (for example React, Supabase, and Vite) each subject to its own license.
      </p>

      <h2>9. Disclaimer</h2>
      <p>
        The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without
        warranties of any kind, either express or implied. To the fullest extent permitted by law, we
        disclaim all warranties, including but not limited to implied warranties of merchantability,
        fitness for a particular purpose, non-infringement, and accuracy. We do not warrant that the
        Service will be uninterrupted, secure, or error-free, or that defects will be corrected.
      </p>

      <h2>10. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, GrahaKadhalika, its operators, and its affiliates will
        not be liable for any indirect, incidental, special, consequential, or punitive damages, or any
        loss of data, profits, or goodwill, whether or not we have been advised of the possibility of
        such damage, arising out of or in connection with your use of the Service. Our total liability
        for any claim shall not exceed the amount you paid (if anything) to us in connection with the
        Service — which, since the Service is free, is zero.
      </p>

      <h2>11. Indemnification</h2>
      <p>
        You agree to defend, indemnify, and hold harmless GrahaKadhalika and its operators from and
        against any claims, liabilities, damages, losses, or expenses arising out of or in any way
        connected with your use of the Service or your violation of these Terms.
      </p>

      <h2>12. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. When we do, the &ldquo;Last updated&rdquo;
        date at the top will change. Your continued use after such changes constitutes acceptance of
        the revised Terms.
      </p>

      <h2>13. Governing law and jurisdiction</h2>
      <p>
        These Terms are governed by and construed in accordance with the laws of India, without
        regard to its conflict of law principles. Any dispute arising from or related to the Service
        shall be subject to the exclusive jurisdiction of the competent courts in India.
      </p>

      <div className="legal-contact">
        <strong>Contact us about these Terms</strong>
        <p>
          If you have any questions, please reach out through the{' '}
          <Link to="/contact">Contact Us form</Link>.
        </p>
      </div>
    </LegalPage>
  )
}
