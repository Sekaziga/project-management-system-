import { useEffect } from 'react'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  confirmTone?: 'danger' | 'primary'
  loading?: boolean
  onCancel: () => void
  onConfirm: () => void
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  confirmTone = 'primary',
  loading = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !loading) {
        onCancel()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, loading, onCancel])

  if (!open) return null

  const confirmClassName =
    confirmTone === 'danger'
      ? 'bg-red-600 text-white hover:bg-red-700'
      : 'bg-[var(--brand-9)] text-white hover:bg-[var(--brand-10)]'

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-4 backdrop-blur-[2px] sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="w-full max-w-md rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] p-5 shadow-[0_30px_80px_color-mix(in_oklab,var(--gray-12)_24%,transparent)]"
      >
        <h2 id="confirm-dialog-title" className="text-lg font-semibold text-[var(--gray-12)]">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--gray-7)]">{description}</p>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-lg border border-[var(--gray-4)] px-4 py-2 text-sm font-semibold text-[var(--gray-8)] transition-colors hover:bg-[var(--gray-3)] hover:text-[var(--gray-12)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${confirmClassName}`}
          >
            {loading ? 'Working...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
