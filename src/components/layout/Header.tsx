import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Menu, Bell } from 'lucide-react'

interface HeaderProps {
  onMenuToggle: () => void
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const location = useLocation()

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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.3rem 0.75rem',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(37, 99, 235, 0.1)',
          border: '1px solid rgba(37, 99, 235, 0.25)',
          color: 'var(--brand-light)',
          fontSize: '0.78rem',
          fontWeight: 600
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#4ade80'
          }}></span>
          Phase 1 Active
        </div>

        <button
          type="button"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-card)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Notifications"
        >
          <Bell size={17} />
        </button>
      </div>
    </header>
  )
}
