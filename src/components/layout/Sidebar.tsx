import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  BarChart3,
  Settings,
  GraduationCap
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
        <div className="user-snippet">
          <div className="user-avatar" aria-hidden="true">
            BP
          </div>
          <div className="user-info">
            <span className="user-name">Staff Member</span>
            <span className="user-role-badge">Counsellor</span>
          </div>
        </div>
      </div>
    </>
  )
}
