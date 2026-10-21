import { useEffect, useRef, useState } from 'react'
import { drawSprite } from '../engine/paint'
import type { Sprite } from '../engine/sprites'
import type { Palette } from '../engine/palette'
import { SITE_PALETTE } from './theme'

/* ------------------------------------------------------------------ *
 * Sprite rasterising
 *
 * Where the site needs a piece of the garden's art in the DOM (a flower
 * marking a subteam, say), it draws the engine's own sprite rather than a
 * redrawn copy. Each sprite is rendered once at 1:1 into an offscreen canvas,
 * cached as a data URL, and scaled up by CSS at integer factors with
 * `image-rendering: pixelated`, so the pixels stay square.
 * ------------------------------------------------------------------ */

const spriteCache = new Map<Sprite, string>()
/** Sprites drawn in a palette other than the site's, one cache per palette. */
const tintedCache = new WeakMap<Palette, Map<Sprite, string>>()

export function spriteURL(sp: Sprite, pal: Palette = SITE_PALETTE): string {
  let cache = spriteCache
  if (pal !== SITE_PALETTE) {
    cache = tintedCache.get(pal) ?? new Map()
    tintedCache.set(pal, cache)
  }
  const cached = cache.get(sp)
  if (cached) return cached
  const canvas = document.createElement('canvas')
  canvas.width = sp.w
  canvas.height = sp.h
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  ctx.imageSmoothingEnabled = false
  drawSprite(ctx, sp, 0, 0, pal)
  const url = canvas.toDataURL()
  cache.set(sp, url)
  return url
}

/* ------------------------------------------------------------------ *
 * Accessibility
 * ------------------------------------------------------------------ */

/** Tracks `prefers-reduced-motion`. The garden falls back to a still frame. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

/* ------------------------------------------------------------------ *
 * Small utilities
 * ------------------------------------------------------------------ */

/** Closes a modal or menu on Escape. */
export function useEscape(active: boolean, onEscape: () => void) {
  const handler = useRef(onEscape)
  handler.current = onEscape
  useEffect(() => {
    if (!active) return
    const on = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handler.current()
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [active])
}

/** Fades a panel in the first time it scrolls into view. */
export function useRevealOnScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true)
            io.disconnect()
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return { ref, shown }
}
