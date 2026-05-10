interface AccountActiveToggleProps {
  isActive: boolean
  disabled?: boolean
  pending?: boolean
  onChange: () => void
}

export function AccountActiveToggle({
  isActive,
  disabled = false,
  pending = false,
  onChange,
}: AccountActiveToggleProps) {
  const busy = disabled || pending

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isActive}
      disabled={busy}
      onClick={() => {
        if (!busy) onChange()
      }}
      className={`flex w-full flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-4 text-left transition hover:border-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 disabled:cursor-not-allowed disabled:opacity-50`}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-white">Hesap etkin mi?</p>
        <p className="mt-1 text-xs text-slate-500">
          Pasifleştirilmiş hesaplar sisteme giriş yapamaz. Değişiklik hemen
          geçerlidir.
        </p>
      </div>
      <span
        aria-hidden
        className={`relative inline-flex h-8 w-[3.25rem] shrink-0 items-center rounded-full border transition ${
          isActive
            ? 'border-emerald-500/50 bg-emerald-500/30'
            : 'border-white/15 bg-slate-800'
        }`}
      >
        <span
          className={`pointer-events-none inline-block size-6 rounded-full shadow transition-transform ${
            isActive
              ? 'translate-x-[1.35rem] bg-emerald-200'
              : 'translate-x-1 bg-slate-400'
          }`}
        />
      </span>
    </button>
  )
}
