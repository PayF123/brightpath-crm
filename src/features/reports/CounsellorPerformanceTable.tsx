import React from 'react'
import { Users, User, ShieldCheck } from 'lucide-react'
import { CounsellorPerformanceItem } from '../../services/reportService'

export interface CounsellorPerformanceTableProps {
  counsellors: CounsellorPerformanceItem[]
  isLoading?: boolean
}

export const CounsellorPerformanceTable: React.FC<CounsellorPerformanceTableProps> = ({
  counsellors,
  isLoading = false
}) => {
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
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.35)',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399'
            }}
          >
            <Users size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#fff' }}>
              Counsellor Conversion Efficiency
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Individual staff performance in converting prospective leads into admissions
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.05)',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)'
          }}
        >
          <ShieldCheck size={12} color="#34d399" />
          <span>{counsellors.length} Active Staff</span>
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem 0' }}>
          {[1, 2].map((i) => (
            <div key={i} style={{ height: '42px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.05)', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : counsellors.length === 0 ? (
        <div
          style={{
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed rgba(255, 255, 255, 0.1)'
          }}
        >
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
            No counsellor performance records found in this window.
          </p>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
            Assign leads to counsellors to populate team analytics.
          </span>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>STAFF MEMBER</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'center' }}>ASSIGNED LEADS</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'center' }}>CONVERTED</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'center' }}>LOST</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'center' }}>CONVERSION %</th>
              </tr>
            </thead>
            <tbody>
              {counsellors.map((c) => {
                const isPositive = c.conversionRate > 0

                return (
                  <tr
                    key={c.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    {/* Staff Name & Role */}
                    <td style={{ padding: '0.8rem 0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: 'rgba(37, 99, 235, 0.15)',
                            color: 'var(--brand-light)'
                          }}
                        >
                          <User size={14} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#fff' }}>{c.name}</div>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              textTransform: 'capitalize',
                              color: 'var(--text-muted)'
                            }}
                          >
                            {c.role}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Assigned */}
                    <td style={{ padding: '0.8rem 0.5rem', textAlign: 'center', fontWeight: 700, color: '#fff' }}>
                      {c.assignedCount}
                    </td>

                    {/* Converted */}
                    <td style={{ padding: '0.8rem 0.5rem', textAlign: 'center' }}>
                      <span
                        style={{
                          fontWeight: 700,
                          color: c.convertedCount > 0 ? '#34d399' : 'var(--text-muted)'
                        }}
                      >
                        {c.convertedCount}
                      </span>
                    </td>

                    {/* Lost */}
                    <td style={{ padding: '0.8rem 0.5rem', textAlign: 'center' }}>
                      <span
                        style={{
                          fontWeight: 700,
                          color: c.lostCount > 0 ? '#f87171' : 'var(--text-muted)'
                        }}
                      >
                        {c.lostCount}
                      </span>
                    </td>

                    {/* Rate */}
                    <td style={{ padding: '0.8rem 0.5rem', textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '9999px',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          background: isPositive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                          color: isPositive ? '#34d399' : 'var(--text-muted)',
                          border: `1px solid ${isPositive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.07)'}`
                        }}
                      >
                        {c.conversionRate}%
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
