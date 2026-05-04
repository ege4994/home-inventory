import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import type { SearchResult } from '../types'

export function useSearch(query: string): SearchResult[] {
  const allItems = useLiveQuery(() => db.items.toArray(), [])
  const allBoxes = useLiveQuery(() => db.boxes.toArray(), [])
  const allLocations = useLiveQuery(() => db.locations.toArray(), [])

  return useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q || !allItems || !allBoxes || !allLocations) return []

    const boxMap = new Map(allBoxes.map((b) => [b.id, b]))
    const locationMap = new Map(allLocations.map((l) => [l.id, l]))

    return allItems
      .filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q)
      )
      .map((i) => {
        const box = boxMap.get(i.boxId)
        if (!box) return null
        const location = locationMap.get(box.locationId)
        if (!location) return null
        return { item: i, box, location }
      })
      .filter((r): r is SearchResult => r !== null)
      .slice(0, 50)
  }, [query, allItems, allBoxes, allLocations])
}
