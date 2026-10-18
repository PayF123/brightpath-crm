import React from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, Lock, Mail, ArrowRight } from 'lucide-react'

export const LoginShell: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at top, #1e293b 0%, #090d16 80%)',
      padding: '1.5rem'
    }}>
      <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--brand-primary), #1d4ed8)',
            boxShadow: '0 8px 20px var(--brand-glow)',
            color: '#fff',
            marginBottom: '1rem'
          }}>
            <GraduationCap size={28} />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>Staff Portal Sign In</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            BrightPath Academy Lead Management CRM
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); alert('Authentication connects in Phase 4'); }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', fontWeight: 600 }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  placeholder="staff@brightpath.academy"
                  defaultValue="demo.counsellor@brightpath.academy"
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

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', fontWeight: 600 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  defaultValue="password123"
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

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}>
              <span>Sign In to Dashboard</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </form>

        <div style={{ marginTop: '1.75rem', textAlign: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
          <Link to="/" style={{ fontSize: '0.85rem', color: 'var(--brand-light)', fontWeight: 500 }}>
            ← Return to Dashboard Preview
          </Link>
        </div>
      </div>
    </div>
  )
}
