import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCourse, getGradeMeta, getLessonSequence } from '../data'
import { isLessonComplete } from '../lib/progress'
import { getSubjectColor } from '../lib/subjectColors'
import { getSelectedMajorId, getRecommendedOption } from '../lib/major'
import majors from '../data/majors.json'
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

  const color = getSubjectColor(course.subjectArea)
  const sequence = getLessonSequence(course)
  const numberByLessonId = new Map(sequence.map((item, i) => [item.lesson.id, i + 1]))
  const selectedMajor = majors.find((m) => m.id === getSelectedMajorId())
  const recommended =
    course.alternatives?.length > 0 && selectedMajor ? getRecommendedOption(course, selectedMajor.picks) : null

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link to={`/grade/${grade}`} className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
        ← Grade {grade} · {meta?.label}
      </Link>

      <div className={`mt-3 rounded-2xl bg-gradient-to-r ${color.gradient} p-6 text-white shadow-sm`}>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <CreditBadge creditType={course.creditType} />
        </div>
        <p className="mt-1 inline-block rounded-full bg-white/25 px-2.5 py-0.5 text-xs font-semibold backdrop-blur">
          {course.subjectArea}
        </p>
        <p className="mt-3 max-w-2xl text-white/90">{course.description}</p>
        {course.textbook && <p className="mt-2 text-sm text-white/80">📘 Textbook: {course.textbook}</p>}
        {course.peimsCode && <p className="mt-1 text-xs text-white/70">PEIMS Code: {course.peimsCode}</p>}
      </div>

      {course.alternatives?.length > 0 && (
        <div className={`mt-4 rounded-lg border-2 ${color.border} ${color.soft} p-4`}>
          {selectedMajor ? (
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {selectedMajor.icon} Recommended for {selectedMajor.label}:{' '}
              <span className={color.ring}>{recommended?.title ?? course.title}</span>
            </p>
          ) : (
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              🔀 This credit can be satisfied by any of these — not sure which to pick?{' '}
              <Link to="/majors" className="underline">
                Tell us your major
              </Link>
              .
            </p>
          )}
          <ul className="mt-2 flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
            {[{ title: course.title, peimsCode: course.peimsCode, isPrimary: true }, ...course.alternatives].map((opt) => {
              const isRecommended = selectedMajor && recommended?.title === opt.title
              return (
                <li key={opt.title} className={isRecommended ? `font-semibold ${color.ring}` : ''}>
                  {isRecommended && `${selectedMajor.icon} `}
                  {opt.title}
                  {opt.peimsCode && <span className="text-slate-400 dark:text-slate-500"> · PEIMS {opt.peimsCode}</span>}
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {sequence.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            📋 Go through the {sequence.length} lessons in order below — each one is numbered so you always know what's next.
          </p>
          <Link
            to={`/grade/${grade}/course/${courseId}/test`}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold text-white ${color.solid}`}
          >
            🧪 Take the Full Course Test
          </Link>
        </div>
      )}

      <div className="mt-8">
        {course.units.length === 0 && (
          <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-slate-400 dark:border-slate-700 dark:text-slate-500">
            Unit content for this course is coming in a future build phase.
          </p>
        )}

        <div className="flex flex-col gap-3">
          {course.units.map((unit, unitIndex) => {
            const isOpen = openUnit === unit.id
            return (
              <div
                key={unit.id}
                className={`overflow-hidden rounded-xl border-2 ${color.border} ${color.soft}`}
              >
                <button
                  onClick={() => setOpenUnit(isOpen ? null : unit.id)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left font-medium text-slate-900 dark:text-white"
                >
                  <span className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${color.chip}`}>
                      Unit {unitIndex + 1}
                    </span>
                    {unit.title}
                  </span>
                  <span className="text-slate-400">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <>
                    <ul className="border-t border-slate-100 dark:border-slate-800">
                      {unit.lessons.map((lesson) => (
                        <li key={lesson.id}>
                          <Link
                            to={`/grade/${grade}/course/${courseId}/lesson/${lesson.id}`}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                          >
                            <span
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                isLessonComplete(lesson.id)
                                  ? 'bg-emerald-500 text-white'
                                  : `${color.chip}`
                              }`}
                            >
                              {isLessonComplete(lesson.id) ? '✓' : numberByLessonId.get(lesson.id)}
                            </span>
                            <span className="flex-1">{lesson.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={`/grade/${grade}/course/${courseId}/test/unit/${unit.id}`}
                      className="flex items-center gap-2 border-t border-slate-100 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      🧪 Take the Unit {unitIndex + 1} Test
                    </Link>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
