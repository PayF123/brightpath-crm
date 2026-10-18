import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { MobileNav } from './MobileNav'

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
        <Header onMenuToggle={() => setMobileMenuOpen(true)} />
        <main className="page-body">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
