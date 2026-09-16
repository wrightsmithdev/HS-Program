import { Link, useParams } from 'react-router-dom'
import { getGradeMeta, getCourses } from '../data'
import CourseCard from '../components/CourseCard'

export default function GradeTab() {
  const { grade } = useParams()
  const meta = getGradeMeta(grade)
  const courses = getCourses(grade)

  if (!meta) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-slate-600 dark:text-slate-300">Unknown grade.</p>
        <Link to="/" className="text-indigo-600 hover:underline dark:text-indigo-400">
          Back home
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link to="/" className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
        ← All grades
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
        Grade {meta.grade} · {meta.label}
      </h1>
      <p className="text-slate-500 dark:text-slate-400">{meta.location}</p>
      <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">{meta.description}</p>

      <div className="mt-6 flex flex-col gap-3">
        {courses.map((course) => (
          <CourseCard key={course.id} grade={meta.grade} course={course} />
        ))}
      </div>
    </div>
  )
}
