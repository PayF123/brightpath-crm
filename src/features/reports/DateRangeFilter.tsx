import React from 'react'
import { Calendar } from 'lucide-react'
import { DateRangePreset } from '../../services/reportService'

export interface DateRangeFilterProps {
  currentPreset: DateRangePreset
  onChange: (preset: DateRangePreset) => void
  disabled?: boolean
}

interface FilterOption {
  value: DateRangePreset
  label: string
}

const OPTIONS: FilterOption[] = [
  { value: 'all', label: 'All Time' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '7d', label: 'Last 7 Days' },
  { value: 'today', label: 'Today' }
]

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  currentPreset,
  onChange,
  disabled = false
}) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.25rem',
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 'var(--radius-md)',
        gap: '0.25rem'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.35rem 0.65rem',
          color: 'var(--text-muted)',
          fontSize: '0.78rem',
          fontWeight: 600,
          borderRight: '1px solid rgba(255, 255, 255, 0.06)'
        }}
      >
        <Calendar size={14} />
        <span>Date Window:</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
        {OPTIONS.map((opt) => {
          const isActive = currentPreset === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(opt.value)}
              style={{
                padding: '0.35rem 0.8rem',
                fontSize: '0.78rem',
                fontWeight: isActive ? 700 : 500,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: isActive
                  ? 'linear-gradient(135deg, var(--brand-primary) 0%, #1d4ed8 100%)'
                  : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: isActive ? '0 2px 8px var(--brand-glow)' : 'none',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={(e) => {
                if (!isActive && !disabled) {
                  e.currentTarget.style.color = '#fff'
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive && !disabled) {
                  e.currentTarget.style.color = 'var(--text-secondary)'
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
