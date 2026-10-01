import { useEffect, useState, type FormEvent } from 'react'
import { Modal } from './Modal'
import { BookCover } from './BookCover'
import { ShelfPicker } from './ShelfPicker'
import { Sparkle } from './Botanicals'
import { searchOpenLibrary } from '../lib/openLibrary'
import type { Book, NewBook, Shelf } from '../types'

interface Props {
  defaultShelf: Shelf
  existing: Book[]
  onAdd: (book: NewBook, shelf: Shelf) => void
  onClose: () => void
}

type Tab = 'search' | 'manual'
type Status = 'idle' | 'loading' | 'done' | 'error'

export function AddBookModal({ defaultShelf, existing, onAdd, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('search')
  const [shelf, setShelf] = useState<Shelf>(defaultShelf)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<NewBook[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const [added, setAdded] = useState<string[]>([])

  const [manual, setManual] = useState({ title: '', author: '', year: '', pages: '', coverUrl: '' })

  useEffect(() => {
    const q = query.trim()
    if (q.length < 3) return
    const ctrl = new AbortController()
    const t = window.setTimeout(() => {
      setStatus('loading')
      searchOpenLibrary(q, ctrl.signal)
        .then((r) => {
          setResults(r)
          setStatus('done')
        })
        .catch((err: unknown) => {
          if (err instanceof DOMException && err.name === 'AbortError') return
          setStatus('error')
        })
    }, 400)
    return () => {
      window.clearTimeout(t)
      ctrl.abort()
    }
  }, [query])

  const existingKeys = new Set(existing.map((b) => b.olKey).filter(Boolean))
  const tooShort = query.trim().length < 3

  const handleAdd = (book: NewBook) => {
    onAdd(book, shelf)
    if (book.olKey) setAdded((a) => [...a, book.olKey!])
  }

  const submitManual = (e: FormEvent) => {
    e.preventDefault()
    if (!manual.title.trim()) return
    onAdd(
      {
        title: manual.title.trim(),
        author: manual.author.trim() || 'Unknown author',
        year: manual.year ? Number(manual.year) : undefined,
        pages: manual.pages ? Number(manual.pages) : undefined,
        coverUrl: manual.coverUrl.trim() || undefined,
      },
      shelf,
    )
    onClose()
  }

  return (
    <Modal title="Plant a new book" onClose={onClose} wide>
      <div className="p-6 sm:p-8">
        <p className="flex items-center gap-2 text-xs tracking-[0.25em] text-plum/70 uppercase">
          <Sparkle size={12} /> Gather a new story
        </p>
        <h2 className="mt-1 text-3xl font-semibold text-forest">Plant a new book</h2>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex rounded-full border border-wheat p-1 text-sm">
            {(['search', 'manual'] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`rounded-full px-4 py-1.5 transition ${tab === t ? 'bg-plum text-linen' : 'text-bark/70 hover:text-bark'}`}
              >
                {t === 'search' ? 'Search Open Library' : 'Add by hand'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-bark/60">Add to</span>
            <ShelfPicker value={shelf} onChange={setShelf} size="sm" />
          </div>
        </div>

        {tab === 'search' ? (
          <div className="mt-6">
            <label htmlFor="ol-search" className="sr-only">
              Search by title or author
            </label>
            <input
              id="ol-search"
              className="input"
              placeholder="Search by title or author, e.g. Braiding Sweetgrass"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <div className="mt-4 min-h-40" aria-live="polite">
              {tooShort && <p className="py-10 text-center italic text-bark/50">Whisper at least three letters to begin.</p>}
              {!tooShort && status === 'loading' && (
                <p className="py-10 text-center italic text-bark/60">Consulting the stacks...</p>
              )}
              {!tooShort && status === 'error' && (
                <p className="py-10 text-center text-clay">
                  The library spirits are quiet right now. Try again, or add the book by hand.
                </p>
              )}
              {!tooShort && status === 'done' && results.length === 0 && (
                <p className="py-10 text-center italic text-bark/60">No books found. Try another phrasing.</p>
              )}
              {!tooShort && status !== 'loading' && results.length > 0 && (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {results.map((r) => {
                    const isAdded = !!r.olKey && (existingKeys.has(r.olKey) || added.includes(r.olKey))
                    return (
                      <li key={r.olKey ?? r.title} className="flex gap-3 rounded-2xl border border-wheat/70 bg-parchment/60 p-3">
                        <div className="w-14 shrink-0">
                          <BookCover title={r.title} author={r.author} coverUrl={r.coverUrl?.replace('-L.jpg', '-S.jpg')} />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <p className="line-clamp-2 font-display text-lg leading-tight font-semibold text-forest">{r.title}</p>
                          <p className="truncate text-sm text-bark/70">{r.author}</p>
                          {r.year && <p className="text-xs text-bark/50">{r.year}</p>}
                          <button
                            type="button"
                            disabled={isAdded}
                            onClick={() => handleAdd(r)}
                            className="btn-primary mt-auto self-start px-3 py-1 text-xs"
                          >
                            {isAdded ? 'On your shelves' : '+ Add'}
                          </button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        ) : (
          <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={submitManual}>
            <label className="sm:col-span-2">
              <span className="mb-1 block text-sm text-bark/70">Title *</span>
              <input className="input" required value={manual.title} onChange={(e) => setManual({ ...manual, title: e.target.value })} />
            </label>
            <label className="sm:col-span-2">
              <span className="mb-1 block text-sm text-bark/70">Author</span>
              <input className="input" value={manual.author} onChange={(e) => setManual({ ...manual, author: e.target.value })} />
            </label>
            <label>
              <span className="mb-1 block text-sm text-bark/70">Year</span>
              <input className="input" inputMode="numeric" value={manual.year} onChange={(e) => setManual({ ...manual, year: e.target.value.replace(/\D/g, '') })} />
            </label>
            <label>
              <span className="mb-1 block text-sm text-bark/70">Pages</span>
              <input className="input" inputMode="numeric" value={manual.pages} onChange={(e) => setManual({ ...manual, pages: e.target.value.replace(/\D/g, '') })} />
            </label>
            <label className="sm:col-span-2">
              <span className="mb-1 block text-sm text-bark/70">Cover image URL (optional)</span>
              <input className="input" type="url" value={manual.coverUrl} onChange={(e) => setManual({ ...manual, coverUrl: e.target.value })} />
            </label>
            <div className="flex justify-end gap-2 sm:col-span-2">
              <button type="button" className="btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-accent">
                Plant this book
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  )
}
