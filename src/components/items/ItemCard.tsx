import type { Item, Box, Location } from '../../types'

interface ItemCardProps {
  item: Item
  box?: Box
  location?: Location
  onClick: () => void
}

export function ItemCard({ item, box, location, onClick }: ItemCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-center gap-3 px-4 py-3 active:bg-gray-50 transition-colors"
    >
      {item.photoBase64 ? (
        <img
          src={item.photoBase64}
          alt={item.name}
          className="w-12 h-12 rounded-xl object-cover flex-shrink-0 bg-gray-100"
        />
      ) : (
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{item.name}</p>
        {item.description && (
          <p className="text-sm text-gray-400 truncate">{item.description}</p>
        )}
        {box && (
          <span className="inline-flex items-center gap-1 mt-0.5">
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: box.color + '22', color: box.color }}
            >
              {box.name}
            </span>
            {location && (
              <span className="text-xs text-gray-400">
                {location.icon} {location.name}
              </span>
            )}
          </span>
        )}
      </div>

      <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  )
}
