import React from 'react'
import {
  Globe,
  MapPin,
  UserCheck,
  Share2,
  PhoneCall,
  HelpCircle,
  TrendingUp,
  Percent
} from 'lucide-react'
import { ChannelPerformance } from '../../services/reportService'
import { LeadSource } from '../../types/database.types'

export interface SourcePerformanceTableProps {
  channels: ChannelPerformance[]
  totalInquiries: number
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

export const SourcePerformanceTable: React.FC<SourcePerformanceTableProps> = ({
  channels,
  totalInquiries,
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
              background: 'rgba(37, 99, 235, 0.15)',
              color: 'var(--brand-light)'
            }}
          >
            <TrendingUp size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#fff' }}>
              Acquisition Channel Performance
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Inquiry volume and enrollment conversion efficiency by channel
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
          <Percent size={12} />
          <span>{channels.filter((c) => c.totalInquiries > 0).length} Active Channels</span>
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem 0' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ height: '42px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.05)', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : totalInquiries === 0 ? (
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
            No acquisition data recorded for the selected date window.
          </p>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
            Switch to "All Time" to inspect historical marketing attribution.
          </span>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>SOURCE CHANNEL</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'center' }}>INQUIRIES</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'center' }}>CONVERTED</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'center' }}>CONV. RATE</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>PIPELINE SHARE</th>
              </tr>
            </thead>
            <tbody>
              {channels.map((ch) => {
                const Icon = SOURCE_ICONS[ch.source] || HelpCircle
                const isConvertedPositive = ch.conversionRate > 0

                return (
                  <tr
                    key={ch.source}
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
                    {/* Source Name & Icon */}
                    <td style={{ padding: '0.8rem 0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '26px',
                            height: '26px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          <Icon size={14} />
                        </div>
                        <span style={{ fontWeight: 600, color: '#fff' }}>{ch.source}</span>
                      </div>
                    </td>

                    {/* Total Inquiries */}
                    <td style={{ padding: '0.8rem 0.5rem', textAlign: 'center', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {ch.totalInquiries}
                    </td>

                    {/* Converted */}
                    <td style={{ padding: '0.8rem 0.5rem', textAlign: 'center' }}>
                      <span
                        style={{
                          fontWeight: 700,
                          color: ch.convertedCount > 0 ? '#34d399' : 'var(--text-muted)'
                        }}
                      >
                        {ch.convertedCount}
                      </span>
                    </td>

                    {/* Conversion Rate */}
                    <td style={{ padding: '0.8rem 0.5rem', textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '9999px',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          background: isConvertedPositive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                          color: isConvertedPositive ? '#34d399' : 'var(--text-muted)',
                          border: `1px solid ${isConvertedPositive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.07)'}`
                        }}
                      >
                        {ch.conversionRate}%
                      </span>
                    </td>

                    {/* Share Bar */}
                    <td style={{ padding: '0.8rem 0.5rem', minWidth: '130px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div
                          style={{
                            flex: 1,
                            height: '6px',
                            borderRadius: '3px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            overflow: 'hidden'
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${ch.sharePercentage}%`,
                              borderRadius: '3px',
                              background: ch.sharePercentage > 0
                                ? 'linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)'
                                : 'transparent',
                              transition: 'width 0.4s ease'
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', minWidth: '38px', textAlign: 'right' }}>
                          {ch.sharePercentage}%
                        </span>
                      </div>
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
