import { bayer, fbm, hash2, valueNoise } from '../../engine/noise'
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
import { mulberry32 } from '../rng'
import { SITE_PALETTE } from '../theme'
import { GARDEN_ROWS, LAWN_SIZE, STRIP_W, seedFor, variantFor, type Variant } from './gardens'

/**
 * Draws the page backgrounds. Build time only: `npm run gardens` runs this
 * and writes the results to public/gardens/. The site never imports it.
 *
 * It is the recipe the live garden used, from the engine's own parts: the
 * grass is terrain.ts's fbm with a Bayer dither, the ponds are world.ts's
 * wobbling lake shape, and the plants are the engine's sprites drawn by the
 * engine's own `drawSprite`. Two things differ from the old live version:
 *
 * - The lawn is a seamless tile, so one small image covers any page.
 * - Each margin is its own strip that ends at the reading column. A pond is
 *   sized and placed so the whole of it fits inside its strip with room to
 *   spare. The old version cut the water off wherever the margin stopped,
 *   which drew a hard straight edge down the side of the pond.
 */

type Rgb = [number, number, number]

const hexCache = new Map<string, Rgb>()
function hexRgb(hex: string): Rgb {
  let c = hexCache.get(hex)
  if (!c) {
    const n = parseInt(hex.slice(1), 16)
    c = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
    hexCache.set(hex, c)
  }
  return c
}

/**
 * An RGBA bitmap that answers the three canvas calls the engine's painters
 * make (`globalAlpha`, `fillStyle`, `fillRect`), so `drawSprite` runs on it
 * unchanged, in Node as well as in a browser. Drawing composites over what is
 * there, and can be clipped to a band of columns.
 */
export class Bitmap {
  readonly data: Uint8ClampedArray
  globalAlpha = 1
  fillStyle: string = SITE_PALETTE.shadow
  clipX0 = 0
  clipX1: number

  constructor(
    readonly width: number,
    readonly height: number,
  ) {
    this.data = new Uint8ClampedArray(width * height * 4)
    this.clipX1 = width
  }

  /** Paints one pixel over what is already there, at opacity `a`. */
  blend(x: number, y: number, c: Rgb, a = 1) {
    x |= 0
    y |= 0
    if (x < this.clipX0 || x >= this.clipX1 || y < 0 || y >= this.height || a <= 0) return
    const d = this.data
    const i = (y * this.width + x) * 4
    const da = d[i + 3] / 255
    const oa = a + da * (1 - a)
    d[i] = (c[0] * a + d[i] * da * (1 - a)) / oa
    d[i + 1] = (c[1] * a + d[i + 1] * da * (1 - a)) / oa
    d[i + 2] = (c[2] * a + d[i + 2] * da * (1 - a)) / oa
    d[i + 3] = oa * 255
  }

  fillRect(x: number, y: number, w: number, h: number) {
    const c = hexRgb(this.fillStyle)
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.blend(x + i, y + j, c, this.globalAlpha)
  }
}

/* ---------------------------------------------------------------- the lawn */

/**
 * Value noise that wraps every LAWN_SIZE pixels, so the tile it fills joins up
 * with itself on all four sides. Same lattice hash and smoothing as the
 * engine's `valueNoise`.
 */
function wrappedNoise(x: number, y: number, cell: number): number {
  const period = LAWN_SIZE / cell
  const fx = x / cell
  const fy = y / cell
  const xi = Math.floor(fx)
  const yi = Math.floor(fy)
  const sx = (fx - xi) * (fx - xi) * (3 - 2 * (fx - xi))
  const sy = (fy - yi) * (fy - yi) * (3 - 2 * (fy - yi))
  const at = (i: number, j: number) => hash2(((i % period) + period) % period, ((j % period) + period) % period)
  const a = at(xi, yi)
  const b = at(xi + 1, yi)
  const c = at(xi, yi + 1)
  const d = at(xi + 1, yi + 1)
  const top = a + (b - a) * sx
  return top + (c + (d - c) * sx - top) * sy
}

/** The engine's three-octave fbm (cells of about 62, 30 and 14 px), at wrapping cell sizes of 64, 32 and 16. */
function lawnFbm(x: number, y: number): number {
  return wrappedNoise(x, y, 64) * 0.5 + wrappedNoise(x, y, 32) * 0.25 + wrappedNoise(x, y, 16) * 0.125
}

