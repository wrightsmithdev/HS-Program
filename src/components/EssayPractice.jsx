import { useEffect, useRef, useState } from 'react'
import Formatted from './Formatted'

function useLocalStorageState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? JSON.parse(raw) : initial
    } catch {
      return initial
    }
  })
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch {
        // localStorage unavailable - draft just won't persist
      }
    }, 400)
    return () => clearTimeout(timeoutRef.current)
  }, [key, value])

  return [value, setValue]
}

export default function EssayPractice({ lessonId, essayPrompt, color }) {
  const [essayText, setEssayText] = useLocalStorageState(`stallion-prep-essay-${lessonId}`, '')
  const [checked, setChecked] = useLocalStorageState(
    `stallion-prep-essay-rubric-${lessonId}`,
    essayPrompt.rubric.map(() => false)
  )

  const toggleCheck = (i) => {
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
  }

  const checkedCount = checked.filter(Boolean).length

  return (
    <div className={`rounded-lg border-2 ${color.border} ${color.soft} p-4`}>
      <p className="font-medium text-slate-900 dark:text-white">
        <Formatted text={essayPrompt.prompt} />
      </p>

      <textarea
        value={essayText}
        onChange={(e) => setEssayText(e.target.value)}
        rows={10}
        placeholder="Write your essay here — it saves automatically as you type."
        className="mt-3 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      />
      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
        {essayText.trim().split(/\s+/).filter(Boolean).length} words · saved automatically
      </p>

      <div className="mt-4">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          ✅ Self-check rubric ({checkedCount}/{essayPrompt.rubric.length})
        </p>
        <ul className="mt-2 flex flex-col gap-1">
          {essayPrompt.rubric.map((item, i) => (
            <li key={i}>
              <label className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input type="checkbox" checked={checked[i] ?? false} onChange={() => toggleCheck(i)} className="mt-1" />
                <span>{item}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
