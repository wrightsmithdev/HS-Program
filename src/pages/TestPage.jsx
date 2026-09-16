import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCourse, getGradeMeta, getUnitTestQuestions, getCourseTestQuestions } from '../data'
import { getSubjectColor } from '../lib/subjectColors'
import Formatted from '../components/Formatted'

function scoreMessage(percent) {
  if (percent >= 90) return { emoji: '🌟', text: "Excellent! You've really got this down." }
  if (percent >= 70) return { emoji: '👍', text: 'Solid work! Take a look at the ones you missed below.' }
  return { emoji: '📚', text: "Let's review this material a bit more before moving on." }
}

export default function TestPage() {
  const { grade, courseId, unitId } = useParams()
  const meta = getGradeMeta(grade)
  const course = getCourse(grade, courseId)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const { questions, title } = useMemo(() => {
    if (!course) return { questions: [], title: '' }
    if (unitId) {
      const { unit, questions } = getUnitTestQuestions(course, unitId)
      return { questions, title: unit ? `Unit Test: ${unit.title}` : 'Unit Test' }
    }
    return { questions: getCourseTestQuestions(course), title: `${course.title} — Full Course Test` }
  }, [course, unitId])

  if (!course) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-slate-600 dark:text-slate-300">Course not found.</p>
        <Link to={`/grade/${grade}`} className="text-indigo-600 hover:underline dark:text-indigo-400">
          ← Back to Grade {grade}
        </Link>
      </div>
    )
  }

  const color = getSubjectColor(course.subjectArea)
  const backLink = `/grade/${grade}/course/${courseId}`
  const answeredCount = Object.keys(answers).length
  const allAnswered = questions.length > 0 && answeredCount === questions.length

  const correctCount = questions.filter((q) => answers[q.id] === q.answerIndex).length
  const percent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0
  const message = scoreMessage(percent)

  const selectAnswer = (questionId, choiceIndex) => {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [questionId]: choiceIndex }))
  }

  const retake = () => {
    setAnswers({})
    setSubmitted(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link to={backLink} className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
          ← {course.title}
        </Link>
        <p className="mt-4 rounded-lg border border-dashed border-slate-300 p-6 text-center text-slate-400 dark:border-slate-700 dark:text-slate-500">
          No practice questions are available to build a test from yet.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link to={backLink} className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
        ← {course.title}
      </Link>

      <div className={`mt-3 rounded-2xl bg-gradient-to-r ${color.gradient} p-6 text-white shadow-sm`}>
        <p className="text-xs font-semibold uppercase tracking-wide text-white/80">Grade {grade} · {meta?.label}</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">🧪 {title}</h1>
        <p className="mt-2 text-white/90">{questions.length} questions — answer them all, then submit to see your score.</p>
      </div>

      {submitted && (
        <div className={`mt-6 rounded-2xl border-2 ${color.border} ${color.soft} p-6 text-center`}>
          <p className="text-4xl font-bold text-slate-900 dark:text-white">{percent}%</p>
          <p className="mt-1 text-slate-600 dark:text-slate-300">
            {correctCount} out of {questions.length} correct
          </p>
          <p className="mt-2 text-lg">
            {message.emoji} {message.text}
          </p>
          <button
            onClick={retake}
            className={`mt-4 rounded-lg px-4 py-2 text-sm font-semibold text-white ${color.solid}`}
          >
            🔁 Retake Test
          </button>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {questions.map((q, index) => {
          const selected = answers[q.id]
          const isCorrect = selected === q.answerIndex
          return (
            <div key={q.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              {submitted && (
                <p className="mb-1 text-xs font-medium text-slate-400 dark:text-slate-500">
                  {q.unitTitle} · {q.lessonTitle}
                </p>
              )}
              <p className="font-medium text-slate-900 dark:text-white">
                {index + 1}. <Formatted text={q.question} />
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {q.choices.map((choice, i) => {
                  const isSelected = selected === i
                  let style = isSelected
                    ? `${color.border} ${color.soft}`
                    : 'border-slate-200 dark:border-slate-700'
                  if (submitted) {
                    if (i === q.answerIndex) style = 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30'
                    else if (isSelected) style = 'border-red-400 bg-red-50 dark:bg-red-900/30'
                    else style = 'border-slate-200 dark:border-slate-700 opacity-60'
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => selectAnswer(q.id, i)}
                      disabled={submitted}
                      className={`rounded-md border px-3 py-2 text-left text-sm text-slate-700 disabled:cursor-default dark:text-slate-200 ${style}`}
                    >
                      {choice}
                    </button>
                  )
                })}
              </div>
              {submitted && (
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  <span className={isCorrect ? 'font-semibold text-emerald-600 dark:text-emerald-400' : 'font-semibold text-red-600 dark:text-red-400'}>
                    {isCorrect ? 'Correct! ' : 'Not quite. '}
                  </span>
                  <Formatted text={q.explanation} />
                </p>
              )}
            </div>
          )
        })}
      </div>

      {!submitted && (
        <div className="sticky bottom-4 mt-6 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {answeredCount} of {questions.length} answered
            {!allAnswered && answeredCount > 0 && ' — unanswered questions count as incorrect'}
          </p>
          <button
            onClick={() => setSubmitted(true)}
            disabled={answeredCount === 0}
            className={`rounded-lg px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 ${color.solid}`}
          >
            Submit Test
          </button>
        </div>
      )}
    </div>
  )
}
