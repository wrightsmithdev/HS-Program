import { useEffect, useState } from 'react'

// The AI feature ships as a separate file (public/stallion-ai.js -> dist/stallion-ai.js)
// that isn't part of the main app bundle. This module tries to load it once via a
// plain <script> tag (works even when the app is opened straight off a flash drive)
// and tracks whether it was actually found, so the rest of the app can hide every
// AI-related UI element when the file isn't there.

let status = 'checking' // 'checking' | 'available' | 'missing'
const listeners = new Set()

function setStatus(next) {
  status = next
  for (const listener of listeners) listener(status)
}

function start() {
  if (status !== 'checking' || typeof document === 'undefined') return
  if (window.StallionAI) {
    setStatus('available')
    return
  }
  const script = document.createElement('script')
  script.src = './stallion-ai.js'
  script.onload = () => setStatus(window.StallionAI ? 'available' : 'missing')
  script.onerror = () => setStatus('missing')
  document.head.appendChild(script)
}

start()

export function useAiAddon() {
  const [state, setState] = useState(status)
  useEffect(() => {
    listeners.add(setState)
    return () => listeners.delete(setState)
  }, [])
  return state // 'checking' | 'available' | 'missing'
}

export function getAiApi() {
  return window.StallionAI || null
}
