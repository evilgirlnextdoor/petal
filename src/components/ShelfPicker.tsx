import { SHELVES, type Shelf } from '../types'

interface Props {
  value: Shelf
  onChange: (shelf: Shelf) => void
  size?: 'sm' | 'md'
}

/** Segmented control for choosing or moving a book between shelves. */
export function ShelfPicker({ value, onChange, size = 'md' }: Props) {
  return (
    <div role="radiogroup" aria-label="Shelf" className="inline-flex flex-wrap gap-1 rounded-full bg-sand/70 p-1">
      {SHELVES.map((s) => {
        const active = s.id === value
        return (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(s.id)}
            className={`rounded-full transition ${size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm'} ${
              active ? 'bg-moss text-linen shadow-sm' : 'text-bark/70 hover:bg-linen/70 hover:text-bark'
            }`}
          >
            {s.label}
          </button>
        )
      })}
    </div>
  )
}
