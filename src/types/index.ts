export interface Location {
  id?: number
  name: string
  icon: string
  createdAt: number
}

export interface Box {
  id?: number
  locationId: number
  name: string
  color: string
  createdAt: number
}

export interface Item {
  id?: number
  boxId: number
  name: string
  description?: string
  photoBase64?: string
  createdAt: number
  updatedAt: number
}

export interface SearchResult {
  item: Item
  box: Box
  location: Location
}

export type AppView =
  | { screen: 'locations' }
  | { screen: 'boxes'; location: Location }

export type ModalState =
  | null
  | { type: 'addLocation' }
  | { type: 'editLocation'; location: Location }
  | { type: 'addBox'; locationId: number }
  | { type: 'editBox'; box: Box }
  | { type: 'boxDetail'; box: Box }
  | { type: 'addItem'; boxId: number }
  | { type: 'editItem'; item: Item }
  | { type: 'quickAdd'; boxId: number; box: Box }
