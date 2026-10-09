import { useEffect, useRef } from 'react'
import { bayer, fbm, valueNoise } from '../../engine/noise'
import { drawSprite } from '../../engine/paint'
import {
  BERRY_BUSH,
  BIG_FLOWER,
  BLUEBELL,
  BUSH,
  CATTAIL,
  DAISY,
  FERN,
  HEART_PLANT,
  LILAC,
  LILYPAD,
  LILY_FLOWER,
  PEBBLE,
  PINK_BELL,
  REED,
  ROCK,
  TREE,
  TUFT,
  WATER_GRASS,
  WHITE_FLOWER,
  type Sprite,
} from '../../engine/sprites'
import { contentBand, pixelScale } from '../layout'
import { mulberry32 } from '../rng'
import { SITE_PALETTE } from '../theme'

/**
 * The page background: the engine's garden, kept to the margins, SCROLLING.
 *
 * Flowers, trees and a pond live only in the left and right side bands. The
 * middle is one flat sheet of grass, so content panels sit on a consistent
 * green with no lighter block down the centre. The whole garden scrolls with
 * the page: it is baked once to the full document height and a moving window is
 * blitted to the viewport.
 *
 * None of it is hand-drawn art. It reuses the engine's own recipes:
 *   grass:  terrain.ts's LAND recipe (fbm plus bayer), one uniform tone.
 *   pond:   world.ts's angular-harmonic SDF with an fbm wobble, coloured by
 *           terrain.ts's depth recipe, so edges wobble like the real ponds
 *           instead of being perfect ellipses.
 *   plants: the engine's flower, tree, rock and reed sprites, via drawSprite.
 * Only the layout is ours: margins only, clean centre.
 *
 * Three variants, keyed to the page family by `variantFor`.
 */

/**
 * Ceiling on the baked canvas height, in logical rows.
 *
 * The whole page background is baked once into an offscreen canvas and a moving
 * window is blitted from it, so a very long page would otherwise ask the browser
 * for a very large bitmap. Past this height the background stops scrolling and
 * the last screens run over a frozen window. At the smallest pixel scale that is
 * a document about 32000 CSS pixels tall, which no page here comes close to.
 */
const MAX_BAKED_ROWS = 16000

export type Variant = 'meadow' | 'wetland' | 'orchard'

export function variantFor(path: string): Variant {
  if (path.startsWith('/human-practices')) return 'wetland'
  if (path.startsWith('/team')) return 'orchard'
  return 'meadow'
}

/**
 * How crowded a margin gets.
 *
 * Plants are placed in one pass with a spacing rule, so no two overlap and the
 * margin never competes with the reading column. The grass texture does the
 * work, and plants are occasional punctuation in it. If a margin ever looks
 * busy, raise `step` before adding anything else.
 */

/** Closest two plants may sit, in logical px, measured centre to centre. */
const MIN_GAP = 42

interface Spec {
  seed: number
  pondSide: 'left' | 'right' | 'none'
  low: Sprite[]
  tall: Sprite[]
  /** Average logical rows between one plant and the next, down a single margin. */
  step: number
  /** Share of plants that are the tall, shadow-casting kind. */
  tallShare: number
}

const SPECS: Record<Variant, Spec> = {
  // The `low` lists are weighted by repetition rather than by a separate table.
  // Grass tufts and pebbles come first and repeat, because they read as
  // texture; the pale flowers are what catches the eye across a green page, so
  // they are a minority of the draws rather than half of them.
  meadow: {
    seed: 0x11a1,
    pondSide: 'left',
    low: [TUFT, TUFT, TUFT, PEBBLE, LILAC, BLUEBELL, PINK_BELL, DAISY, WHITE_FLOWER],
    tall: [BUSH, BUSH, FERN, BERRY_BUSH, ROCK, TREE],
    step: 124,
    tallShare: 0.34,
  },
  wetland: {
    seed: 0x2b0d,
    pondSide: 'right',
    low: [TUFT, TUFT, TUFT, PEBBLE, BLUEBELL, LILAC, DAISY, WHITE_FLOWER],
    tall: [REED, FERN, BUSH, CATTAIL, HEART_PLANT],
    step: 118,
    tallShare: 0.36,
  },
  orchard: {
    seed: 0x3c77,
    pondSide: 'none',
    low: [TUFT, TUFT, TUFT, PEBBLE, LILAC, PINK_BELL, DAISY, WHITE_FLOWER],
    tall: [BUSH, BERRY_BUSH, ROCK, TREE, TREE],
    step: 128,
    tallShare: 0.36,
  },
}

function hexRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
const mix = (a: [number, number, number], b: [number, number, number], t: number): [number, number, number] => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
]

/** terrain.ts's baked object shadow. */
function shadowEllipse(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number, color: string) {
  ctx.globalAlpha = 0.18
  ctx.fillStyle = color
  for (let y = -ry; y <= ry; y++) {
    const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry))))
    if (w > 0) ctx.fillRect((cx - w) | 0, (cy + y) | 0, w * 2, 1)
  }
  ctx.globalAlpha = 1
}

/** An organic pond, shaped exactly like world.ts's lakes. */
interface Pond {
  cx: number
  cy: number
  r: number
  sx: number
  sy: number
  h: [number, number, number]
  p: [number, number, number]
}

/** world.ts's lake SDF: radius wobbles by angle through three sine harmonics. */
function pondSDF(pd: Pond, x: number, y: number): number {
  const dx = (x - pd.cx) / pd.sx
  const dy = (y - pd.cy) / pd.sy
  const dist = Math.sqrt(dx * dx + dy * dy)
  const a = Math.atan2(dy, dx)
  const R = pd.r * (1 + pd.h[0] * Math.sin(a * 3 + pd.p[0]) + pd.h[1] * Math.sin(a * 2 + pd.p[1]) + pd.h[2] * Math.sin(a * 5 + pd.p[2]))
  return R - dist
}


/**
 * Bake the full garden into an offscreen buffer at logical (lw × rows). Water and
 * plants live only in the side bands of width `band`; the middle is flat grass.
 */
