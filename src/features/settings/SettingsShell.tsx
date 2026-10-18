import React from 'react'
import { ShieldCheck, User, Lock, Save } from 'lucide-react'

export const SettingsShell: React.FC = () => {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Account & System Settings</h1>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', fontWeight: 600 }}>
                Full Name
              </label>
              <input
                type="text"
                defaultValue="Demo Counsellor"
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
                defaultValue="staff@brightpath.academy"
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
                Assigned Role
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="badge badge-qualified" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
                  Counsellor
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  (Least-privileged default role)
                </span>
              </div>
            </div>

            <div style={{ paddingTop: '0.5rem' }}>
              <button type="button" className="btn btn-primary" onClick={() => alert('Profile update will be enabled in Phase 11')}>
                <Save size={16} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Security Policy Notice */}
        <div className="card" style={{ borderColor: 'rgba(56, 189, 248, 0.25)', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%)' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--brand-light)' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>Role Immutability & Security Boundary</span>
                <Lock size={14} style={{ color: 'var(--text-muted)' }} />
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: '1.5' }}>
                Per the security requirements of the master specification, users cannot escalate their own role from client-side forms. Administrator bootstrapping is performed exclusively via controlled Supabase SQL procedures.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
