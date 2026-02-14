import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <h1 className="hero-title">20 Years of Trusted Dental Care</h1>
          <p className="hero-subtitle">
            Experience compassionate, expert dental care in a comfortable environment. 
            Your smile and oral health are our top priorities.
          </p>
          <div className="hero-actions">
            <Link to="/book" className="btn btn-primary">Book Appointment</Link>
            <Link to="/contact" className="btn btn-secondary">Contact Us</Link>
          </div>
        </div>
      </section>

      <section className="section intro">
        <div className="container">
          <h2 className="section-title">Welcome to Our Practice</h2>
          <p className="section-subtitle">
            Where decades of experience meet a patient-first approach
          </p>
          <div className="intro-content">
            <p>
              With over 20 years of clinical experience, we provide comprehensive dental 
              services—from routine cleanings to advanced procedures—tailored to your needs. 
              We believe in building lasting relationships and making every visit positive.
            </p>
            <p>
              Our practice combines modern technology with a gentle, caring approach. 
              Whether you need preventive care, cosmetic dentistry, or specialized treatment, 
              we are here to support your oral health journey.
            </p>
            <Link to="/about" className="btn btn-primary">Learn About Our Dentist</Link>
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container cta-inner">
          <h2>Ready to Schedule Your Visit?</h2>
          <p>Book your appointment today and take the first step toward a healthier smile.</p>
          <Link to="/book" className="btn btn-primary">Book Appointment</Link>
        </div>
      </section>

      <style>{`
        .hero {
          background: linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-alt) 100%);
          padding: 4rem 1.25rem 5rem;
          text-align: center;
        }
        .hero-inner { max-width: 700px; margin: 0 auto; }
        .hero-title {
          font-size: clamp(2rem, 5vw, 3rem);
          color: var(--color-text);
          margin-bottom: 1rem;
        }
        .hero-subtitle {
          font-size: 1.15rem;
          color: var(--color-text-muted);
          margin-bottom: 2rem;
          line-height: 1.7;
        }
        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
        }
        .intro-content {
          max-width: 680px;
          margin: 0 auto;
        }
        .intro-content p {
          margin-bottom: 1rem;
          color: var(--color-text-muted);
        }
        .intro-content .btn { margin-top: 0.5rem; }
        .cta-section {
          background: var(--color-primary);
          color: var(--color-white);
          text-align: center;
        }
        .cta-inner h2 {
          color: var(--color-white);
          margin-bottom: 0.5rem;
        }
        .cta-inner p {
          margin-bottom: 1.5rem;
          opacity: 0.95;
        }
        .cta-inner .btn {
          background: var(--color-white);
          color: var(--color-primary);
        }
        .cta-inner .btn:hover { background: var(--color-bg); }
      `}</style>
    </>
  )
}
