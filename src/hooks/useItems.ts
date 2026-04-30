import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import type { Item } from '../types'

export function useItemsByBox(boxId: number) {
  const items = useLiveQuery(
    () => db.items.where('boxId').equals(boxId).sortBy('name'),
    [boxId]
  )
  return items ?? []
}

export async function addItem(data: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
  const now = Date.now()
  return db.items.add({ ...data, createdAt: now, updatedAt: now })
}

export async function updateItem(id: number, changes: Partial<Item>): Promise<void> {
  await db.items.update(id, { ...changes, updatedAt: Date.now() })
}

export async function deleteItem(id: number): Promise<void> {
  await db.items.delete(id)
}
