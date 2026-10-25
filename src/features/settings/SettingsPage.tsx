import React from 'react'
import { ProfileCard } from './ProfileCard'
import { SecurityBoundaryCard } from './SecurityBoundaryCard'
import { TeamMembersList } from './TeamMembersList'

export const SettingsPage: React.FC = () => {
  return (
    <div>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title">Account &amp; System Settings</h1>
          <p className="page-desc">
            Personal staff profile configuration, enterprise security boundaries, and team directory.
          </p>
        </div>
      </div>

      {/* Main Grid: Profile Form & Security Boundary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.75rem'
        }}
      >
        <ProfileCard />
        <SecurityBoundaryCard />
      </div>

      {/* Full-Width Institutional Team Directory */}
      <TeamMembersList />
    </div>
  )
}
