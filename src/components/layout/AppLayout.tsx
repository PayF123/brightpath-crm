import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { EnvConfigBanner } from '../common/EnvConfigBanner'

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sentinelKey, setSentinelKey] = useState(0)

  // Allows clicking the Cloud Status Pill in the header to re-open/inspect the Sentinel Banner
  const handleToggleSentinel = () => {
    setSentinelKey((prev) => prev + 1)
  }

  return (
    <div className="app-container">
      {/* Desktop Persistent Sidebar */}
      <aside className="desktop-sidebar" aria-label="Desktop Navigation">
        <Sidebar />
      </aside>

      {/* Mobile Slide-Over Drawer */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Viewport */}
      <div className="main-wrapper">
        <Header
          onMenuToggle={() => setMobileMenuOpen(true)}
          onToggleSentinel={handleToggleSentinel}
        />
        <main className="page-body">
          {/* Animated Supabase Cloud Sentinel Banner */}
          <EnvConfigBanner key={sentinelKey} />

          {/* Child View Content */}
          <Outlet />
        </main>
      </div>
    </div>
  )
}
