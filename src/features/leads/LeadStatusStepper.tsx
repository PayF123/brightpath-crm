import React from 'react'
import { Check, CheckCircle2, ChevronRight, XCircle, RefreshCw, AlertTriangle, ArrowRight } from 'lucide-react'
import { LeadStatus } from '../../types/database.types'

interface LeadStatusStepperProps {
  currentStatus: LeadStatus
  onStatusChange: (newStatus: LeadStatus) => void
  onMarkLost: () => void
  isUpdating: boolean
}

const STAGES: { key: LeadStatus; label: string; stepNumber: number }[] = [
  { key: 'New', label: '1. New Lead', stepNumber: 1 },
  { key: 'Contacted', label: '2. Contacted', stepNumber: 2 },
  { key: 'Qualified', label: '3. Qualified', stepNumber: 3 },
  { key: 'Converted', label: '4. Converted (Enrolled)', stepNumber: 4 }
]

export const LeadStatusStepper: React.FC<LeadStatusStepperProps> = ({
  currentStatus,
  onStatusChange,
  onMarkLost,
  isUpdating
}) => {
  const currentStageIndex = STAGES.findIndex((s) => s.key === currentStatus)
  const isLost = currentStatus === 'Lost'

  return (
    <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>
            ADMISSIONS PIPELINE PROGRESSION
          </span>
          {isUpdating && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--brand-light)' }}>
              <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} />
              <span>Saving...</span>
            </span>
          )}
        </div>

        {/* Action: Mark as Lost or Reopen */}
        {!isLost ? (
          <button
            type="button"
            onClick={onMarkLost}
            disabled={isUpdating}
            className="btn btn-secondary"
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.78rem',
              color: '#f87171',
              borderColor: 'rgba(239, 68, 68, 0.3)',
              background: 'rgba(239, 68, 68, 0.08)'
            }}
          >
            <XCircle size={14} />
            <span>Mark as Lost</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onStatusChange('New')}
            disabled={isUpdating}
            className="btn btn-secondary"
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.78rem',
              color: 'var(--brand-light)'
            }}
          >
            <RefreshCw size={13} />
            <span>Re-open Lead (Move to New)</span>
          </button>
        )}
      </div>

      {/* Lost State Warning Banner */}
      {isLost && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.85rem 1.15rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--status-lost-bg)',
          border: '1px solid var(--status-lost-border)',
          color: '#f87171',
          marginBottom: '1.25rem'
        }}>
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>
              This Lead is Marked as Lost
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: '2px' }}>
              Admission consultation has concluded. You can re-open this lead anytime if the student resumes contact.
            </div>
          </div>
        </div>
      )}

      {/* 4 Pipeline Stages */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '0.65rem'
      }}>
        {STAGES.map((stage, idx) => {
          const isCompleted = !isLost && currentStageIndex > idx
          const isCurrent = !isLost && currentStageIndex === idx
          const isUpcoming = !isLost && currentStageIndex < idx

          let borderColor = 'var(--border-subtle)'
          let bgColor = 'rgba(255, 255, 255, 0.02)'
          let textColor = 'var(--text-muted)'

          if (isCurrent) {
            borderColor = 'var(--brand-primary)'
            bgColor = 'rgba(37, 99, 235, 0.16)'
            textColor = '#fff'
          } else if (isCompleted) {
            borderColor = 'rgba(16, 185, 129, 0.4)'
            bgColor = 'rgba(16, 185, 129, 0.08)'
            textColor = '#34d399'
          }

          return (
            <button
              key={stage.key}
              type="button"
              disabled={isUpdating || isCurrent}
              onClick={() => onStatusChange(stage.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: bgColor,
                border: `1px solid ${borderColor}`,
                cursor: isCurrent || isUpdating ? 'default' : 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (!isCurrent && !isUpdating) {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)'
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isCurrent && !isUpdating) {
                  e.currentTarget.style.borderColor = borderColor
                  e.currentTarget.style.backgroundColor = bgColor
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                {/* Step Circle Indicator */}
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: isCompleted ? '#10b981' : isCurrent ? 'var(--brand-primary)' : 'rgba(255, 255, 255, 0.08)',
                  color: '#fff',
                  flexShrink: 0
                }}>
                  {isCompleted ? <Check size={14} strokeWidth={3} /> : stage.stepNumber}
                </div>

                <div>
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: isCurrent ? 700 : 600,
                    color: textColor
                  }}>
                    {stage.label}
                  </div>
                  <div style={{
                    fontSize: '0.7rem',
                    color: isCurrent ? 'var(--brand-light)' : 'var(--text-muted)'
                  }}>
                    {isCurrent ? 'Current Stage' : isCompleted ? 'Completed' : 'Click to advance'}
                  </div>
                </div>
              </div>

              {isUpcoming && (
                <ArrowRight size={14} style={{ color: 'var(--text-muted)', opacity: 0.6 }} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
