import { useEffect, useState } from 'react'
import { api } from '@/api/client'
import type { Service } from '@/types'
import ServiceCard from '@/components/ServiceCard'

export default function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.services.list().then(setServices).catch((e) => setError(e instanceof Error ? e.message : 'Failed to load')).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="section"><div className="container"><p className="loading">Loading services...</p></div></div>
    )
  }
  if (error) {
    return (
      <div className="section"><div className="container"><h1 className="section-title">Our Services</h1><p className="error-msg">{error}</p></div></div>
    )
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title">Our Services</h1>
        <p className="section-subtitle">Comprehensive dental care for you and your family.</p>
        <div className="services-grid">
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
        {services.length === 0 && (
          <p className="no-services">Services will appear here once added in the admin. Run the backend seed command to load default services.</p>
        )}
      </div>
      <style>{`
        .loading,.error-msg,.no-services{text-align:center;color:var(--color-text-muted);}
        .error-msg{color:#dc2626;}
        .services-grid{display:grid;gap:1.5rem;margin-top:1rem;}
        @media(min-width:640px){.services-grid{grid-template-columns:repeat(2,1fr);}}
        @media(min-width:960px){.services-grid{grid-template-columns:repeat(3,1fr);}}
      `}</style>
    </div>
  )
}
