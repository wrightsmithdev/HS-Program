import { useState } from 'react'
import { Link } from 'react-router-dom'
import { hasApiKey } from '../lib/aiSettings'
import { askAI, AIError } from '../lib/aiClient'
import { getRemainingToday, getDailyLimit, consumeOneQuestion } from '../lib/aiQuota'

const HISTORY_KEY = 'stallion-prep-ai-history-v1'
const MAX_HISTORY = 10

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
  } catch {
    return []
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-MAX_HISTORY)))
  } catch {
    // localStorage unavailable - history just won't persist
  }
}

export default function AskAIPage() {
  const [question, setQuestion] = useState('')
  const [history, setHistory] = useState(loadHistory)
  const [remaining, setRemaining] = useState(getRemainingToday())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const hasKey = hasApiKey()

  const ask = async (e) => {
    e.preventDefault()
    if (!question.trim() || remaining <= 0 || loading) return
    setLoading(true)
    setError(null)
    const asked = question.trim()
    try {
      const answer = await askAI(asked)
      const next = [...history, { question: asked, answer, at: Date.now() }]
      setHistory(next)
      saveHistory(next)
      setRemaining(consumeOneQuestion())
      setQuestion('')
    } catch (e2) {
      setError(e2 instanceof AIError ? e2 : new AIError('api', 'Something went wrong.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link to="/" className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
        ← Home
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">🤖 Ask AI</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        Ask about anything — a class you're taking, a concept you're stuck on, college questions, whatever. You get{' '}
        <strong>{getDailyLimit()} questions per day</strong>.
      </p>

      {!hasKey ? (
        <div className="mt-6 rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          You need an API key to use this.{' '}
          <Link to="/settings" className="underline">
            Add one in Settings
          </Link>
          .
        </div>
      ) : (
        <form onSubmit={ask} className="mt-6">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            placeholder="Type your question…"
            className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm text-slate-400 dark:text-slate-500">
              {remaining > 0 ? `${remaining} question${remaining === 1 ? '' : 's'} left today` : 'No questions left today — come back tomorrow'}
            </p>
            <button
              type="submit"
              disabled={loading || remaining <= 0 || !question.trim()}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? 'Asking…' : 'Ask'}
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error.message}</p>}
        </form>
      )}

      {history.length > 0 && (
        <div className="mt-8 flex flex-col gap-4">
          {[...history].reverse().map((h, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <p className="font-medium text-slate-900 dark:text-white">🙋 {h.question}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">🤖 {h.answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
