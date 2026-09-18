const KEY = 'stallion-prep-ai-prefill-v1'

export function setPendingQuestion(text) {
  try {
    sessionStorage.setItem(KEY, text)
  } catch {
    // sessionStorage unavailable - prefill just won't carry over
  }
}

// Reads without clearing, so the draft survives navigating away (e.g. to Settings
// to add a key) and back before the user actually asks it.
export function getPendingQuestion() {
  try {
    return sessionStorage.getItem(KEY) || ''
  } catch {
    return ''
  }
}

export function clearPendingQuestion() {
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    // sessionStorage unavailable - nothing to clear
  }
}
