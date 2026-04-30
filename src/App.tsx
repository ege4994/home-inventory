import { useState } from 'react'
import { AppShell } from './components/layout/AppShell'
import { BoxList } from './components/boxes/BoxList'
import { BoxModal } from './components/boxes/BoxModal'
import { BoxDetailModal } from './components/boxes/BoxDetailModal'
import { ItemModal } from './components/items/ItemModal'
import { ItemCard } from './components/items/ItemCard'
import { EmptyState } from './components/shared/EmptyState'
import { useBoxes } from './hooks/useBoxes'
import { useSearch } from './hooks/useSearch'
import type { Box, Item, ModalState } from './types'

function SearchIcon() {
  return (
    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
    </svg>
  )
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [modal, setModal] = useState<ModalState>(null)

  const boxes = useBoxes()
  const searchResults = useSearch(searchQuery)

  function closeModal() {
    setModal(null)
  }

  function openBoxDetail(box: Box) {
    setModal({ type: 'boxDetail', box })
  }

  function openEditBox(box: Box) {
    setModal({ type: 'editBox', box })
  }

  function openAddBox() {
    setModal({ type: 'addBox' })
  }

  function openAddItem(boxId: number) {
    setModal({ type: 'addItem', boxId })
  }

  function openEditItem(item: Item) {
    setModal({ type: 'editItem', item })
  }

  const isSearching = searchQuery.trim().length > 0

  return (
    <>
      <AppShell
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddBox={openAddBox}
      >
        {isSearching ? (
          <div>
            {searchResults.length === 0 ? (
              <EmptyState
                icon={<SearchIcon />}
                title={`No results for "${searchQuery}"`}
                description="Try a different word"
              />
            ) : (
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide px-4 pt-4 pb-2">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </p>
                <div className="divide-y divide-gray-50">
                  {searchResults.map(({ item, box }) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      box={box}
                      onClick={() => openBoxDetail(box)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <BoxList
            boxes={boxes}
            onOpenBox={openBoxDetail}
            onEditBox={openEditBox}
            onAddBox={openAddBox}
          />
        )}
      </AppShell>

      {modal?.type === 'addBox' && (
        <BoxModal onClose={closeModal} />
      )}

      {modal?.type === 'editBox' && (
        <BoxModal box={modal.box} onClose={closeModal} />
      )}

      {modal?.type === 'boxDetail' && (
        <BoxDetailModal
          box={modal.box}
          onClose={closeModal}
          onAddItem={() => openAddItem(modal.box.id!)}
          onEditItem={openEditItem}
        />
      )}

      {modal?.type === 'addItem' && (
        <ItemModal
          boxId={modal.boxId}
          onClose={closeModal}
        />
      )}

      {modal?.type === 'editItem' && (
        <ItemModal
          boxId={modal.item.boxId}
          item={modal.item}
          onClose={closeModal}
        />
      )}
    </>
  )
}
