import type { Book, Shelf } from '../types'

const STORAGE_KEY = 'petal-and-page:library:v1'
const SHELF_IDS: Shelf[] = ['want', 'reading', 'read']

export interface LibraryExport {
  app: 'petal-and-page'
  version: 1
  exportedAt: string
  books: Book[]
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null

/** Validates and normalizes untrusted data (localStorage or an imported file). */
export function sanitizeBooks(raw: unknown): Book[] {
  if (!Array.isArray(raw)) return []
  return raw.filter(isRecord).flatMap((b): Book[] => {
    if (typeof b.id !== 'string' || typeof b.title !== 'string') return []
    const shelf = SHELF_IDS.includes(b.shelf as Shelf) ? (b.shelf as Shelf) : 'want'
    const rating = typeof b.rating === 'number' ? Math.min(5, Math.max(0, Math.round(b.rating))) : 0
    const comments = Array.isArray(b.comments)
      ? b.comments.filter(
          (c): c is Book['comments'][number] =>
            isRecord(c) && typeof c.id === 'string' && typeof c.text === 'string' && typeof c.createdAt === 'string',
        )
      : []
    return [
      {
        id: b.id,
        title: b.title,
        author: typeof b.author === 'string' ? b.author : 'Unknown author',
        coverUrl: typeof b.coverUrl === 'string' ? b.coverUrl : undefined,
        year: typeof b.year === 'number' ? b.year : undefined,
        pages: typeof b.pages === 'number' ? b.pages : undefined,
        olKey: typeof b.olKey === 'string' ? b.olKey : undefined,
        shelf,
        rating,
        comments,
        addedAt: typeof b.addedAt === 'string' ? b.addedAt : new Date().toISOString(),
        startedAt: typeof b.startedAt === 'string' ? b.startedAt : undefined,
        finishedAt: typeof b.finishedAt === 'string' ? b.finishedAt : undefined,
      },
    ]
  })
}

export function loadBooks(): Book[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? sanitizeBooks(JSON.parse(raw)) : []
  } catch {
    return []
  }
}

export function saveBooks(books: Book[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
  } catch {
    // Storage may be full or unavailable (private mode). Data stays in memory.
  }
}

export function exportLibrary(books: Book[]): void {
  const payload: LibraryExport = {
    app: 'petal-and-page',
    version: 1,
    exportedAt: new Date().toISOString(),
    books,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `petal-and-page-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export async function parseImportFile(file: File): Promise<Book[]> {
  const data: unknown = JSON.parse(await file.text())
  const list = isRecord(data) && Array.isArray(data.books) ? data.books : data
  const books = sanitizeBooks(list)
  if (books.length === 0) throw new Error('No books found in that file.')
  return books
}
