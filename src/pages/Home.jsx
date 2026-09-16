import { Link } from 'react-router-dom'
import { config, getGrades, getCourses, countLessonsForGrade } from '../data'
import { countCompleteInGrade } from '../lib/progress'
import ProgressRing from '../components/ProgressRing'

export default function Home() {
  const grades = getGrades()

  let totalLessons = 0
  let totalComplete = 0
  for (const g of grades) {
    totalLessons += countLessonsForGrade(g.grade)
    totalComplete += countCompleteInGrade(getCourses(g.grade))
  }
  const overallPercent = totalLessons > 0 ? (totalComplete / totalLessons) * 100 : 0

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-col items-start gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
        <ProgressRing percent={overallPercent} size={88} stroke={8} />
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Stallion Prep</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Modeled on Mansfield ISD Early College High School at Timberview / TCC Southeast Campus.
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Track: <span className="font-medium text-slate-700 dark:text-slate-200">{config.diplomaTrack}</span> ·{' '}
            Endorsement: <span className="font-medium text-slate-700 dark:text-slate-200">{config.endorsement}</span> ·{' '}
            {totalComplete}/{totalLessons} lessons complete
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {grades.map((g) => {
          const courses = getCourses(g.grade)
          const total = countLessonsForGrade(g.grade)
          const complete = countCompleteInGrade(courses)
          const percent = total > 0 ? (complete / total) * 100 : 0

          return (
            <Link
              key={g.grade}
              to={`/grade/${g.grade}`}
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <ProgressRing percent={percent} size={56} stroke={5} />
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Grade {g.grade} · {g.label}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{g.location}</p>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{courses.length} courses</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
