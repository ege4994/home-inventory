import { useState } from 'react'
import { Modal } from '../shared/Modal'
import { IsometricBox } from '../shared/IsometricBox'
import { addBox, updateBox, deleteBox } from '../../hooks/useBoxes'
import type { Box } from '../../types'

const COLORS = [
  '#2563eb', '#16a34a', '#dc2626', '#d97706',
  '#7c3aed', '#db2777', '#0891b2', '#4b5563',
]

interface BoxModalProps {
  box?: Box
  locationId?: number
  onClose: () => void
}

export function BoxModal({ box, locationId, onClose }: BoxModalProps) {
  const [name, setName] = useState(box?.name ?? '')
  const [color, setColor] = useState(box?.color ?? COLORS[0])
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const isEdit = box != null

  async function handleSave() {
    if (!name.trim()) return
    setSaving(true)
    if (isEdit) {
      await updateBox(box.id!, { name: name.trim(), color })
    } else {
      await addBox(name.trim(), color, locationId!)
    }
    onClose()
  }

  async function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); return }
    await deleteBox(box!.id!)
    onClose()
  }

  return (
    <Modal onClose={onClose} title={isEdit ? 'Edit Box' : 'New Box'}>
      <div className="px-4 pb-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">Box name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Garage Box 2"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-base outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
        </div>

        <div className="flex justify-center py-2">
          <IsometricBox color={color} size={80} />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Color</label>
          <div className="flex gap-2.5 flex-wrap">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-90"
                style={{ backgroundColor: c }}
                aria-label={c}
              >
                {color === c && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!name.trim() || saving}
          className="w-full bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl active:bg-blue-700 transition-colors"
        >
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Box'}
        </button>

        {isEdit && (
          <button
            onClick={handleDelete}
            className={`w-full py-3 rounded-xl font-medium transition-colors ${
              confirmDelete
                ? 'bg-red-600 text-white active:bg-red-700'
                : 'text-red-500 border border-red-200 active:bg-red-50'
            }`}
          >
            {confirmDelete ? 'Tap again to confirm delete' : 'Delete Box & All Items'}
          </button>
        )}
      </div>
    </Modal>
  )
}
