import { useState } from 'react'
import { AppShell } from './components/layout/AppShell'
import { BoxList } from './components/boxes/BoxList'
import { BoxModal } from './components/boxes/BoxModal'
import { BoxDetailModal } from './components/boxes/BoxDetailModal'
import { ItemModal } from './components/items/ItemModal'
import { ItemCard } from './components/items/ItemCard'
import { QuickAddModal } from './components/items/QuickAddModal'
import { EmptyState } from './components/shared/EmptyState'
import { LocationList } from './components/locations/LocationList'
import { LocationModal } from './components/locations/LocationModal'
import { useLocations } from './hooks/useLocations'
import { useBoxesByLocation } from './hooks/useBoxes'
import { useSearch } from './hooks/useSearch'
import type { Box, Item, Location, ModalState, AppView } from './types'

function SearchIcon() {
  return (
    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
    </svg>
  )
}

export default function App() {
  const [appView, setAppView] = useState<AppView>({ screen: 'locations' })
  const [searchQuery, setSearchQuery] = useState('')
  const [modal, setModal] = useState<ModalState>(null)

  const locations = useLocations()
  const searchResults = useSearch(searchQuery)

  const locationId = appView.screen === 'boxes' ? appView.location.id! : 0
  const boxes = useBoxesByLocation(locationId)

  // Keep the displayed location title in sync with live data
  const activeLocation: Location | null =
    appView.screen === 'boxes'
      ? (locations.find((l) => l.id === appView.location.id) ?? appView.location)
      : null

  function closeModal() { setModal(null) }

  function openLocation(location: Location) {
    setAppView({ screen: 'boxes', location })
    setSearchQuery('')
  }

  function goHome() {
    setModal(null)
    setAppView({ screen: 'locations' })
    setSearchQuery('')
  }

  function openAddBox() {
    if (appView.screen !== 'boxes') return
    setModal({ type: 'addBox', locationId: appView.location.id! })
  }

  function openBoxDetail(box: Box) { setModal({ type: 'boxDetail', box }) }
  function openEditBox(box: Box) { setModal({ type: 'editBox', box }) }
  function openAddItem(boxId: number) { setModal({ type: 'addItem', boxId }) }
  function openEditItem(item: Item) { setModal({ type: 'editItem', item }) }
  function openQuickAdd(box: Box) { setModal({ type: 'quickAdd', boxId: box.id!, box }) }
  function openAddLocation() { setModal({ type: 'addLocation' }) }
  function openEditLocation(location: Location) { setModal({ type: 'editLocation', location }) }

  const isOnBoxesScreen = appView.screen === 'boxes'
  const isSearching = searchQuery.trim().length > 0

  return (
    <>
      <AppShell
        title={activeLocation ? activeLocation.name : 'Stashly'}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAdd={isOnBoxesScreen ? openAddBox : openAddLocation}
        addLabel={isOnBoxesScreen ? 'Add Box' : 'Add Location'}
        onBack={isOnBoxesScreen ? goHome : undefined}
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
                  {searchResults.map(({ item, box, location }) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      box={box}
                      location={location}
                      onClick={() => openBoxDetail(box)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : appView.screen === 'locations' ? (
          <LocationList
            locations={locations}
            onOpenLocation={openLocation}
            onEditLocation={openEditLocation}
            onAddLocation={openAddLocation}
          />
        ) : (
          <BoxList
            boxes={boxes}
            onOpenBox={openBoxDetail}
            onEditBox={openEditBox}
            onAddBox={openAddBox}
          />
        )}
      </AppShell>

      {modal?.type === 'addLocation' && (
        <LocationModal onClose={closeModal} />
      )}

      {modal?.type === 'editLocation' && (
        <LocationModal location={modal.location} onClose={closeModal} />
      )}

      {modal?.type === 'addBox' && (
        <BoxModal locationId={modal.locationId} onClose={closeModal} />
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
          onQuickAdd={() => openQuickAdd(modal.box)}
        />
      )}

      {modal?.type === 'addItem' && (
        <ItemModal boxId={modal.boxId} onClose={closeModal} />
      )}

      {modal?.type === 'editItem' && (
        <ItemModal boxId={modal.item.boxId} item={modal.item} onClose={closeModal} />
      )}

      {modal?.type === 'quickAdd' && (
        <QuickAddModal boxId={modal.boxId} box={modal.box} onClose={closeModal} />
      )}
    </>
  )
}
