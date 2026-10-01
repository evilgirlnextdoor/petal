import { useState } from 'react'
import { Blossom } from './Botanicals'

interface Props {
  value: number
  onChange?: (value: number) => void
  size?: number
}

const LABELS = ['Unrated', 'A wilted petal', 'A modest sprout', 'A fair bloom', 'A lush garden', 'Pure magic']

export function FlowerRating({ value, onChange, size = 22 }: Props) {
  const [hover, setHover] = useState(0)
  const shown = hover || value
  const readOnly = !onChange

  if (readOnly) {
    return (
      <div className="flex items-center gap-0.5 text-terracotta" aria-label={`Rated ${value} of 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Blossom key={n} size={size} filled={n <= value} />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <div
        role="radiogroup"
        aria-label="Rating"
        className="flex items-center gap-1 text-terracotta"
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} of 5: ${LABELS[n]}`}
            className="rounded-full p-0.5 transition hover:scale-110"
            onMouseEnter={() => setHover(n)}
            onClick={() => onChange(value === n ? 0 : n)}
          >
            <Blossom size={size} filled={n <= shown} />
          </button>
        ))}
      </div>
      <span className="text-xs italic text-bark/60">{LABELS[shown]}</span>
    </div>
  )
}
