import React, { useState, useEffect } from 'react'
import { Search, X, RotateCcw, Filter, BookOpen, Compass, UserCheck } from 'lucide-react'
import { Profile } from '../../types/database.types'

export interface FilterState {
  search: string
  status: string
  course: string
  source: string
  assignedTo: string
}

interface LeadFiltersProps {
  filters: FilterState
  onFilterChange: (newFilters: FilterState) => void
  statusCounts: Record<string, number>
  staffProfiles: Profile[]
  courseOptions: string[]
  sourceOptions: string[]
}

const STATUS_KEYS = ['All', 'New', 'Contacted', 'Qualified', 'Converted', 'Lost']

export const LeadFilters: React.FC<LeadFiltersProps> = ({
  filters,
  onFilterChange,
  statusCounts,
  staffProfiles,
  courseOptions,
  sourceOptions
}) => {
  const [localSearch, setLocalSearch] = useState(filters.search)

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== filters.search) {
        onFilterChange({ ...filters, search: localSearch })
      }
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [localSearch, filters, onFilterChange])

  // Sync external filter changes (e.g. on reset)
  useEffect(() => {
    setLocalSearch(filters.search)
  }, [filters.search])

  const isFiltered = Boolean(
    filters.search ||
    filters.status !== 'All' ||
    filters.course !== 'All' ||
    filters.source !== 'All' ||
    filters.assignedTo !== 'All'
  )

  const handleReset = () => {
    setLocalSearch('')
    onFilterChange({
      search: '',
      status: 'All',
      course: 'All',
      source: 'All',
      assignedTo: 'All'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'var(--status-new)'
      case 'Contacted': return 'var(--status-contacted)'
      case 'Qualified': return 'var(--status-qualified)'
      case 'Converted': return 'var(--status-converted)'
      case 'Lost': return 'var(--status-lost)'
      default: return 'var(--brand-primary)'
    }
  }

  return (
    <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Top Row: Search Input & Action Reset */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 320px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search across student name, phone, or email..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 2.2rem 0.65rem 2.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-canvas)',
              border: '1px solid var(--border-card)',
              color: '#fff',
              fontSize: '0.9rem',
              transition: 'border-color 0.15s ease'
            }}
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => setLocalSearch('')}
              aria-label="Clear search"
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Dropdown Selectors */}
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Course Selector */}
          <div style={{ position: 'relative' }}>
            <select
              value={filters.course}
              onChange={(e) => onFilterChange({ ...filters, course: e.target.value })}
              style={{
                padding: '0.65rem 1rem 0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-canvas)',
                border: `1px solid ${filters.course !== 'All' ? 'var(--brand-primary)' : 'var(--border-card)'}`,
                color: filters.course !== 'All' ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.86rem',
                cursor: 'pointer'
              }}
            >
              <option value="All">All Courses</option>
              {courseOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Source Selector */}
          <div style={{ position: 'relative' }}>
            <select
              value={filters.source}
              onChange={(e) => onFilterChange({ ...filters, source: e.target.value })}
              style={{
                padding: '0.65rem 1rem 0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-canvas)',
                border: `1px solid ${filters.source !== 'All' ? 'var(--brand-primary)' : 'var(--border-card)'}`,
                color: filters.source !== 'All' ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.86rem',
                cursor: 'pointer'
              }}
            >
              <option value="All">All Sources</option>
              {sourceOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Assignee / Counsellor Selector */}
          {staffProfiles.length > 0 && (
            <div style={{ position: 'relative' }}>
              <select
                value={filters.assignedTo}
                onChange={(e) => onFilterChange({ ...filters, assignedTo: e.target.value })}
                style={{
                  padding: '0.65rem 1rem 0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-canvas)',
                  border: `1px solid ${filters.assignedTo !== 'All' ? 'var(--brand-primary)' : 'var(--border-card)'}`,
                  color: filters.assignedTo !== 'All' ? '#fff' : 'var(--text-secondary)',
                  fontSize: '0.86rem',
                  cursor: 'pointer'
                }}
              >
                <option value="All">All Counsellors</option>
                {staffProfiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.full_name} ({p.role})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Reset Filters Button */}
          {isFiltered && (
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-secondary"
              style={{
                padding: '0.65rem 0.9rem',
                fontSize: '0.85rem',
                gap: '0.4rem',
                color: '#f87171'
              }}
              title="Reset all search filters"
            >
              <RotateCcw size={14} />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Status Quick Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.25rem',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '0.85rem'
      }}>
        {STATUS_KEYS.map((statusKey) => {
          const isActive = filters.status === statusKey
          const count = statusCounts[statusKey] ?? 0
          const statusColor = getStatusColor(statusKey)

          return (
            <button
              key={statusKey}
              type="button"
              onClick={() => onFilterChange({ ...filters, status: statusKey })}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: isActive ? 'rgba(37, 99, 235, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${isActive ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                color: isActive ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {statusKey !== 'All' && (
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: statusColor
                  }}
                />
              )}
              <span>{statusKey}</span>
              <span
                style={{
                  padding: '0.1rem 0.45rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  background: isActive ? 'var(--brand-primary)' : 'rgba(255, 255, 255, 0.06)',
                  color: isActive ? '#fff' : 'var(--text-muted)'
                }}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
