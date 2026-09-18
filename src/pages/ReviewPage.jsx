import { Link } from 'react-router-dom'
import { getMissedItems } from '../lib/missedQuestions'
import { findGradeForCourse } from '../data'
import { useAiAddon } from '../lib/aiAddon'
import { setPendingQuestion } from '../lib/aiPrefill'
import Formatted from '../components/Formatted'

function AskAiAboutItem({ item }) {
  const aiAvailable = useAiAddon() === 'available'
  if (!aiAvailable) return null

  const prefill = `I got this question wrong: "${item.question}" I picked "${item.choices[item.selectedIndex]}" but the correct answer is "${item.choices[item.correctIndex]}". Can you explain why, in a way that helps me understand the concept?`

  return (
    <Link
      to="/ask"
      onClick={() => setPendingQuestion(prefill)}
      className="mt-2 inline-block text-sm text-teal-600 hover:underline dark:text-teal-400"
    >
      🤖 Ask AI to explain this
    </Link>
  )
}

export default function ReviewPage() {
  const items = getMissedItems()

  const byCourse = {}
  for (const item of items) {
    byCourse[item.courseId] ??= { courseTitle: item.courseTitle, items: [] }
    byCourse[item.courseId].items.push(item)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/" className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
        ← Home
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">📋 Questions to Review</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        Every question you've gotten wrong (in a lesson or a test) stays here until you answer it correctly. Answer it
        again from its lesson to clear it.
      </p>

      {items.length === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed border-slate-300 p-6 text-center text-slate-400 dark:border-slate-700 dark:text-slate-500">
          Nothing to review right now — nice work! Missed questions will show up here.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-6">
          {Object.entries(byCourse).map(([courseId, group]) => {
            const grade = findGradeForCourse(courseId)
            return (
              <div key={courseId}>
                <h2 className="mb-2 font-semibold text-slate-700 dark:text-slate-200">
                  {group.courseTitle} <span className="text-sm font-normal text-slate-400">({group.items.length})</span>
                </h2>
                <div className="flex flex-col gap-2">
                  {group.items.map((item, i) => (
                    <div key={i} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {item.unitTitle} · {item.lessonTitle}
                      </p>
                      <p className="mt-1 font-medium text-slate-900 dark:text-white">
                        <Formatted text={item.question} />
                      </p>
                      <p className="mt-2 text-sm">
                        <span className="font-semibold text-red-600 dark:text-red-400">Your answer: </span>
                        <span className="text-slate-600 dark:text-slate-300">{item.choices[item.selectedIndex]}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">Correct answer: </span>
                        <span className="text-slate-600 dark:text-slate-300">{item.choices[item.correctIndex]}</span>
                      </p>
                      <p className="mt-1 whitespace-pre-line text-sm text-slate-500 dark:text-slate-400">
                        <Formatted text={item.explanation} />
                      </p>
                      <AskAiAboutItem item={item} />
                      {grade && (
                        <Link
                          to={`/grade/${grade}/course/${courseId}/lesson/${item.lessonId}`}
                          className="mt-2 inline-block text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                        >
                          Go review this lesson →
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
