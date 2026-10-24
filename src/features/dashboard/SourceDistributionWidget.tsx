import React from 'react'
import { Link } from 'react-router-dom'
import { Compass, Globe, UserCheck, Share2, PhoneCall, HelpCircle, MapPin } from 'lucide-react'
import { SourceDistributionItem } from '../../services/metricService'
import { LeadSource } from '../../types/database.types'

export interface SourceDistributionWidgetProps {
  distribution: SourceDistributionItem[]
  totalLeads: number
  isLoading?: boolean
}

const SOURCE_ICONS: Record<LeadSource, React.FC<{ size?: number; color?: string }>> = {
  Website: Globe,
  'Walk-in': MapPin,
  Referral: UserCheck,
  'Social Media': Share2,
  'Phone Inquiry': PhoneCall,
  Other: HelpCircle
}

export const SourceDistributionWidget: React.FC<SourceDistributionWidgetProps> = ({
  distribution,
  totalLeads,
  isLoading = false
}) => {
  // Sort sources by count descending to show top channels first
  const sortedDistribution = [...distribution].sort((a, b) => b.count - a.count)

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
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399'
            }}
          >
            <Compass size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#fff' }}>
              Lead Acquisition Channels
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Top originating sources for coaching enquiries
            </span>
          </div>
        </div>

        <Link
          to="/leads"
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--brand-light)',
            textDecoration: 'none'
          }}
        >
          View Breakdown
        </Link>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', padding: '1rem 0' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ height: '32px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.05)', animation: 'pulse 1.5s infinite' }} />
          ))}
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
            No acquisition data recorded yet.
          </p>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
            Sources are tracked automatically when new student leads are registered.
          </span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {sortedDistribution.map((item) => {
            const Icon = SOURCE_ICONS[item.source] || HelpCircle
            return (
              <div key={item.source} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon size={14} color="var(--text-muted)" />
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.source}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                      {item.count}
                    </span>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        minWidth: '42px',
                        textAlign: 'right'
                      }}
                    >
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                {/* Bar */}
                <div
                  style={{
                    height: '6px',
                    width: '100%',
                    borderRadius: '3px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${item.percentage}%`,
                      borderRadius: '3px',
                      background: item.percentage > 0 ? 'linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)' : 'transparent',
                      transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
