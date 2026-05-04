import { LocationCard } from './LocationCard'
import { EmptyState } from '../shared/EmptyState'
import type { Location } from '../../types'

interface LocationListProps {
  locations: Location[]
  onOpenLocation: (location: Location) => void
  onEditLocation: (location: Location) => void
  onAddLocation: () => void
}

function LocationIcon() {
  return (
    <span style={{ fontSize: 64, lineHeight: 1 }}>📦</span>
  )
}

export function LocationList({ locations, onOpenLocation, onEditLocation, onAddLocation }: LocationListProps) {
  if (locations.length === 0) {
    return (
      <EmptyState
        icon={<LocationIcon />}
        title="No locations yet"
        description="Add a location like Home, Shop, or Storage to start tracking"
        action={
          <button
            onClick={onAddLocation}
            className="bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl active:bg-blue-700"
          >
            Add a Location
          </button>
        }
      />
    )
  }

  return (
    <div className="p-4 grid grid-cols-1 gap-3">
      {locations.map((loc) => (
        <LocationCard
          key={loc.id}
          location={loc}
          onClick={() => onOpenLocation(loc)}
          onEdit={() => onEditLocation(loc)}
        />
      ))}
    </div>
  )
}
