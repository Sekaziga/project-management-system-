interface StatusBadgeProps {
  status: 'active' | 'completed' | 'archived' | string
}

const statusClasses: Record<string, string> = {
  active:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-900/20 dark:text-emerald-300',
  completed:
    'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-900/20 dark:text-sky-300',
  archived:
    'border-[var(--gray-4)] bg-[var(--gray-2)] text-[var(--gray-7)]',
  todo:
    'border-[var(--gray-4)] bg-[var(--gray-2)] text-[var(--gray-8)]',
  in_progress:
    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-900/20 dark:text-amber-300',
  blocked:
    'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-900/20 dark:text-rose-300',
  done:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-900/20 dark:text-emerald-300',
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase()
  const label = normalizedStatus.replace('_', ' ')

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusClasses[normalizedStatus] ?? 'border-[var(--gray-4)] bg-[var(--gray-2)] text-[var(--gray-8)]'}`}
    >
      {label}
    </span>
  )
}
