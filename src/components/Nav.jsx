import { Link, useLocation } from 'react-router-dom'
import { getGrades } from '../data'

export default function Nav() {
  const location = useLocation()
  const grades = getGrades()
  const onMajors = location.pathname.startsWith('/majors')

  return (
    <header className="sticky top-0 z-10">
      <Link
        to="/majors"
        className={`block border-b px-4 py-2 text-center text-sm font-semibold transition ${
          onMajors
            ? 'border-transparent bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white'
            : 'border-slate-200 bg-gradient-to-r from-indigo-50 via-violet-50 to-fuchsia-50 text-indigo-700 hover:from-indigo-100 hover:via-violet-100 hover:to-fuchsia-100 dark:border-slate-800 dark:from-indigo-950/60 dark:via-violet-950/60 dark:to-fuchsia-950/60 dark:text-indigo-300'
        }`}
      >
        🎯 Not sure which classes to pick? Browse Majors &amp; Career Paths →
      </Link>

      <div className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
            <span className="text-xl">🐎</span>
            <span>Stallion Prep</span>
          </Link>
          <nav className="flex gap-1">
            {grades.map((g) => {
              const path = `/grade/${g.grade}`
              const active = location.pathname.startsWith(path)
              return (
                <Link
                  key={g.grade}
                  to={path}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                    active
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  Grade {g.grade}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}
