import type { Box } from '../../types'
import { IsometricBox } from '../shared/IsometricBox'

interface BoxCardProps {
  box: Box
  itemCount: number
  onClick: () => void
  onEdit: () => void
}

export function BoxCard({ box, itemCount, onClick, onEdit }: BoxCardProps) {
  return (
    <div
      onClick={onClick}
      className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-3 pt-4 flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform hover:-translate-y-0.5 hover:shadow-md"
    >
      <button
        onClick={(e) => { e.stopPropagation(); onEdit() }}
        className="absolute top-1.5 right-1.5 p-1 text-gray-300 hover:text-gray-500 hover:bg-gray-50 rounded-md"
        aria-label="Edit box"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>
      <IsometricBox color={box.color} size={52} />
      <p className="text-xs font-semibold text-gray-900 text-center leading-tight break-words w-full">{box.name}</p>
      <p className="text-xs text-gray-400 -mt-1">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
    </div>
  )
}
