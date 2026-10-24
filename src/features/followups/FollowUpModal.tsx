import React, { useState, useEffect } from 'react'
import {
  X,
  CalendarClock,
  User,
  Clock,
  FileText,
  UserCheck,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { leadService } from '../../services/leadService'
import { followupService, FollowUpWithDetails } from '../../services/followupService'
import { getDefaultDueDateTime } from '../../utils/dateUtils'
import { Profile, Lead } from '../../types/database.types'

interface FollowUpModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (newFollowUp: FollowUpWithDetails) => void
  targetLead?: { id: string; full_name: string; phone?: string; course_interest?: string } | null
  currentUserId: string
}

export const FollowUpModal: React.FC<FollowUpModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  targetLead,
  currentUserId
}) => {
  const [selectedLeadId, setSelectedLeadId] = useState(targetLead?.id || '')
  const [dueAt, setDueAt] = useState(getDefaultDueDateTime())
  const [note, setNote] = useState('')
  const [assignedTo, setAssignedTo] = useState(currentUserId)

  const [availableLeads, setAvailableLeads] = useState<Lead[]>([])
  const [staffProfiles, setStaffProfiles] = useState<Profile[]>([])
  const [loadingInitial, setLoadingInitial] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return

    setDueAt(getDefaultDueDateTime())
    setNote('')
    setErrors({})
    setApiError(null)

    if (targetLead?.id) {
      setSelectedLeadId(targetLead.id)
    }

    setLoadingInitial(true)
    Promise.all([
      leadService.getStaffProfiles(),
      targetLead ? Promise.resolve([]) : leadService.getLeads()
    ])
      .then(([profiles, leads]) => {
        setStaffProfiles(profiles)
        if (!targetLead) {
          setAvailableLeads(leads)
          if (leads.length > 0 && !selectedLeadId) {
            setSelectedLeadId(leads[0].id)
          }
        }
        if (currentUserId) {
          setAssignedTo(currentUserId)
        }
      })
      .catch((err) => {
        console.error('Failed to load modal dependencies:', err)
      })
      .finally(() => {
        setLoadingInitial(false)
      })

    // Prevent background scrolling
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, targetLead, currentUserId])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose()
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, isSubmitting, onClose])

  if (!isOpen) return null

  const validate = (): boolean => {
    const errs: Record<string, string> = {}

    if (!selectedLeadId) {
      errs.lead = 'Please select a student lead.'
    }

    if (!dueAt) {
      errs.dueAt = 'Please select a due date and time.'
    } else {
      const parsed = new Date(dueAt).getTime()
      if (isNaN(parsed)) {
        errs.dueAt = 'Invalid date and time selected.'
      }
    }

    if (!note.trim() || note.trim().length < 3) {
      errs.note = 'Please enter an action reminder note (at least 3 characters).'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setApiError(null)

    try {
      const created = await followupService.createFollowUp({
        lead_id: selectedLeadId,
        due_at: dueAt,
        note: note.trim(),
        assigned_to: assignedTo || currentUserId
      }, currentUserId)

      onSuccess(created)
      onClose()
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Failed to schedule follow-up.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(5, 8, 16, 0.8)',
        backdropFilter: 'blur(8px)',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose()
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          background: 'linear-gradient(180deg, #161f36 0%, #0d1322 100%)',
          border: '1px solid var(--border-card)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
            }}>
              <CalendarClock size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                Schedule Follow-up Task
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Set a deadline for student callback or demo reminder.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close dialog"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              padding: '0.3rem'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{
            padding: '1.25rem 1.5rem',
            overflowY: 'auto',
            maxHeight: 'calc(90vh - 140px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.15rem'
          }}>
            {apiError && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--status-lost-bg)',
                border: '1px solid var(--status-lost-border)',
                color: '#f87171',
                fontSize: '0.85rem'
              }}>
                <AlertCircle size={15} style={{ display: 'inline', marginRight: '6px' }} />
                <span>{apiError}</span>
              </div>
            )}

            {/* Target Student Lead */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                TARGET STUDENT LEAD <span style={{ color: '#ef4444' }}>*</span>
              </label>
              {targetLead ? (
                <div style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.92rem' }}>
                    {targetLead.full_name}
                  </div>
                  {targetLead.course_interest && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--brand-light)' }}>
                      {targetLead.course_interest}
                    </span>
                  )}
                </div>
              ) : (
                <select
                  value={selectedLeadId}
                  disabled={isSubmitting || loadingInitial}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-canvas)',
                    border: `1px solid ${errors.lead ? '#ef4444' : 'var(--border-card)'}`,
                    color: '#fff',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="">Select a student...</option>
                  {availableLeads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.full_name} ({l.course_interest} • {l.phone})
                    </option>
                  ))}
                </select>
              )}
              {errors.lead && <p style={{ color: '#f87171', fontSize: '0.78rem', margin: '0.25rem 0 0' }}>{errors.lead}</p>}
            </div>

            {/* Due Date & Time Picker */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                DUE DATE &amp; TIME <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Clock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="datetime-local"
                  value={dueAt}
                  disabled={isSubmitting}
                  onChange={(e) => setDueAt(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem 0.65rem 2.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-canvas)',
                    border: `1px solid ${errors.dueAt ? '#ef4444' : 'var(--border-card)'}`,
                    color: '#fff',
                    fontSize: '0.9rem',
                    colorScheme: 'dark'
                  }}
                />
              </div>
              {errors.dueAt && <p style={{ color: '#f87171', fontSize: '0.78rem', margin: '0.25rem 0 0' }}>{errors.dueAt}</p>}
            </div>

            {/* Action / Reminder Note */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                TASK REMINDER NOTE <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Call candidate to explain batch timings, fee installments, and share curriculum PDF on WhatsApp."
                value={note}
                disabled={isSubmitting}
                onChange={(e) => setNote(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-canvas)',
                  border: `1px solid ${errors.note ? '#ef4444' : 'var(--border-card)'}`,
                  color: '#fff',
                  fontSize: '0.88rem',
                  resize: 'vertical'
                }}
              />
              {errors.note && <p style={{ color: '#f87171', fontSize: '0.78rem', margin: '0.25rem 0 0' }}>{errors.note}</p>}
            </div>

            {/* Assignee */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                ASSIGNED COUNSELLOR
              </label>
              <select
                value={assignedTo}
                disabled={isSubmitting || loadingInitial}
                onChange={(e) => setAssignedTo(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-canvas)',
                  border: '1px solid var(--border-card)',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
              >
                {staffProfiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.full_name} ({p.role.toUpperCase()}) {p.id === currentUserId ? '— You' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            background: 'rgba(255, 255, 255, 0.02)'
          }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ minWidth: '150px' }}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Scheduling...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} />
                  <span>Schedule Task</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
