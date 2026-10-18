import type { Sprite } from '../../engine/sprites'
import type { Palette } from '../../engine/palette'
import { SITE_PALETTE } from '../theme'

/**
 * The two markers in the on-page outline, drawn in the engine's sprite
 * alphabet (see LEGEND in `src/engine/sprites.ts`) so they take the site's
 * palette like everything else. They live here rather than with the garden's
 * sprites because the engine is frozen; the rail is the only place they appear.
 */

function s(rows: string[]): Sprite {
  const w = Math.max(...rows.map((r) => r.length))
  return { w, h: rows.length, rows: rows.map((r) => r.padEnd(w, '.')) }
}

/** A section the reader has not reached: the two-leaf sprout off the hedgehog's head, on its own. */
export const SPROUT = s([
  'q.....q',
  'qp...pq',
  '.qp.pq.',
  '..ppp..',
  '...s...',
  '...s...',
  '..FsF..',
])

/**
 * The section the reader is in: the garden's lilac, one stem row taller. The
 * head is the same seven pixels wide as the garden's, so it stays symmetric.
 */
export const RAIL_BLOOM = s([
  '..V.V..',
  '.VvyvV.',
  '.VyyyV.',
  '..VvV..',
  '...s...',
  '..FsF..',
  '...s...',
  '...s...',
])

/** `hex` darkened to `factor` of its lightness, as an rgb() string. */
function deepen(hex: string, factor: number): string {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  const max = Math.max(r, g, b) / 255
  const min = Math.min(r, g, b) / 255
  const l = (max + min) / 2
  const d = max - min
  const sat = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  let h = 0
  if (d !== 0) {
    const R = r / 255
    const G = g / 255
    const B = b / 255
    if (max === R) h = ((G - B) / d) % 6
    else if (max === G) h = (B - R) / d + 2
    else h = (R - G) / d + 4
    h = ((h * 60) + 360) % 360
  }
  const L = l * factor
  const c = (1 - Math.abs(2 * L - 1)) * sat
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = L - c / 2
  const seg = Math.floor(h / 60)
  const [r1, g1, b1] = [
    [c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x],
  ][seg] ?? [0, 0, 0]
  const to = (v: number) => Math.round((v + m) * 255)
  return `rgb(${to(r1)}, ${to(g1)}, ${to(b1)})`
}

/**
 * The site's palette with the lilac taken a shade deeper: at the rail's size the
 * garden lilac washes out against the panel. Only the bloom is drawn with it.
 */
export const RAIL_PALETTE: Palette = {
  ...SITE_PALETTE,
  lilacPetal: deepen(SITE_PALETTE.lilacPetal, 0.86),
  lilacHi: SITE_PALETTE.lilacPetal,
}
