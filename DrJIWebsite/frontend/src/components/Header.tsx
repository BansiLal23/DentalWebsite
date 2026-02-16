import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

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
  const { user, logout } = useAuth()

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
          {user ? (
            <>
              <span className="nav-user">{user.email}</span>
              <button type="button" className="nav-btn" onClick={() => { setMenuOpen(false); logout(); }}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Sign in</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)}>Sign up</Link>
            </>
          )}
        </nav>
        {/* Sign in / Sign up always visible in header bar */}
        <div className="header-auth">
          {user ? (
            <>
              <span className="nav-user">{user.email}</span>
              <button type="button" className="nav-btn" onClick={() => logout()}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`auth-link ${location.pathname === '/login' ? 'active' : ''}`}>Sign in</Link>
              <Link to="/signup" className={`auth-link auth-link-primary ${location.pathname === '/signup' ? 'active' : ''}`}>Sign up</Link>
            </>
          )}
        </div>
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
        .header-auth {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .auth-link {
          font-weight: 500;
          color: var(--color-text);
          font-size: 0.95rem;
        }
        .auth-link:hover, .auth-link.active { color: var(--color-primary); }
        .auth-link-primary {
          color: var(--color-primary);
          font-weight: 600;
        }
        .auth-link-primary:hover { opacity: 0.9; }
        .header-auth .nav-user { font-size: 0.85rem; color: var(--color-text-muted); }
        .header-auth .nav-btn {
          background: none; border: none; cursor: pointer; font-size: 0.95rem; font-weight: 500;
          color: var(--color-text); padding: 0; font-family: inherit;
        }
        .header-auth .nav-btn:hover { color: var(--color-primary); }
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
        .nav-user { font-size: 0.9rem; color: var(--color-text-muted); padding: 0.6rem 0; }
        .nav-btn {
          background: none; border: none; cursor: pointer; font-size: inherit; font-weight: 500;
          color: var(--color-text); padding: 0.6rem 0; font-family: inherit;
        }
        .nav-btn:hover { color: var(--color-primary); }
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
          .header-auth { margin-left: auto; }
        }
        @media (max-width: 767px) {
          .header-auth { margin-left: auto; }
        }
      `}</style>
    </header>
  )
}
