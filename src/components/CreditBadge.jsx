const STYLES = {
  'state-core': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  'dual-credit': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  elective: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  program: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
}

const LABELS = {
  'state-core': 'State Core',
  'dual-credit': 'TCC Dual Credit',
  elective: 'Elective',
  program: 'Program',
}

export default function CreditBadge({ creditType }) {
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STYLES[creditType] ?? STYLES.elective}`}>
      {LABELS[creditType] ?? creditType}
    </span>
  )
}
