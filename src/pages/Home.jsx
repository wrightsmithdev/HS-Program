import { Link } from 'react-router-dom'
import { config, getGrades, getCourses, countLessonsForGrade } from '../data'
import { countCompleteInGrade } from '../lib/progress'
import ProgressRing from '../components/ProgressRing'

const GRADE_COLORS = {
  9: { border: 'border-emerald-300 dark:border-emerald-700', soft: 'bg-emerald-50 dark:bg-emerald-950/40', ring: 'text-emerald-500 dark:text-emerald-400', chip: 'bg-emerald-500 text-white' },
  10: { border: 'border-sky-300 dark:border-sky-700', soft: 'bg-sky-50 dark:bg-sky-950/40', ring: 'text-sky-500 dark:text-sky-400', chip: 'bg-sky-500 text-white' },
  11: { border: 'border-violet-300 dark:border-violet-700', soft: 'bg-violet-50 dark:bg-violet-950/40', ring: 'text-violet-500 dark:text-violet-400', chip: 'bg-violet-500 text-white' },
  12: { border: 'border-amber-300 dark:border-amber-700', soft: 'bg-amber-50 dark:bg-amber-950/40', ring: 'text-amber-500 dark:text-amber-400', chip: 'bg-amber-500 text-white' },
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
      <div className="flex flex-col items-start gap-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 p-6 text-white shadow-sm sm:flex-row sm:items-center">
        <div className="rounded-full bg-white/20 p-1 backdrop-blur">
          <ProgressRing percent={overallPercent} size={88} stroke={8} colorClass="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">🐎 Stallion Prep</h1>
          <p className="mt-1 text-white/90">
            Your 4-year plan to graduate with your diploma — and get a big head start on college.
          </p>
          <p className="mt-2 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 font-medium backdrop-blur">
              🏆 {config.diplomaTrack} Diploma
            </span>
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 font-medium backdrop-blur">
              💻 {config.endorsement} Focus
            </span>
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 font-medium backdrop-blur">
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
              className={`flex items-center gap-4 rounded-xl border-2 ${color.border} ${color.soft} p-5 shadow-sm transition hover:shadow-md hover:-translate-y-0.5`}
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
