import { LoginForm } from '@/components/login-form'

function App() {
  return (
    <main className="theme grid min-h-svh place-items-center bg-background p-6 text-foreground">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  )
}

export default App
