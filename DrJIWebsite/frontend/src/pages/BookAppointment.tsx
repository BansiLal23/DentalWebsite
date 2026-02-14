import { useState, FormEvent } from 'react'
import { api } from '@/api/client'
import { SERVICE_OPTIONS } from '@/types'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  service: '',
  preferred_date: '',
  message: '',
}

type FormErrors = Partial<Record<keyof typeof initialForm, string>>

function validate(form: typeof initialForm): FormErrors {
  const errors: FormErrors = {}
  if (!form.name.trim()) errors.name = 'Name is required.'
  else if (form.name.trim().length < 2) errors.name = 'Name must be at least 2 characters.'
  if (!form.email.trim()) errors.email = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Please enter a valid email.'
  if (!form.phone.trim()) errors.phone = 'Phone is required.'
  else if (form.phone.replace(/\D/g, '').length < 8) errors.phone = 'Please enter a valid phone number.'
  if (!form.service) errors.service = 'Please select a service.'
  return errors
}

export default function BookAppointment() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    setSubmitError(null)
    try {
      await api.appointments.create({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        service: form.service,
        preferred_date: form.preferred_date || undefined,
        message: form.message.trim() || undefined,
      })
      setSuccess(true)
      setForm(initialForm)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="section">
        <div className="container form-container">
          <div className="success-message">
            <h2>Appointment Request Received</h2>
            <p>
              Thank you for booking with us. We will contact you shortly to confirm your appointment.
            </p>
          </div>
        </div>
        <style>{`
          .form-container { max-width: 520px; margin: 0 auto; }
          .success-message {
            text-align: center;
            padding: 2rem;
            background: var(--color-bg);
            border-radius: var(--radius-lg);
          }
          .success-message h2 { margin-bottom: 0.5rem; color: var(--color-primary-dark); }
        `}</style>
      </div>
    )
  }

  return (
    <div className="section">
      <div className="container form-container">
        <h1 className="section-title">Book an Appointment</h1>
        <p className="section-subtitle">
          Fill out the form below and we will get back to you to confirm your visit.
        </p>

        <form onSubmit={handleSubmit} className="appointment-form">
          {submitError && (
            <div className="form-error">{submitError}</div>
          )}
          <div className="input-group">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className={errors.name ? 'invalid' : ''}
              placeholder="Your full name"
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>
          <div className="input-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? 'invalid' : ''}
              placeholder="your@email.com"
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div className="input-group">
            <label htmlFor="phone">Phone *</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              className={errors.phone ? 'invalid' : ''}
              placeholder="(555) 123-4567"
            />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>
          <div className="input-group">
            <label htmlFor="service">Service *</label>
            <select
              id="service"
              name="service"
              value={form.service}
              onChange={handleChange}
              className={errors.service ? 'invalid' : ''}
            >
              <option value="">Select a service</option>
              {SERVICE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors.service && <span className="error">{errors.service}</span>}
          </div>
          <div className="input-group">
            <label htmlFor="preferred_date">Preferred Date</label>
            <input
              id="preferred_date"
              name="preferred_date"
              type="date"
              value={form.preferred_date}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Any special requests or notes..."
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Sending...' : 'Submit Request'}
          </button>
        </form>
      </div>

      <style>{`
        .form-container { max-width: 520px; margin: 0 auto; }
        .appointment-form { margin-top: 1.5rem; }
        .form-error {
          padding: 0.75rem;
          background: #fef2f2;
          color: #dc2626;
          border-radius: var(--radius);
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  )
}
