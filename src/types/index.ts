export interface Box {
  id?: number
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
}

export type ModalState =
  | null
  | { type: 'addBox' }
  | { type: 'editBox'; box: Box }
  | { type: 'boxDetail'; box: Box }
  | { type: 'addItem'; boxId: number }
  | { type: 'editItem'; item: Item }
