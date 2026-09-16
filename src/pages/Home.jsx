import { Link } from 'react-router-dom'
import { config, getGrades, getCourses, countLessonsForGrade } from '../data'
import { countCompleteInGrade } from '../lib/progress'
import ProgressRing from '../components/ProgressRing'

const GRADE_COLORS = {
  9: { border: 'border-emerald-300 dark:border-emerald-700', ring: 'text-emerald-500 dark:text-emerald-400', chip: 'bg-emerald-500 text-white' },
  10: { border: 'border-sky-300 dark:border-sky-700', ring: 'text-sky-500 dark:text-sky-400', chip: 'bg-sky-500 text-white' },
  11: { border: 'border-violet-300 dark:border-violet-700', ring: 'text-violet-500 dark:text-violet-400', chip: 'bg-violet-500 text-white' },
  12: { border: 'border-amber-300 dark:border-amber-700', ring: 'text-amber-500 dark:text-amber-400', chip: 'bg-amber-500 text-white' },
}

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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">🐎 Stallion Prep</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Your 4-year plan to graduate with your diploma — and get a big head start on college.
          </p>
          <p className="mt-2 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              🏆 {config.diplomaTrack} Diploma
            </span>
            <span className="rounded-full bg-cyan-100 px-2.5 py-0.5 font-medium text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300">
              💻 {config.endorsement} Focus
            </span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              ✓ {totalComplete}/{totalLessons} lessons done
            </span>
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {grades.map((g) => {
          const courses = getCourses(g.grade)
          const total = countLessonsForGrade(g.grade)
          const complete = countCompleteInGrade(courses)
          const percent = total > 0 ? (complete / total) * 100 : 0
          const color = GRADE_COLORS[g.grade]

          return (
            <Link
              key={g.grade}
              to={`/grade/${g.grade}`}
              className={`flex items-center gap-4 rounded-xl border-2 ${color.border} bg-white p-5 shadow-sm transition hover:shadow-md dark:bg-slate-900`}
            >
              <ProgressRing percent={percent} size={56} stroke={5} colorClass={color.ring} />
              <div>
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${color.chip}`}>
                  Grade {g.grade}
                </span>
                <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{g.label}</h2>
                <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">{courses.length} courses</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
