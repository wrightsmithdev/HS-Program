import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAiAddon, getAiApi } from '../lib/aiAddon'

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

function NotInstalled() {
  return (
    <div className="mt-6 rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
      The Ask AI add-on file (<span className="font-mono">stallion-ai.js</span>) wasn't found next to{' '}
      <span className="font-mono">index.html</span>. Ask AI is an optional add-on — copy that file into the same
      folder as the app and refresh the page to enable it.
    </div>
  )
}

function AskAIForm() {
  const ai = getAiApi()
  const [question, setQuestion] = useState('')
  const [history, setHistory] = useState(loadHistory)
  const [remaining, setRemaining] = useState(ai.getRemainingToday())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const hasKey = ai.hasApiKey()

  const ask = async (e) => {
    e.preventDefault()
    if (!question.trim() || remaining <= 0 || loading) return
    setLoading(true)
    setError(null)
    const asked = question.trim()
    try {
      const answer = await ai.askAI(asked)
      const next = [...history, { question: asked, answer, at: Date.now() }]
      setHistory(next)
      saveHistory(next)
      setRemaining(ai.consumeOneQuestion())
      setQuestion('')
    } catch (e2) {
      setError(e2)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
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
              {remaining > 0
                ? `${remaining} question${remaining === 1 ? '' : 's'} left today`
                : 'No questions left today — come back tomorrow'}
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
    </>
  )
}

export default function AskAIPage() {
  const status = useAiAddon()

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link to="/" className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
        ← Home
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">🤖 Ask AI</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        Ask about anything — a class you're taking, a concept you're stuck on, college questions, whatever. You get{' '}
        <strong>3 questions per day</strong>.
      </p>

      {status === 'available' ? <AskAIForm /> : status === 'missing' ? <NotInstalled /> : null}
    </div>
  )
}
