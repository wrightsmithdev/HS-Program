import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCourse, getGradeMeta } from '../data'
import { isLessonComplete } from '../lib/progress'
import CreditBadge from '../components/CreditBadge'

export default function CoursePage() {
  const { grade, courseId } = useParams()
  const meta = getGradeMeta(grade)
  const course = getCourse(grade, courseId)
  const [openUnit, setOpenUnit] = useState(course?.units?.[0]?.id ?? null)

  if (!course) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-slate-600 dark:text-slate-300">Course not found.</p>
        <Link to={`/grade/${grade}`} className="text-indigo-600 hover:underline dark:text-indigo-400">
          ← Back to Grade {grade}
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link to={`/grade/${grade}`} className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
        ← Grade {grade} · {meta?.label}
      </Link>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{course.title}</h1>
        <CreditBadge creditType={course.creditType} />
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{course.stateCourseStandard}</p>
      <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">{course.description}</p>

      <div className="mt-8">
        {course.units.length === 0 && (
          <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-slate-400 dark:border-slate-700 dark:text-slate-500">
            Unit content for this course is coming in a future build phase.
          </p>
        )}

        <div className="flex flex-col gap-3">
          {course.units.map((unit) => {
            const isOpen = openUnit === unit.id
            return (
              <div key={unit.id} className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <button
                  onClick={() => setOpenUnit(isOpen ? null : unit.id)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left font-medium text-slate-900 dark:text-white"
                >
                  {unit.title}
                  <span className="text-slate-400">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <ul className="border-t border-slate-100 dark:border-slate-800">
                    {unit.lessons.map((lesson) => (
                      <li key={lesson.id}>
                        <Link
                          to={`/grade/${grade}/course/${courseId}/lesson/${lesson.id}`}
                          className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          <span>{lesson.title}</span>
                          {isLessonComplete(lesson.id) && <span className="text-emerald-500">✓</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
