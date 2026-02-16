import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api } from '@/api/client'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email.trim()) {
      setError('Email is required.')
      return
    }
    setLoading(true)
    try {
      await api.auth.forgotPassword(email.trim().toLowerCase())
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed.')
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
            <p>We sent a password reset code to <strong>{email}</strong>. Use it on the next page (valid for 5 minutes).</p>
            <Link to="/reset-password" className="btn btn-primary">Reset password</Link>
            <p className="form-footer">
              <Link to="/login">Back to sign in</Link>
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
        <h1 className="section-title">Forgot password</h1>
        <p className="section-subtitle">Enter your email and we&apos;ll send you a reset code.</p>
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
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Sending...' : 'Send reset code'}
          </button>
          <p className="form-footer">
            <Link to="/login">Back to sign in</Link>
          </p>
        </form>
      </div>
      <style>{`
        .form-container { max-width: 420px; margin: 0 auto; }
        .auth-form { margin-top: 1.5rem; }
        .form-error { padding: 0.75rem; background: #fef2f2; color: #dc2626; border-radius: var(--radius); margin-bottom: 1rem; }
        .form-footer { margin-top: 1.5rem; text-align: center; font-size: 0.95rem; }
        .form-footer a { color: var(--color-primary); }
      `}</style>
    </div>
  )
}
