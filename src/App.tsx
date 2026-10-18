import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardShell } from './features/dashboard/DashboardShell'
import { LeadsShell } from './features/leads/LeadsShell'
import { LeadDetailShell } from './features/leads/LeadDetailShell'
import { FollowupsShell } from './features/followups/FollowupsShell'
import { ReportsShell } from './features/reports/ReportsShell'
import { SettingsShell } from './features/settings/SettingsShell'
import { LoginShell } from './features/auth/LoginShell'
import { NotFoundPage } from './features/notfound/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Unauthenticated Login Portal */}
        <Route path="/login" element={<LoginShell />} />

        {/* Master Operations Layout Shell */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardShell />} />
          <Route path="leads" element={<LeadsShell />} />
          <Route path="leads/:id" element={<LeadDetailShell />} />
          <Route path="followups" element={<FollowupsShell />} />
          <Route path="reports" element={<ReportsShell />} />
          <Route path="settings" element={<SettingsShell />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
