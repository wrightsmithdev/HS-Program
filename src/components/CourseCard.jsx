import { Link } from 'react-router-dom'
import CreditBadge from './CreditBadge'
import ProgressRing from './ProgressRing'
import { countLessons } from '../data'
import { countCompleteInCourse } from '../lib/progress'
import { getSubjectColor } from '../lib/subjectColors'

const SUBJECT_ICONS = {
  English: '📖',
  Math: '📐',
  Science: '🔬',
  'Social Studies': '🌎',
  'Fine Arts': '🎭',
  LOTE: '🗣️',
  PE: '🏃',
  'AVID/Advisory': '🎯',
  Elective: '🎤',
  'STEM Endorsement': '💻',
  Capstone: '🎓',
}

export default function CourseCard({ grade, course }) {
  const total = countLessons(course)
  const complete = countCompleteInCourse(course)
  const percent = total > 0 ? (complete / total) * 100 : 0
  const color = getSubjectColor(course.subjectArea)

  return (
    <Link
      to={`/grade/${grade}/course/${course.id}`}
      className={`flex items-center gap-4 rounded-xl border-2 ${color.border} ${color.soft} p-4 shadow-sm transition hover:shadow-md hover:-translate-y-0.5`}
    >
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl ${color.iconBg}`}
        aria-hidden="true"
      >
        {SUBJECT_ICONS[course.subjectArea] ?? '📚'}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-base font-semibold text-slate-900 dark:text-white">{course.title}</h3>
          <CreditBadge creditType={course.creditType} />
        </div>
        <p className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${color.badge}`}>
          {course.subjectArea}
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {course.credits} credit{course.credits === 1 ? '' : 's'}
          {course.collegeCreditHours ? ` · ${course.collegeCreditHours} college hrs` : ''}
        </p>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          {total > 0 ? `${complete}/${total} lessons done` : 'Content coming soon'}
        </p>
      </div>
      {total > 0 && <ProgressRing percent={percent} size={44} stroke={4} colorClass={color.ring} />}
    </Link>
  )
}
