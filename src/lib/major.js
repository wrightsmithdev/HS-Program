const STORAGE_KEY = 'stallion-prep-major-v1'

export function getSelectedMajorId() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function setSelectedMajorId(id) {
  try {
    if (id) localStorage.setItem(STORAGE_KEY, id)
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // localStorage unavailable - selection just won't persist
  }
}

// Course-code tokens (e.g. "HIST 1301", "DRAM 1310") are embedded consistently
// in both majors.json picks and course titles/alternatives, so matching on the
// code is more robust than exact-string matching against differently-phrased titles.
function extractCode(text) {
  const match = text?.match(/[A-Z]{2,5}\s?\d{3,4}/)
  return match ? match[0].replace(/\s+/, ' ').toUpperCase() : null
}

export function getRecommendedOption(course, picks) {
  const pickText = picks?.[course.id]
  if (!pickText) return null

  const options = [{ title: course.title, peimsCode: course.peimsCode, isPrimary: true }, ...(course.alternatives || [])]
  const pickCode = extractCode(pickText)
  if (pickCode) {
    const match = options.find((o) => extractCode(o.title) === pickCode)
    if (match) return match
  }
  return options.find((o) => o.title === pickText) || null
}