function bake(variant: Variant, lw: number, rows: number, band: number): HTMLCanvasElement {
  const spec = SPECS[variant]
  const pal = SITE_PALETTE
  const buf = document.createElement('canvas')
  buf.width = lw
  buf.height = rows
  const ctx = buf.getContext('2d')!
  ctx.imageSmoothingEnabled = false

  const rng = mulberry32(spec.seed)

  // ---- ponds down the variant's side (organic) ----
  const ponds: Pond[] = []
  if (spec.pondSide !== 'none' && band >= 18) {
    // Spaced well apart: a pond is a big feature, and two of them within a
    // screen of each other make the margin feel crowded.
    const n = Math.max(1, Math.round(rows / 900))
    const cxBase = spec.pondSide === 'left' ? band * 0.5 : lw - band * 0.5
    for (let i = 0; i < n; i++) {
      ponds.push({
        cx: cxBase + (rng() - 0.5) * band * 0.3,
        cy: ((i + 0.5) * rows) / n + (rng() - 0.5) * rows * 0.12,
        r: band * (0.42 + rng() * 0.18),
        sx: 1.1 + rng() * 0.5, // wider than tall, like the engine's ponds
        sy: 0.8 + rng() * 0.2,
        h: [0.15 + rng() * 0.06, 0.09 + rng() * 0.05, 0.05 + rng() * 0.04],
        p: [rng() * 6.28, rng() * 6.28, rng() * 6.28],
      })
    }
  }

  // ---- ground + water ----
  const g = [hexRgb(pal.grass3), hexRgb(pal.grass1), hexRgb(pal.grass2)]
  const deep = hexRgb(pal.waterDeep)
  const shallow = hexRgb(pal.water)
  const foam = hexRgb(pal.foam)
  const deepMottle = mix(deep, shallow, 0.38)

  const img = ctx.createImageData(lw, rows)
  const data = img.data
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < lw; x++) {
      let c: [number, number, number]

      // pond field (only bother near a side band)
      let f = -1e9
      if (ponds.length && (x < band + 6 || x > lw - band - 6)) {
        for (const pd of ponds) f = Math.max(f, pondSDF(pd, x, y))
        f += (fbm(x * 0.035, y * 0.035) - 0.46) * 7 // world.ts's shoreline wobble
      }

      if (f > -0.6) {
        // water, coloured by depth exactly like terrain.ts
        if (f > 5) c = fbm(x * 0.045, y * 0.045) > 0.6 ? deepMottle : deep
        else c = shallow
        if (f >= -0.5 && f <= 1 && valueNoise(x * 0.2, y * 0.2) > 0.46) c = foam
      } else {
        // One uniform grass everywhere, with no centre special-casing, so the middle
        // is the same green as the margins and reads as a single lawn.
        const v = fbm(x * 0.016, y * 0.016) * 1.15 * 2
        const gi = Math.max(0, Math.min(2, Math.floor(v + (bayer(x, y) - 0.5) * 0.9)))
        c = g[gi]
      }

      const i = (y * lw + x) * 4
      data[i] = c[0]
      data[i + 1] = c[1]
      data[i + 2] = c[2]
      data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)

  if (band < 18) return buf // narrow viewport: grass only

  // ---- plants, margins only, down the full height ----
  interface P {
    sprite: Sprite
    x: number
    y: number
    tall: boolean
  }
  const placed: P[] = []
  const inWater = (x: number, y: number) => {
    for (const pd of ponds) if (pondSDF(pd, x, y) > -1) return true
    return false
  }
  const sideX = (side: 0 | 1, frac: number) => {
    const inset = 2 + frac * (band - 4)
    return side === 0 ? inset : lw - 1 - inset
  }

  /**
   * Rejects a position that would crowd something already placed. Without this
   * the margins grow clumps: random placement will happily stack a tree, a bush
   * and a daisy on the same few pixels.
   */
  const tooClose = (x: number, y: number) => {
    for (const p of placed) {
      const dx = p.x - x
      const dy = p.y - y
      if (dx * dx + dy * dy < MIN_GAP * MIN_GAP) return true
    }
    return false
  }

  // One pass per margin. Each step offers a single plant, and the plant is
  // dropped entirely if it would land on top of a neighbour, so the sides stay
  // mostly grass with something to look at every so often.
  for (const side of [0, 1] as const) {
    for (let y = rng() * spec.step; y < rows - 6; y += spec.step * (0.6 + rng() * 0.8)) {
      const isTall = rng() < spec.tallShare
      // Tall plants hug the outer edge so they never lean over the reading
      // column; low ones may sit anywhere across the band.
      const x = sideX(side, isTall ? rng() * 0.38 : rng())
      if (inWater(x, y) || tooClose(x, y)) continue
      const sprite = isTall
        ? spec.tall[(rng() * spec.tall.length) | 0]
        : rng() < 0.05
          ? BIG_FLOWER
          : spec.low[(rng() * spec.low.length) | 0]
      placed.push({ sprite, x, y, tall: isTall })
    }
  }
  // A little planting at each waterline, enough to read as a pond edge.
  for (const pd of ponds) {
    for (let i = 0; i < 3; i++) {
      const a = rng() * Math.PI * 2
      const x = pd.cx + Math.cos(a) * pd.r * pd.sx * 0.85
      const y = pd.cy + Math.sin(a) * pd.r * pd.sy * 0.9
      if (tooClose(x, y)) continue
      placed.push({
        sprite: rng() < 0.4 ? LILYPAD : rng() < 0.5 ? LILY_FLOWER : WATER_GRASS,
        x,
        y,
        tall: false,
      })
    }
  }

  placed.sort((a, b) => a.y - b.y)
  for (const p of placed) {
    const sp = p.sprite
    // `tall` is set by the placement pass that put this sprite here, so it
    // already means "this one stands up and casts a shadow". Gating on a second
    // hardcoded set as well would silently flatten any tall sprite a
    // contributor adds to a variant's `tall` list.
    if (p.tall) {
      shadowEllipse(ctx, p.x, p.y - 1, Math.max(4, sp.w / 2.4), 2.5, pal.shadow)
      drawSprite(ctx, sp, Math.round(p.x - sp.w / 2), Math.round(p.y - sp.h), pal)
    } else {
      drawSprite(ctx, sp, Math.round(p.x - sp.w / 2), Math.round(p.y - sp.h / 2), pal)
    }
  }
  return buf
}

