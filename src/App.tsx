import { useCallback, useMemo, useState } from 'react'
import { useLibrary } from './hooks/useLibrary'
import { exportLibrary, parseImportFile } from './lib/storage'
import { SHELVES, shelfLabel, type Shelf } from './types'
import { Header } from './components/Header'
import { Stats } from './components/Stats'
import { BookCard, DRAG_MIME } from './components/BookCard'
import { AddBookModal } from './components/AddBookModal'
import { BookDetailModal } from './components/BookDetailModal'
import { Blossom, Divider } from './components/Botanicals'

type View = Shelf | 'all'
type SortKey = 'added' | 'title' | 'author' | 'rating'

export default function App() {
  const library = useLibrary()
  const { books, addBook, moveBook, importBooks } = library

  const [view, setView] = useState<View>('reading')
  const [filter, setFilter] = useState('')
  const [sort, setSort] = useState<SortKey>('added')
  const [adding, setAdding] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<View | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const notify = useCallback((msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 3000)
  }, [])

  const counts = useMemo(() => {
    const c: Record<View, number> = { all: books.length, want: 0, reading: 0, read: 0 }
    books.forEach((b) => c[b.shelf]++)
    return c
  }, [books])

  const visible = useMemo(() => {
    const q = filter.trim().toLowerCase()
    const list = books.filter(
      (b) =>
        (view === 'all' || b.shelf === view) &&
        (!q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)),
    )
    const sorters: Record<SortKey, (a: (typeof list)[number], b: (typeof list)[number]) => number> = {
      added: (a, b) => b.addedAt.localeCompare(a.addedAt),
      title: (a, b) => a.title.localeCompare(b.title),
      author: (a, b) => a.author.localeCompare(b.author),
      rating: (a, b) => b.rating - a.rating,
    }
    return [...list].sort(sorters[sort])
  }, [books, view, filter, sort])

  const openBook = books.find((b) => b.id === openId)

  const handleMove = (id: string, shelf: Shelf) => {
    moveBook(id, shelf)
    const book = books.find((b) => b.id === id)
    if (book && book.shelf !== shelf) notify(`Moved "${book.title}" to ${shelfLabel(shelf)}`)
  }

  const handleImport = async (file: File) => {
    try {
      const imported = await parseImportFile(file)
      importBooks(imported)
      notify(`Welcomed ${imported.length} books into your garden`)
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not read that file.')
    }
  }

  const tabs: { id: View; label: string }[] = [...SHELVES.map((s) => ({ id: s.id, label: s.label })), { id: 'all', label: 'All Books' }]
  const blurb = SHELVES.find((s) => s.id === view)?.blurb ?? 'Your whole garden'

  return (
    <div className="min-h-screen pb-20">
      <Header onAdd={() => setAdding(true)} onExport={() => exportLibrary(books)} onImport={handleImport} />

      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        <Stats books={books} />

        <nav aria-label="Shelves" className="mt-8 flex flex-wrap justify-center gap-2">
          {tabs.map((t) => {
            const active = view === t.id
            const droppable = t.id !== 'all'
            return (
              <button
                key={t.id}
                type="button"
                aria-current={active ? 'page' : undefined}
                onClick={() => setView(t.id)}
                onDragOver={(e) => {
                  if (!droppable || !e.dataTransfer.types.includes(DRAG_MIME)) return
                  e.preventDefault()
                  setDropTarget(t.id)
                }}
                onDragLeave={() => setDropTarget(null)}
                onDrop={(e) => {
                  e.preventDefault()
                  setDropTarget(null)
                  const id = e.dataTransfer.getData(DRAG_MIME)
                  if (id && t.id !== 'all') handleMove(id, t.id)
                }}
                className={`flex items-center gap-2 rounded-full border px-5 py-2 text-sm transition ${
                  active
                    ? 'border-moss bg-moss text-linen shadow'
                    : 'border-wheat bg-linen/60 text-bark/80 hover:border-sage hover:text-bark'
                } ${dropTarget === t.id ? 'scale-105 ring-4 ring-lavender' : ''}`}
              >
                {t.label}
                <span className={`rounded-full px-2 py-0.5 text-xs ${active ? 'bg-linen/20' : 'bg-sand'}`}>{counts[t.id]}</span>
              </button>
            )
          })}
        </nav>
        <p className="mt-2 text-center text-xs italic text-bark/50">Tip: drag a book onto a shelf to move it.</p>

        <Divider className="mx-auto mt-6 max-w-md" />
        <h2 className="mt-3 text-center text-2xl italic text-plum">{blurb}</h2>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="sm:w-80">
            <span className="sr-only">Filter books</span>
            <input className="input" placeholder="Filter by title or author" value={filter} onChange={(e) => setFilter(e.target.value)} />
          </label>
          <label className="flex items-center gap-2 text-sm text-bark/70">
            Sort by
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-full border border-wheat bg-linen/80 px-3 py-2 text-sm focus:border-sage focus:outline-none"
            >
              <option value="added">Recently added</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="rating">Rating</option>
            </select>
          </label>
        </div>

        {visible.length > 0 ? (
          <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
            {visible.map((b) => (
              <li key={b.id}>
                <BookCard book={b} onOpen={() => setOpenId(b.id)} onMove={(s) => handleMove(b.id, s)} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="card mx-auto mt-8 max-w-md px-6 py-12 text-center">
            <Blossom size={44} className="mx-auto text-rose" />
            <p className="mt-3 font-display text-2xl text-forest">
              {filter ? 'No books match that filter' : 'This bed is still fallow'}
            </p>
            <p className="mt-1 text-sm italic text-bark/60">
              {filter ? 'Try a different word.' : 'Plant a book and watch your library grow.'}
            </p>
            {!filter && (
              <button type="button" className="btn-accent mt-5" onClick={() => setAdding(true)}>
                + Plant a book
              </button>
            )}
          </div>
        )}
      </main>

      <footer className="mt-16 text-center text-xs italic text-bark/40">
        Your library lives in this browser. Export a backup now and then to keep it safe.
        <br />
        Book data and covers from{' '}
        <a href="https://openlibrary.org" target="_blank" rel="noreferrer" className="underline hover:text-plum">
          Open Library
        </a>
        .
      </footer>

      {adding && (
        <AddBookModal
          defaultShelf={view === 'all' ? 'want' : view}
          existing={books}
          onClose={() => setAdding(false)}
          onAdd={(data, shelf) => {
            addBook(data, shelf)
            notify(`Planted "${data.title}" in ${shelfLabel(shelf)}`)
          }}
        />
      )}
      {openBook && <BookDetailModal book={openBook} library={library} onClose={() => setOpenId(null)} />}

      {toast && (
        <div
          role="status"
          className="animate-fade-up fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-forest px-5 py-2.5 text-sm text-linen shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  )
}
