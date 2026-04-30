import Dexie, { type Table } from 'dexie'
import type { Box, Item } from '../types'

class InventoryDB extends Dexie {
  boxes!: Table<Box, number>
  items!: Table<Item, number>

  constructor() {
    super('HomeInventory')
    this.version(1).stores({
      boxes: '++id, name, createdAt',
      items: '++id, boxId, name, updatedAt',
    })
  }
}

export const db = new InventoryDB()
