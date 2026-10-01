import { useCallback, useEffect, useState } from 'react'
import type { Book, NewBook, Shelf } from '../types'
import { loadBooks, saveBooks } from '../lib/storage'
import { makeId } from '../lib/id'

const now = () => new Date().toISOString()

/** Applies date bookkeeping when a book changes shelves. */
function withShelf(book: Book, shelf: Shelf): Book {
  const next: Book = { ...book, shelf }
  if (shelf === 'reading' && !next.startedAt) next.startedAt = now()
  if (shelf === 'read' && !next.finishedAt) next.finishedAt = now()
  if (shelf === 'want') {
    next.startedAt = undefined
    next.finishedAt = undefined
  }
  return next
}

export function useLibrary() {
  const [books, setBooks] = useState<Book[]>(loadBooks)

  useEffect(() => {
    saveBooks(books)
  }, [books])

  const update = useCallback((id: string, fn: (b: Book) => Book) => {
    setBooks((prev) => prev.map((b) => (b.id === id ? fn(b) : b)))
  }, [])

  const addBook = useCallback((data: NewBook, shelf: Shelf) => {
    const base: Book = { ...data, id: makeId(), shelf: 'want', rating: 0, comments: [], addedAt: now() }
    const book = withShelf(base, shelf)
    setBooks((prev) => [book, ...prev])
    return book
  }, [])

  const moveBook = useCallback((id: string, shelf: Shelf) => update(id, (b) => withShelf(b, shelf)), [update])

  const rateBook = useCallback((id: string, rating: number) => update(id, (b) => ({ ...b, rating })), [update])

  const setDates = useCallback(
    (id: string, dates: Pick<Book, 'startedAt' | 'finishedAt'>) => update(id, (b) => ({ ...b, ...dates })),
    [update],
  )

  const addComment = useCallback(
    (id: string, text: string) =>
      update(id, (b) => ({ ...b, comments: [...b.comments, { id: makeId(), text, createdAt: now() }] })),
    [update],
  )

  const editComment = useCallback(
    (id: string, commentId: string, text: string) =>
      update(id, (b) => ({ ...b, comments: b.comments.map((c) => (c.id === commentId ? { ...c, text } : c)) })),
    [update],
  )

  const deleteComment = useCallback(
    (id: string, commentId: string) =>
      update(id, (b) => ({ ...b, comments: b.comments.filter((c) => c.id !== commentId) })),
    [update],
  )

  const removeBook = useCallback((id: string) => setBooks((prev) => prev.filter((b) => b.id !== id)), [])

  /** Merge imported books: same id replaces, new ids are added. */
  const importBooks = useCallback((incoming: Book[]) => {
    setBooks((prev) => {
      const map = new Map(prev.map((b) => [b.id, b]))
      incoming.forEach((b) => map.set(b.id, b))
      return [...map.values()]
    })
  }, [])

  return {
    books,
    addBook,
    moveBook,
    rateBook,
    setDates,
    addComment,
    editComment,
    deleteComment,
    removeBook,
    importBooks,
  }
}

export type Library = ReturnType<typeof useLibrary>
