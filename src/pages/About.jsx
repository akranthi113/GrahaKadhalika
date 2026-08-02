import './About.css'

export default function About() {
  return (
    <div className="about">
      <section className="about-hero">
        <h1>About GrahaKadhalika</h1>
        <p className="about-tagline">
          "The planets may influence the path, but your choices determine the destination."
        </p>
      </section>

      <div className="about-body">
        <section className="about-section">
          <p>
            <strong>Grahakadhalika</strong> is a name inspired by the continuous movement of the
            planets. In Vedic astrology, a person's birth chart represents the planetary positions
            at the moment of birth, but life does not remain static. As time passes, the planets
            continue their journey, and these ongoing planetary progressions influence different
            phases of life. The word <strong>"Grahakadhalika"</strong> was derived from this concept
            of the dynamic movement of the <em>Grahas</em> (planets) and their influence throughout
            our lives.
          </p>
          <p>
            This website was created with a simple purpose—to make genuine astrological guidance
            freely available to everyone.
          </p>
        </section>

        <section className="about-section">
          <h2>Free, Always</h2>
          <p>
            At Grahakadhalika, we believe that knowledge should be shared without barriers. All
            consultations, guidance, and advice offered through this platform are completely{' '}
            <strong>free of charge</strong>. We do not ask users for any payment or mandatory fees.
            Access to guidance will always remain free for everyone.
          </p>
          <p>
            This project is not a business venture. It is a <strong>charitable initiative</strong>{' '}
            driven by a personal passion for astrology. For me, astrology is a lifelong hobby and an
            area of continuous learning. Creating Grahakadhalika is my way of giving back to society
            by sharing whatever knowledge and experience I have gained over the years.
          </p>
          <p>
            If someone finds value in the guidance provided and wishes to support the project, they
            are welcome to leave a voluntary tip or contribute toward improving and maintaining the
            website. Such support is entirely optional and is never expected or required.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Mission</h2>
          <ul className="about-mission">
            <li>To provide honest and unbiased astrological guidance.</li>
            <li>To make astrology accessible to everyone regardless of their financial background.</li>
            <li>To educate people rather than create fear or dependency.</li>
            <li>To encourage free will and conscious decision-making instead of blind belief.</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Free Will Over Fate</h2>
          <p>
            We firmly believe that astrology is a tool for understanding possibilities—not a system
            that controls your destiny. While planetary influences may indicate tendencies and
            opportunities, every individual possesses <strong>free will</strong>. Your choices,
            actions, and determination remain the most powerful forces in shaping your future.
          </p>
          <p>
            Grahakadhalika exists to support, guide, and educate—not to predict doom or create
            unnecessary fear. Every consultation and piece of advice is offered with the intention
            of helping people gain clarity, confidence, and hope.
          </p>
          <p>
            Thank you for visiting Grahakadhalika. We hope this platform becomes a trusted source of
            knowledge and guidance for anyone seeking a deeper understanding of life's journey.
          </p>
        </section>

        <blockquote className="about-quote">
          "The planets may influence the path, but your choices determine the destination."
        </blockquote>
      </div>
    </div>
  )
}
