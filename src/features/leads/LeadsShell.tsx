import React from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Plus, Phone, Mail, ExternalLink } from 'lucide-react'

export const LeadsShell: React.FC = () => {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Leads Directory</h1>
          <p className="page-desc">
            Manage student enquiries, update consultation statuses, and track counselor assignments.
          </p>
        </div>
        <div>
          <button type="button" className="btn btn-primary" onClick={() => alert('Lead creation modal will be connected in Phase 5')}>
            <Plus size={16} />
            <span>Add New Lead</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 260px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by student name, phone, or email..."
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem 0.6rem 2.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-canvas)',
                border: '1px solid var(--border-card)',
                color: '#fff',
                fontSize: '0.9rem'
              }}
              readOnly
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              style={{
                padding: '0.6rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-canvas)',
                border: '1px solid var(--border-card)',
                color: 'var(--text-secondary)',
                fontSize: '0.88rem'
              }}
              disabled
            >
              <option>Status: All</option>
              <option>New</option>
              <option>Contacted</option>
              <option>Qualified</option>
              <option>Converted</option>
              <option>Lost</option>
            </select>

            <select
              style={{
                padding: '0.6rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-canvas)',
                border: '1px solid var(--border-card)',
                color: 'var(--text-secondary)',
                fontSize: '0.88rem'
              }}
              disabled
            >
              <option>Source: All</option>
              <option>Website</option>
              <option>Walk-in</option>
              <option>Referral</option>
            </select>

            <button type="button" className="btn btn-secondary" style={{ padding: '0.6rem 0.9rem' }}>
              <Filter size={15} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Leads Table Shell */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)' }}>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Student Name</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Course Interest</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Contact Details</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Source</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Status</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Sample preview row */}
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ fontWeight: 600, color: '#fff' }}>Aarav Sharma</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Created 2 hours ago</div>
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <span style={{ color: 'var(--brand-light)', fontWeight: 500 }}>Full Stack Web Dev</span>
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                    <Phone size={13} style={{ color: 'var(--text-muted)' }} />
                    <span>+91 98765 43210</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <Mail size={13} />
                    <span>aarav.demo@example.com</span>
                  </div>
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Website</span>
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <span className="badge badge-new">New Lead</span>
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <Link to="/leads/demo-aarav-1" className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                    <span>Details</span>
                    <ExternalLink size={13} />
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ padding: '0.9rem 1.25rem', background: 'rgba(0,0,0,0.1)', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Showing sample preview record. Live Supabase database integration connects in Phase 5.
          </span>
          <span className="badge badge-qualified">Phase 1 Preview</span>
        </div>
      </div>
    </div>
  )
}
