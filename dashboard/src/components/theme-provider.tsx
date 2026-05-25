import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'

const THEME_STORAGE_KEY = 'vibelink_dashboard_theme'

type ThemeContextValue = {
  theme: ThemeMode
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'system'
}

function readStoredTheme(): ThemeMode | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return isThemeMode(stored) ? stored : null
  } catch {
    return null
  }
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveTheme(theme: ThemeMode): 'light' | 'dark' {
  return theme === 'system' ? getSystemTheme() : theme
}

function applyTheme(theme: ThemeMode) {
  if (typeof document === 'undefined') return

  const resolvedTheme = resolveTheme(theme)
  const root = document.documentElement

  root.classList.toggle('dark', resolvedTheme === 'dark')
  root.style.colorScheme = resolvedTheme
  root.dataset.theme = resolvedTheme
}

export function initializeTheme() {
  const storedTheme = readStoredTheme() ?? 'system'
  applyTheme(storedTheme)
  return storedTheme
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => initializeTheme())
  const resolvedTheme = resolveTheme(theme)

  const setTheme = useCallback((nextTheme: ThemeMode) => {
    setThemeState(nextTheme)
    applyTheme(nextTheme)

    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    } catch {
      // Storage can be unavailable in private browsing or restrictive browser modes.
    }
  }, [])

  useLayoutEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return

      const nextTheme = isThemeMode(event.newValue) ? event.newValue : 'system'
      setThemeState(nextTheme)
      applyTheme(nextTheme)
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  useEffect(() => {
    if (theme !== 'system' || typeof window.matchMedia !== 'function') return

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => applyTheme('system')

    handleChange()

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', handleChange)
      return () => media.removeEventListener('change', handleChange)
    }

    media.addListener(handleChange)
    return () => media.removeListener(handleChange)
  }, [theme])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [resolvedTheme, setTheme, theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider.')
  }

  return context
}