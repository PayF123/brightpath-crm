import React from 'react'
import { Link } from 'react-router-dom'
import {
  Activity as ActivityIcon,
  Sparkles,
  CheckCircle2,
  Calendar,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react'
import { ActivityDashboardItem } from '../../services/metricService'
import { formatRelativeTime } from '../../utils/dateUtils'

export interface RecentActivityWidgetProps {
  activities: ActivityDashboardItem[]
  isLoading?: boolean
}

export const RecentActivityWidget: React.FC<RecentActivityWidgetProps> = ({
  activities,
  isLoading = false
}) => {
  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'LEAD_CREATED':
        return {
          icon: Sparkles,
          color: '#22d3ee',
          bg: 'rgba(6, 182, 212, 0.15)'
        }
      case 'STATUS_CHANGED':
        return {
          icon: CheckCircle2,
          color: '#34d399',
          bg: 'rgba(16, 185, 129, 0.15)'
        }
      case 'FOLLOWUP_SCHEDULED':
        return {
          icon: Calendar,
          color: '#fbbf24',
          bg: 'rgba(245, 158, 11, 0.15)'
        }
      case 'FOLLOWUP_COMPLETED':
        return {
          icon: CheckCircle2,
          color: '#34d399',
          bg: 'rgba(16, 185, 129, 0.15)'
        }
      case 'NOTE_ADDED':
        return {
          icon: FileText,
          color: '#a78bfa',
          bg: 'rgba(168, 85, 247, 0.15)'
        }
      default:
        return {
          icon: ActivityIcon,
          color: 'var(--brand-light)',
          bg: 'rgba(37, 99, 235, 0.15)'
        }
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
              background: 'rgba(168, 85, 247, 0.15)',
              color: '#c084fc'
            }}
          >
            <ActivityIcon size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#fff' }}>
              Institutional Activity Stream
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Real-time audit log of staff interactions & student updates
            </span>
          </div>
        </div>

        <Link
          to="/leads"
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
          <span>Leads Audit</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', padding: '1rem 0' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.05)', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div
          style={{
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed rgba(255, 255, 255, 0.1)'
          }}
        >
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
            No institutional activities logged yet.
          </p>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
            Actions like lead creation, status changes, and follow-ups stream here automatically.
          </span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {activities.map((item) => {
            const badge = getActivityBadge(item.activity_type)
            const Icon = badge.icon

            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                {/* Event Icon */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: badge.bg,
                    color: badge.color,
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                >
                  <Icon size={14} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.15rem' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#fff' }}>
                      {item.actor_name}
                    </span>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                        flexShrink: 0
                      }}
                    >
                      <Clock size={11} />
                      {formatRelativeTime(item.created_at)}
                    </span>
                  </div>

                  <p
                    style={{
                      margin: '0 0 0.2rem',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.35
                    }}
                  >
                    {item.description}
                  </p>

                  <Link
                    to={`/leads/${item.lead_id}`}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--brand-light)',
                      textDecoration: 'none'
                    }}
                  >
                    Student: {item.lead_name}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
