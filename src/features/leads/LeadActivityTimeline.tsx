import React, { useState } from 'react'
import {
  History,
  Sparkles,
  ArrowRightCircle,
  MessageSquare,
  FileEdit,
  CalendarClock,
  Clock,
  Send,
  RefreshCw,
  User,
  AlertCircle
} from 'lucide-react'
import { ActivityWithActor, activityService } from '../../services/activityService'

interface LeadActivityTimelineProps {
  leadId: string
  activities: ActivityWithActor[]
  loading: boolean
  onNoteAdded: (newActivity: ActivityWithActor) => void
  currentUserId: string
}

export const LeadActivityTimeline: React.FC<LeadActivityTimelineProps> = ({
  leadId,
  activities,
  loading,
  onNoteAdded,
  currentUserId
}) => {
  const [noteText, setNoteText] = useState('')
  const [isPostingNote, setIsPostingNote] = useState(false)
  const [noteError, setNoteError] = useState<string | null>(null)

  const handlePostNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!noteText.trim()) return

    setIsPostingNote(true)
    setNoteError(null)

    try {
      const createdActivity = await activityService.addLeadNote(leadId, currentUserId, noteText)
      if (createdActivity) {
        onNoteAdded(createdActivity as ActivityWithActor)
        setNoteText('')
      }
    } catch (err: unknown) {
      setNoteError(err instanceof Error ? err.message : 'Failed to post note.')
    } finally {
      setIsPostingNote(false)
    }
  }

  const formatActivityDate = (dateString: string) => {
    try {
      const d = new Date(dateString)
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const getActivityIconConfig = (type: string) => {
    switch (type) {
      case 'LEAD_CREATED':
        return {
          icon: <Sparkles size={14} />,
          bg: 'rgba(16, 185, 129, 0.15)',
          color: '#34d399',
          border: 'rgba(16, 185, 129, 0.3)',
          label: 'Enquiry Created'
        }
      case 'STATUS_CHANGED':
        return {
          icon: <ArrowRightCircle size={14} />,
          bg: 'rgba(37, 99, 235, 0.15)',
          color: '#60a5fa',
          border: 'rgba(37, 99, 235, 0.3)',
          label: 'Status Change'
        }
      case 'NOTE_ADDED':
        return {
          icon: <MessageSquare size={14} />,
          bg: 'rgba(168, 85, 247, 0.15)',
          color: '#c084fc',
          border: 'rgba(168, 85, 247, 0.3)',
          label: 'Counsellor Note'
        }
      case 'LEAD_UPDATED':
        return {
          icon: <FileEdit size={14} />,
          bg: 'rgba(56, 189, 248, 0.15)',
          color: '#38bdf8',
          border: 'rgba(56, 189, 248, 0.3)',
          label: 'Details Updated'
        }
      case 'FOLLOW_UP_SCHEDULED':
        return {
          icon: <CalendarClock size={14} />,
          bg: 'rgba(245, 158, 11, 0.15)',
          color: '#fbbf24',
          border: 'rgba(245, 158, 11, 0.3)',
          label: 'Follow-up Task'
        }
      default:
        return {
          icon: <Clock size={14} />,
          bg: 'rgba(255, 255, 255, 0.08)',
          color: 'var(--text-muted)',
          border: 'var(--border-subtle)',
          label: 'Activity'
        }
    }
  }

  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <History size={18} style={{ color: 'var(--brand-light)' }} />
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: 0 }}>
          Activity Timeline &amp; Notes
        </h2>
      </div>

      {/* Quick Note Composer */}
      <form onSubmit={handlePostNote} style={{ marginBottom: '1.5rem' }}>
        <div style={{
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-canvas)',
          border: '1px solid var(--border-card)',
          overflow: 'hidden',
          transition: 'border-color 0.15s ease'
        }}>
          <textarea
            rows={2}
            placeholder="Type a consultation note (e.g. Spoke to student, shared curriculum brochure, follow-up scheduled)..."
            value={noteText}
            disabled={isPostingNote}
            onChange={(e) => setNoteText(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 0.85rem',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '0.88rem',
              resize: 'none'
            }}
          />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.5rem 0.75rem',
            borderTop: '1px solid var(--border-subtle)',
            background: 'rgba(255, 255, 255, 0.02)'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Visible to all counsellors
            </span>
            <button
              type="submit"
              disabled={isPostingNote || !noteText.trim()}
              className="btn btn-primary"
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.8rem',
                opacity: !noteText.trim() || isPostingNote ? 0.6 : 1,
                cursor: !noteText.trim() || isPostingNote ? 'not-allowed' : 'pointer'
              }}
            >
              {isPostingNote ? (
                <>
                  <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <Send size={13} />
                  <span>Post Note</span>
                </>
              )}
            </button>
          </div>
        </div>
        {noteError && (
          <p style={{ color: '#f87171', fontSize: '0.78rem', margin: '0.35rem 0 0' }}>
            {noteError}
          </p>
        )}
      </form>

      {/* Timeline Stream */}
      <div style={{ position: 'relative', paddingLeft: '1.25rem' }}>
        {/* Vertical Timeline Guide Line */}
        <div style={{
          position: 'absolute',
          left: '9px',
          top: '8px',
          bottom: '8px',
          width: '2px',
          background: 'var(--border-subtle)'
        }} />

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
              <span>Loading activity history...</span>
            </div>
          </div>
        ) : activities.length === 0 ? (
          <div style={{ padding: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
            No activity logged yet for this enquiry.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {activities.map((act) => {
              const cfg = getActivityIconConfig(act.activity_type)
              const actorName = act.actor_profile?.full_name || 'Staff'

              return (
                <div key={act.id} style={{ position: 'relative' }}>
                  {/* Timeline Node Dot */}
                  <div style={{
                    position: 'absolute',
                    left: '-1.25rem',
                    top: '2px',
                    transform: 'translateX(-50%)',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: cfg.bg,
                    border: `1px solid ${cfg.border}`,
                    color: cfg.color
                  }}>
                    {cfg.icon}
                  </div>

                  {/* Content Container */}
                  <div style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span style={{
                          padding: '0.1rem 0.45rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          background: cfg.bg,
                          color: cfg.color
                        }}>
                          {cfg.label}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>
                          {actorName}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {formatActivityDate(act.created_at)}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                      {act.description}
                    </div>

                    {/* Metadata if Cancellation Reason */}
                    {Boolean(act.metadata && (act.metadata as any).reason) && (
                      <div style={{
                        marginTop: '0.4rem',
                        padding: '0.4rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        fontSize: '0.78rem',
                        color: '#f87171'
                      }}>
                        <strong>Reason:</strong> {String((act.metadata as any).reason)}
                        {Boolean((act.metadata as any).notes) && (
                          <div style={{ marginTop: '2px', opacity: 0.9 }}>
                            {String((act.metadata as any).notes)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
