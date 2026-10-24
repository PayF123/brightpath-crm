import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, Calendar, ArrowRight, User } from 'lucide-react'
import { StatusBadge } from '../../components/common/StatusBadge'
import { CardSkeleton } from '../../components/common/LoadingSkeleton'
import { EmptyState } from '../../components/common/EmptyState'
import { LeadWithProfile } from '../../services/leadService'

interface LeadCardsMobileProps {
  leads: LeadWithProfile[]
  loading: boolean
  onResetFilters: () => void
  isFiltered: boolean
}

export const LeadCardsMobile: React.FC<LeadCardsMobileProps> = ({
  leads,
  loading,
  onResetFilters,
  isFiltered
}) => {
  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString)
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  if (loading) {
    return <CardSkeleton count={4} />
  }

  if (leads.length === 0) {
    return (
      <div className="card" style={{ padding: 0 }}>
        <EmptyState
          type={isFiltered ? 'no-results' : 'no-data'}
          onAction={isFiltered ? onResetFilters : undefined}
          actionLabel={isFiltered ? 'Clear All Filters' : undefined}
        />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {leads.map((lead) => {
        const counsellor = lead.assigned_profile

        return (
          <div
            key={lead.id}
            className="card"
            style={{
              padding: '1.15rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              border: '1px solid var(--border-card)',
              background: 'linear-gradient(180deg, var(--bg-card) 0%, #0d1322 100%)'
            }}
          >
            {/* Card Header: Student Name & Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
              <div>
                <Link
                  to={`/leads/${lead.id}`}
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: '#fff',
                    textDecoration: 'none'
                  }}
                >
                  {lead.full_name}
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  <Calendar size={12} />
                  <span>{formatDate(lead.created_at)}</span>
                  <span>•</span>
                  <span>{lead.source}</span>
                </div>
              </div>
              <StatusBadge status={lead.status} size="sm" />
            </div>

            {/* Course Interest */}
            <div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.2rem 0.55rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(37, 99, 235, 0.12)',
                  border: '1px solid rgba(37, 99, 235, 0.25)',
                  color: 'var(--brand-light)',
                  fontSize: '0.82rem',
                  fontWeight: 500
                }}
              >
                {lead.course_interest}
              </span>
            </div>

            {/* Contact Actions (Call & Email) */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <a
                href={`tel:${lead.phone}`}
                className="btn btn-secondary"
                style={{
                  flex: 1,
                  padding: '0.45rem 0.65rem',
                  fontSize: '0.8rem',
                  justifyContent: 'center'
                }}
              >
                <Phone size={13} />
                <span>{lead.phone}</span>
              </a>

              {lead.email && (
                <a
                  href={`mailto:${lead.email}`}
                  className="btn btn-secondary"
                  style={{
                    flex: 1,
                    padding: '0.45rem 0.65rem',
                    fontSize: '0.8rem',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Mail size={13} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>Email</span>
                </a>
              )}
            </div>

            {/* Notes if available */}
            {lead.notes && (
              <p
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  margin: 0,
                  fontStyle: 'italic',
                  lineHeight: 1.4,
                  background: 'rgba(0,0,0,0.2)',
                  padding: '0.4rem 0.65rem',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                "{lead.notes}"
              </p>
            )}

            {/* Footer with Counsellor and Details link */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.65rem',
              borderTop: '1px solid var(--border-subtle)',
              marginTop: '0.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <User size={13} />
                <span>{counsellor ? counsellor.full_name : 'Unassigned'}</span>
              </div>

              <Link
                to={`/leads/${lead.id}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.82rem',
                  color: 'var(--brand-light)',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                <span>Details</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
