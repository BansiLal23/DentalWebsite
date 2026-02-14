import { useEffect, useState } from 'react'
import { api } from '@/api/client'
import type { Dentist } from '@/types'
import { Link } from 'react-router-dom'

export default function About() {
  const [dentist, setDentist] = useState<Dentist | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.dentists
      .list()
      .then((list) => {
        if (list.length > 0) setDentist(list[0])
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <p className="loading">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !dentist) {
    return (
      <div className="section">
        <div className="container">
          <h1 className="section-title">About Our Dentist</h1>
          <p className="section-subtitle">
            20+ years of clinical experience, certifications, and a patient-first philosophy.
          </p>
          <div className="about-fallback">
            <p>
              Our lead dentist brings over 20 years of clinical experience, with a focus on
              comprehensive care, certifications in advanced procedures, and a philosophy
              centered on putting patients first.
            </p>
            <Link to="/book" className="btn btn-primary">Book an Appointment</Link>
          </div>
        </div>
      </div>
    )
  }

  const certs = dentist.certifications
    ? dentist.certifications.split('\n').filter(Boolean)
    : []

  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title">About Our Dentist</h1>
        <p className="section-subtitle">
          {dentist.experience_years}+ years of clinical experience and a patient-first approach
        </p>

        <article className="about-profile">
          {dentist.image && (
            <div className="about-image-wrap">
              <img src={dentist.image} alt={dentist.name} />
            </div>
          )}
          <div className="about-details">
            <h2>{dentist.name}</h2>
            {dentist.title && <p className="about-title">{dentist.title}</p>}
            <p className="about-bio">{dentist.bio}</p>
            {dentist.philosophy && (
              <>
                <h3>Our Philosophy</h3>
                <p>{dentist.philosophy}</p>
              </>
            )}
            {certs.length > 0 && (
              <>
                <h3>Certifications</h3>
                <ul>
                  {certs.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </>
            )}
            <Link to="/book" className="btn btn-primary">Book an Appointment</Link>
          </div>
        </article>
      </div>

      <style>{`
        .loading { text-align: center; color: var(--color-text-muted); }
        .about-fallback { max-width: 640px; }
        .about-fallback p { margin-bottom: 1rem; }
        .about-fallback .btn { margin-top: 0.5rem; }
        .about-profile {
          display: grid;
          gap: 2rem;
          margin-top: 2rem;
        }
        @media (min-width: 768px) {
          .about-profile { grid-template-columns: 280px 1fr; }
        }
        .about-image-wrap {
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          aspect-ratio: 1;
        }
        .about-image-wrap img { width: 100%; height: 100%; object-fit: cover; }
        .about-details h2 { margin-bottom: 0.25rem; }
        .about-title { color: var(--color-primary); margin-bottom: 1rem; }
        .about-bio { margin-bottom: 1.5rem; color: var(--color-text-muted); }
        .about-details h3 {
          font-size: 1.2rem;
          margin: 1.5rem 0 0.5rem;
        }
        .about-details ul { margin-left: 1.25rem; margin-bottom: 1rem; }
        .about-details .btn { margin-top: 0.5rem; }
      `}</style>
    </div>
  )
}
