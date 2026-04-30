import { Modal } from '../shared/Modal'
import { EmptyState } from '../shared/EmptyState'
import { ItemCard } from '../items/ItemCard'
import { useItemsByBox } from '../../hooks/useItems'
import type { Box, Item } from '../../types'

interface BoxDetailModalProps {
  box: Box
  onClose: () => void
  onAddItem: () => void
  onEditItem: (item: Item) => void
}

function ItemsIcon() {
  return (
    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  )
}

export function BoxDetailModal({ box, onClose, onAddItem, onEditItem }: BoxDetailModalProps) {
  const items = useItemsByBox(box.id!)

  return (
    <Modal onClose={onClose} title={box.name}>
      <div className="pb-24">
        {items.length === 0 ? (
          <EmptyState
            icon={<ItemsIcon />}
            title="No items yet"
            description="Add items to track what's in this box"
          />
        ) : (
          <div className="divide-y divide-gray-50">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} onClick={() => onEditItem(item)} />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-safe bg-gradient-to-t from-white via-white/90 to-transparent">
        <button
          onClick={onAddItem}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 active:bg-blue-700"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Item
        </button>
      </div>
    </Modal>
  )
}
