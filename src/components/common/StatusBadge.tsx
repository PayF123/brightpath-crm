import React from 'react'
import { LeadStatus } from '../../types/database.types'

interface StatusBadgeProps {
  status: LeadStatus | string
  size?: 'sm' | 'md'
  showDot?: boolean
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = true
}) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'New':
        return {
          className: 'badge-new',
          dotColor: 'var(--status-new)',
          label: 'New Lead'
        }
      case 'Contacted':
        return {
          className: 'badge-contacted',
          dotColor: 'var(--status-contacted)',
          label: 'Contacted'
        }
      case 'Qualified':
        return {
          className: 'badge-qualified',
          dotColor: 'var(--status-qualified)',
          label: 'Qualified'
        }
      case 'Converted':
        return {
          className: 'badge-converted',
          dotColor: 'var(--status-converted)',
          label: 'Converted'
        }
      case 'Lost':
        return {
          className: 'badge-lost',
          dotColor: 'var(--status-lost)',
          label: 'Lost'
        }
      default:
        return {
          className: 'badge-secondary',
          dotColor: 'var(--text-muted)',
          label: status
        }
    }
  }

  const config = getBadgeConfig()
  const isSmall = size === 'sm'

  return (
    <span
      className={`badge ${config.className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSmall ? '0.25rem' : '0.35rem',
        padding: isSmall ? '0.15rem 0.5rem' : '0.25rem 0.65rem',
        fontSize: isSmall ? '0.72rem' : '0.78rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
        transition: 'all 0.15s ease'
      }}
    >
      {showDot && (
        <span
          style={{
            width: isSmall ? '5px' : '6px',
            height: isSmall ? '5px' : '6px',
            borderRadius: '50%',
            backgroundColor: config.dotColor,
            flexShrink: 0
          }}
        />
      )}
      <span>{config.label}</span>
    </span>
  )
}
