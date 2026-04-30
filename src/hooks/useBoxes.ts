import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import type { Box } from '../types'

export function useBoxes() {
  const boxes = useLiveQuery(() => db.boxes.orderBy('createdAt').toArray(), [])
  return boxes ?? []
}

export async function addBox(name: string, color: string): Promise<number> {
  return db.boxes.add({ name, color, createdAt: Date.now() })
}

export async function updateBox(id: number, changes: Partial<Box>): Promise<void> {
  await db.boxes.update(id, changes)
}

export async function deleteBox(id: number): Promise<void> {
  await db.transaction('rw', db.boxes, db.items, async () => {
    await db.items.where('boxId').equals(id).delete()
    await db.boxes.delete(id)
  })
}
