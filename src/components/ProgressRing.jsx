export default function ProgressRing({ percent = 0, size = 56, stroke = 6, label, colorClass = 'text-indigo-600 dark:text-indigo-400' }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-slate-200 dark:text-slate-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${colorClass} transition-all`}
        />
      </svg>
      <span className="absolute text-xs font-semibold text-slate-700 dark:text-slate-200">
        {label ?? `${Math.round(percent)}%`}
      </span>
    </div>
  )
}
