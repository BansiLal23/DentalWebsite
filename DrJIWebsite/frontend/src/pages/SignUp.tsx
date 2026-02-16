import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api } from '@/api/client'

const PASSWORD_HINT = 'Min 8 characters, one uppercase, one lowercase, one digit, one special character.'

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!name.trim()) {
      setError('Name is required.')
      return
    }
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters.')
      return
    }
    if (!email.trim()) {
      setError('Email is required.')
      return
    }
    if (!password) {
      setError('Password is required.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await api.auth.signup({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirm_password: confirmPassword,
      })
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="section">
        <div className="container form-container">
          <div className="success-message">
            <h2>Check your email</h2>
            <p>We sent a verification code to <strong>{email}</strong>. Enter it on the next page to activate your account.</p>
            <Link to="/verify-email" className="btn btn-primary">Verify email</Link>
            <p className="form-footer">
              <Link to="/login">Already have an account? Sign in</Link>
            </p>
          </div>
        </div>
        <style>{`
          .form-container { max-width: 480px; margin: 0 auto; }
          .success-message { text-align: center; padding: 2rem; background: var(--color-bg); border-radius: var(--radius-lg); }
          .success-message h2 { margin-bottom: 0.5rem; color: var(--color-primary-dark); }
          .success-message .btn { margin-top: 1rem; }
          .form-footer { margin-top: 1.5rem; font-size: 0.95rem; }
          .form-footer a { color: var(--color-primary); }
        `}</style>
      </div>
    )
  }

  return (
    <div className="section">
      <div className="container form-container">
        <h1 className="section-title">Sign up</h1>
        <p className="section-subtitle">Create an account to book appointments.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="form-error">{error}</div>}
          <div className="input-group">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              disabled={loading}
            />
          </div>
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
              autoComplete="new-password"
              disabled={loading}
            />
            <span className="field-hint">{PASSWORD_HINT}</span>
          </div>
          <div className="input-group">
            <label htmlFor="confirm_password">Confirm password *</label>
            <input
              id="confirm_password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
          <p className="form-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
      <style>{`
        .form-container { max-width: 420px; margin: 0 auto; }
        .auth-form { margin-top: 1.5rem; }
        .form-error { padding: 0.75rem; background: #fef2f2; color: #dc2626; border-radius: var(--radius); margin-bottom: 1rem; }
        .field-hint { font-size: 0.85rem; color: var(--color-text-muted); margin-top: 0.25rem; display: block; }
        .form-footer { margin-top: 1.5rem; text-align: center; font-size: 0.95rem; }
        .form-footer a { color: var(--color-primary); }
      `}</style>
    </div>
  )
}
