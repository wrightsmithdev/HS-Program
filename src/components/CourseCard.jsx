import { Link } from 'react-router-dom'
import CreditBadge from './CreditBadge'
import ProgressRing from './ProgressRing'
import { countLessons } from '../data'
import { countCompleteInCourse } from '../lib/progress'

const SUBJECT_ICONS = {
  English: '📖',
  Math: '📐',
  Science: '🔬',
  'Social Studies': '🌎',
  'Fine Arts': '🎭',
  LOTE: '🗣️',
  PE: '🏃',
  'AVID/Advisory': '🎯',
  'STEM Endorsement': '💻',
  Capstone: '🎓',
}

export default function CourseCard({ grade, course }) {
  const total = countLessons(course)
  const complete = countCompleteInCourse(course)
  const percent = total > 0 ? (complete / total) * 100 : 0

  return (
    <Link
      to={`/grade/${grade}/course/${course.id}`}
      className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      <span className="text-2xl" aria-hidden="true">
        {SUBJECT_ICONS[course.subjectArea] ?? '📚'}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate font-semibold text-slate-900 dark:text-white">{course.title}</h3>
          <CreditBadge creditType={course.creditType} />
        </div>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          {course.subjectArea} · {course.credits} credit{course.credits === 1 ? '' : 's'}
          {course.collegeCreditHours ? ` · ${course.collegeCreditHours} TCC hrs` : ''}
        </p>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          {total > 0 ? `${complete}/${total} lessons complete` : 'Content coming soon'}
        </p>
      </div>
      {total > 0 && <ProgressRing percent={percent} size={44} stroke={4} />}
    </Link>
  )
}
