import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Menu, LogOut, Shield } from 'lucide-react'
import { CloudStatusPill } from '../common/CloudStatusPill'
import { useAuth } from '../../hooks/useAuth'

interface HeaderProps {
  onMenuToggle: () => void
  onToggleSentinel?: () => void
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, onToggleSentinel }) => {
  const location = useLocation()
  const { user, profile, role, signOut } = useAuth()

  const getBreadcrumb = () => {
    const path = location.pathname
    if (path === '/') return 'Dashboard'
    if (path.startsWith('/leads/')) return 'Lead Details'
    if (path === '/leads') return 'Leads Directory'
    if (path === '/followups') return 'Follow-ups'
    if (path === '/reports') return 'Reports'
    if (path === '/settings') return 'Settings'
    return 'BrightPath CRM'
  }

  const userRole = role || 'counsellor'
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Staff'

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onMenuToggle}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="breadcrumbs">
          <Link to="/" className="breadcrumbs-root">CRM</Link>
          <span>/</span>
          <span className="breadcrumbs-current">{getBreadcrumb()}</span>
        </div>
      </div>

      <div className="header-right">
        {/* Dynamic Cloud Connection Status Pill */}
        <CloudStatusPill onInspect={onToggleSentinel} />

        {/* User Role Badge */}
        {user && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(37, 99, 235, 0.1)',
            border: '1px solid rgba(37, 99, 235, 0.25)',
            color: 'var(--brand-light)',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'capitalize'
          }}>
            <Shield size={12} />
            <span>{userRole}</span>
          </div>
        )}

        {/* Sign Out Quick Action */}
        {user && (
          <button
            type="button"
            onClick={() => signOut()}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title={`Signed in as ${displayName} (${user.email}). Click to sign out.`}
            aria-label="Sign Out"
          >
            <LogOut size={14} />
            <span style={{ display: 'none' }}>Sign Out</span>
          </button>
        )}
      </div>
    </header>
  )
}
