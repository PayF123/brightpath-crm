import React, { useState, useEffect, useRef } from 'react'
import {
  X,
  User,
  Phone,
  Mail,
  BookOpen,
  Compass,
  FileText,
  UserCheck,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Sparkles
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { leadService } from '../../services/leadService'
import { Lead, LeadSource, Profile } from '../../types/database.types'

interface LeadFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (lead: Lead) => void
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

export const LeadFormModal: React.FC<LeadFormModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user, profile } = useAuth()

  // Form Fields
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [courseInterest, setCourseInterest] = useState('Full Stack Web Development')
  const [source, setSource] = useState<LeadSource>('Website')
  const [assignedTo, setAssignedTo] = useState<string>('')
  const [notes, setNotes] = useState('')

  // Staff Profiles for Assignee Dropdown
  const [staffProfiles, setStaffProfiles] = useState<Profile[]>([])
  const [loadingStaff, setLoadingStaff] = useState(false)

  // Status & Validation States
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState<string | null>(null)

  const nameInputRef = useRef<HTMLInputElement>(null)

  // Fetch staff list & set default assignee
  useEffect(() => {
    if (!isOpen) return

    let isMounted = true
    setLoadingStaff(true)

    leadService.getStaffProfiles()
      .then((profiles) => {
        if (!isMounted) return
        setStaffProfiles(profiles)
        // Default to logged-in user if available, otherwise first staff member
        if (user?.id) {
          setAssignedTo(user.id)
        } else if (profiles.length > 0) {
          setAssignedTo(profiles[0].id)
        }
      })
      .catch((err) => {
        console.error('Failed to load staff profiles:', err)
      })
      .finally(() => {
        if (isMounted) setLoadingStaff(false)
      })

    // Auto-focus first input
    setTimeout(() => {
      nameInputRef.current?.focus()
    }, 100)

    // Prevent background scroll
    document.body.style.overflow = 'hidden'

    return () => {
      isMounted = false
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, user])

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

  // Reset Form
  const resetForm = () => {
    setFullName('')
    setPhone('')
    setEmail('')
    setCourseInterest(COURSE_OPTIONS[0])
    setSource(SOURCE_OPTIONS[0])
    setNotes('')
    setFieldErrors({})
    setApiError(null)
    if (user?.id) setAssignedTo(user.id)
  }

  // Field Validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    // Name validation
    const trimmedName = fullName.trim()
    if (!trimmedName) {
      errors.fullName = 'Student full name is required.'
    } else if (trimmedName.length < 2) {
      errors.fullName = 'Name must be at least 2 characters long.'
    }

    // Phone validation (min 10 digits, allows +, spaces, dashes)
    const trimmedPhone = phone.trim()
    const digitsOnly = trimmedPhone.replace(/\D/g, '')
    if (!trimmedPhone) {
      errors.phone = 'Phone number is required.'
    } else if (digitsOnly.length < 10) {
      errors.phone = 'Please enter a valid phone number (at least 10 digits).'
    }

    // Email validation (optional, but validated if supplied)
    const trimmedEmail = email.trim()
    if (trimmedEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(trimmedEmail)) {
        errors.email = 'Please enter a valid email address (e.g. name@domain.com).'
      }
    }

    // Course validation
    if (!courseInterest) {
      errors.courseInterest = 'Please select a course of interest.'
    }

    // Source validation
    if (!source) {
      errors.source = 'Please select a lead source.'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError(null)

    if (!validateForm()) {
      return
    }

    if (!user?.id) {
      setApiError('You must be signed in to create a lead.')
      return
    }

    setIsSubmitting(true)

    try {
      const createdLead = await leadService.createLead({
        full_name: fullName,
        phone,
        email: email || null,
        course_interest: courseInterest,
        source,
        status: 'New',
        assigned_to: assignedTo || user.id,
        notes: notes || null
      }, user.id)

      resetForm()
      onSuccess(createdLead)
      onClose()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create student lead.'
      setApiError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(5, 8, 16, 0.75)',
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
          maxWidth: '560px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          background: 'linear-gradient(180deg, #161f36 0%, #0d1322 100%)',
          border: '1px solid var(--border-card)',
          boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
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
              background: 'linear-gradient(135deg, var(--brand-primary), #1d4ed8)',
              color: '#fff',
              boxShadow: '0 4px 12px var(--brand-glow)'
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                New Student Enquiry
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Capture prospective student details and assign a counsellor.
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
              padding: '0.4rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{
            padding: '1.25rem 1.5rem',
            overflowY: 'auto',
            maxHeight: 'calc(92vh - 145px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.15rem'
          }}>
            {/* Top API Error Banner */}
            {apiError && (
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem',
                padding: '0.8rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--status-lost-bg)',
                border: '1px solid var(--status-lost-border)',
                color: '#f87171',
                fontSize: '0.85rem'
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{apiError}</span>
              </div>
            )}

            {/* Row 1: Student Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                STUDENT FULL NAME <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  ref={nameInputRef}
                  type="text"
                  placeholder="e.g. Rahul Verma"
                  value={fullName}
                  disabled={isSubmitting}
                  onChange={(e) => {
                    setFullName(e.target.value)
                    if (fieldErrors.fullName) setFieldErrors(prev => ({ ...prev, fullName: '' }))
                  }}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem 0.65rem 2.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-canvas)',
                    border: `1px solid ${fieldErrors.fullName ? '#ef4444' : 'var(--border-card)'}`,
                    color: '#fff',
                    fontSize: '0.92rem'
                  }}
                />
              </div>
              {fieldErrors.fullName && (
                <p style={{ margin: '0.3rem 0 0', color: '#f87171', fontSize: '0.78rem' }}>
                  {fieldErrors.fullName}
                </p>
              )}
            </div>

            {/* Row 2: Phone Number & Email Address (2 Columns) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                  PHONE NUMBER <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    disabled={isSubmitting}
                    onChange={(e) => {
                      setPhone(e.target.value)
                      if (fieldErrors.phone) setFieldErrors(prev => ({ ...prev, phone: '' }))
                    }}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem 0.65rem 2.25rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-canvas)',
                      border: `1px solid ${fieldErrors.phone ? '#ef4444' : 'var(--border-card)'}`,
                      color: '#fff',
                      fontSize: '0.92rem'
                    }}
                  />
                </div>
                {fieldErrors.phone && (
                  <p style={{ margin: '0.3rem 0 0', color: '#f87171', fontSize: '0.78rem' }}>
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                  EMAIL ADDRESS <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={email}
                    disabled={isSubmitting}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }))
                    }}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem 0.65rem 2.25rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-canvas)',
                      border: `1px solid ${fieldErrors.email ? '#ef4444' : 'var(--border-card)'}`,
                      color: '#fff',
                      fontSize: '0.92rem'
                    }}
                  />
                </div>
                {fieldErrors.email && (
                  <p style={{ margin: '0.3rem 0 0', color: '#f87171', fontSize: '0.78rem' }}>
                    {fieldErrors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Row 3: Course Interest & Lead Source (2 Columns) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                  COURSE OF INTEREST <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <BookOpen size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <select
                    value={courseInterest}
                    disabled={isSubmitting}
                    onChange={(e) => setCourseInterest(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem 0.65rem 2.25rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-canvas)',
                      border: '1px solid var(--border-card)',
                      color: '#fff',
                      fontSize: '0.9rem'
                    }}
                  >
                    {COURSE_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                  LEAD SOURCE <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Compass size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <select
                    value={source}
                    disabled={isSubmitting}
                    onChange={(e) => setSource(e.target.value as LeadSource)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem 0.65rem 2.25rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-canvas)',
                      border: '1px solid var(--border-card)',
                      color: '#fff',
                      fontSize: '0.9rem'
                    }}
                  >
                    {SOURCE_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Row 4: Counsellor Assignee */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                ASSIGNED COUNSELLOR
              </label>
              <div style={{ position: 'relative' }}>
                <UserCheck size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <select
                  value={assignedTo}
                  disabled={isSubmitting || loadingStaff}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem 0.65rem 2.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-canvas)',
                    border: '1px solid var(--border-card)',
                    color: '#fff',
                    fontSize: '0.9rem'
                  }}
                >
                  {staffProfiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.full_name} ({p.role.toUpperCase()}) {p.id === user?.id ? '— You' : ''}
                    </option>
                  ))}
                  {staffProfiles.length === 0 && (
                    <option value={user?.id || ''}>
                      {profile?.full_name || 'Current User'} (Assigned)
                    </option>
                  )}
                </select>
              </div>
            </div>

            {/* Row 5: Initial Consultation Notes */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  INITIAL CONSULTATION NOTES <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
                </label>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {notes.length}/500
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <textarea
                  rows={3}
                  maxLength={500}
                  placeholder="e.g. Candidate inquired about scholarship options and prefers weekend batches. Follow-up demo requested."
                  value={notes}
                  disabled={isSubmitting}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-canvas)',
                    border: '1px solid var(--border-card)',
                    color: '#fff',
                    fontSize: '0.88rem',
                    lineHeight: '1.4',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
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
              style={{
                minWidth: '150px',
                opacity: isSubmitting ? 0.8 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Creating Lead...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>Create Student Lead</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
