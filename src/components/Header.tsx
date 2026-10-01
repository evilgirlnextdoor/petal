import { useRef } from 'react'
import { FloralCorner, MoonPhases, Sparkle } from './Botanicals'

interface Props {
  onAdd: () => void
  onExport: () => void
  onImport: (file: File) => void
}

export function Header({ onAdd, onExport, onImport }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <header className="relative overflow-hidden">
      <FloralCorner className="animate-float-slow pointer-events-none absolute -top-6 -left-10 w-48 -scale-y-100 opacity-80 sm:w-64" />
      <FloralCorner className="animate-float-slow pointer-events-none absolute -top-6 -right-10 w-48 -scale-100 opacity-80 [animation-delay:-3s] sm:w-64" />

      <div className="relative mx-auto max-w-6xl px-6 pt-12 pb-8 text-center">
        <MoonPhases className="mx-auto h-4 text-plum/50" />
        <p className="mt-4 flex items-center justify-center gap-2 text-xs tracking-[0.35em] text-plum/70 uppercase">
          <Sparkle size={10} /> A reading garden <Sparkle size={10} />
        </p>
        <h1 className="mt-2 text-5xl font-semibold tracking-tight text-forest sm:text-7xl">
          Petal <span className="font-medium italic text-terracotta">&amp;</span> Page
        </h1>
        <p className="mx-auto mt-3 max-w-md italic text-bark/70">
          Tend the stories you have gathered and the ones still calling to you.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button type="button" className="btn-accent px-6 py-2.5 text-base" onClick={onAdd}>
            + Plant a book
          </button>
          <button type="button" className="btn-ghost" onClick={onExport}>
            Export backup
          </button>
          <button type="button" className="btn-ghost" onClick={() => fileRef.current?.click()}>
            Import backup
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onImport(file)
              e.target.value = ''
            }}
          />
        </div>
      </div>
    </header>
  )
}
