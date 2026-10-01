import type { Book } from '../types'
import { Blossom, Leaf, Moon } from './Botanicals'

export function Stats({ books }: { books: Book[] }) {
  const year = new Date().getFullYear()
  const read = books.filter((b) => b.shelf === 'read')
  const thisYear = read.filter((b) => b.finishedAt && new Date(b.finishedAt).getFullYear() === year).length
  const rated = read.filter((b) => b.rating > 0)
  const avg = rated.length ? (rated.reduce((s, b) => s + b.rating, 0) / rated.length).toFixed(1) : '·'
  const pages = read.reduce((s, b) => s + (b.pages ?? 0), 0)

  const items = [
    { label: `Read in ${year}`, value: thisYear, icon: <Moon size={18} className="text-plum" /> },
    { label: 'Books harvested', value: read.length, icon: <Leaf size={18} className="text-moss" /> },
    { label: 'Average bloom', value: avg, icon: <Blossom size={18} className="text-terracotta" /> },
    { label: 'Pages turned', value: pages.toLocaleString(), icon: <Leaf size={18} className="-scale-x-100 text-sage" /> },
  ]

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((i) => (
        <div key={i.label} className="card flex items-center gap-3 px-4 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-parchment">{i.icon}</span>
          <div>
            <dd className="font-display text-2xl leading-none font-semibold text-forest">{i.value}</dd>
            <dt className="mt-0.5 text-xs text-bark/60">{i.label}</dt>
          </div>
        </div>
      ))}
    </dl>
  )
}
