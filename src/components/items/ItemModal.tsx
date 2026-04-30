import { useState, useRef } from 'react'
import { Modal } from '../shared/Modal'
import { addItem, updateItem, deleteItem } from '../../hooks/useItems'
import { compressPhoto } from '../../utils/photo'
import { useBoxes } from '../../hooks/useBoxes'
import type { Item } from '../../types'

interface ItemModalProps {
  boxId: number
  item?: Item
  onClose: () => void
}

export function ItemModal({ boxId, item, onClose }: ItemModalProps) {
  const [name, setName] = useState(item?.name ?? '')
  const [description, setDescription] = useState(item?.description ?? '')
  const [photo, setPhoto] = useState<string | undefined>(item?.photoBase64)
  const [selectedBoxId, setSelectedBoxId] = useState(item?.boxId ?? boxId)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const allBoxes = useBoxes()
  const isEdit = item != null

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCompressing(true)
    try {
      const compressed = await compressPhoto(file)
      setPhoto(compressed)
    } finally {
      setCompressing(false)
    }
  }

  async function handleSave() {
    if (!name.trim()) return
    setSaving(true)
    const data = {
      boxId: selectedBoxId,
      name: name.trim(),
      description: description.trim() || undefined,
      photoBase64: photo,
    }
    if (isEdit) {
      await updateItem(item.id!, data)
    } else {
      await addItem(data)
    }
    onClose()
  }

  async function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); return }
    await deleteItem(item!.id!)
    onClose()
  }

  return (
    <Modal onClose={onClose} title={isEdit ? 'Edit Item' : 'New Item'}>
      <div className="px-4 pb-6 space-y-4">
        {/* Photo */}
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handlePhotoChange}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full h-36 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 overflow-hidden active:bg-gray-200 transition-colors"
          >
            {photo ? (
              <img src={photo} alt="Item photo" className="w-full h-full object-cover" />
            ) : compressing ? (
              <span className="text-sm text-gray-400">Compressing…</span>
            ) : (
              <>
                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm text-gray-400">Add photo (optional)</span>
              </>
            )}
          </button>
          {photo && (
            <button
              onClick={() => setPhoto(undefined)}
              className="mt-1.5 text-sm text-red-400 w-full text-center"
            >
              Remove photo
            </button>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">Item name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Tape, USB charger"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-base outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            autoFocus={!isEdit}
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Black, 2m cable"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-base outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Box selector */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">Box</label>
          <select
            value={selectedBoxId}
            onChange={(e) => setSelectedBoxId(Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-base outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white appearance-none"
          >
            {allBoxes.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSave}
          disabled={!name.trim() || saving || compressing}
          className="w-full bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl active:bg-blue-700 transition-colors"
        >
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Item'}
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
            {confirmDelete ? 'Tap again to confirm delete' : 'Remove Item'}
          </button>
        )}
      </div>
    </Modal>
  )
}
