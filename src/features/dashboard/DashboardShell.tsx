import React from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Clock
} from 'lucide-react'

export const DashboardShell: React.FC = () => {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive Dashboard</h1>
          <p className="page-desc">
            Enquiry-to-admission pipeline, counsellor follow-ups, and conversion metrics.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/leads" className="btn btn-primary">
            <span>View All Leads</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid-cols-4" style={{ marginBottom: '1.75rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Inquiries
            </span>
            <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'rgba(37, 99, 235, 0.15)', color: 'var(--brand-light)' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', margin: '0.6rem 0 0.2rem' }}>
            --
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Permitted leads in pipeline
          </span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              New Leads
            </span>
            <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'var(--status-new-bg)', color: 'var(--status-new)' }}>
              <Sparkles size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', margin: '0.6rem 0 0.2rem' }}>
            --
          </div>
          <span className="badge badge-new">Pending initial contact</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Converted
            </span>
            <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'var(--status-converted-bg)', color: 'var(--status-converted)' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', margin: '0.6rem 0 0.2rem' }}>
            --
          </div>
          <span className="badge badge-converted">Enrolled students</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Overdue Tasks
            </span>
            <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'var(--status-overdue-bg)', color: 'var(--status-overdue)' }}>
              <AlertCircle size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', margin: '0.6rem 0 0.2rem' }}>
            --
          </div>
          <span className="badge badge-overdue">Requires immediate action</span>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid-cols-2">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.15rem' }}>Pipeline Conversion</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--brand-light)', fontSize: '0.85rem', fontWeight: 600 }}>
              <TrendingUp size={16} />
              <span>Target: 25%</span>
            </div>
          </div>
          <div style={{ padding: '2rem 1rem', textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-card)' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Database pipeline status distribution will render live in Phase 7.
            </p>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.15rem' }}>Today's Follow-up Queue</h2>
            <Link to="/followups" style={{ fontSize: '0.82rem', color: 'var(--brand-light)', fontWeight: 600 }}>
              View all
            </Link>
          </div>
          <div style={{ padding: '2rem 1rem', textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-card)' }}>
            <Clock size={28} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Pending calls and student appointments will display here in Phase 6.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
