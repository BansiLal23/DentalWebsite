import type { Service } from '@/types'
import { Link } from 'react-router-dom'

interface ServiceCardProps {
  service: Service
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const benefits = service.benefits_list?.length
    ? service.benefits_list
    : service.benefits
      ? service.benefits.split('\n').filter(Boolean).map((b) => b.trim())
      : []

  return (
    <article className="service-card">
      <div className="service-card-inner">
        <h3>{service.name}</h3>
        {service.short_description && (
          <p className="service-short">{service.short_description}</p>
        )}
        {service.description && (
          <p className="service-desc">{service.description}</p>
        )}
        {benefits.length > 0 && (
          <ul className="service-benefits">
            {benefits.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
        {service.experience_highlight && (
          <p className="service-highlight">{service.experience_highlight}</p>
        )}
        <Link to="/book" className="btn btn-primary service-cta">
          Book This Service
        </Link>
      </div>
      <style>{`
        .service-card {
          background: var(--color-white);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow);
          overflow: hidden;
          border: 1px solid #e5e7eb;
          transition: box-shadow 0.2s;
        }
        .service-card:hover { box-shadow: var(--shadow-lg); }
        .service-card-inner { padding: 1.75rem; }
        .service-card h3 {
          font-size: 1.35rem;
          color: var(--color-primary-dark);
          margin-bottom: 0.5rem;
        }
        .service-short {
          font-weight: 500;
          color: var(--color-text);
          margin-bottom: 0.75rem;
        }
        .service-desc {
          color: var(--color-text-muted);
          font-size: 0.95rem;
          margin-bottom: 1rem;
        }
        .service-benefits {
          margin-left: 1.25rem;
          margin-bottom: 1rem;
          font-size: 0.95rem;
          color: var(--color-text-muted);
        }
        .service-highlight {
          font-size: 0.9rem;
          color: var(--color-primary);
          font-weight: 500;
          margin-bottom: 1rem;
        }
        .service-cta { margin-top: 0.25rem; }
      `}</style>
    </article>
  )
}
