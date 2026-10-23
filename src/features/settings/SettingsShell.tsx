import React, { useState, useEffect } from 'react'
import { ShieldCheck, User, Lock, Save, CheckCircle2, AlertCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { authService } from '../../services/authService'

export const SettingsShell: React.FC = () => {
  const { user, profile, role, refreshProfile } = useAuth()
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (profile?.full_name) {
      setFullName(profile.full_name)
    }
  }, [profile])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setIsSaving(true)
    setMessage(null)

    try {
      await authService.updateProfile(user.id, fullName)
      await refreshProfile()
      setMessage({ type: 'success', text: 'Profile display name updated successfully!' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile.'
      setMessage({ type: 'error', text: msg })
    } finally {
      setIsSaving(false)
    }
  }

  const userRole = role || 'counsellor'

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Account &amp; System Settings</h1>
          <p className="page-desc">
            Manage your personal profile, institute preferences, and view operational security policies.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Profile Card */}
        <div className="card">
          <h2 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} style={{ color: 'var(--brand-light)' }} />
            <span>Staff Profile</span>
          </h2>

          {message && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
              fontSize: '0.88rem',
              background: message.type === 'success' ? 'var(--status-converted-bg)' : 'var(--status-lost-bg)',
              border: `1px solid ${message.type === 'success' ? 'var(--status-converted-border)' : 'var(--status-lost-border)'}`,
              color: message.type === 'success' ? '#34d399' : '#f87171'
            }}>
              {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSave}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-canvas)',
                    border: '1px solid var(--border-card)',
                    color: '#fff',
                    fontSize: '0.92rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || 'staff@brightpath.academy'}
                  disabled
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-muted)',
                    fontSize: '0.92rem',
                    cursor: 'not-allowed'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Assigned Staff Role
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="badge badge-qualified" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem', textTransform: 'capitalize' }}>
                    {userRole}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {userRole === 'admin' ? '(Full System Access)' : userRole === 'manager' ? '(Team Supervision)' : '(Standard Staff Access)'}
                  </span>
                </div>
              </div>

              <div style={{ paddingTop: '0.5rem' }}>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn btn-primary"
                  style={{ opacity: isSaving ? 0.7 : 1 }}
                >
                  <Save size={16} />
                  <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Security Policy Notice */}
        <div className="card" style={{ borderColor: 'rgba(56, 189, 248, 0.25)', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%)' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--brand-light)' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>Role Immutability &amp; Security Boundary</span>
                <Lock size={14} style={{ color: 'var(--text-muted)' }} />
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: '1.5' }}>
                Per the security rules of the master specification, staff members cannot modify their own role. Administrator promotion is performed strictly via the verified SQL procedure in the Supabase Dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
