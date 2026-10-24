import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/common/ProtectedRoute'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardShell } from './features/dashboard/DashboardShell'
import { LeadsListPage } from './features/leads/LeadsListPage'
import { LeadDetailPage } from './features/leads/LeadDetailPage'
import { FollowUpsPage } from './features/followups/FollowUpsPage'
import { ReportsShell } from './features/reports/ReportsShell'
import { SettingsShell } from './features/settings/SettingsShell'
import { LoginPage } from './features/auth/LoginPage'
import { NotFoundPage } from './features/notfound/NotFoundPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Portal */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected CRM Operations Routes (Requires Staff Login) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<DashboardShell />} />
              <Route path="leads" element={<LeadsListPage />} />
              <Route path="leads/:id" element={<LeadDetailPage />} />
              <Route path="followups" element={<FollowUpsPage />} />
              <Route path="reports" element={<ReportsShell />} />
              <Route path="settings" element={<SettingsShell />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
