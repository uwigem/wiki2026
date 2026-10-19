import { CREDIT_LOGOS, type CreditLogoId } from '../content/creditLogos'

const cache = new Map<CreditLogoId, string>()

/** Draws a logo once at one pixel per cell and keeps the data URL. */
function logoURL(id: CreditLogoId): string {
  const hit = cache.get(id)
  if (hit) return hit
  const logo = CREDIT_LOGOS[id]
  const canvas = document.createElement('canvas')
  canvas.width = logo.w
  canvas.height = logo.h
  const ctx = canvas.getContext('2d')!
  logo.rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x]
      if (ch === '.') continue
      ctx.fillStyle = logo.pal[parseInt(ch, 36)]
      ctx.fillRect(x, y, 1, 1)
    }
  })
  const url = canvas.toDataURL()
  cache.set(id, url)
  return url
}

/**
 * One pixel-art logo, scaled up with crisp pixels. Decorative: wherever a logo
 * appears, the organisation's name is written beside it.
 */
export default function CreditLogo({ id, scale, className }: { id: CreditLogoId; scale: number; className?: string }) {
  const logo = CREDIT_LOGOS[id]
  return (
    <img
      src={logoURL(id)}
      alt=""
      aria-hidden
      width={logo.w * scale}
      height={logo.h * scale}
      draggable={false}
      className={'pixelated select-none ' + (className ?? '')}
    />
  )
}

/** Gap between logos in a set, in CSS pixels. */
const GAP = 6

/**
 * The largest whole-number scale, up to `max`, at which a grid of logos fits a
 * box, so every pixel stays the same size. Each column is as wide as its
 * widest logo and each row as tall as its tallest.
 */
function fitScale(ids: CreditLogoId[], across: number, width: number, height: number, max = 4): number {
  const logos = ids.map((id) => CREDIT_LOGOS[id])
  const down = Math.ceil(logos.length / across)
  for (let scale = max; scale > 1; scale--) {
    let w = GAP * (across - 1)
    for (let c = 0; c < across; c++) w += scale * Math.max(0, ...logos.filter((_, i) => i % across === c).map((l) => l.w))
    let h = GAP * (down - 1)
    for (let r = 0; r < down; r++) h += scale * Math.max(0, ...logos.filter((_, i) => Math.floor(i / across) === r).map((l) => l.h))
    if (w <= width && h <= height) return scale
  }
  return 1
}

/**
 * A card's logos, as large as they fit in the box: one alone, two side by
 * side, three or four in a two-by-two grid, all at one scale.
 */
export function LogoSet({
  ids,
  width,
  height,
  max = 4,
}: {
  ids: CreditLogoId[]
  width: number
  height: number
  /** The largest scale to draw at, so a lone logo does not dwarf the name under it. */
  max?: number
}) {
  const across = ids.length === 1 ? 1 : 2
  const scale = fitScale(ids, across, width, height, max)
  return (
    <span className="grid place-items-center" style={{ gridTemplateColumns: `repeat(${across}, auto)`, gap: GAP }}>
      {ids.map((id, i) => (
        <CreditLogo key={id + i} id={id} scale={scale} />
      ))}
    </span>
  )
}
