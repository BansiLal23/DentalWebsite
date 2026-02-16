import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '@/api/client'

const PASSWORD_HINT = 'Min 8 characters, one uppercase, one lowercase, one digit, one special character.'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email.trim() || !otp.trim() || !newPassword) {
      setError('Email, code, and new password are required.')
      return
    }
    setLoading(true)
    try {
      await api.auth.resetPassword(email.trim().toLowerCase(), otp.trim(), newPassword)
      navigate('/login', { state: { message: 'Password reset. You can sign in now.' } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section">
      <div className="container form-container">
        <h1 className="section-title">Reset password</h1>
        <p className="section-subtitle">Enter the code from your email and choose a new password.</p>
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
            <label htmlFor="otp">Reset code *</label>
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
          <div className="input-group">
            <label htmlFor="new_password">New password *</label>
            <input
              id="new_password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={loading}
            />
            <span className="field-hint">{PASSWORD_HINT}</span>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset password'}
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
        .field-hint { font-size: 0.85rem; color: var(--color-text-muted); margin-top: 0.25rem; display: block; }
        .form-footer { margin-top: 1.5rem; text-align: center; font-size: 0.95rem; }
        .form-footer a { color: var(--color-primary); }
      `}</style>
    </div>
  )
}
