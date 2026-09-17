const KEY_STORAGE = 'stallion-prep-anthropic-key-v1'

export function getApiKey() {
  try {
    return localStorage.getItem(KEY_STORAGE) || ''
  } catch {
    return ''
  }
}

export function setApiKey(key) {
  try {
    if (key) localStorage.setItem(KEY_STORAGE, key)
    else localStorage.removeItem(KEY_STORAGE)
  } catch {
    // localStorage unavailable - key just won't persist
  }
}

export function hasApiKey() {
  return Boolean(getApiKey())
}
