interface AppShellProps {
  title: string
  searchQuery: string
  onSearchChange: (q: string) => void
  onAdd: () => void
  addLabel: string
  onBack?: () => void
  onSettings: () => void
  children: React.ReactNode
}

export function AppShell({ title, searchQuery, onSearchChange, onAdd, addLabel, onBack, onSettings, children }: AppShellProps) {
  return (
    <div className="flex flex-col h-dvh bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 pt-safe-top px-4 pb-3">
        <div className="flex items-center gap-3 mb-3 pt-2">
          {onBack && (
            <button
              onClick={onBack}
              className="text-white/80 active:text-white -ml-1 p-1"
              aria-label="Back"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-bold text-xl leading-tight truncate">{title}</h1>
          </div>
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 bg-white/20 text-white text-sm font-medium px-3 py-1.5 rounded-full active:bg-white/30 flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {addLabel}
          </button>
          <button
            onClick={onSettings}
            className="text-white/80 active:text-white p-1 flex-shrink-0"
            aria-label="Veri yedekleme"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="5" r="1" fill="currentColor" stroke="none" />
              <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
              <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
            </svg>
          </button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-9 pr-4 py-2.5 bg-white rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-300"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
