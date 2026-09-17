const STORAGE_KEY = 'stallion-prep-ai-quota-v1'
const DAILY_LIMIT = 3

function todayKey() {
  return new Date().toISOString().slice(0, 10) // YYYY-MM-DD, local-ish (UTC date)
}

function read() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function write(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // localStorage unavailable - quota just won't persist (fails safe: always allowed)
  }
}

export function getDailyLimit() {
  return DAILY_LIMIT
}

export function getRemainingToday() {
  const data = read()
  const used = data[todayKey()] || 0
  return Math.max(0, DAILY_LIMIT - used)
}

export function consumeOneQuestion() {
  const data = read()
  const key = todayKey()
  data[key] = (data[key] || 0) + 1
  write(data)
  return getRemainingToday()
}
