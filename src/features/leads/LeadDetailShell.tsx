import React from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  BookOpen,
  Globe,
  Clock,
  History,
  CheckCircle2,
  CalendarClock
} from 'lucide-react'

export const LeadDetailShell: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to="/leads" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-light)', fontSize: '0.88rem', fontWeight: 500 }}>
          <ArrowLeft size={16} />
          <span>Back to Leads Directory</span>
        </Link>
      </div>

      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
            <h1 className="page-title">Aarav Sharma</h1>
            <span className="badge badge-new">New Enquiry</span>
          </div>
          <p className="page-desc">Record ID: {id || 'demo-record'}</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="button" className="btn btn-primary" onClick={() => alert('Follow-up modal connects in Phase 6')}>
            <CalendarClock size={16} />
            <span>Schedule Follow-up</span>
          </button>
        </div>
      </div>

      {/* Visual Pipeline Progression Stepper */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.75rem' }}>
          Enquiry Pipeline Status
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '120px', padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(56, 189, 248, 0.2)', border: '1px solid var(--status-new)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} style={{ color: 'var(--status-new)' }} />
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>1. New</span>
          </div>

          <div style={{ flex: 1, minWidth: '120px', padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-canvas)', border: '1px solid var(--border-card)', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.7 }}>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>2. Contacted</span>
          </div>

          <div style={{ flex: 1, minWidth: '120px', padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-canvas)', border: '1px solid var(--border-card)', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.7 }}>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>3. Qualified</span>
          </div>

          <div style={{ flex: 1, minWidth: '120px', padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-canvas)', border: '1px solid var(--border-card)', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.7 }}>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>4. Converted</span>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Info vs Activity */}
      <div className="grid-cols-2">
        {/* Left: Contact and Course info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card">
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              Student Information
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={16} style={{ color: 'var(--text-muted)' }} />
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>+91 98765 43210</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={16} style={{ color: 'var(--text-muted)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>aarav.demo@example.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <BookOpen size={16} style={{ color: 'var(--text-muted)' }} />
                <span style={{ color: 'var(--brand-light)' }}>Full Stack Web Development</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Globe size={16} style={{ color: 'var(--text-muted)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Source: Website Enquiry</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Calendar size={16} style={{ color: 'var(--text-muted)' }} />
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Registered on Oct 18, 2026</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Counsellor Notes</h2>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
              "Student is looking for weekend batch timings. Interested in AI specialization module. Requested demo class link."
            </p>
          </div>
        </div>

        {/* Right: Activity & Followups timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <History size={18} style={{ color: 'var(--brand-light)' }} />
                <span>Audit & Activity History</span>
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '2px solid var(--border-card)', paddingLeft: '1rem', marginLeft: '0.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <Clock size={13} />
                  <span>2 hours ago</span>
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff', marginTop: '0.2rem' }}>
                  Enquiry Received
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Created via Website Contact Form
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <Clock size={13} />
                  <span>Phase 7 Feature</span>
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--brand-light)', marginTop: '0.2rem' }}>
                  Immutable Activity Logs
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  All status transitions and follow-up completions will automatically log here.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
