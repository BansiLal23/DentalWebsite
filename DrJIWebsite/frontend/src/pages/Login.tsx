import { useState, FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { api, setAuth } from '@/api/client'
import { useAuth } from '@/context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser } = useAuth()
  const message = (location.state as { message?: string })?.message
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email.trim() || !password) {
      setError('Email and password are required.')
      return
    }
    setLoading(true)
    try {
      const res = await api.auth.login(email.trim().toLowerCase(), password)
      setAuth(res.access, res.user)
      setUser(res.user)
      navigate((location.state as { from?: { pathname: string } })?.from?.pathname ?? '/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section">
      <div className="container form-container">
        <h1 className="section-title">Sign in</h1>
        <p className="section-subtitle">Sign in to your account to book appointments.</p>
        {message && <div className="form-success">{message}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="form-error">{error}</div>}
          <div className="input-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={loading}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password *</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={loading}
            />
          </div>
          <p className="form-link-right">
            <Link to="/forgot-password">Forgot password?</Link>
          </p>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <p className="form-footer">
            Don&apos;t have an account? <Link to="/signup">Sign up</Link>
          </p>
        </form>
      </div>
      <style>{`
        .form-container { max-width: 420px; margin: 0 auto; }
        .auth-form { margin-top: 1.5rem; }
        .form-error { padding: 0.75rem; background: #fef2f2; color: #dc2626; border-radius: var(--radius); margin-bottom: 1rem; }
        .form-success { padding: 0.75rem; background: #f0fdf4; color: #166534; border-radius: var(--radius); margin-bottom: 1rem; }
        .form-link-right { margin-top: -0.5rem; margin-bottom: 1rem; font-size: 0.95rem; }
        .form-link-right a { color: var(--color-primary); }
        .form-footer { margin-top: 1.5rem; text-align: center; font-size: 0.95rem; }
        .form-footer a { color: var(--color-primary); }
      `}</style>
    </div>
  )
}
