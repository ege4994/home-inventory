import { useState } from 'react'
import { Modal } from '../shared/Modal'
import { addLocation, updateLocation, deleteLocation } from '../../hooks/useLocations'
import type { Location } from '../../types'

const ICONS = ['🏠', '🏪', '🏭', '🏢', '🏡', '🚗', '📦', '🏬', '🏗️', '🏕️']

interface LocationModalProps {
  location?: Location
  onClose: () => void
}

export function LocationModal({ location, onClose }: LocationModalProps) {
  const [name, setName] = useState(location?.name ?? '')
  const [icon, setIcon] = useState(location?.icon ?? ICONS[0])
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const isEdit = location != null

  async function handleSave() {
    if (!name.trim()) return
    setSaving(true)
    if (isEdit) {
      await updateLocation(location.id!, { name: name.trim(), icon })
    } else {
      await addLocation(name.trim(), icon)
    }
    onClose()
  }

  async function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); return }
    await deleteLocation(location!.id!)
    onClose()
  }

  return (
    <Modal onClose={onClose} title={isEdit ? 'Edit Location' : 'New Location'}>
      <div className="px-4 pb-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Garage, Shop, Storage"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-base outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Icon</label>
          <div className="flex gap-2 flex-wrap">
            {ICONS.map((ic) => (
              <button
                key={ic}
                onClick={() => setIcon(ic)}
                className={`w-11 h-11 rounded-xl text-2xl flex items-center justify-center transition-all active:scale-90 ${
                  icon === ic
                    ? 'bg-blue-50 ring-2 ring-blue-500'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!name.trim() || saving}
          className="w-full bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl active:bg-blue-700 transition-colors"
        >
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Location'}
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
            {confirmDelete ? 'Tap again to confirm delete' : 'Delete Location & All Boxes'}
          </button>
        )}
      </div>
    </Modal>
  )
}
