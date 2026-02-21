import { useState, FormEvent, useEffect } from 'react'
import { api } from '@/api/client'
import { SERVICE_OPTIONS, type TimeSlot } from '@/types'

const MAX_MESSAGE_LENGTH = 2000

const initialForm = {
  name: '',
  email: '',
  phone: '',
  service: '',
  preferred_date: '',
  slot_time: '',
  message: '',
}

type FormErrors = Partial<Record<keyof typeof initialForm, string | undefined>>

function validate(form: typeof initialForm): FormErrors {
  const errors: FormErrors = {}
  if (!form.name.trim()) errors.name = 'Name is required.'
  else if (form.name.trim().length < 2) errors.name = 'Name must be at least 2 characters.'
  if (!form.email.trim()) errors.email = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Please enter a valid email.'
  if (!form.phone.trim()) errors.phone = 'Phone is required.'
  else if (form.phone.replace(/\D/g, '').length < 8) errors.phone = 'Please enter a valid phone number.'
  if (!form.service) errors.service = 'Please select a service.'
  if (!form.preferred_date) errors.preferred_date = 'Please select a date from the calendar.'
  else {
    const d = new Date(form.preferred_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (d < today) errors.preferred_date = 'Date cannot be in the past.'
  }
  if (!form.slot_time) errors.slot_time = 'Please select an available time slot.'
  if (form.message.length > MAX_MESSAGE_LENGTH) errors.message = `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`
  return errors
}

function toYMD(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function getCalendarDays(year: number, month: number): (number | null)[] {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const startPad = first.getDay()
  const days: (number | null)[] = []
  for (let i = 0; i < startPad; i++) days.push(null)
  for (let d = 1; d <= last.getDate(); d++) days.push(d)
  return days
}

function isPast(year: number, month: number, day: number): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(year, month, day)
  return d < today
}

export default function BookAppointment() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slotsError, setSlotsError] = useState<string | null>(null)
  const [slotsFetchKey, setSlotsFetchKey] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  const now = new Date()
  const [calMonth, setCalMonth] = useState(now.getMonth())
  const [calYear, setCalMonthYear] = useState(now.getFullYear())

  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([])
      setSelectedSlot(null)
      setSlotsError(null)
      return
    }
    setSlotsLoading(true)
    setSlotsError(null)
    setSelectedSlot(null)
    api.appointments.getAvailableSlots(selectedDate)
      .then((slots) => {
        setAvailableSlots(slots)
        setSlotsError(null)
      })
      .catch((err) => {
        setAvailableSlots([])
        setSlotsError(err instanceof Error ? err.message : 'Could not load slots. Check that the backend is running and try again.')
      })
      .finally(() => setSlotsLoading(false))
  }, [selectedDate, slotsFetchKey])

  const handleCalendarSelect = (year: number, month: number, day: number) => {
    if (isPast(year, month, day)) return
    const dateStr = toYMD(new Date(year, month, day))
    setSelectedDate(dateStr)
    setForm((prev) => ({ ...prev, preferred_date: dateStr, slot_time: '' }))
  }

  const handleSlotSelect = (time: string) => {
    setSelectedSlot(time)
    setForm((prev) => ({ ...prev, slot_time: time }))
    setErrors((prev) => ({ ...prev, slot_time: undefined, preferred_date: undefined }))
  }

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
        preferred_date: form.preferred_date,
        slot_time: form.slot_time,
        message: form.message.trim() || undefined,
      })
      setSuccess(true)
      setForm(initialForm)
      setSelectedDate(null)
      setSelectedSlot(null)
      setAvailableSlots([])
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="section book-section">
        <div className="book-container">
          <div className="book-success-card">
            <h2 className="book-success-title">Appointment Booked</h2>
            <p className="book-success-text">
              Thank you for booking with us. A confirmation has been sent to the clinic. We will contact you if needed.
            </p>
          </div>
        </div>
        <style>{`
          .book-success-card {
            text-align: center;
            padding: 2.5rem;
            background: var(--color-white);
            border: 1px solid rgba(13, 148, 136, 0.15);
            border-radius: var(--radius-lg);
            box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          }
          .book-success-title { margin-bottom: 0.75rem; color: var(--color-primary-dark); font-size: 1.5rem; }
          .book-success-text { color: var(--color-text-muted); line-height: 1.6; }
        `}</style>
      </div>
    )
  }

  const calendarDays = getCalendarDays(calYear, calMonth)
  const monthLabel = new Date(calYear, calMonth).toLocaleString('default', { month: 'long', year: 'numeric' })
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="section book-section">
      <div className="book-container">
        <div className="book-heading">
          <h1 className="book-title">Book an Appointment</h1>
          <p className="book-subtitle">
            Choose a date, pick an available slot, then fill in your details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="book-form">
          {submitError && (
            <div className="book-form-error">{submitError}</div>
          )}

          <div className="book-card calendar-section">
            <h3 className="book-step-title">1. Select a date</h3>
            <div className="calendar-nav">
              <button
                type="button"
                className="calendar-nav-btn"
                onClick={() => {
                  if (calMonth === 0) {
                    setCalMonth(11)
                    setCalMonthYear((y) => y - 1)
                  } else setCalMonth((m) => m - 1)
                }}
              >
                ←
              </button>
              <span className="calendar-month-label">{monthLabel}</span>
              <button
                type="button"
                className="calendar-nav-btn"
                onClick={() => {
                  if (calMonth === 11) {
                    setCalMonth(0)
                    setCalMonthYear((y) => y + 1)
                  } else setCalMonth((m) => m + 1)
                }}
              >
                →
              </button>
            </div>
            <div className="calendar-grid">
              {weekDays.map((d) => (
                <div key={d} className="calendar-weekday">{d}</div>
              ))}
              {calendarDays.map((day, i) => (
                day === null
                  ? <div key={`e-${i}`} className="calendar-cell calendar-empty" />
                  : (
                    <button
                      key={`${calYear}-${calMonth}-${day}`}
                      type="button"
                      className={`calendar-cell calendar-day ${isPast(calYear, calMonth, day) ? 'past' : ''} ${selectedDate === toYMD(new Date(calYear, calMonth, day)) ? 'selected' : ''}`}
                      onClick={() => handleCalendarSelect(calYear, calMonth, day)}
                      disabled={isPast(calYear, calMonth, day)}
                    >
                      {day}
                    </button>
                  )
              ))}
            </div>
            {errors.preferred_date && <span className="error">{errors.preferred_date}</span>}
          </div>

          <div className="book-card slots-section">
            <h3 className="book-step-title">2. Select a time</h3>
            {!selectedDate && (
              <p className="slots-hint">Select a date above to see available slots.</p>
            )}
            {selectedDate && slotsLoading && (
              <p className="slots-hint">Loading slots…</p>
            )}
            {selectedDate && slotsError && (
              <div className="slots-error">
                <p>{slotsError}</p>
                <button type="button" className="btn btn-secondary slots-retry-btn" onClick={() => setSlotsFetchKey((k) => k + 1)}>
                  Try again
                </button>
              </div>
            )}
            {selectedDate && !slotsLoading && !slotsError && availableSlots.length === 0 && (
              <p className="slots-hint">No available slots for this date. Try another date.</p>
            )}
            {selectedDate && !slotsLoading && !slotsError && availableSlots.length > 0 && (
              <div className="slots-grid">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    className={`slot-btn ${selectedSlot === slot.time ? 'selected' : ''}`}
                    onClick={() => handleSlotSelect(slot.time)}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            )}
            {errors.slot_time && <span className="error">{errors.slot_time}</span>}
          </div>

          <div className="book-card form-fields">
            <h3 className="book-step-title">3. Your details</h3>
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
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Any special requests or notes..."
                maxLength={MAX_MESSAGE_LENGTH}
                className={errors.message ? 'invalid' : ''}
              />
              <span className="char-hint">{form.message.length} / {MAX_MESSAGE_LENGTH}</span>
              {errors.message && <span className="error">{errors.message}</span>}
            </div>
          </div>

          <div className="book-submit-wrap">
            <button type="submit" className="btn btn-primary book-submit-btn" disabled={submitting}>
              {submitting ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .book-section { padding: 3rem 1.5rem 4rem; min-height: 60vh; }
        .book-container {
          max-width: 560px;
          margin: 0 auto;
          text-align: center;
        }
        .book-heading { margin-bottom: 2rem; }
        .book-title {
          font-size: clamp(1.75rem, 4vw, 2.25rem);
          color: var(--color-text);
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        .book-subtitle {
          color: var(--color-text-muted);
          font-size: 1.05rem;
          line-height: 1.5;
        }
        .book-form { text-align: left; }
        .book-form-error {
          padding: 1rem 1.25rem;
          background: #fef2f2;
          color: #dc2626;
          border-radius: var(--radius);
          margin-bottom: 1.5rem;
          font-size: 0.9375rem;
        }
        .book-card {
          background: var(--color-white);
          border: 1px solid rgba(13, 148, 136, 0.15);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          margin-bottom: 1.25rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .book-step-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-text);
          margin-bottom: 1rem;
          letter-spacing: -0.01em;
        }
        .calendar-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .calendar-nav-btn {
          background: var(--color-bg);
          border: 1px solid rgba(13, 148, 136, 0.2);
          border-radius: var(--radius);
          padding: 0.4rem 0.75rem;
          cursor: pointer;
          font-size: 1rem;
          color: var(--color-text);
        }
        .calendar-nav-btn:hover { background: rgba(13, 148, 136, 0.08); border-color: var(--color-primary); }
        .calendar-month-label { font-weight: 600; min-width: 140px; text-align: center; color: var(--color-text); }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
          max-width: 320px;
          margin: 0 auto;
        }
        .calendar-weekday {
          font-size: 0.7rem;
          color: var(--color-text-muted);
          text-align: center;
          padding: 0.35rem;
          font-weight: 600;
        }
        .calendar-cell {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 10px;
          font-size: 0.9rem;
        }
        .calendar-empty { background: transparent; }
        .calendar-day {
          background: var(--color-bg);
          border: 1px solid transparent;
          cursor: pointer;
          color: var(--color-text);
          font-weight: 500;
        }
        .calendar-day:hover:not(.past):not(:disabled) {
          background: rgba(13, 148, 136, 0.12);
          border-color: rgba(13, 148, 136, 0.3);
        }
        .calendar-day.selected {
          background: var(--color-primary);
          color: white;
          border-color: var(--color-primary);
        }
        .calendar-day.past { opacity: 0.4; cursor: not-allowed; }
        .slots-hint { color: var(--color-text-muted); font-size: 0.9rem; margin: 0.5rem 0; }
        .slots-error {
          padding: 1rem;
          background: #fef2f2;
          border-radius: var(--radius);
          margin: 0.5rem 0;
        }
        .slots-error p { color: #dc2626; margin-bottom: 0.75rem; font-size: 0.9rem; }
        .slots-retry-btn { font-size: 0.9rem; padding: 0.5rem 1rem; }
        .slots-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .slot-btn {
          padding: 0.55rem 1.1rem;
          border: 1px solid rgba(13, 148, 136, 0.25);
          border-radius: 10px;
          background: var(--color-bg);
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--color-text);
        }
        .slot-btn:hover { background: rgba(13, 148, 136, 0.12); border-color: var(--color-primary); }
        .slot-btn.selected {
          background: var(--color-primary);
          color: white;
          border-color: var(--color-primary);
        }
        .char-hint {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          margin-top: 0.25rem;
        }
        .book-submit-wrap { text-align: center; margin-top: 1.5rem; }
        .book-submit-btn { min-width: 200px; padding: 0.85rem 1.75rem; font-size: 1rem; }
      `}</style>
    </div>
  )
}
