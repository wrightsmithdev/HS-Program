import config from './config.json'
import gradesMeta from './gradesMeta.json'
import grade9 from './grade9.json'
import grade10 from './grade10.json'
import grade11 from './grade11.json'
import grade12 from './grade12.json'

const COURSES_BY_GRADE = { 9: grade9, 10: grade10, 11: grade11, 12: grade12 }

export { config, gradesMeta }

export function getGrades() {
  return gradesMeta
}

export function getGradeMeta(gradeNum) {
  return gradesMeta.find((g) => g.grade === Number(gradeNum))
}

export function getCourses(gradeNum) {
  return COURSES_BY_GRADE[Number(gradeNum)] || []
}

export function getCourse(gradeNum, courseId) {
  return getCourses(gradeNum).find((c) => c.id === courseId)
}

export function getLesson(gradeNum, courseId, lessonId) {
  const course = getCourse(gradeNum, courseId)
  if (!course) return null
  for (const unit of course.units) {
    const lesson = unit.lessons.find((l) => l.id === lessonId)
    if (lesson) return { lesson, unit, course }
  }
  return null
}

export function countLessons(course) {
  return course.units.reduce((sum, u) => sum + u.lessons.length, 0)
}

export function countLessonsForGrade(gradeNum) {
  return getCourses(gradeNum).reduce((sum, c) => sum + countLessons(c), 0)
}
