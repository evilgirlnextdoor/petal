import { BookCover } from './BookCover'
import { FlowerRating } from './FlowerRating'
import { Leaf } from './Botanicals'
import { SHELVES, type Book, type Shelf } from '../types'

interface Props {
  book: Book
  onOpen: () => void
  onMove: (shelf: Shelf) => void
}

export const DRAG_MIME = 'application/x-petal-book'

export function BookCard({ book, onOpen, onMove }: Props) {
  return (
    <article
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(DRAG_MIME, book.id)
        e.dataTransfer.effectAllowed = 'move'
      }}
      className="group card animate-fade-up flex flex-col p-3 transition hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgb(91_58_94_/_0.35)]"
    >
      <button type="button" onClick={onOpen} className="text-left" aria-label={`Open ${book.title}`}>
        <BookCover title={book.title} author={book.author} coverUrl={book.coverUrl} />
      </button>
      <div className="mt-3 flex flex-1 flex-col px-1">
        <button type="button" onClick={onOpen} className="text-left">
          <h3 className="line-clamp-2 text-lg leading-tight font-semibold text-forest group-hover:text-plum">{book.title}</h3>
        </button>
        <p className="mt-0.5 truncate text-sm italic text-bark/65">{book.author}</p>
        <div className="mt-2 flex items-center justify-between gap-2">
          {book.shelf === 'read' || book.rating > 0 ? <FlowerRating value={book.rating} size={15} /> : <span />}
          {book.comments.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-sage" title={`${book.comments.length} reflections`}>
              <Leaf size={12} /> {book.comments.length}
            </span>
          )}
        </div>
        <label className="mt-3">
          <span className="sr-only">Move {book.title} to shelf</span>
          <select
            value={book.shelf}
            onChange={(e) => onMove(e.target.value as Shelf)}
            className="w-full cursor-pointer rounded-full border border-wheat bg-parchment/80 px-3 py-1.5 text-xs text-bark/80 hover:border-sage focus:border-sage focus:outline-none"
          >
            {SHELVES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </article>
  )
}
