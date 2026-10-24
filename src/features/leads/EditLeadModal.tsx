import React, { useState, useEffect } from 'react'
import { X, User, Phone, Mail, BookOpen, Compass, UserCheck, RefreshCw, CheckCircle2 } from 'lucide-react'
import { LeadWithProfile, leadService } from '../../services/leadService'
import { LeadSource, Profile } from '../../types/database.types'

interface EditLeadModalProps {
  isOpen: boolean
  lead: LeadWithProfile
  staffProfiles: Profile[]
  onClose: () => void
  onSuccess: (updated: LeadWithProfile) => void
  currentUserId: string
}

const COURSE_OPTIONS = [
  'Full Stack Web Development',
  'Data Science & AI',
  'UI/UX Design Masterclass',
  'Cloud & DevOps Engineering',
  'Cybersecurity & Ethical Hacking',
  'Digital Marketing & Growth',
  'Other'
]

const SOURCE_OPTIONS: LeadSource[] = [
  'Website',
  'Walk-in',
  'Referral',
  'Social Media',
  'Phone Inquiry',
  'Other'
]

export const EditLeadModal: React.FC<EditLeadModalProps> = ({
  isOpen,
  lead,
  staffProfiles,
  onClose,
  onSuccess,
  currentUserId
}) => {
  const [fullName, setFullName] = useState(lead.full_name)
  const [phone, setPhone] = useState(lead.phone)
  const [email, setEmail] = useState(lead.email || '')
  const [courseInterest, setCourseInterest] = useState(lead.course_interest)
  const [source, setSource] = useState<LeadSource>(lead.source)
  const [assignedTo, setAssignedTo] = useState<string>(lead.assigned_to || '')
  const [notes, setNotes] = useState(lead.notes || '')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setFullName(lead.full_name)
      setPhone(lead.phone)
      setEmail(lead.email || '')
      setCourseInterest(lead.course_interest)
      setSource(lead.source)
      setAssignedTo(lead.assigned_to || '')
      setNotes(lead.notes || '')
      setErrors({})
      setApiError(null)
    }
  }, [isOpen, lead])

  if (!isOpen) return null

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = 'Full name is required (min 2 characters).'
    }
    const digitsOnly = phone.replace(/\D/g, '')
    if (!phone.trim() || digitsOnly.length < 10) {
      errs.phone = 'Valid phone number is required (min 10 digits).'
    }
    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email.trim())) {
        errs.email = 'Please enter a valid email address.'
      }
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
      const updated = await leadService.updateLead(lead.id, {
        full_name: fullName,
        phone,
        email: email || null,
        course_interest: courseInterest,
        source,
        assigned_to: assignedTo || null,
        notes: notes || null
      }, currentUserId)

      if (updated) {
        onSuccess(updated)
        onClose()
      }
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Failed to update lead details.')
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
          maxWidth: '540px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          background: 'linear-gradient(180deg, #161f36 0%, #0d1322 100%)',
          border: '1px solid var(--border-card)',
          overflow: 'hidden'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', margin: 0 }}>
              Edit Student Enquiry
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Update student contact details or counsellor assignment.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{
            padding: '1.25rem 1.5rem',
            overflowY: 'auto',
            maxHeight: 'calc(90vh - 140px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.1rem'
          }}>
            {apiError && (
              <div style={{ padding: '0.75rem 1rem', background: 'var(--status-lost-bg)', border: '1px solid var(--status-lost-border)', color: '#f87171', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                {apiError}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                STUDENT FULL NAME
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-canvas)', border: '1px solid var(--border-card)', color: '#fff', fontSize: '0.9rem' }}
              />
              {errors.fullName && <p style={{ color: '#f87171', fontSize: '0.78rem', margin: '0.25rem 0 0' }}>{errors.fullName}</p>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                  PHONE NUMBER
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-canvas)', border: '1px solid var(--border-card)', color: '#fff', fontSize: '0.9rem' }}
                />
                {errors.phone && <p style={{ color: '#f87171', fontSize: '0.78rem', margin: '0.25rem 0 0' }}>{errors.phone}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-canvas)', border: '1px solid var(--border-card)', color: '#fff', fontSize: '0.9rem' }}
                />
                {errors.email && <p style={{ color: '#f87171', fontSize: '0.78rem', margin: '0.25rem 0 0' }}>{errors.email}</p>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                  COURSE OF INTEREST
                </label>
                <select
                  value={courseInterest}
                  onChange={(e) => setCourseInterest(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-canvas)', border: '1px solid var(--border-card)', color: '#fff', fontSize: '0.88rem' }}
                >
                  {COURSE_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                  LEAD SOURCE
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as LeadSource)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-canvas)', border: '1px solid var(--border-card)', color: '#fff', fontSize: '0.88rem' }}
                >
                  {SOURCE_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                ASSIGNED COUNSELLOR
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-canvas)', border: '1px solid var(--border-card)', color: '#fff', fontSize: '0.88rem' }}
              >
                {staffProfiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.full_name} ({p.role.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                CONSULTATION NOTES
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-canvas)', border: '1px solid var(--border-card)', color: '#fff', fontSize: '0.88rem', resize: 'vertical' }}
              />
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            background: 'rgba(255, 255, 255, 0.02)'
          }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
