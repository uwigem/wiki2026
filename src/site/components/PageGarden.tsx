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
  if (path.startsWith('/impact')) return 'wetland'
  if (path.startsWith('/team') || path.startsWith('/attributions')) return 'orchard'
  return 'meadow'
}

interface Spec {
  seed: number
  pondSide: 'left' | 'right' | 'none'
  low: Sprite[]
  tall: Sprite[]
  /** logical px between tall plants down a margin */
  tallStep: number
  /** logical px between big cream flowers down a margin */
  bigStep: number
}

const SPECS: Record<Variant, Spec> = {
  meadow: {
    seed: 0x11a1,
    pondSide: 'left',
    low: [LILAC, DAISY, WHITE_FLOWER, PINK_BELL, BLUEBELL, TUFT, PEBBLE],
    tall: [TREE, BUSH, FERN, ROCK, BERRY_BUSH],
    tallStep: 62,
    bigStep: 96,
  },
  wetland: {
    seed: 0x2b0d,
    pondSide: 'right',
    low: [BLUEBELL, WHITE_FLOWER, DAISY, TUFT, LILAC, PEBBLE],
    tall: [REED, FERN, BUSH, CATTAIL, HEART_PLANT],
    tallStep: 58,
    bigStep: 104,
  },
  orchard: {
    seed: 0x3c77,
    pondSide: 'none',
    low: [DAISY, LILAC, PINK_BELL, TUFT, WHITE_FLOWER, PEBBLE],
    tall: [TREE, TREE, BERRY_BUSH, BUSH, ROCK],
    tallStep: 52,
    bigStep: 110,
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
    const n = Math.max(1, Math.round(rows / 620))
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

  // Plants are placed one row-step at a time down each margin. The step is
  // fixed, so on a wide screen the band gets wider while the count stays the
  // same and the sides thin out. Scale the per-row count with the band to keep
  // the density even, capped so a very wide window does not turn into a wall.
  const perRow = Math.max(1, Math.min(3, Math.round(band / 64)))

  for (const side of [0, 1] as const) {
    // Low flowers and tufts: dense, spread across the whole band.
    for (let y = rng() * 24; y < rows - 3; y += 20 + rng() * 18) {
      for (let i = 0; i < perRow; i++) {
        const x = sideX(side, rng())
        if (inWater(x, y)) continue
        placed.push({ sprite: spec.low[(rng() * spec.low.length) | 0], x, y, tall: false })
      }
    }
    // Big cream flowers get their own, more frequent pass, so there are plenty.
    for (let y = rng() * spec.bigStep; y < rows - 4; y += spec.bigStep * (0.7 + rng() * 0.5)) {
      for (let i = 0; i < perRow; i++) {
        const x = sideX(side, 0.2 + rng() * 0.6)
        if (inWater(x, y)) continue
        placed.push({ sprite: BIG_FLOWER, x, y, tall: false })
      }
    }
    // Tall plants hug the outer edge so they never lean over the reading column,
    // which is why this pass stays at one per step.
    for (let y = rng() * spec.tallStep; y < rows - 6; y += spec.tallStep * (0.7 + rng() * 0.6)) {
      const x = sideX(side, rng() * 0.4)
      if (inWater(x, y)) continue
      placed.push({ sprite: spec.tall[(rng() * spec.tall.length) | 0], x, y, tall: true })
    }
  }
  // waterline plants around each pond
  for (const pd of ponds) {
    for (let i = 0; i < 5; i++) {
      const a = rng() * Math.PI * 2
      placed.push({
        sprite: rng() < 0.4 ? LILYPAD : rng() < 0.5 ? LILY_FLOWER : WATER_GRASS,
        x: pd.cx + Math.cos(a) * pd.r * pd.sx * 0.85,
        y: pd.cy + Math.sin(a) * pd.r * pd.sy * 0.9,
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
     * Resize the canvas to the viewport and repaint from whatever is already
     * baked. Cheap, so it runs on every resize event: the canvas carries an
     * inline width, and leaving that stale during a window drag shows a bare
     * strip of flat body-green down the side with no garden in it.
     */
    const resizeCanvas = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      if (vw < 2 || vh < 2) return
      scale = Math.max(2, Math.round(pixelScale(vw, vh) * 0.75))
      lw = Math.ceil(vw / scale)
      lh = Math.ceil(vh / scale)
      if (canvas.width !== vw || canvas.height !== vh) {
        canvas.width = vw
        canvas.height = vh
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
      const vw = window.innerWidth
      const vh = window.innerHeight
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
