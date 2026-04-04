import { Route, Routes, useNavigate } from 'react-router-dom'

import { LoginForm } from '@/components/login-form'
import { ThemeToggle } from '@/components/theme-toggle'
import { CoderOverviewPage } from '@/pages/coder-overview-page'
import { DashboardPage } from '@/pages/dashboard-page'

function LoginPage() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-svh">
      <div className="absolute right-4 top-4 z-10 md:right-6 md:top-6">
        <ThemeToggle />
      </div>
      <main className="theme grid min-h-svh place-items-center bg-background p-6 text-foreground">
        <div className="w-full max-w-sm">
          <LoginForm onSuccess={() => navigate('/dashboard')} />
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/coder-overview" element={<CoderOverviewPage />} />
    </Routes>
  )
}

export default App
