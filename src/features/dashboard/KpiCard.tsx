import React from 'react'
import { Link } from 'react-router-dom'
import { LucideIcon } from 'lucide-react'

export interface KpiCardProps {
  title: string
  value: string | number
  subtext: string
  icon: LucideIcon
  iconColor: string
  iconBg: string
  badgeText?: string
  badgeVariant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  to?: string
  isLoading?: boolean
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  iconColor,
  iconBg,
  badgeText,
  badgeVariant = 'neutral',
  to,
  isLoading = false
}) => {
  const badgeStyles: Record<string, { bg: string; color: string; border: string }> = {
    primary: {
      bg: 'rgba(37, 99, 235, 0.15)',
      color: 'var(--brand-light)',
      border: 'rgba(37, 99, 235, 0.3)'
    },
    success: {
      bg: 'rgba(16, 185, 129, 0.15)',
      color: '#34d399',
      border: 'rgba(16, 185, 129, 0.3)'
    },
    warning: {
      bg: 'rgba(245, 158, 11, 0.15)',
      color: '#fbbf24',
      border: 'rgba(245, 158, 11, 0.3)'
    },
    danger: {
      bg: 'rgba(244, 63, 94, 0.15)',
      color: '#fb7185',
      border: 'rgba(244, 63, 94, 0.3)'
    },
    info: {
      bg: 'rgba(6, 182, 212, 0.15)',
      color: '#22d3ee',
      border: 'rgba(6, 182, 212, 0.3)'
    },
    neutral: {
      bg: 'rgba(255, 255, 255, 0.05)',
      color: 'var(--text-muted)',
      border: 'rgba(255, 255, 255, 0.08)'
    }
  }

  const currentBadge = badgeStyles[badgeVariant] || badgeStyles.neutral

  const cardContent = (
    <div
      className="card"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.25rem',
        background: 'linear-gradient(145deg, rgba(21, 29, 48, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.35)',
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, box-shadow 0.2s ease',
        cursor: to ? 'pointer' : 'default',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        if (to) {
          e.currentTarget.style.transform = 'translateY(-3px)'
          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)'
          e.currentTarget.style.boxShadow = '0 12px 30px -4px rgba(37, 99, 235, 0.2)'
        }
      }}
      onMouseLeave={(e) => {
        if (to) {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)'
          e.currentTarget.style.boxShadow = '0 4px 20px -2px rgba(0, 0, 0, 0.35)'
        }
      }}
    >
      {/* Background ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: iconColor,
          opacity: 0.05,
          filter: 'blur(30px)',
          pointerEvents: 'none'
        }}
      />

      {/* Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <span
          style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)'
          }}
        >
          {title}
        </span>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            background: iconBg,
            color: iconColor,
            boxShadow: `0 2px 10px ${iconBg}`
          }}
        >
          <Icon size={20} />
        </div>
      </div>

      {/* Big Value Display */}
      {isLoading ? (
        <div style={{ margin: '0.4rem 0 0.8rem' }}>
          <div
            style={{
              width: '80px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.08)',
              animation: 'pulse 1.5s ease-in-out infinite'
            }}
          />
        </div>
      ) : (
        <div
          style={{
            fontSize: '2.1rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            lineHeight: 1.1,
            margin: '0.25rem 0 0.65rem'
          }}
        >
          {value}
        </div>
      )}

      {/* Footer / Subtext & Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          {subtext}
        </span>

        {badgeText && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.2rem 0.55rem',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 600,
              background: currentBadge.bg,
              color: currentBadge.color,
              border: `1px solid ${currentBadge.border}`
            }}
          >
            {badgeText}
          </span>
        )}
      </div>
    </div>
  )

  if (to) {
    return (
      <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }}>
        {cardContent}
      </Link>
    )
  }

  return cardContent
}
