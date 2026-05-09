import { useEffect } from 'react'

export interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  isConfirming?: boolean
  variant?: 'danger' | 'neutral'
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Onayla',
  cancelLabel = 'İptal',
  isConfirming = false,
  variant = 'neutral',
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  const confirmBtnClass =
    variant === 'danger'
      ? 'bg-rose-500/90 text-white hover:bg-rose-400 disabled:opacity-60'
      : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300 disabled:opacity-60'

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="confirm-dialog-title"
          className="text-lg font-semibold text-white"
        >
          {title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            disabled={isConfirming}
            onClick={onCancel}
            className="rounded-full border border-white/20 px-5 py-2 text-sm text-slate-200 hover:border-cyan-300 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isConfirming}
            onClick={onConfirm}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${confirmBtnClass}`}
          >
            {isConfirming ? 'İşleniyor…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