export default function PageGarden({ variant }: { variant: Variant }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const out = canvas.getContext('2d')
    if (!out) return

    let buf: HTMLCanvasElement | null = null
    let lw = 0
    let rows = 0
    let scale = 3
    let lh = 0
    let sig = ''
    let raf = 0

    /**
     * Match the backing store to the box CSS has already given the canvas, and
     * repaint from whatever is baked. Cheap, so it runs on every resize event:
     * leaving the bitmap stale during a window drag shows a bare strip of flat
     * body-green down the side with no garden in it.
     *
     * The size is MEASURED, never assigned. Do not set a width from
     * `window.innerWidth`: on a phone that is the layout viewport, which grows
     * when anything on the page overflows sideways. One table wider than the
     * screen would stretch it, the canvas would paint itself that wide, and the
     * page would stay stretched because the canvas had become the widest thing
     * on it. A background that never declares its own width cannot get into
     * that loop.
     */
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      const vw = Math.round(rect.width)
      const vh = Math.round(rect.height)
      if (vw < 2 || vh < 2) return
      scale = Math.max(2, Math.round(pixelScale(vw, vh) * 0.75))
      lw = Math.ceil(vw / scale)
      lh = Math.ceil(vh / scale)
      if (canvas.width !== vw || canvas.height !== vh) {
        canvas.width = vw
        canvas.height = vh
        // Pin the CSS box to the same whole number as the bitmap. The measured
        // box can be fractional, and half a pixel of scaling is enough to turn
        // crisp pixel art soft. Derived from the measurement rather than from
        // the layout viewport, so it still cannot inflate itself.
        canvas.style.width = vw + 'px'
        canvas.style.height = vh + 'px'
      }
      blit()
    }

    /**
     * Re-bake the whole background. Tens of milliseconds of main-thread work, so
     * this is the half that gets debounced.
     */
    const rebakeIfNeeded = () => {
      const rect = canvas.getBoundingClientRect()
      const vw = Math.round(rect.width)
      const vh = Math.round(rect.height)
      if (vw < 2 || vh < 2) return
      const docH = Math.max(document.documentElement.scrollHeight, vh)
      rows = Math.min(MAX_BAKED_ROWS, Math.ceil(docH / scale))
      const band = contentBand(vw).band / scale

      const nextSig = `${variant}|${lw}|${rows}|${Math.round(band)}`
      if (nextSig === sig) return
      sig = nextSig
      buf = bake(variant, lw, rows, band)
      blit()
    }

    const blit = () => {
      raf = 0
      if (!buf) return
      out.imageSmoothingEnabled = false
      out.clearRect(0, 0, canvas.width, canvas.height)
      // moving window: the garden scrolls 1:1 with the page
      const srcY = Math.max(0, Math.min(rows - lh, window.scrollY / scale))
      out.drawImage(buf, 0, srcY, lw, lh, 0, 0, canvas.width, canvas.height)
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(blit)
    }

    // A window drag, or a collapsing mobile URL bar, fires resize about once a
    // frame. The cheap half runs every time so the background keeps covering the
    // viewport; only the bake is debounced, so dragging stays smooth.
    let rebakeTimer = 0
    const onResize = () => {
      resizeCanvas()
      clearTimeout(rebakeTimer)
      rebakeTimer = window.setTimeout(rebakeIfNeeded, 150)
    }

    // First paint is immediate, never debounced.
    resizeCanvas()
    rebakeIfNeeded()
    // The document grows as content and images settle, so rebake to cover the
    // new height. Height changes do not move the canvas, so this only needs the
    // debounced half.
    const ro = new ResizeObserver(() => {
      clearTimeout(rebakeTimer)
      rebakeTimer = window.setTimeout(rebakeIfNeeded, 150)
    })
    ro.observe(document.body)
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll, { passive: true })
    // A backgrounded tab parks rAF, so repaint the correct window on return.
    const onVisible = () => {
      if (!document.hidden) blit()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      clearTimeout(rebakeTimer)
      ro.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [variant])

  return <canvas ref={ref} aria-hidden className="pixelated fixed inset-0 z-0 block h-full w-full" />
}