/** One seamless tile of the garden's single uniform lawn. */
export function bakeLawn(): Bitmap {
  const pal = SITE_PALETTE
  const g: Rgb[] = [hexRgb(pal.grass3), hexRgb(pal.grass1), hexRgb(pal.grass2)]
  const bm = new Bitmap(LAWN_SIZE, LAWN_SIZE)
  for (let y = 0; y < LAWN_SIZE; y++) {
    for (let x = 0; x < LAWN_SIZE; x++) {
      const v = lawnFbm(x, y) * 1.15 * 2
      const gi = Math.max(0, Math.min(2, Math.floor(v + (bayer(x, y) - 0.5) * 0.9)))
      bm.blend(x, y, g[gi])
    }
  }
  return bm
}

/* ------------------------------------------------------------- the margins */

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

/**
 * The planting per page family. The `low` lists are weighted by repetition:
 * tufts and pebbles read as texture, the pale flowers catch the eye, so the
 * flowers are a minority of the draws.
 */
const SPECS: Record<Variant, Spec> = {
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

/**
 * The width of margin most laptop windows show, in logical pixels. Plants
 * are laid out at their old density across this much of the strip; a
 * sparser second pass fills the rest, which only wider windows show.
 */
const VIS = 68

/** Closest two plants may sit, centre to centre. */
const MIN_GAP = 42

/** Water never comes closer than this to the reading column. */
const INNER_GAP = 6

/** The furthest a pond may reach from its centre, across the strip. Two of these plus the gap still fit inside STRIP_W. */
const MAX_POND_REACH = 54

/**
 * How far the shoreline wobble can push water past the lake shape: the
 * wobble is (fbm - 0.46) * 7 and fbm stays under 0.875, so under 3, and water
 * starts at -0.6. Rounded up.
 */
const WOBBLE = 4.4

interface Pond {
  cx: number
  cy: number
  r: number
  sx: number
  sy: number
  h: [number, number, number]
  p: [number, number, number]
  /** Half-width and half-height of the box the water can reach. */
  rx: number
  ry: number
}

/** world.ts's lake shape: the radius wobbles by angle through three harmonics. */
function pondSDF(pd: Pond, x: number, y: number): number {
  const dx = (x - pd.cx) / pd.sx
  const dy = (y - pd.cy) / pd.sy
  const dist = Math.sqrt(dx * dx + dy * dy)
  const a = Math.atan2(dy, dx)
  const R = pd.r * (1 + pd.h[0] * Math.sin(a * 3 + pd.p[0]) + pd.h[1] * Math.sin(a * 2 + pd.p[1]) + pd.h[2] * Math.sin(a * 5 + pd.p[2]))
  return R - dist
}

/** Whether a pond puts water at (x, y): the lake shape plus world.ts's shoreline wobble. */
function wet(pd: Pond, x: number, y: number): boolean {
  return pondSDF(pd, x, y) + (fbm(x * 0.035, y * 0.035) - 0.46) * 7 > -0.6
}

/**
 * How close to the reading column (`inner`) and how far from it (`outer`)
 * a pond's water actually reaches, in logical pixels from the column.
 */
function shoreline(pd: Pond, side: 0 | 1): { inner: number; outer: number } {
  let inner = Infinity
  let outer = -Infinity
  for (let y = Math.floor(pd.cy - pd.ry); y <= Math.ceil(pd.cy + pd.ry); y++) {
    for (let x = Math.floor(pd.cx - pd.rx); x <= Math.ceil(pd.cx + pd.rx); x++) {
      if (!wet(pd, x, y)) continue
      const d = side === 0 ? STRIP_W - 1 - x : x - STRIP_W
      if (d < inner) inner = d
      if (d > outer) outer = d
    }
  }
  return { inner, outer }
}

/** terrain.ts's baked object shadow. */
function shadowEllipse(bm: Bitmap, cx: number, cy: number, rx: number, ry: number, color: string) {
  bm.globalAlpha = 0.18
  bm.fillStyle = color
  for (let y = -ry; y <= ry; y++) {
    const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry))))
    if (w > 0) bm.fillRect((cx - w) | 0, (cy + y) | 0, w * 2, 1)
  }
  bm.globalAlpha = 1
}

