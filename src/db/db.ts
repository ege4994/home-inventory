import Dexie, { type Table } from 'dexie'
import type { Box, Item, Location } from '../types'

class InventoryDB extends Dexie {
  boxes!: Table<Box, number>
  items!: Table<Item, number>
  locations!: Table<Location, number>

  constructor() {
    super('HomeInventory')

    // v1 stays intact — Dexie requires prior versions to remain
    this.version(1).stores({
      boxes: '++id, name, createdAt',
      items: '++id, boxId, name, updatedAt',
    })

    this.version(2)
      .stores({
        locations: '++id, name, createdAt',
        boxes: '++id, locationId, name, createdAt',
        items: '++id, boxId, name, updatedAt',
      })
      .upgrade(async (tx) => {
        const locationId = await tx.table('locations').add({
          name: 'Home',
          icon: '🏠',
          createdAt: Date.now(),
        })
        await tx.table('boxes').toCollection().modify({ locationId })
      })
  }
}

export const db = new InventoryDB()
