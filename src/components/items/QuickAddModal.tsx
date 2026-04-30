import { useState, useEffect, useRef } from 'react'
import { compressPhoto } from '../../utils/photo'
import { addItem } from '../../hooks/useItems'
import type { Box } from '../../types'

interface QuickAddModalProps {
  boxId: number
  box: Box
  onClose: () => void
}

type QuickPhase =
  | { name: 'photo' }
  | { name: 'compressing' }
  | { name: 'naming'; photoBase64: string }
  | { name: 'saving'; photoBase64: string }

interface RecentItem {
  id: number
  name: string
  photoBase64: string
}

export function QuickAddModal({ boxId, box, onClose }: QuickAddModalProps) {
  const [phase, setPhase] = useState<QuickPhase>({ name: 'photo' })
  const [nameValue, setNameValue] = useState('')
  const [recentItems, setRecentItems] = useState<RecentItem[]>([])
  const fileRef = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  // Body scroll lock + Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  // Auto-trigger file picker on 'photo' phase transitions
  useEffect(() => {
    if (phase.name === 'photo') {
      if (fileRef.current) fileRef.current.value = '' // enables same-file re-select
      fileRef.current?.click()
    }
  }, [phase.name])

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return // user cancelled — stay on photo phase (no state change = no effect re-fire)
    setPhase({ name: 'compressing' })
    try {
      const photoBase64 = await compressPhoto(file)
      setNameValue('')
      setPhase({ name: 'naming', photoBase64 })
    } catch {
      setPhase({ name: 'photo' }) // compression failed → retry
    }
  }

  async function handleSave() {
    if (phase.name !== 'naming') return
    const trimmed = nameValue.trim()
    if (!trimmed) {
      nameRef.current?.focus()
      return
    }
    const { photoBase64 } = phase
    setPhase({ name: 'saving', photoBase64 })
    try {
      const id = await addItem({ boxId, name: trimmed, photoBase64 })
      setRecentItems(prev => [{ id, name: trimmed, photoBase64 }, ...prev])
      setNameValue('')
      setPhase({ name: 'photo' })
    } catch {
      setPhase({ name: 'naming', photoBase64 }) // DB error → revert, photo intact
    }
  }

  function handleNameKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    }
  }

  function handleRetake() {
    setPhase({ name: 'photo' })
  }

  const isSaving = phase.name === 'saving'
  const isNaming = phase.name === 'naming' || isSaving
  const photoBase64 = (phase.name === 'naming' || phase.name === 'saving') ? phase.photoBase64 : null

  return (
    <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col pt-safe-top pb-safe">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: box.color }}
          />
          <span className="text-white font-semibold truncate">{box.name}</span>
        </div>
        <button
          onClick={onClose}
          className="text-white/70 font-medium text-sm px-3 py-1.5 rounded-lg active:bg-white/10"
        >
          Done
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-4 gap-4">
        {phase.name === 'photo' && (
          <button
            onClick={() => {
              if (fileRef.current) fileRef.current.value = ''
              fileRef.current?.click()
            }}
            className="flex flex-col items-center gap-4 text-white/40 active:text-white/60"
          >
            <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-lg font-medium">Tap to take a photo</span>
          </button>
        )}

        {phase.name === 'compressing' && (
          <div className="flex flex-col items-center gap-3 text-white/60">
            <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm">Processing…</span>
          </div>
        )}

        {isNaming && photoBase64 && (
          <>
            <img
              src={photoBase64}
              alt="Item photo"
              className="w-full max-h-[45dvh] object-contain rounded-xl flex-shrink-0"
            />
            <input
              ref={nameRef}
              type="text"
              value={nameValue}
              onChange={e => setNameValue(e.target.value)}
              onKeyDown={handleNameKeyDown}
              placeholder="Item name"
              autoFocus
              disabled={isSaving}
              className="w-full bg-white/10 text-white placeholder-white/30 rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <div className="w-full flex gap-2">
              <button
                onClick={handleSave}
                disabled={!nameValue.trim() || isSaving}
                className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-xl active:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving…' : 'Add'}
              </button>
              <button
                onClick={handleRetake}
                disabled={isSaving}
                className="px-5 py-3 rounded-xl text-white/60 font-medium active:bg-white/10 disabled:opacity-40"
              >
                Retake
              </button>
            </div>
          </>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Recently added strip */}
      <div className="flex-shrink-0 h-28 border-t border-white/10 bg-white/5 flex flex-col justify-center">
        <div className="px-4 pb-1">
          <span className="text-xs text-white/40">
            {recentItems.length === 0 ? 'No items yet' : `${recentItems.length} added`}
          </span>
        </div>
        {recentItems.length > 0 && (
          <div className="flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-none">
            {recentItems.map(item => (
              <div key={item.id} className="flex-shrink-0 flex flex-col items-center gap-1 w-16">
                <img
                  src={item.photoBase64}
                  alt={item.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <span className="text-xs text-white/70 truncate w-16 text-center">{item.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
