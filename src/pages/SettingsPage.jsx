import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getApiKey, setApiKey } from '../lib/aiSettings'

export default function SettingsPage() {
  const [key, setKey] = useState(getApiKey())
  const [saved, setSaved] = useState(false)

  const save = () => {
    setApiKey(key.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const clear = () => {
    setKey('')
    setApiKey('')
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link to="/" className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
        ← Home
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">🤖 Ask AI Settings</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        This app works fully offline with no AI. Adding your own Anthropic (Claude) API key unlocks the{' '}
        <Link to="/ask" className="underline">
          Ask AI
        </Link>{' '}
        page, where you can ask up to 3 questions a day about anything — a class, homework, college questions,
        whatever — when you're online.
      </p>

      <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
        <p className="font-semibold">Before you paste a key here:</p>
        <ul className="mt-1 list-disc pl-5">
          <li>Your key is stored only in this browser (localStorage) — it is never sent anywhere except directly to Anthropic's API.</li>
          <li>Usage is billed to <em>your own</em> Anthropic account, typically a fraction of a cent per question.</li>
          <li>Don't paste your key into a copy of this app you don't trust or that someone else could open on this device.</li>
          <li>Get a key at <span className="font-mono">console.anthropic.com</span> (requires an Anthropic account with billing set up).</li>
        </ul>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Anthropic API Key</label>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="sk-ant-..."
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
        <div className="mt-3 flex gap-2">
          <button onClick={save} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
            {saved ? '✓ Saved' : 'Save Key'}
          </button>
          <button
            onClick={clear}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Remove Key
          </button>
        </div>
      </div>
    </div>
  )
}
