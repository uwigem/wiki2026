import { SITE_PALETTE } from '../../theme'
import { SIZE, draw } from './art'

const cache = new Map<string, string>()

/** An element's picture as an image URL, drawn once in the site's palette. */
export function iconURL(id: string): string {
  const hit = cache.get(id)
  if (hit) return hit
  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  const grid = draw(id)
  for (let i = 0; i < grid.length; i++) {
    const k = grid[i]
    if (!k) continue
    ctx.fillStyle = SITE_PALETTE[k]
    ctx.fillRect(i % SIZE, Math.floor(i / SIZE), 1, 1)
  }
  const url = canvas.toDataURL()
  cache.set(id, url)
  return url
}

/**
 * An element's picture, 24 pixels square at scale 1. Decorative: the name is
 * always written next to it. Whole-number scales only, or the pixels go uneven.
 */
export default function ElementIcon({ id, scale = 1, className }: { id: string; scale?: number; className?: string }) {
  const size = SIZE * scale
  return (
    <img
      src={iconURL(id)}
      width={size}
      height={size}
      alt=""
      aria-hidden
      draggable={false}
      className={'pixelated shrink-0 select-none ' + (className ?? '')}
    />
  )
}
