import React from 'react'
import { AlertCircle, Clock, CheckCircle2, Calendar, UserCheck } from 'lucide-react'
import { FollowUpCounts } from '../../services/followupService'
import { Profile } from '../../types/database.types'

export type FollowUpTab = 'all' | 'overdue' | 'today' | 'upcoming' | 'completed'

interface FollowUpFilterTabsProps {
  activeTab: FollowUpTab
  onTabChange: (tab: FollowUpTab) => void
  counts: FollowUpCounts
  staffProfiles: Profile[]
  assignedTo: string
  onAssigneeChange: (assignee: string) => void
}

export const FollowUpFilterTabs: React.FC<FollowUpFilterTabsProps> = ({
  activeTab,
  onTabChange,
  counts,
  staffProfiles,
  assignedTo,
  onAssigneeChange
}) => {
  const tabs: { key: FollowUpTab; label: string; count: number; isOverdueTab?: boolean }[] = [
    { key: 'all', label: 'All Tasks', count: counts.all },
    { key: 'overdue', label: 'Overdue', count: counts.overdue, isOverdueTab: true },
    { key: 'today', label: 'Due Today', count: counts.today },
    { key: 'upcoming', label: 'Upcoming', count: counts.upcoming },
    { key: 'completed', label: 'Completed', count: counts.completed }
  ]

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem',
      marginBottom: '1.5rem',
      borderBottom: '1px solid var(--border-subtle)',
      paddingBottom: '0.85rem'
    }}>
      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.2rem'
      }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key
          const isDanger = tab.isOverdueTab && tab.count > 0

          let bg = 'rgba(255, 255, 255, 0.03)'
          let border = '1px solid var(--border-subtle)'
          let text = 'var(--text-secondary)'

          if (isActive) {
            bg = isDanger ? 'rgba(239, 68, 68, 0.2)' : 'var(--brand-primary)'
            border = `1px solid ${isDanger ? 'var(--status-overdue)' : 'var(--brand-primary)'}`
            text = '#fff'
          } else if (isDanger) {
            border = '1px solid rgba(239, 68, 68, 0.3)'
            text = '#f87171'
          }

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.84rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: bg,
                border,
                color: text,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.isOverdueTab && tab.count > 0 && (
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              )}
              <span>{tab.label}</span>
              <span
                style={{
                  padding: '0.1rem 0.45rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  background: isActive ? 'rgba(255,255,255,0.2)' : isDanger ? 'rgba(239,68,68,0.2)' : 'rgba(255, 255, 255, 0.06)',
                  color: isActive ? '#fff' : isDanger ? '#f87171' : 'var(--text-muted)'
                }}
              >
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Counsellor Filter Dropdown */}
      {staffProfiles.length > 0 && (
        <div style={{ position: 'relative' }}>
          <select
            value={assignedTo}
            onChange={(e) => onAssigneeChange(e.target.value)}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-canvas)',
              border: `1px solid ${assignedTo !== 'All' ? 'var(--brand-primary)' : 'var(--border-card)'}`,
              color: assignedTo !== 'All' ? '#fff' : 'var(--text-secondary)',
              fontSize: '0.84rem',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Counsellors</option>
            {staffProfiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.full_name} ({p.role.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
