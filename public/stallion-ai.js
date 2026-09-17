// Stallion Prep — Ask AI add-on.
//
// This file is intentionally separate from the main app bundle. The main
// app looks for it (via a plain <script> tag, which still works when the
// app is opened straight off a flash drive with no server) and only turns
// on the "Ask AI" feature if this file is present next to index.html.
// Delete this file to ship the app with no AI feature at all; copy it back
// in to re-enable it — nothing else about the app needs to change either way.
;(function () {
  const KEY_STORAGE = 'stallion-prep-anthropic-key-v1'
  const QUOTA_STORAGE = 'stallion-prep-ai-quota-v1'
  const DAILY_LIMIT = 3
  const MODEL = 'claude-haiku-4-5-20251001'
  const API_URL = 'https://api.anthropic.com/v1/messages'

  function getApiKey() {
    try {
      return localStorage.getItem(KEY_STORAGE) || ''
    } catch {
      return ''
    }
  }

  function setApiKey(key) {
    try {
      if (key) localStorage.setItem(KEY_STORAGE, key)
      else localStorage.removeItem(KEY_STORAGE)
    } catch {
      // localStorage unavailable - key just won't persist
    }
  }

  function hasApiKey() {
    return Boolean(getApiKey())
  }

  function todayKey() {
    return new Date().toISOString().slice(0, 10)
  }

  function readQuota() {
    try {
      return JSON.parse(localStorage.getItem(QUOTA_STORAGE) || '{}')
    } catch {
      return {}
    }
  }

  function writeQuota(data) {
    try {
      localStorage.setItem(QUOTA_STORAGE, JSON.stringify(data))
    } catch {
      // localStorage unavailable - quota just won't persist (fails safe: always allowed)
    }
  }

  function getDailyLimit() {
    return DAILY_LIMIT
  }

  function getRemainingToday() {
    const data = readQuota()
    const used = data[todayKey()] || 0
    return Math.max(0, DAILY_LIMIT - used)
  }

  function consumeOneQuestion() {
    const data = readQuota()
    const key = todayKey()
    data[key] = (data[key] || 0) + 1
    writeQuota(data)
    return getRemainingToday()
  }

  function AIError(kind, message) {
    const err = new Error(message)
    err.kind = kind // 'no_key' | 'network' | 'api'
    err.name = 'AIError'
    return err
  }

  async function callClaude(system, userPrompt, maxTokens) {
    const apiKey = getApiKey()
    if (!apiKey) throw AIError('no_key', 'No API key set.')

    let res
    try {
      res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: maxTokens,
          system,
          messages: [{ role: 'user', content: userPrompt }],
        }),
      })
    } catch {
      throw AIError('network', "Couldn't reach the AI service. Check your internet connection.")
    }

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      let detail = text
      try {
        detail = JSON.parse(text)?.error?.message || text
      } catch {
        // keep raw text
      }
      throw AIError('api', `AI request failed (${res.status}): ${String(detail).slice(0, 200)}`)
    }

    const data = await res.json()
    return data.content?.[0]?.text ?? ''
  }

  async function askAI(question) {
    const system =
      "You are a friendly, knowledgeable study helper for a high school freshman-senior in a Texas Early College High School program (taking honors classes and TCC dual-credit college courses). Answer the student's question clearly and helpfully, at a level appropriate for their grade level. You can help with any subject - English, math, science, social studies, Spanish, college/career questions, or general study advice. Keep answers focused and not overly long (a few short paragraphs at most, use bullet points for steps/lists). If asked to just do their homework for them (e.g. write their essay, or give test answers with no explanation), instead help them understand and work through it themselves."
    return callClaude(system, question, 1024)
  }

  window.StallionAI = {
    version: 1,
    hasApiKey,
    getApiKey,
    setApiKey,
    getDailyLimit,
    getRemainingToday,
    consumeOneQuestion,
    askAI,
    AIError,
  }

  window.dispatchEvent(new Event('stallion-ai-ready'))
})()
