import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/book', label: 'Book Appointment', cta: true },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  return (
    <header className="site-header">
      <div className="header-container">
        <Link to="/" className="header-logo" onClick={() => setMenuOpen(false)}>
          Dr. JI Dental
        </Link>

        <div className={`header-nav-wrapper ${menuOpen ? 'open' : ''}`}>
          <nav className="header-nav">
            {navLinks.map(({ to, label, cta }) => (
              cta ? (
                <Link
                  key={to}
                  to={to}
                  className={`header-nav-cta ${location.pathname === to ? 'active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              ) : (
                <Link
                  key={to}
                  to={to}
                  className={location.pathname === to ? 'active' : ''}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              )
            ))}
          </nav>

          <div className="header-actions">
          {user ? (
            <>
              <span className="header-user">{user.email}</span>
              <button type="button" className="header-btn" onClick={() => { setMenuOpen(false); logout(); }}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`header-link ${location.pathname === '/login' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Sign in</Link>
              <Link to="/signup" className={`header-link header-link-cta ${location.pathname === '/signup' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Sign up</Link>
            </>
          )}
          </div>
        </div>

        <button
          type="button"
          className="header-menu-toggle"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <style>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--color-white);
          border-bottom: 1px solid rgba(13, 148, 136, 0.12);
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }
        .header-logo {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-primary);
          letter-spacing: -0.02em;
          flex-shrink: 0;
        }
        .header-logo:hover { color: var(--color-primary-dark); }
        .header-nav-wrapper {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .header-nav {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .header-nav a {
          padding: 0.5rem 0.75rem;
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--color-text);
          border-radius: var(--radius);
          transition: color 0.2s, background 0.2s;
        }
        .header-nav a:hover { color: var(--color-primary); }
        .header-nav a.active { color: var(--color-primary); }
        .header-nav-cta {
          background: var(--color-primary) !important;
          color: var(--color-white) !important;
          padding: 0.5rem 1.25rem !important;
          margin: 0 0.25rem;
        }
        .header-nav-cta:hover { background: var(--color-primary-dark) !important; color: var(--color-white) !important; opacity: 1; }
        .header-nav-cta.active { background: var(--color-primary-dark) !important; color: var(--color-white) !important; }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .header-link {
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--color-text);
          padding: 0.4rem 0.75rem;
          border-radius: var(--radius);
        }
        .header-link:hover { color: var(--color-primary); }
        .header-link.active { color: var(--color-primary); }
        .header-link-cta {
          background: var(--color-primary);
          color: var(--color-white);
          padding: 0.5rem 1rem;
        }
        .header-link-cta:hover { color: var(--color-white); opacity: 0.95; }
        .header-user {
          font-size: 0.875rem;
          color: var(--color-text-muted);
          max-width: 140px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .header-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--color-text);
          padding: 0.4rem 0.75rem;
          font-family: inherit;
          border-radius: var(--radius);
        }
        .header-btn:hover { color: var(--color-primary); }
        .header-menu-toggle {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 44px;
          height: 44px;
          padding: 10px;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: var(--radius);
        }
        .header-menu-toggle span {
          width: 22px;
          height: 2px;
          background: var(--color-text);
          transition: transform 0.2s, opacity 0.2s;
        }
        .header-menu-toggle[aria-expanded="true"] span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .header-menu-toggle[aria-expanded="true"] span:nth-child(2) { opacity: 0; }
        .header-menu-toggle[aria-expanded="true"] span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
        @media (min-width: 900px) {
          .header-menu-toggle { display: none; }
        }
        @media (max-width: 899px) {
          .header-nav-wrapper {
            display: none;
            position: fixed;
            top: 72px;
            left: 0;
            right: 0;
            flex-direction: column;
            align-items: stretch;
            background: var(--color-white);
            padding: 1rem 1.5rem;
            gap: 0.5rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.08);
            border-bottom: 1px solid rgba(0,0,0,0.06);
            max-height: calc(100vh - 72px);
            overflow-y: auto;
          }
          .header-nav-wrapper.open { display: flex; }
          .header-nav {
            flex-direction: column;
            align-items: stretch;
            gap: 0.25rem;
          }
          .header-nav a {
            padding: 0.75rem 1rem;
            border-radius: var(--radius);
          }
          .header-nav-cta {
            text-align: center;
            margin: 0.25rem 0;
          }
          .header-actions {
            flex-direction: column;
            margin-top: 0.5rem;
            padding-top: 0.75rem;
            border-top: 1px solid rgba(0,0,0,0.06);
          }
          .header-actions .header-user,
          .header-actions .header-btn,
          .header-actions .header-link {
            width: 100%;
            text-align: center;
            padding: 0.6rem 1rem;
          }
        }
      `}</style>
    </header>
  )
}
