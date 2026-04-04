import * as React from "react"
import { MoonIcon, SunIcon } from "lucide-react"

import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "nhr-theme"

function readInitialDark(): boolean {
  if (typeof window === "undefined") return false
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === "dark") return true
  if (stored === "light") return false
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

export function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = React.useState(readInitialDark)

  React.useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
    localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light")
  }, [isDark])

  return (
    <Switch
      id="theme-toggle"
      checked={isDark}
      onCheckedChange={setIsDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(className)}
      thumbChildren={
        isDark ? (
          <MoonIcon
            size={10}
            className="text-primary"
            strokeWidth={2.5}
            aria-hidden
          />
        ) : (
          <SunIcon
            size={10}
            className="text-white"
            strokeWidth={2.5}
            aria-hidden
          />
        )
      }
    />
  )
}
