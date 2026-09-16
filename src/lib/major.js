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

function resolve(options, pickText) {
  if (!pickText) return null
  const pickCode = extractCode(pickText)
  if (pickCode) {
    const match = options.find((o) => extractCode(o.title) === pickCode)
    if (match) return match
  }
  return options.find((o) => o.title === pickText) || null
}

// For a plain (non-semester) choice course.
export function getRecommendedOption(course, picks) {
  const pickText = picks?.[course.id]
  if (!pickText || typeof pickText !== 'string') return null
  const options = [{ title: course.title, peimsCode: course.peimsCode, isPrimary: true }, ...(course.alternatives || [])]
  return resolve(options, pickText)
}

// For a semester ('Fall' | 'Spring') of a split course.
export function getRecommendedSemesterOption(course, picks, semesterLabel) {
  const semester = course.semesters?.find((s) => s.label === semesterLabel)
  if (!semester) return null
  const pickEntry = picks?.[course.id]
  const pickText = typeof pickEntry === 'object' ? pickEntry?.[semesterLabel.toLowerCase()] : null
  if (!pickText) return null
  const options = [{ title: semester.title, peimsCode: semester.peimsCode, isPrimary: true }, ...(semester.alternatives || [])]
  return resolve(options, pickText)
}
