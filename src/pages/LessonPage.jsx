import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getLesson } from '../data'
import { isLessonComplete, setLessonComplete } from '../lib/progress'

function QuizQuestion({ question, index }) {
  const [selected, setSelected] = useState(null)

  return (
    <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
      <p className="font-medium text-slate-900 dark:text-white">
        {index + 1}. {question.question}
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {question.choices.map((choice, i) => {
          const isSelected = selected === i
          const isCorrect = i === question.answerIndex
          let style = 'border-slate-200 dark:border-slate-700'
          if (selected !== null) {
            if (isCorrect) style = 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30'
            else if (isSelected) style = 'border-red-400 bg-red-50 dark:bg-red-900/30'
          }
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              disabled={selected !== null}
              className={`rounded-md border px-3 py-2 text-left text-sm text-slate-700 disabled:cursor-default dark:text-slate-200 ${style}`}
            >
              {choice}
            </button>
          )
        })}
      </div>
      {selected !== null && (
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          <span className={selected === question.answerIndex ? 'font-semibold text-emerald-600 dark:text-emerald-400' : 'font-semibold text-red-600 dark:text-red-400'}>
            {selected === question.answerIndex ? 'Correct. ' : 'Not quite. '}
          </span>
          {question.explanation}
        </p>
      )}
    </div>
  )
}

export default function LessonPage() {
  const { grade, courseId, lessonId } = useParams()
  const result = getLesson(grade, courseId, lessonId)
  const [complete, setComplete] = useState(() => isLessonComplete(lessonId))

  const toggleComplete = () => {
    const next = !complete
    setComplete(next)
    setLessonComplete(lessonId, next)
  }

  const backLink = `/grade/${grade}/course/${courseId}`

  if (!result) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-slate-600 dark:text-slate-300">Lesson not found.</p>
        <Link to={backLink} className="text-indigo-600 hover:underline dark:text-indigo-400">
          ← Back to course
        </Link>
      </div>
    )
  }

  const { lesson, unit, course } = result

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link to={backLink} className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
        ← {course.title}
      </Link>
      <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">{unit.title}</p>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{lesson.title}</h1>

      <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">{lesson.summary}</p>

      {lesson.keyTerms?.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Key Terms</h2>
          <dl className="grid gap-3 sm:grid-cols-2">
            {lesson.keyTerms.map((kt) => (
              <div key={kt.term} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                <dt className="font-medium text-slate-900 dark:text-white">{kt.term}</dt>
                <dd className="mt-1 text-sm text-slate-500 dark:text-slate-400">{kt.definition}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {lesson.practiceQuestions?.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Practice Questions</h2>
          <div className="flex flex-col gap-3">
            {lesson.practiceQuestions.map((q, i) => (
              <QuizQuestion key={i} question={q} index={i} />
            ))}
          </div>
        </div>
      )}

      <button
        onClick={toggleComplete}
        className={`mt-8 rounded-lg px-4 py-2 text-sm font-medium transition ${
          complete
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        {complete ? '✓ Marked complete' : 'Mark lesson complete'}
      </button>
    </div>
  )
}
