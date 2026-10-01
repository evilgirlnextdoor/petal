import type { NewBook } from '../types'

interface OLDoc {
  key: string
  title: string
  author_name?: string[]
  first_publish_year?: number
  cover_i?: number
  number_of_pages_median?: number
}

export const coverFromId = (id: number, size: 'S' | 'M' | 'L' = 'M'): string =>
  `https://covers.openlibrary.org/b/id/${id}-${size}.jpg`

export async function searchOpenLibrary(query: string, signal?: AbortSignal): Promise<NewBook[]> {
  const params = new URLSearchParams({
    q: query,
    limit: '12',
    fields: 'key,title,author_name,first_publish_year,cover_i,number_of_pages_median',
  })
  const res = await fetch(`https://openlibrary.org/search.json?${params}`, { signal })
  if (!res.ok) throw new Error(`Open Library returned ${res.status}`)
  const data = (await res.json()) as { docs?: OLDoc[] }
  return (data.docs ?? []).map((d) => ({
    title: d.title,
    author: d.author_name?.slice(0, 2).join(', ') ?? 'Unknown author',
    year: d.first_publish_year,
    pages: d.number_of_pages_median,
    coverUrl: d.cover_i ? coverFromId(d.cover_i, 'L') : undefined,
    olKey: d.key,
  }))
}
