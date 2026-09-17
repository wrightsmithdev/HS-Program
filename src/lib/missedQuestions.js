const STORAGE_KEY = 'stallion-prep-missed-v1'

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function writeAll(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // localStorage unavailable - tracking just won't persist
  }
}

// A question is identified by lessonId + its index within that lesson's
// practiceQuestions array, so the same question attempted from a lesson page
// or a test is tracked as the same item.
function keyFor(lessonId, questionIndex) {
  return `${lessonId}::${questionIndex}`
}

export function recordAttempt({
  courseId,
  courseTitle,
  unitTitle,
  lessonId,
  lessonTitle,
  questionIndex,
  question,
  choices,
  correctIndex,
  selectedIndex,
  explanation,
}) {
  const all = readAll()
  const key = keyFor(lessonId, questionIndex)
  if (selectedIndex === correctIndex) {
    delete all[key]
  } else {
    all[key] = {
      courseId,
      courseTitle,
      unitTitle,
      lessonId,
      lessonTitle,
      question,
      choices,
      correctIndex,
      selectedIndex,
      explanation,
      missedAt: Date.now(),
    }
  }
  writeAll(all)
}

export function getMissedItems() {
  return Object.values(readAll()).sort((a, b) => b.missedAt - a.missedAt)
}

export function getMissedCount() {
  return Object.keys(readAll()).length
}

export function getMissedCountForLesson(lessonId) {
  return Object.values(readAll()).filter((m) => m.lessonId === lessonId).length
}

export function clearMissedItem(lessonId, questionIndex) {
  const all = readAll()
  delete all[keyFor(lessonId, questionIndex)]
  writeAll(all)
}
