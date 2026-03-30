import * as React from 'react'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'nhr-theme'

function readInitialDark(): boolean {
  if (typeof window === 'undefined') return false
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark') return true
  if (stored === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = React.useState(readInitialDark)

  React.useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Switch
        id="theme-toggle"
        checked={isDark}
        onCheckedChange={setIsDark}
      />
      <Label htmlFor="theme-toggle" className="cursor-pointer text-muted-foreground">
        Toggle mode
      </Label>
    </div>
  )
}
