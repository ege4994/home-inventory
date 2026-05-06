import { db } from '../db/db'
import type { Location, Box, Item } from '../types'

interface BackupData {
  version: 1
  exportedAt: number
  locations: Location[]
  boxes: Box[]
  items: Item[]
}

export async function exportData(): Promise<void> {
  const [locations, boxes, items] = await Promise.all([
    db.locations.toArray(),
    db.boxes.toArray(),
    db.items.toArray(),
  ])

  const backup: BackupData = { version: 1, exportedAt: Date.now(), locations, boxes, items }

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const date = new Date().toISOString().split('T')[0]

  const a = document.createElement('a')
  a.href = url
  a.download = `stashly-backup-${date}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export async function importData(file: File): Promise<void> {
  const text = await file.text()
  const backup = JSON.parse(text) as BackupData

  if (
    backup.version !== 1 ||
    !Array.isArray(backup.locations) ||
    !Array.isArray(backup.boxes) ||
    !Array.isArray(backup.items)
  ) {
    throw new Error('Geçersiz yedek dosyası')
  }

  await db.transaction('rw', [db.locations, db.boxes, db.items], async () => {
    await db.items.clear()
    await db.boxes.clear()
    await db.locations.clear()
    await db.locations.bulkAdd(backup.locations)
    await db.boxes.bulkAdd(backup.boxes)
    await db.items.bulkAdd(backup.items)
  })
}
