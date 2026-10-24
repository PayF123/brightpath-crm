import React, { useState, useEffect } from 'react'
import { X, AlertOctagon, RefreshCw, XCircle } from 'lucide-react'

interface LostReasonModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (reason: string, notes: string) => Promise<void>
}

const LOST_REASONS = [
  'Fees Too High / Budget Constraints',
  'Joined Another Institute / Competitor',
  'Batch Timings / Schedule Conflict',
  'Course Curriculum / Tech Stack Mismatch',
  'Not Interested / Wrong Inquiry Number',
  'Decided to Self-Study / Postponed Plan',
  'Other Reason'
]

export const LostReasonModal: React.FC<LostReasonModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [selectedReason, setSelectedReason] = useState(LOST_REASONS[0])
  const [remarks, setRemarks] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setSelectedReason(LOST_REASONS[0])
      setRemarks('')
      setError(null)
      setIsSubmitting(false)
    }
  }, [isOpen])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!selectedReason) {
      setError('Please select a cancellation reason.')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(selectedReason, remarks)
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update lead status.')
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
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose()
        }
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: 0,
          background: 'linear-gradient(180deg, #1f1d2b 0%, #11101a 100%)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.85)',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(239, 68, 68, 0.2)',
          background: 'rgba(239, 68, 68, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171'
            }}>
              <AlertOctagon size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                Mark Lead as Lost
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Specify why this candidate decided not to enroll.
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
              padding: '0.3rem',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--status-lost-bg)',
              border: '1px solid var(--status-lost-border)',
              color: '#f87171',
              fontSize: '0.85rem'
            }}>
              {error}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
              CANCELLATION REASON <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              value={selectedReason}
              disabled={isSubmitting}
              onChange={(e) => setSelectedReason(e.target.value)}
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
              {LOST_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
              ADDITIONAL COUNSELLOR REMARKS <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Candidate felt weekend timings were incompatible with college schedule. Advised to re-apply in summer batch."
              value={remarks}
              disabled={isSubmitting}
              onChange={(e) => setRemarks(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-canvas)',
                border: '1px solid var(--border-card)',
                color: '#fff',
                fontSize: '0.88rem',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)'
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
              disabled={isSubmitting}
              className="btn"
              style={{
                background: '#dc2626',
                color: '#fff',
                borderColor: '#ef4444',
                opacity: isSubmitting ? 0.75 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Marking as Lost...</span>
                </>
              ) : (
                <>
                  <XCircle size={15} />
                  <span>Confirm Status as Lost</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
