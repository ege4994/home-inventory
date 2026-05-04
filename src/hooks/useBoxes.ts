import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import type { Box } from '../types'

export function useBoxes(): Box[] {
  const boxes = useLiveQuery(() => db.boxes.orderBy('createdAt').toArray(), [])
  return boxes ?? []
}

export function useBoxesByLocation(locationId: number): Box[] {
  const boxes = useLiveQuery(
    () => db.boxes.where('locationId').equals(locationId).sortBy('createdAt'),
    [locationId]
  )
  return boxes ?? []
}

export async function addBox(name: string, color: string, locationId: number): Promise<number> {
  return db.boxes.add({ name, color, locationId, createdAt: Date.now() })
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
