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
            <div className="map-container">
              <iframe
                title="Practice location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.25279947927!2d-74.11976373946234!3d40.69766374865766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew+York%2C+NY%2C+USA!5e0!3m2!1sen!2sus!4v1708012800000"
                width="100%"
                height="280"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
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
        .map-container {
          margin-top: 0.5rem;
          min-height: 280px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--color-bg);
        }
        .map-container iframe { display: block; }
      `}</style>
    </div>
  )
}
