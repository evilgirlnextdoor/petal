import { useState, type FormEvent } from 'react'
import { Modal } from './Modal'
import { BookCover } from './BookCover'
import { FlowerRating } from './FlowerRating'
import { ShelfPicker } from './ShelfPicker'
import { Divider, Leaf } from './Botanicals'
import type { Book } from '../types'
import type { Library } from '../hooks/useLibrary'

interface Props {
  book: Book
  library: Library
  onClose: () => void
}

const toDateInput = (iso?: string) => (iso ? iso.slice(0, 10) : '')
const fromDateInput = (v: string) => (v ? new Date(`${v}T12:00:00`).toISOString() : undefined)
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })

export function BookDetailModal({ book, library, onClose }: Props) {
  const [draft, setDraft] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    library.addComment(book.id, text)
    setDraft('')
  }

  const saveEdit = () => {
    if (editingId && editText.trim()) library.editComment(book.id, editingId, editText.trim())
    setEditingId(null)
  }

  return (
    <Modal title={book.title} onClose={onClose} wide>
      <div className="grid gap-6 p-6 sm:grid-cols-[180px_1fr] sm:p-8">
        <div className="mx-auto w-40 sm:w-full">
          <BookCover title={book.title} author={book.author} coverUrl={book.coverUrl} />
        </div>

        <div className="min-w-0">
          <h2 className="pr-8 text-3xl leading-tight font-semibold text-forest sm:text-4xl">{book.title}</h2>
          <p className="mt-1 text-lg italic text-bark/70">{book.author}</p>
          <p className="mt-1 text-sm text-bark/50">
            {[book.year, book.pages && `${book.pages} pages`].filter(Boolean).join(' · ')}
          </p>
          {book.olKey && (
            <a
              href={`https://openlibrary.org${book.olKey}`}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block text-sm text-plum underline decoration-lavender underline-offset-4 hover:text-forest"
            >
              View on Open Library
            </a>
          )}

          <div className="mt-5 space-y-4">
            <div>
              <p className="mb-2 text-xs tracking-[0.2em] text-bark/50 uppercase">Shelf</p>
              <ShelfPicker value={book.shelf} onChange={(s) => library.moveBook(book.id, s)} />
            </div>
            <div>
              <p className="mb-2 text-xs tracking-[0.2em] text-bark/50 uppercase">Your rating</p>
              <FlowerRating value={book.rating} onChange={(r) => library.rateBook(book.id, r)} size={30} />
            </div>
            {book.shelf !== 'want' && (
              <div className="flex flex-wrap gap-4">
                <label className="text-sm">
                  <span className="mb-1 block text-xs tracking-[0.2em] text-bark/50 uppercase">Started</span>
                  <input
                    type="date"
                    className="input py-1.5"
                    value={toDateInput(book.startedAt)}
                    onChange={(e) =>
                      library.setDates(book.id, { startedAt: fromDateInput(e.target.value), finishedAt: book.finishedAt })
                    }
                  />
                </label>
                {book.shelf === 'read' && (
                  <label className="text-sm">
                    <span className="mb-1 block text-xs tracking-[0.2em] text-bark/50 uppercase">Finished</span>
                    <input
                      type="date"
                      className="input py-1.5"
                      value={toDateInput(book.finishedAt)}
                      onChange={(e) =>
                        library.setDates(book.id, { startedAt: book.startedAt, finishedAt: fromDateInput(e.target.value) })
                      }
                    />
                  </label>
                )}
              </div>
            )}
          </div>
        </div>

        <section className="sm:col-span-2" aria-labelledby="reflections-heading">
          <Divider className="mb-4" />
          <h3 id="reflections-heading" className="flex items-center gap-2 text-2xl font-semibold text-forest">
            <Leaf size={18} className="text-sage" /> Reflections
            <span className="text-base font-normal text-bark/50">({book.comments.length})</span>
          </h3>

          <form onSubmit={submit} className="mt-3">
            <label htmlFor="new-comment" className="sr-only">
              Add a reflection
            </label>
            <textarea
              id="new-comment"
              className="input min-h-24 resize-y"
              placeholder="What lingered with you? A favorite line, a feeling, a thought..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit(e)
              }}
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-bark/40">Cmd/Ctrl + Enter to save</span>
              <button type="submit" className="btn-primary" disabled={!draft.trim()}>
                Save reflection
              </button>
            </div>
          </form>

          {book.comments.length > 0 && (
            <ol className="mt-5 space-y-3">
              {[...book.comments].reverse().map((c) => (
                <li key={c.id} className="rounded-2xl border-l-4 border-rose bg-parchment/70 px-4 py-3">
                  {editingId === c.id ? (
                    <div>
                      <textarea className="input min-h-20" value={editText} onChange={(e) => setEditText(e.target.value)} autoFocus />
                      <div className="mt-2 flex justify-end gap-2">
                        <button type="button" className="btn-ghost px-3 py-1 text-xs" onClick={() => setEditingId(null)}>
                          Cancel
                        </button>
                        <button type="button" className="btn-primary px-3 py-1 text-xs" onClick={saveEdit}>
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="whitespace-pre-wrap text-bark">{c.text}</p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-bark/50">
                        <time dateTime={c.createdAt}>{formatDate(c.createdAt)}</time>
                        <button
                          type="button"
                          className="hover:text-plum"
                          onClick={() => {
                            setEditingId(c.id)
                            setEditText(c.text)
                          }}
                        >
                          Edit
                        </button>
                        <button type="button" className="hover:text-clay" onClick={() => library.deleteComment(book.id, c.id)}>
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ol>
          )}

          <div className="mt-8 flex justify-end">
            {confirmDelete ? (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-clay">Release this book from your library?</span>
                <button type="button" className="btn-ghost px-3 py-1 text-xs" onClick={() => setConfirmDelete(false)}>
                  Keep
                </button>
                <button
                  type="button"
                  className="btn bg-clay px-3 py-1 text-xs text-linen hover:bg-bark"
                  onClick={() => {
                    library.removeBook(book.id)
                    onClose()
                  }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <button type="button" className="text-sm text-bark/50 hover:text-clay" onClick={() => setConfirmDelete(true)}>
                Remove from library
              </button>
            )}
          </div>
        </section>
      </div>
    </Modal>
  )
}
