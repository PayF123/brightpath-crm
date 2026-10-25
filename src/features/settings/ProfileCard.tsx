import React, { useState, useEffect } from 'react'
import {
  User,
  Mail,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Calendar,
  Key
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { authService } from '../../services/authService'
import { formatDate } from '../../utils/dateUtils'

export const ProfileCard: React.FC = () => {
  const { user, profile, role, refreshProfile } = useAuth()

  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [isSaving, setIsSaving] = useState(false)
  const [copiedId, setCopiedId] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (profile?.full_name) {
      setFullName(profile.full_name)
    }
  }, [profile])

  const handleCopyId = () => {
    if (!user?.id) return
    navigator.clipboard.writeText(user.id)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const trimmed = fullName.trim()
    if (!trimmed) {
      setError('Staff full name is required.')
      return
    }
    if (trimmed.length < 2) {
      setError('Staff full name must be at least 2 characters.')
      return
    }

    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      await authService.updateProfile(user.id, trimmed)
      await refreshProfile()
      setSuccess('Profile display name updated successfully!')
      setTimeout(() => setSuccess(null), 4000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile.'
      setError(msg)
    } finally {
      setIsSaving(false)
    }
  }

  const userRole = role || profile?.role || 'counsellor'

  const roleConfig: Record<string, { label: string; bg: string; color: string; border: string; desc: string }> = {
    admin: {
      label: 'System Administrator',
      bg: 'rgba(239, 68, 68, 0.15)',
      color: '#f87171',
      border: 'rgba(239, 68, 68, 0.3)',
      desc: 'Full administrative control, team supervision & institute-wide reports.'
    },
    manager: {
      label: 'Admissions Manager',
      bg: 'rgba(59, 130, 246, 0.15)',
      color: 'var(--brand-light)',
      border: 'rgba(59, 130, 246, 0.3)',
      desc: 'Supervisory oversight, team delegation & performance analytics.'
    },
    counsellor: {
      label: 'Admissions Counsellor',
      bg: 'rgba(16, 185, 129, 0.15)',
      color: '#34d399',
      border: 'rgba(16, 185, 129, 0.3)',
      desc: 'Standard counselling access: student inquiries, status updates & follow-ups.'
    }
  }

  const currentRole = roleConfig[userRole] || roleConfig.counsellor

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem',
        background: 'linear-gradient(145deg, rgba(21, 29, 48, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.35)'
      }}
    >
      {/* Card Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(37, 99, 235, 0.15)',
              color: 'var(--brand-light)'
            }}
          >
            <User size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#fff' }}>
              Personal Staff Profile
            </h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Manage your display name and review account privileges
            </span>
          </div>
        </div>

        {/* Role Pill */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.25rem 0.65rem',
            borderRadius: '9999px',
            fontSize: '0.76rem',
            fontWeight: 700,
            background: currentRole.bg,
            color: currentRole.color,
            border: `1px solid ${currentRole.border}`
          }}
        >
          <Shield size={12} />
          <span>{currentRole.label}</span>
        </span>
      </div>

      {/* Feedback Alerts */}
      {success && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            fontSize: '0.86rem',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <CheckCircle2 size={16} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            fontSize: '0.86rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
        {/* Full Name */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
            STAFF DISPLAY NAME <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              required
              value={fullName}
              disabled={isSaving}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Arijeet Sinha"
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem 0.65rem 2.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-canvas)',
                border: '1px solid var(--border-card)',
                color: '#fff',
                fontSize: '0.92rem'
              }}
            />
          </div>
        </div>

        {/* Email Address (Read-only) */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
            EMAIL ADDRESS (READ-ONLY)
          </label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="email"
              value={user?.email || 'staff@brightpath.academy'}
              disabled
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem 0.65rem 2.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'var(--text-muted)',
                fontSize: '0.92rem',
                cursor: 'not-allowed'
              }}
            />
          </div>
        </div>

        {/* Assigned Staff Role & Privileges */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
            ASSIGNED ROLE &amp; PRIVILEGES
          </label>
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  color: currentRole.color
                }}
              >
                {currentRole.label}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                • RLS Protected
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {currentRole.desc}
            </p>
          </div>
        </div>

        {/* Account Metadata Row (User ID & Join Date) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '0.25rem' }}>
          {/* User UUID */}
          <div
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                STAFF USER ID
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                title="Copy User UUID"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: copiedId ? '#34d399' : 'var(--brand-light)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  fontSize: '0.72rem'
                }}
              >
                {copiedId ? <Check size={12} /> : <Copy size={12} />}
                <span>{copiedId ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.76rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.id || '--'}
            </div>
          </div>

          {/* Account Created Date */}
          <div
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
              STAFF ONBOARDING DATE
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>
              <Calendar size={13} color="var(--brand-light)" />
              <span>{profile?.created_at ? formatDate(profile.created_at) : 'Active Session'}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ paddingTop: '0.5rem' }}>
          <button
            type="submit"
            disabled={isSaving}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
