import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import type { SearchResult } from '../types'

export function useSearch(query: string): SearchResult[] {
  const allItems = useLiveQuery(() => db.items.toArray(), [])
  const allBoxes = useLiveQuery(() => db.boxes.toArray(), [])

  return useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q || !allItems || !allBoxes) return []

    const boxMap = new Map(allBoxes.map((b) => [b.id, b]))

    return allItems
      .filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q)
      )
      .map((i) => ({ item: i, box: boxMap.get(i.boxId)! }))
      .filter((r) => r.box != null)
      .slice(0, 50)
  }, [query, allItems, allBoxes])
}
