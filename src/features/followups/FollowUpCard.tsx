import React from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  User,
  ArrowRight,
  RefreshCw,
  XCircle
} from 'lucide-react'
import { FollowUpWithDetails } from '../../services/followupService'
import { formatFollowUpDue, isFollowUpOverdue } from '../../utils/dateUtils'

interface FollowUpCardProps {
  followUp: FollowUpWithDetails
  onComplete: (id: string) => Promise<void>
  onCancel?: (id: string) => Promise<void>
  isActionLoading: boolean
}

export const FollowUpCard: React.FC<FollowUpCardProps> = ({
  followUp,
  onComplete,
  onCancel,
  isActionLoading
}) => {
  const isOverdue = isFollowUpOverdue(followUp.due_at, followUp.status)
  const isCompleted = followUp.status === 'completed'
  const isCancelled = followUp.status === 'cancelled'
  const dueInfo = formatFollowUpDue(followUp.due_at, followUp.status)

  const lead = followUp.lead
  const counsellor = followUp.assigned_profile

  // Border & Glow styling
  let cardBorder = '1px solid var(--border-card)'
  let cardBackground = 'var(--bg-card)'

  if (isOverdue) {
    cardBorder = '1px solid var(--status-overdue-border)'
    cardBackground = 'linear-gradient(90deg, rgba(244, 63, 94, 0.08) 0%, var(--bg-card) 25%)'
  } else if (isCompleted) {
    cardBorder = '1px solid rgba(16, 185, 129, 0.25)'
    cardBackground = 'linear-gradient(90deg, rgba(16, 185, 129, 0.04) 0%, var(--bg-card) 25%)'
  }

  return (
    <div
      className="card"
      style={{
        padding: '1.25rem',
        border: cardBorder,
        background: cardBackground,
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem'
      }}
    >
      {/* Top Header Row: Status Badge & Overdue indicator */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {isOverdue && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--status-overdue-bg)',
              color: 'var(--status-overdue)',
              flexShrink: 0
            }}>
              <AlertCircle size={18} />
            </div>
          )}

          {isCompleted && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              flexShrink: 0
            }}>
              <CheckCircle2 size={18} />
            </div>
          )}

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {lead ? (
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
              ) : (
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
                  Student Enquiry
                </span>
              )}

              {lead?.course_interest && (
                <span style={{
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(37, 99, 235, 0.15)',
                  border: '1px solid rgba(37, 99, 235, 0.25)',
                  color: 'var(--brand-light)',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  {lead.course_interest}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginTop: '3px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {lead?.phone && (
                <a
                  href={`tel:${lead.phone}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)', textDecoration: 'none' }}
                >
                  <Phone size={12} />
                  <span>{lead.phone}</span>
                </a>
              )}
              {lead?.email && (
                <a
                  href={`mailto:${lead.email}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)', textDecoration: 'none' }}
                >
                  <Mail size={12} />
                  <span>{lead.email}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Due / Overdue Badge */}
        <div>
          {isOverdue ? (
            <span className="badge badge-overdue" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--status-overdue)' }} />
              <span>{dueInfo.label}</span>
            </span>
          ) : isCompleted ? (
            <span className="badge badge-converted" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={13} />
              <span>{dueInfo.label}</span>
            </span>
          ) : (
            <span className="badge badge-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={13} />
              <span>{dueInfo.label}</span>
            </span>
          )}
        </div>
      </div>

      {/* Task Reminder Note */}
      <div style={{
        padding: '0.75rem 0.95rem',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(0,0,0,0.25)',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.88rem',
        color: '#fff',
        lineHeight: 1.45
      }}>
        "{followUp.note}"
      </div>

      {/* Footer: Counsellor info & Action Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        paddingTop: '0.5rem',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <User size={14} />
          <span>Assignee: <strong style={{ color: 'var(--text-secondary)' }}>{counsellor ? counsellor.full_name : 'Unassigned'}</strong></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Complete button if pending */}
          {!isCompleted && !isCancelled && (
            <button
              type="button"
              disabled={isActionLoading}
              onClick={() => onComplete(followUp.id)}
              className="btn btn-primary"
              style={{
                padding: '0.4rem 0.85rem',
                fontSize: '0.8rem',
                background: '#10b981',
                borderColor: '#059669',
                boxShadow: 'none'
              }}
            >
              {isActionLoading ? (
                <>
                  <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} />
                  <span>Mark Completed</span>
                </>
              )}
            </button>
          )}

          {/* Direct link to parent lead */}
          {lead && (
            <Link
              to={`/leads/${lead.id}`}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
            >
              <span>View Student</span>
              <ArrowRight size={13} />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
