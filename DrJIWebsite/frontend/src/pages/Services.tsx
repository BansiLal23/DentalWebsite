import { useEffect, useState } from 'react'
import { api } from '@/api/client'
import type { Service } from '@/types'
import { SERVICE_OPTIONS } from '@/types'
import ServiceCard from '@/components/ServiceCard'

// Fallback services when API is unavailable (e.g. frontend-only deploy)
const FALLBACK_SERVICES: Service[] = SERVICE_OPTIONS.map((opt, i) => ({
  id: i + 1,
  name: opt.label,
  slug: opt.value,
  short_description: '',
  description: '',
  benefits: '',
  benefits_list: [],
  experience_highlight: '',
  icon: '',
  order: opt.value === 'general' ? 0 : i + 1,
}))

export default function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [, setError] = useState<string | null>(null)
  const [usedFallback, setUsedFallback] = useState(false)

  useEffect(() => {
    api.services
      .list()
      .then((data) => {
        setServices(data)
        setUsedFallback(false)
      })
      .catch(() => {
        setError('Live services unavailable.')
        setServices(FALLBACK_SERVICES)
        setUsedFallback(true)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="section"><div className="container"><p className="loading">Loading services...</p></div></div>
    )
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title">Our Services</h1>
        <p className="section-subtitle">Comprehensive dental care for you and your family.</p>
        {usedFallback && (
          <p className="api-hint">Showing our service offerings. Connect your backend (VITE_API_URL) to manage services from the admin.</p>
        )}
        <div className="services-grid">
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </div>
      <style>{`
        .loading,.error-msg,.no-services,.api-hint{text-align:center;color:var(--color-text-muted);}
        .error-msg{color:#dc2626;}
        .api-hint{font-size:0.9rem;margin-bottom:1rem;}
        .services-grid{display:grid;gap:1.5rem;margin-top:1rem;}
        @media(min-width:640px){.services-grid{grid-template-columns:repeat(2,1fr);}}
        @media(min-width:960px){.services-grid{grid-template-columns:repeat(3,1fr);}}
      `}</style>
    </div>
  )
}
