export default function Contact() {
  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title">Contact Us</h1>
        <p className="section-subtitle">
          Get in touch for appointments, questions, or directions.
        </p>

        <div className="contact-grid">
          <div className="contact-info">
            <h3>Address</h3>
            <p>123 Dental Care Avenue</p>
            <p>Suite 100</p>
            <p>Your City, ST 12345</p>

            <h3>Phone</h3>
            <p><a href="tel:+15551234567">(555) 123-4567</a></p>

            <h3>Email</h3>
            <p><a href="mailto:info@drjidental.com">info@drjidental.com</a></p>

            <h3>Hours</h3>
            <p>Monday – Friday: 8:00 AM – 6:00 PM</p>
            <p>Saturday: 9:00 AM – 2:00 PM</p>
            <p>Sunday: Closed</p>
          </div>

          <div className="contact-map-wrap">
            <h3>Find Us</h3>
            <div className="map-placeholder" aria-hidden="true">
              <p>Google Map placeholder</p>
              <p className="map-hint">
                Replace this with your Google Map embed or link to your practice location.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .contact-grid {
          display: grid;
          gap: 2rem;
          margin-top: 2rem;
        }
        @media (min-width: 768px) {
          .contact-grid { grid-template-columns: 1fr 1fr; }
        }
        .contact-info h3, .contact-map-wrap h3 {
          font-size: 1.15rem;
          color: var(--color-primary-dark);
          margin: 1.5rem 0 0.5rem;
        }
        .contact-info h3:first-child, .contact-map-wrap h3:first-child { margin-top: 0; }
        .contact-info p { margin-bottom: 0.25rem; color: var(--color-text-muted); }
        .contact-info a { color: var(--color-primary); }
        .map-placeholder {
          margin-top: 0.5rem;
          min-height: 280px;
          background: var(--color-bg);
          border: 2px dashed #94a3b8;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--color-text-muted);
          text-align: center;
          padding: 2rem;
        }
        .map-hint { font-size: 0.9rem; margin-top: 0.5rem; }
      `}</style>
    </div>
  )
}
