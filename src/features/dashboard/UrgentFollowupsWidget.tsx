import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, CheckCircle2, Phone, ArrowRight, User } from 'lucide-react'
import { FollowUpWithDetails } from '../../services/followupService'
import { isFollowUpOverdue, isDueToday, formatRelativeTime, formatDate } from '../../utils/dateUtils'

export interface UrgentFollowupsWidgetProps {
  followups: FollowUpWithDetails[]
  onComplete: (id: string) => Promise<void>
  isLoading?: boolean
}

export const UrgentFollowupsWidget: React.FC<UrgentFollowupsWidgetProps> = ({
  followups,
  onComplete,
  isLoading = false
}) => {
  const [completingId, setCompletingId] = useState<string | null>(null)

  const handleCompleteClick = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      setCompletingId(id)
      await onComplete(id)
    } finally {
      setCompletingId(null)
    }
  }

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem',
        background: 'linear-gradient(145deg, rgba(21, 29, 48, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.35)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(244, 63, 94, 0.15)',
              color: '#fb7185'
            }}
          >
            <Clock size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#fff' }}>
              Action Queue & Reminders
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Top overdue tasks and appointments due today
            </span>
          </div>
        </div>

        <Link
          to="/followups"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--brand-light)',
            textDecoration: 'none'
          }}
        >
          <span>View All Tasks</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', padding: '1rem 0' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: '64px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.05)', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : followups.length === 0 ? (
        <div
          style={{
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            background: 'rgba(16, 185, 129, 0.05)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed rgba(16, 185, 129, 0.25)'
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              marginBottom: '0.65rem'
            }}
          >
            <CheckCircle2 size={24} />
          </div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem' }}>
            All Caught Up!
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: 0 }}>
            No overdue or urgent reminders pending in your queue.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {followups.map((item) => {
            const isOverdue = isFollowUpOverdue(item.due_at, item.status)
            const isToday = isDueToday(item.due_at)
            const isBusy = completingId === item.id

            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: isOverdue ? 'rgba(244, 63, 94, 0.06)' : 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${isOverdue ? 'rgba(244, 63, 94, 0.25)' : 'rgba(255, 255, 255, 0.06)'}`,
                  transition: 'background 0.2s, transform 0.2s',
                  gap: '0.85rem'
                }}
              >
                {/* Left Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                    <Link
                      to={`/leads/${item.lead_id}`}
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: '#fff',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <User size={14} color="var(--brand-light)" />
                      <span className="truncate">{item.lead?.full_name || 'Student Lead'}</span>
                    </Link>

                    {/* Status Pill */}
                    {isOverdue ? (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '9999px',
                          background: 'rgba(244, 63, 94, 0.2)',
                          color: '#fb7185',
                          border: '1px solid rgba(244, 63, 94, 0.35)'
                        }}
                      >
                        OVERDUE ({formatRelativeTime(item.due_at)})
                      </span>
                    ) : isToday ? (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '9999px',
                          background: 'rgba(245, 158, 11, 0.2)',
                          color: '#fbbf24',
                          border: '1px solid rgba(245, 158, 11, 0.35)'
                        }}
                      >
                        DUE TODAY
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '9999px',
                          background: 'rgba(255, 255, 255, 0.06)',
                          color: 'var(--text-muted)'
                        }}
                      >
                        {formatDate(item.due_at)}
                      </span>
                    )}
                  </div>

                  {/* Note preview */}
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {item.note}
                  </p>
                </div>

                {/* Right Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                  {item.lead?.phone && (
                    <a
                      href={`tel:${item.lead.phone}`}
                      className="btn btn-secondary"
                      title={`Call ${item.lead.phone}`}
                      style={{ padding: '0.4rem 0.6rem' }}
                    >
                      <Phone size={14} />
                    </a>
                  )}

                  <button
                    type="button"
                    className="btn btn-secondary"
                    disabled={isBusy}
                    onClick={(e) => handleCompleteClick(e, item.id)}
                    title="Mark task completed"
                    style={{
                      padding: '0.4rem 0.65rem',
                      fontSize: '0.78rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      color: '#34d399',
                      borderColor: 'rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <CheckCircle2 size={14} />
                    <span>{isBusy ? 'Saving...' : 'Done'}</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
