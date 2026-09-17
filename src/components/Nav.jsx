import { Link, useLocation } from 'react-router-dom'
import { getGrades } from '../data'
import { useAiAddon } from '../lib/aiAddon'
import { useTheme } from '../lib/theme'

export default function Nav() {
  const location = useLocation()
  const grades = getGrades()
  const aiAvailable = useAiAddon() === 'available'
  const [theme, toggleTheme] = useTheme()

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
          <span className="text-xl">🐎</span>
          <span>Stallion Study</span>
        </Link>
        <nav className="flex items-center gap-1">
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
          <span className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-700" />
          <Link
            to="/review"
            title="Questions to Review"
            className={`rounded-md px-2 py-1.5 text-sm font-medium transition ${
              location.pathname === '/review'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            📋
          </Link>
          {aiAvailable && (
            <>
              <Link
                to="/ask"
                title="Ask AI"
                className={`rounded-md px-2 py-1.5 text-sm font-medium transition ${
                  location.pathname === '/ask'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                🤖
              </Link>
              <Link
                to="/settings"
                title="Settings"
                className={`rounded-md px-2 py-1.5 text-sm font-medium transition ${
                  location.pathname === '/settings'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                ⚙️
              </Link>
            </>
          )}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="rounded-md px-2 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </nav>
      </div>
    </header>
  )
}
