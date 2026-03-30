import { LoginForm } from '@/components/login-form'
import { ThemeToggle } from '@/components/theme-toggle'

function App() {
  return (
    <div className="relative min-h-svh">
      <div className="absolute right-4 top-4 z-10 md:right-6 md:top-6">
        <ThemeToggle />
      </div>
      <main className="theme grid min-h-svh place-items-center bg-background p-6 text-foreground">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </main>
    </div>
  )
}

export default App
