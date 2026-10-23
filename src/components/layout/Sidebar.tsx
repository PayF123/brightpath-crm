import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  BarChart3,
  Settings,
  GraduationCap,
  LogOut
} from 'lucide-react'

interface SidebarProps {
  onLinkClick?: () => void
}

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/leads', label: 'Leads Directory', icon: Users },
  { to: '/followups', label: 'Follow-ups', icon: CalendarClock },
  { to: '/reports', label: 'Reports & Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export const Sidebar: React.FC<SidebarProps> = ({ onLinkClick }) => {
  const { user, profile, role, signOut } = useAuth()

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Staff Member'
  const userRole = role || 'counsellor'

  // Extract initials (e.g. "Dipti Sharma" -> "DS")
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  const handleSignOut = async () => {
    if (onLinkClick) onLinkClick()
    await signOut()
  }

  return (
    <>
      <div className="sidebar-header">
        <div className="brand-badge">
          <GraduationCap size={22} strokeWidth={2.2} />
        </div>
        <div className="brand-text">
          <span className="brand-title">BrightPath</span>
          <span className="brand-subtitle">Academy CRM</span>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Main Navigation">
        <span className="nav-section-title">Operations</span>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onLinkClick}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
              end={item.to === '/'}
            >
              <Icon size={18} strokeWidth={2} />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="user-snippet">
            <div className="user-avatar" aria-hidden="true">
              {initials}
            </div>
            <div className="user-info">
              <span className="user-name" title={displayName}>
                {displayName}
              </span>
              <span className="user-role-badge">
                {userRole}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            style={{
              padding: '0.45rem',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.15s ease'
            }}
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </>
  )
}
