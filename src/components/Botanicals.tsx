import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

/** Five-petal blossom used for ratings and accents. */
export function Blossom({ size = 24, filled = true, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <g
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.3}
        opacity={filled ? 1 : 0.55}
      >
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse key={deg} cx="12" cy="6.6" rx="3.6" ry="5" transform={`rotate(${deg} 12 12)`} />
        ))}
      </g>
      <circle cx="12" cy="12" r="2.6" fill={filled ? '#c9a14a' : 'none'} stroke="currentColor" strokeWidth={filled ? 0 : 1.2} opacity={filled ? 1 : 0.55} />
    </svg>
  )
}

export function Moon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M15.5 3.2a9 9 0 1 0 5.3 13.3A7.5 7.5 0 0 1 15.5 3.2Z" fill="currentColor" />
    </svg>
  )
}

export function Sparkle({ size = 16, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M12 1.5c.6 5.2 3.3 7.9 8.5 8.5v.1c-5.2.6-7.9 3.3-8.5 8.5h-.1c-.6-5.2-3.3-7.9-8.4-8.5V10c5.1-.6 7.8-3.3 8.4-8.5h.1Z" fill="currentColor" />
    </svg>
  )
}

export function Leaf({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M20 3C9 3 4 9 4 16c0 1.7.4 3.2 1 4.5C7 13 12 9 17 7c-4 3-8 7-10.3 13.4.9.4 2 .6 3.3.6 7 0 10-6 10-18Z" fill="currentColor" />
    </svg>
  )
}

/** Moon phases strip for the header. */
export function MoonPhases(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 220 24" aria-hidden="true" {...props}>
      <g fill="currentColor">
        <circle cx="12" cy="12" r="7" fillOpacity=".2" stroke="currentColor" strokeWidth="1" />
        <path d="M54 5a7 7 0 0 1 0 14 9 9 0 0 0 0-14Z" />
        <path d="M86 5a7 7 0 0 1 0 14Z" />
        <path d="M118 5a7 7 0 1 1 0 14 4 4 0 0 0 0-14Z" />
        <circle cx="152" cy="12" r="8" />
        <path d="M186 5a7 7 0 1 0 0 14 4 4 0 0 1 0-14Z" />
        <path d="M208 5a7 7 0 0 0 0 14Z" />
      </g>
    </svg>
  )
}

/** Trailing floral vine, used as a decorative corner flourish. */
export function FloralCorner(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 220 220" aria-hidden="true" {...props}>
      <g fill="none" stroke="#4f5d3a" strokeWidth="2" strokeLinecap="round" opacity=".7">
        <path d="M8 212C30 150 70 110 140 86s62-48 72-78" />
        <path d="M60 130c-14-8-30-6-40 4 14 6 28 6 40-4Z" fill="#8a9a73" stroke="none" />
        <path d="M104 100c-4-16 2-30 14-38 2 16-2 28-14 38Z" fill="#8a9a73" stroke="none" />
        <path d="M150 82c14-6 28-2 36 10-14 4-26 2-36-10Z" fill="#8a9a73" stroke="none" />
        <path d="M36 168c-12-2-22 4-26 14 12 0 20-4 26-14Z" fill="#8a9a73" stroke="none" />
      </g>
      <g transform="translate(140 86)">
        {[0, 72, 144, 216, 288].map((d) => (
          <ellipse key={d} cx="0" cy="-11" rx="7" ry="11" fill="#d99a8b" transform={`rotate(${d})`} />
        ))}
        <circle r="5" fill="#c9a14a" />
      </g>
      <g transform="translate(60 128) scale(.7)">
        {[0, 72, 144, 216, 288].map((d) => (
          <ellipse key={d} cx="0" cy="-11" rx="7" ry="11" fill="#b9a3c9" transform={`rotate(${d})`} />
        ))}
        <circle r="5" fill="#c9a14a" />
      </g>
      <g transform="translate(206 18) scale(.55)">
        {[0, 72, 144, 216, 288].map((d) => (
          <ellipse key={d} cx="0" cy="-11" rx="7" ry="11" fill="#c0663f" transform={`rotate(${d})`} />
        ))}
        <circle r="5" fill="#c9a14a" />
      </g>
      <g fill="#c9a14a">
        <circle cx="96" cy="140" r="2" />
        <circle cx="178" cy="54" r="1.6" />
        <circle cx="30" cy="120" r="1.4" />
      </g>
    </svg>
  )
}

export function Divider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 text-sage ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-wheat" />
      <Leaf size={14} className="-scale-x-100" />
      <Blossom size={16} className="text-rose" />
      <Leaf size={14} />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-wheat" />
    </div>
  )
}
