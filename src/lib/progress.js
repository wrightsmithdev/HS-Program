const STORAGE_KEY = 'stallion-prep-progress-v1'

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { completedLessons: {} }
  } catch {
    return { completedLessons: {} }
  }
}

function writeStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // localStorage unavailable (private browsing, etc.) - progress just won't persist
  }
}

export function isLessonComplete(lessonId) {
  const store = readStore()
  return Boolean(store.completedLessons[lessonId])
}

export function setLessonComplete(lessonId, complete) {
  const store = readStore()
  if (complete) {
    store.completedLessons[lessonId] = true
  } else {
    delete store.completedLessons[lessonId]
  }
  writeStore(store)
}

export function countCompleteInCourse(course) {
  const store = readStore()
  let count = 0
  for (const unit of course.units) {
    for (const lesson of unit.lessons) {
      if (store.completedLessons[lesson.id]) count += 1
    }
  }
  return count
}

export function countCompleteInGrade(courses) {
  return courses.reduce((sum, c) => sum + countCompleteInCourse(c), 0)
}
