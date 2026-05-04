import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import type { Location } from '../types'

export function useLocations(): Location[] {
  const locations = useLiveQuery(() => db.locations.orderBy('createdAt').toArray(), [])
  return locations ?? []
}

export async function addLocation(name: string, icon: string): Promise<number> {
  return db.locations.add({ name, icon, createdAt: Date.now() })
}

export async function updateLocation(id: number, changes: Partial<Location>): Promise<void> {
  await db.locations.update(id, changes)
}

export async function deleteLocation(id: number): Promise<void> {
  await db.transaction('rw', db.locations, db.boxes, db.items, async () => {
    const boxes = await db.boxes.where('locationId').equals(id).toArray()
    for (const box of boxes) {
      if (box.id != null) {
        await db.items.where('boxId').equals(box.id).delete()
      }
    }
    await db.boxes.where('locationId').equals(id).delete()
    await db.locations.delete(id)
  })
}
