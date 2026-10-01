export type Shelf = 'want' | 'reading' | 'read'

export interface BookComment {
  id: string
  text: string
  createdAt: string
}

export interface Book {
  id: string
  title: string
  author: string
  coverUrl?: string
  year?: number
  pages?: number
  olKey?: string
  shelf: Shelf
  /** 0 means unrated, otherwise 1 to 5 */
  rating: number
  comments: BookComment[]
  addedAt: string
  startedAt?: string
  finishedAt?: string
}

export type NewBook = Pick<Book, 'title' | 'author' | 'coverUrl' | 'year' | 'pages' | 'olKey'>

export const SHELVES: { id: Shelf; label: string; blurb: string }[] = [
  { id: 'reading', label: 'Currently Reading', blurb: 'Stories in bloom' },
  { id: 'want', label: 'Want to Read', blurb: 'Seeds waiting to sprout' },
  { id: 'read', label: 'Read', blurb: 'The harvest' },
]

export const shelfLabel = (shelf: Shelf): string =>
  SHELVES.find((s) => s.id === shelf)?.label ?? shelf
