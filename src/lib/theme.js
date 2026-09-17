import { useEffect, useState } from 'react'

const THEME_KEY = 'stallion-prep-theme-v1'

function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY)
  } catch {
    return null
  }
}

function systemPrefersDark() {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  } catch {
    return false
  }
}

function currentTheme() {
  const stored = getStoredTheme()
  return stored ?? (systemPrefersDark() ? 'dark' : 'light')
}

function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function useTheme() {
  const [theme, setThemeState] = useState(currentTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    if (getStoredTheme()) return // user has an explicit preference, ignore system changes
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setThemeState(media.matches ? 'dark' : 'light')
    media.addEventListener?.('change', onChange)
    return () => media.removeEventListener?.('change', onChange)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      // localStorage unavailable - preference just won't persist
    }
    setThemeState(next)
  }

  return [theme, toggleTheme]
}
