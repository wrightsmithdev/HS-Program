import { useState } from 'react'
import { Link } from 'react-router-dom'
import majors from '../data/majors.json'
import { getGrades, getCourses } from '../data'

function PlanRow({ course, pick }) {
  const hasChoice = course.alternatives?.length > 0
  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-800">
      <span className="mt-0.5 text-lg">{hasChoice ? '🔀' : '📌'}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-slate-400 dark:text-slate-500">{course.subjectArea}</p>
        {hasChoice ? (
          <>
            <p className="font-medium text-slate-900 dark:text-white">{pick}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Recommended pick for this credit slot</p>
          </>
        ) : (
          <p className="font-medium text-slate-900 dark:text-white">{course.title}</p>
        )}
      </div>
    </div>
  )
}

export default function MajorsPage() {
  const [selectedId, setSelectedId] = useState(null)
  const selected = majors.find((m) => m.id === selectedId)
  const grades = getGrades()

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link to="/" className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
        ← Home
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">🎯 Majors & Career Paths</h1>
      <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
        Several ECHS credits let you choose from a short list of TCC courses. Pick the major you're interested in
        to see which option is usually the better fit at each of those choice points across all 4 years.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {majors.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedId(m.id === selectedId ? null : m.id)}
            className={`rounded-xl border-2 p-4 text-left transition ${
              selectedId === m.id
                ? `bg-gradient-to-r ${m.color} border-transparent text-white shadow-md`
                : 'border-slate-200 bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-900'
            }`}
          >
            <span className="text-2xl">{m.icon}</span>
            <p className={`mt-2 font-semibold ${selectedId === m.id ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
              {m.label}
            </p>
            <p className={`mt-1 text-sm ${selectedId === m.id ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'}`}>
              {m.description}
            </p>
          </button>
        ))}
      </div>

      {selected && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {selected.icon} Suggested plan for {selected.label}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            📌 = fixed requirement, same for everyone. 🔀 = a choice slot — this is the recommended pick for this major.
          </p>

          <div className="mt-4 flex flex-col gap-6">
            {grades.map((g) => {
              const courses = getCourses(g.grade).filter((c) => c.creditType !== 'program' && c.creditType !== 'elective')
              if (courses.length === 0) return null
              return (
                <div key={g.grade}>
                  <h3 className="mb-2 font-semibold text-slate-700 dark:text-slate-200">
                    Grade {g.grade} · {g.label}
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {courses.map((c) => (
                      <PlanRow key={c.id} course={c} pick={selected.picks[c.id] ?? c.title} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
