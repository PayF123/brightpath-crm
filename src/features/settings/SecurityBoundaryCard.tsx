import React from 'react'
import { ShieldCheck, Lock, Database, UserCheck, KeyRound } from 'lucide-react'

export const SecurityBoundaryCard: React.FC = () => {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.85) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.35)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', marginBottom: '1.25rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(56, 189, 248, 0.15)',
            color: 'var(--brand-light)',
            flexShrink: 0
          }}
        >
          <ShieldCheck size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span>Role Immutability &amp; Security Boundary</span>
            <Lock size={15} style={{ color: 'var(--text-muted)' }} />
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0', lineHeight: 1.45 }}>
            Enterprise Row Level Security (RLS) enforcement and administrative operational guidelines
          </p>
        </div>
      </div>

      {/* Security Policies List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {/* Policy 1: Client Role Locking */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          <KeyRound size={16} color="var(--brand-light)" style={{ flexShrink: 0, marginTop: '3px' }} />
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#fff' }}>
              Client Role Tamper Protection
            </div>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              The client interface strictly permits updating the <code style={{ color: '#38bdf8' }}>full_name</code> field. Modifying the <code style={{ color: '#38bdf8' }}>role</code> column directly is locked at the database level by PostgreSQL RLS policies.
            </p>
          </div>
        </div>

        {/* Policy 2: Lead Scoping & Delegation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          <UserCheck size={16} color="#34d399" style={{ flexShrink: 0, marginTop: '3px' }} />
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#fff' }}>
              Role-Based Pipeline Authorization
            </div>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Admissions Counsellors access student leads assigned to them or created by them. Managers and Administrators have institute-wide supervisory visibility and reassignment rights.
            </p>
          </div>
        </div>

        {/* Policy 3: Immutable Audit Trails */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          <Database size={16} color="#fbbf24" style={{ flexShrink: 0, marginTop: '3px' }} />
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#fff' }}>
              Append-Only Institutional Audit Log
            </div>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              All stage movements, follow-up completions, and counsellor consultation notes are permanently committed to <code style={{ color: '#38bdf8' }}>public.activities</code> and cannot be deleted or overwritten.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
