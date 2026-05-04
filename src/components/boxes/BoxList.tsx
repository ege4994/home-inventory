import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/db'
import { BoxCard } from './BoxCard'
import { EmptyState } from '../shared/EmptyState'
import { IsometricBox } from '../shared/IsometricBox'
import type { Box } from '../../types'

interface BoxListProps {
  boxes: Box[]
  onOpenBox: (box: Box) => void
  onEditBox: (box: Box) => void
  onAddBox: () => void
}

export function BoxList({ boxes, onOpenBox, onEditBox, onAddBox }: BoxListProps) {
  const itemCounts = useLiveQuery(async () => {
    const counts: Record<number, number> = {}
    for (const box of boxes) {
      if (box.id != null) {
        counts[box.id] = await db.items.where('boxId').equals(box.id).count()
      }
    }
    return counts
  }, [boxes])

  if (boxes.length === 0) {
    return (
      <EmptyState
        icon={<IsometricBox color="#94a3b8" size={72} />}
        title="No boxes yet"
        description="Add your first box to start tracking items"
        action={
          <button
            onClick={onAddBox}
            className="bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl active:bg-blue-700"
          >
            Add a Box
          </button>
        }
      />
    )
  }

  return (
    <div className="p-4 grid grid-cols-1 gap-3">
      {boxes.map((box) => (
        <BoxCard
          key={box.id}
          box={box}
          itemCount={itemCounts?.[box.id!] ?? 0}
          onClick={() => onOpenBox(box)}
          onEdit={() => onEditBox(box)}
        />
      ))}
    </div>
  )
}
