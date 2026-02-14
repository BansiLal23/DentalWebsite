import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">Dr. JI Dental</Link>
          <p>20+ years of trusted dental care. Your smile is our priority.</p>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/book">Book Appointment</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="footer-contact">
          <h4>Contact</h4>
          <p>123 Dental Care Ave</p>
          <p>Suite 100</p>
          <p>Phone: (555) 123-4567</p>
          <p>Email: info@drjidental.com</p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {currentYear} Dr. JI Dental Care. All rights reserved.</p>
        </div>
      </div>
      <style>{`
        .footer {
          background: var(--color-text);
          color: #99a3ae;
          margin-top: 4rem;
        }
        .footer-inner {
          display: grid;
          gap: 2rem;
          padding: 3rem 1.25rem 2rem;
        }
        @media (min-width: 640px) {
          .footer-inner { grid-template-columns: 1fr 1fr 1fr; }
        }
        .footer-logo {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          color: var(--color-white);
          margin-bottom: 0.5rem;
        }
        .footer-brand p, .footer-contact p {
          font-size: 0.95rem;
          margin-bottom: 0.25rem;
        }
        .footer-links h4, .footer-contact h4 {
          color: var(--color-white);
          font-size: 1rem;
          margin-bottom: 0.75rem;
        }
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .footer-links a {
          color: #99a3ae;
        }
        .footer-links a:hover { color: var(--color-primary-light); }
        .footer-bottom {
          border-top: 1px solid #374151;
          padding: 1rem 1.25rem;
          text-align: center;
          font-size: 0.875rem;
        }
      `}</style>
    </footer>
  )
}
