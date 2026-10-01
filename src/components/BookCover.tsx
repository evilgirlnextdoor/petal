import { useState } from 'react'
import { Blossom } from './Botanicals'

const PALETTES = [
  ['#4f5d3a', '#8a9a73'],
  ['#5b3a5e', '#b9a3c9'],
  ['#9c4a2f', '#d99a8b'],
  ['#2f3a2a', '#c9a14a'],
  ['#4a3628', '#d8c3a0'],
]

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)

interface Props {
  title: string
  author: string
  coverUrl?: string
  className?: string
}

export function BookCover({ title, author, coverUrl, className = '' }: Props) {
  const [failed, setFailed] = useState(false)

  if (coverUrl && !failed) {
    return (
      <img
        src={coverUrl}
        alt={`Cover of ${title}`}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`aspect-[2/3] w-full rounded-xl object-cover shadow-md ${className}`}
      />
    )
  }

  const [deep, light] = PALETTES[hash(title) % PALETTES.length]
  return (
    <div
      className={`relative flex aspect-[2/3] w-full flex-col items-center justify-center overflow-hidden rounded-xl p-3 text-center shadow-md ${className}`}
      style={{ background: `linear-gradient(160deg, ${deep}, ${light})` }}
      role="img"
      aria-label={`Cover of ${title}`}
    >
      <Blossom size={28} className="mb-2 text-linen/80" />
      <span className="line-clamp-4 font-display text-lg leading-tight font-semibold text-linen">{title}</span>
      <span className="mt-1 line-clamp-2 text-[0.7rem] italic text-linen/80">{author}</span>
      <span className="absolute inset-2 rounded-lg border border-linen/30" />
    </div>
  )
}
