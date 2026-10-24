import React from 'react'
import { Link } from 'react-router-dom'
import { Layers, ArrowRight } from 'lucide-react'
import { StageDistributionItem } from '../../services/metricService'

export interface PipelineDistributionWidgetProps {
  distribution: StageDistributionItem[]
  totalLeads: number
  isLoading?: boolean
}

export const PipelineDistributionWidget: React.FC<PipelineDistributionWidgetProps> = ({
  distribution,
  totalLeads,
  isLoading = false
}) => {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem',
        background: 'linear-gradient(145deg, rgba(21, 29, 48, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.35)'
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
              background: 'rgba(59, 130, 246, 0.15)',
              color: 'var(--brand-light)'
            }}
          >
            <Layers size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#fff' }}>
              Pipeline Stage Breakdown
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Distribution across active admission milestones
            </span>
          </div>
        </div>

        <Link
          to="/leads"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--brand-light)',
            textDecoration: 'none'
          }}
        >
          <span>Pipeline View</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem 0' }}>
          <div style={{ height: '14px', borderRadius: '7px', background: 'rgba(255, 255, 255, 0.08)', animation: 'pulse 1.5s infinite' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', marginTop: '0.5rem' }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{ height: '60px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.05)', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        </div>
      ) : totalLeads === 0 ? (
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
            No leads recorded in the admissions pipeline yet.
          </p>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
            Click "+ Quick Add Lead" above to register student inquiries.
          </span>
        </div>
      ) : (
        <div>
          {/* Segmented Horizontal Progress Bar */}
          <div
            style={{
              display: 'flex',
              height: '14px',
              width: '100%',
              borderRadius: '7px',
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.05)',
              marginBottom: '1.25rem',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4)'
            }}
          >
            {distribution.map((stage) => {
              if (stage.count === 0) return null
              return (
                <div
                  key={stage.status}
                  title={`${stage.status}: ${stage.count} (${stage.percentage}%)`}
                  style={{
                    width: `${stage.percentage}%`,
                    backgroundColor: stage.color,
                    transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />
              )
            })}
          </div>

          {/* Detailed Stage Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
              gap: '0.65rem'
            }}
          >
            {distribution.map((stage) => (
              <Link
                key={stage.status}
                to={`/leads?status=${stage.status}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'background 0.2s, border-color 0.2s, transform 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'
                  e.currentTarget.style.borderColor = stage.color
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: stage.color,
                      boxShadow: `0 0 6px ${stage.color}`
                    }}
                  />
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {stage.status}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                    {stage.count}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    {stage.percentage}%
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
