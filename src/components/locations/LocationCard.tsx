import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/db'
import type { Location } from '../../types'

interface LocationCardProps {
  location: Location
  onClick: () => void
  onEdit: () => void
}

export function LocationCard({ location, onClick, onEdit }: LocationCardProps) {
  const boxCount = useLiveQuery(
    () => db.boxes.where('locationId').equals(location.id!).count(),
    [location.id]
  ) ?? 0

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-2xl shadow-sm border border-gray-100 p-4 active:scale-95 transition-transform"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center bg-gray-50 text-2xl">
            {location.icon}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{location.name}</p>
            <p className="text-sm text-gray-400">{boxCount} {boxCount === 1 ? 'box' : 'boxes'}</p>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onEdit() }}
          className="p-1.5 text-gray-300 hover:text-gray-500 rounded-lg flex-shrink-0"
          aria-label="Edit location"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      </div>
    </button>
  )
}
