import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '@/api/client'

export default function VerifyEmail() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email.trim() || !otp.trim()) {
      setError('Email and verification code are required.')
      return
    }
    setLoading(true)
    try {
      await api.auth.verifyEmail(email.trim().toLowerCase(), otp.trim())
      navigate('/login', { state: { message: 'Email verified. You can sign in now.' } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section">
      <div className="container form-container">
        <h1 className="section-title">Verify your email</h1>
        <p className="section-subtitle">Enter the 6-digit code we sent to your email.</p>
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
            <label htmlFor="otp">Verification code *</label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              maxLength={6}
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
          <p className="form-footer">
            <Link to="/signup">Sign up</Link> · <Link to="/login">Sign in</Link>
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
