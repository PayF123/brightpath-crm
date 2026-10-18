import React from 'react'
import { BarChart3, TrendingUp, PieChart, Award } from 'lucide-react'

export const ReportsShell: React.FC = () => {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Performance Analytics</h1>
          <p className="page-desc">
            Admissions conversion rates, lead source attribution, and enquiry performance metrics.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid-cols-2" style={{ marginBottom: '1.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} style={{ color: 'var(--brand-light)' }} />
              <span>Conversion by Acquisition Source</span>
            </h2>
            <span className="badge badge-qualified">Phase 8</span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.6rem 0' }}>Source</th>
                <th style={{ padding: '0.6rem 0' }}>Enquiries</th>
                <th style={{ padding: '0.6rem 0' }}>Converted</th>
                <th style={{ padding: '0.6rem 0' }}>Conv. %</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem 0', color: '#fff', fontWeight: 500 }}>Website Form</td>
                <td style={{ padding: '0.75rem 0' }}>--</td>
                <td style={{ padding: '0.75rem 0' }}>--</td>
                <td style={{ padding: '0.75rem 0', color: 'var(--status-converted)' }}>--%</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem 0', color: '#fff', fontWeight: 500 }}>Referral</td>
                <td style={{ padding: '0.75rem 0' }}>--</td>
                <td style={{ padding: '0.75rem 0' }}>--</td>
                <td style={{ padding: '0.75rem 0', color: 'var(--status-converted)' }}>--%</td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem 0', color: '#fff', fontWeight: 500 }}>Walk-in</td>
                <td style={{ padding: '0.75rem 0' }}>--</td>
                <td style={{ padding: '0.75rem 0' }}>--</td>
                <td style={{ padding: '0.75rem 0', color: 'var(--status-converted)' }}>--%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PieChart size={18} style={{ color: 'var(--status-qualified)' }} />
              <span>Course Demand Breakdown</span>
            </h2>
            <span className="badge badge-qualified">Phase 8</span>
          </div>

          <div style={{ padding: '2rem 1rem', textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
            <BarChart3 size={28} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Real-time course demand aggregates will calculate automatically from live database leads.
            </p>
          </div>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(37, 99, 235, 0.08)', borderColor: 'rgba(37, 99, 235, 0.25)' }}>
        <Award size={24} style={{ color: 'var(--brand-light)', flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>Reconciled Truthful Metrics</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Per the master specification, reports and dashboard metrics share identical calculation logic derived directly from accessible PostgreSQL rows.
          </div>
        </div>
      </div>
    </div>
  )
}
