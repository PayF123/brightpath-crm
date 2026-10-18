import React from 'react'
import { Link } from 'react-router-dom'
import { CalendarClock, AlertCircle, CheckCircle2, Clock, Plus, ArrowRight } from 'lucide-react'

export const FollowupsShell: React.FC = () => {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Follow-ups Queue</h1>
          <p className="page-desc">
            Track student consultation calls, scheduled demo classes, and follow-up deadlines.
          </p>
        </div>
        <div>
          <button type="button" className="btn btn-primary" onClick={() => alert('Follow-up creation connects in Phase 6')}>
            <Plus size={16} />
            <span>New Follow-up</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
        <button type="button" className="btn btn-primary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
          All Follow-ups
        </button>
        <button type="button" className="btn btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
          Overdue (1)
        </button>
        <button type="button" className="btn btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
          Pending
        </button>
        <button type="button" className="btn btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
          Completed
        </button>
      </div>

      {/* Follow-up Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Sample Overdue card */}
        <div className="card" style={{ borderColor: 'var(--status-overdue-border)', background: 'linear-gradient(90deg, rgba(244, 63, 94, 0.05) 0%, var(--bg-card) 30%)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-md)', background: 'var(--status-overdue-bg)', color: 'var(--status-overdue)' }}>
                <AlertCircle size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>Aarav Sharma</h3>
                  <span className="badge badge-overdue">Overdue by 2 hours</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  "Call back regarding weekend batch timings and send brochure PDF."
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={13} />
                    <span>Due: Today, 10:00 AM</span>
                  </span>
                  <span>Assignee: Counsellor</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" style={{ fontSize: '0.82rem', padding: '0.45rem 0.8rem' }} onClick={() => alert('Mark complete action in Phase 6')}>
                <CheckCircle2 size={15} style={{ color: 'var(--status-converted)' }} />
                <span>Mark Completed</span>
              </button>
              <Link to="/leads/demo-aarav-1" className="btn btn-secondary" style={{ fontSize: '0.82rem', padding: '0.45rem 0.8rem' }}>
                <span>View Lead</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Phase notice */}
        <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem', borderStyle: 'dashed' }}>
          <CalendarClock size={32} style={{ color: 'var(--brand-light)', marginBottom: '0.5rem' }} />
          <h3 style={{ fontSize: '1.05rem' }}>Follow-up Task Engine</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0.4rem auto 0' }}>
            In Phase 6, live due dates, overdue computations (<code style={{ color: 'var(--brand-light)' }}>due_at &lt; NOW()</code>), and completion tracking will synchronize with Supabase.
          </p>
        </div>
      </div>
    </div>
  )
}