/**
 * A page's two margin strips, side by side in one transparent bitmap: the
 * left margin in the left half and the right margin in the right half, each
 * with its inner edge against the middle, where the reading column sits.
 * Transparent wherever there is only lawn, so the lawn tile shows through.
 */
export function bakeStrips(path: string): Bitmap {
  const spec = SPECS[variantFor(path)]
  const pal = SITE_PALETTE
  const rows = GARDEN_ROWS
  const bm = new Bitmap(STRIP_W * 2, rows)
  const rng = mulberry32((spec.seed ^ seedFor(path)) >>> 0)

  /** The x of a point `d` logical pixels out from the reading column. */
  const xAt = (side: 0 | 1, d: number) => (side === 0 ? STRIP_W - 1 - d : STRIP_W + d)
  /** Keeps drawing on one side from spilling into the other half. */
  const clipTo = (side: 0 | 1) => {
    bm.clipX0 = side === 0 ? 0 : STRIP_W
    bm.clipX1 = side === 0 ? STRIP_W : STRIP_W * 2
  }
  const sideOf = (x: number): 0 | 1 => (x < STRIP_W ? 0 : 1)

  // ---- ponds: spaced well apart, each wholly inside its strip ----
  const ponds: Pond[] = []
  if (spec.pondSide !== 'none') {
    const home: 0 | 1 = spec.pondSide === 'left' ? 0 : 1
    const n = Math.max(1, Math.round(rows / 900))
    for (let i = 0; i < n; i++) {
      // Mostly on the family's own side, now and then across the page, so no
      // two pages lay their water out the same way.
      const side: 0 | 1 = rng() < 0.75 ? home : ((1 - home) as 0 | 1)
      const h: [number, number, number] = [0.15 + rng() * 0.06, 0.09 + rng() * 0.05, 0.05 + rng() * 0.04]
      const p: [number, number, number] = [rng() * 6.28, rng() * 6.28, rng() * 6.28]
      const sx = 1.1 + rng() * 0.5 // wider than tall, like the engine's ponds
      const sy = 0.8 + rng() * 0.2
      const lobes = 1 + h[0] + h[1] + h[2]
      const r = Math.min(VIS * (0.42 + rng() * 0.18), (MAX_POND_REACH / sx - WOBBLE) / lobes)
      const rx = (r * lobes + WOBBLE) * sx
      const ry = (r * lobes + WOBBLE) * sy
      const cy = Math.max(ry + 4, Math.min(rows - ry - 4, ((i + 0.5) * rows) / n + (rng() - 0.5) * rows * 0.12))
      const pd: Pond = { cx: 0, cy, r, sx, sy, h, p, rx, ry }

      // Placed by its real shoreline, not its worst case: start where even the
      // widest possible pond would clear the column, measure where this one's
      // water actually ends, and pull it in until that edge sits a few pixels
      // from the column. Never closer than INNER_GAP, checked last.
      let d = rx + INNER_GAP + 2
      pd.cx = xAt(side, d)
      const target = INNER_GAP + Math.floor(rng() * 6)
      for (let k = 0; k < 6; k++) {
        const shift = shoreline(pd, side).inner - target
        if (Math.abs(shift) < 1) break
        d -= shift
        pd.cx = xAt(side, d)
      }
      while (shoreline(pd, side).inner < INNER_GAP) pd.cx = xAt(side, ++d)
      ponds.push(pd)
    }
  }

  const deep = hexRgb(pal.waterDeep)
  const shallow = hexRgb(pal.water)
  const foam = hexRgb(pal.foam)
  const deepMottle: Rgb = [deep[0] + (shallow[0] - deep[0]) * 0.38, deep[1] + (shallow[1] - deep[1]) * 0.38, deep[2] + (shallow[2] - deep[2]) * 0.38]

  for (const pd of ponds) {
    clipTo(sideOf(pd.cx))
    for (let y = Math.floor(pd.cy - pd.ry); y <= Math.ceil(pd.cy + pd.ry); y++) {
      for (let x = Math.floor(pd.cx - pd.rx); x <= Math.ceil(pd.cx + pd.rx); x++) {
        let f = -1e9
        for (const q of ponds) f = Math.max(f, pondSDF(q, x, y))
        f += (fbm(x * 0.035, y * 0.035) - 0.46) * 7 // world.ts's shoreline wobble
        if (f <= -0.6) continue
        // water, coloured by depth exactly like terrain.ts
        let c = f > 5 ? (fbm(x * 0.045, y * 0.045) > 0.6 ? deepMottle : deep) : shallow
        if (f >= -0.5 && f <= 1 && valueNoise(x * 0.2, y * 0.2) > 0.46) c = foam
        bm.blend(x, y, c)
      }
    }
  }

  // ---- plants ----
  interface Placed {
    sprite: Sprite
    x: number
    y: number
    tall: boolean
  }
  const placed: Placed[] = []
  const inWater = (x: number, y: number) => ponds.some((pd) => pondSDF(pd, x, y) > -1)
  /** Rejects a spot that would crowd something already placed, so the margins never grow clumps. */
  const tooClose = (x: number, y: number) =>
    placed.some((p) => (p.x - x) * (p.x - x) + (p.y - y) * (p.y - y) < MIN_GAP * MIN_GAP)
  /** A sprite at `d` from the column must sit wholly inside its strip, and wholly on the page vertically. */
  const fits = (sprite: Sprite, d: number, y: number, tall: boolean) =>
    d - sprite.w / 2 >= 1 && d + sprite.w / 2 <= STRIP_W - 2 && y - (tall ? sprite.h : sprite.h / 2) >= 1 && y + sprite.h / 2 <= rows - 2

  const offer = (side: 0 | 1, y: number, d: number, isTall: boolean) => {
    const sprite = isTall ? spec.tall[(rng() * spec.tall.length) | 0] : rng() < 0.05 ? BIG_FLOWER : spec.low[(rng() * spec.low.length) | 0]
    const x = xAt(side, d)
    if (!fits(sprite, d, y, isTall) || inWater(x, y) || tooClose(x, y)) return
    placed.push({ sprite, x, y, tall: isTall })
  }

  for (const side of [0, 1] as const) {
    // The margin a laptop shows, at the old density. Tall plants keep to its
    // outer part so they never lean over the reading column.
    for (let y = rng() * spec.step; y < rows - 6; y += spec.step * (0.6 + rng() * 0.8)) {
      const isTall = rng() < spec.tallShare
      const inset = 2 + (isTall ? rng() * 0.38 : rng()) * (VIS - 4)
      offer(side, y, VIS - 1 - inset, isTall)
    }
    // Further out, for wide screens: sparser.
    for (let y = rng() * spec.step * 2; y < rows - 6; y += spec.step * 2 * (0.6 + rng() * 0.8)) {
      offer(side, y, VIS + rng() * (STRIP_W - VIS - 12), rng() < spec.tallShare)
    }
  }
  // A little planting at each waterline, enough to read as a pond edge.
  for (const pd of ponds) {
    const side = sideOf(pd.cx)
    for (let i = 0; i < 3; i++) {
      const a = rng() * Math.PI * 2
      const x = pd.cx + Math.cos(a) * pd.r * pd.sx * 0.85
      const y = pd.cy + Math.sin(a) * pd.r * pd.sy * 0.9
      const sprite = rng() < 0.4 ? LILYPAD : rng() < 0.5 ? LILY_FLOWER : WATER_GRASS
      const d = side === 0 ? STRIP_W - 1 - x : x - STRIP_W
      if (!fits(sprite, d, y, false) || tooClose(x, y)) continue
      placed.push({ sprite, x, y, tall: false })
    }
  }

  placed.sort((a, b) => a.y - b.y)
  const ctx = bm as unknown as CanvasRenderingContext2D
  for (const p of placed) {
    const sp = p.sprite
    clipTo(sideOf(p.x))
    if (p.tall) {
      shadowEllipse(bm, p.x, p.y - 1, Math.max(4, sp.w / 2.4), 2.5, pal.shadow)
      drawSprite(ctx, sp, Math.round(p.x - sp.w / 2), Math.round(p.y - sp.h), pal)
    } else {
      drawSprite(ctx, sp, Math.round(p.x - sp.w / 2), Math.round(p.y - sp.h / 2), pal)
    }
  }
  return bm
}
