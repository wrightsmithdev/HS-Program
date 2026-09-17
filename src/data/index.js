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

export function getLessonSequence(course) {
  const seq = []
  for (const unit of course.units) {
    for (const lesson of unit.lessons) {
      seq.push({ lesson, unit })
    }
  }
  return seq
}

export function getLessonPosition(course, lessonId) {
  const seq = getLessonSequence(course)
  const index = seq.findIndex((item) => item.lesson.id === lessonId)
  if (index === -1) return null
  return {
    number: index + 1,
    total: seq.length,
    prev: index > 0 ? seq[index - 1].lesson : null,
    next: index < seq.length - 1 ? seq[index + 1].lesson : null,
  }
}

export function countLessonsForGrade(gradeNum) {
  return getCourses(gradeNum).reduce((sum, c) => sum + countLessons(c), 0)
}

// Flattens practice questions into a test set, tagging each with where it came from
// so results can be reviewed against the right lesson/unit afterward.
function collectQuestions(units) {
  const questions = []
  for (const unit of units) {
    for (const lesson of unit.lessons) {
      lesson.practiceQuestions.forEach((q, questionIndex) => {
        questions.push({
          id: `${lesson.id}-${questionIndex}`,
          ...q,
          unitTitle: unit.title,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          questionIndex,
        })
      })
    }
  }
  return questions
}

export function getUnitTestQuestions(course, unitId) {
  const unit = course.units.find((u) => u.id === unitId)
  if (!unit) return { unit: null, questions: [] }
  return { unit, questions: collectQuestions([unit]) }
}

export function getCourseTestQuestions(course) {
  return collectQuestions(course.units)
}

// Missed-question review links need a grade to build a route, but only know
// the courseId - courses ids are unique across grades so this is unambiguous.
export function findGradeForCourse(courseId) {
  for (const { grade } of gradesMeta) {
    if (getCourse(grade, courseId)) return grade
  }
  return null
}
