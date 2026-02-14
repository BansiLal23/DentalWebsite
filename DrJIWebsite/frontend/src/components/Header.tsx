import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/book', label: 'Book Appointment' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
          Dr. JI Dental
        </Link>
        <button
          type="button"
          className="menu-toggle"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={location.pathname === to ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <style>{`
        .header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--color-white);
          box-shadow: var(--shadow);
        }
        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
        }
        .logo {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-primary);
        }
        .menu-toggle {
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 8px;
          background: none;
          border: none;
          cursor: pointer;
        }
        .menu-toggle span {
          width: 24px;
          height: 2px;
          background: var(--color-text);
        }
        .nav {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: var(--color-white);
          flex-direction: column;
          padding: 1rem;
          gap: 0.5rem;
          box-shadow: var(--shadow-lg);
        }
        .nav-open { display: flex; }
        .nav a {
          padding: 0.6rem 0;
          color: var(--color-text);
          font-weight: 500;
        }
        .nav a:hover, .nav a.active { color: var(--color-primary); }
        @media (min-width: 768px) {
          .menu-toggle { display: none; }
          .nav {
            display: flex;
            flex-direction: row;
            position: static;
            box-shadow: none;
            padding: 0;
            gap: 1.5rem;
          }
        }
      `}</style>
    </header>
  )
}
