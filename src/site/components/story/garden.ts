import { BALANCE_LOGO, HEDGEHOG_SIDE, HEDGEHOG_SIDE_SIZE, decodeLayer } from '../../content/balanceLogo'
import { bayer, fbm, valueNoise } from '../../../engine/noise'
import {
  BIG_FLOWER,
  BLUEBELL,
  BUSH,
  CATTAIL,
  DAISY,
  HEART_PLANT,
  LEGEND,
  LILAC,
  LILYPAD,
  LILY_FLOWER,
  PEBBLE,
  PINK_BELL,
  REED,
  ROCK,
  TREE,
  WHITE_FLOWER,
  type Sprite,
} from '../../../engine/sprites'
import { mulberry32 } from '../../rng'
import { SITE_PALETTE } from '../../theme'
import { mix, toRgb, type Painter, type Rgb } from './painter'

/**
 * The landing-page garden: a pond garden built only from the playground's
 * own pieces. Its plants, bushes, rocks, pond and flowers; its three grass
 * tones, dithered only along patch edges; its soft shadows baked into the
 * ground.
 *
 * The big things (the hedgehog, the pond, the tree, the bush) are placed by
 * hand. The flowers are scattered the way the playground scatters them: a
 * seeded random walk over the meadow, thicker in some places and bare in
 * others, kinds mixed, with neighbours often matching so they mingle in
 * loose groups. The seed is fixed, so it is the same garden on every visit.
 *
 * The ground is a plane seen from the side. Grass patches are sampled in
 * perspective, so they are wide near you and thin toward the horizon.
 */

const PAL = SITE_PALETTE as unknown as Record<string, string>
const rgbCache = new Map<string, Rgb>()
const c = (key: string): Rgb => {
  let v = rgbCache.get(key)
  if (!v) {
    v = toRgb(PAL[key])
    rgbCache.set(key, v)
  }
  return v
}
const legend = (ch: string) => {
  const key = LEGEND[ch]
  return key ? c(key) : undefined
}
const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const smooth = (v: number) => v * v * (3 - 2 * v)

/** Sprites are drawn at twice native size, like the playground's. */
const GS = 2
/** Lower on a phone, so the title and the button above stay clear of the garden. */
export const groundTop = (W: number, H: number) => Math.round(H * (W < 300 ? 0.74 : 0.66))
/** How big the healthy pot plant from the watering scene stands in the closing garden. */
export const plantK = (W: number, H: number) => Math.min(H / 200, W / 300)
/**
 * How deep the garden is laid out, in native pixels below the horizon, on
 * every screen. A phone's ground is much taller than a laptop's; laying the
 * garden out over all of it made the pond and the perspective look as if
 * seen from above. Instead a phone sees the same low angle, with more grass
 * in front.
 */
const DEPTH = 76

type Kind =
  | 'hog'
  | 'plant'
  | 'tree'
  | 'bush'
  | 'heart'
  | 'rock'
  | 'pebble'
  | 'reed'
  | 'cattail'
  | 'pad'
  | 'lily'
  | 'daisy'
  | 'lilac'
  | 'white'
  | 'blue'
  | 'pink'
  | 'big'

type Flower = 'daisy' | 'lilac' | 'white' | 'blue' | 'pink' | 'big'

const SPRITE: Record<Exclude<Kind, 'hog' | 'plant'>, Sprite> = {
  tree: TREE,
  bush: BUSH,
  heart: HEART_PLANT,
  rock: ROCK,
  pebble: PEBBLE,
  reed: REED,
  cattail: CATTAIL,
  pad: LILYPAD,
  lily: LILY_FLOWER,
  daisy: DAISY,
  lilac: LILAC,
  white: WHITE_FLOWER,
  blue: BLUEBELL,
  pink: PINK_BELL,
  big: BIG_FLOWER,
}

/** Shadow half-sizes in sprite cells, as the playground bakes them. */
const SHADOW: Partial<Record<Kind, [number, number]>> = {
  hog: [8, 2.5],
  plant: [8, 2.5],
  tree: [9, 2.5],
  bush: [6, 2.5],
  heart: [4, 2.5],
  rock: [6, 2.5],
  reed: [4, 2.5],
  daisy: [3, 1.5],
  lilac: [3, 1.5],
  white: [3, 1.5],
  blue: [3, 1.5],
  pink: [3, 1.5],
  big: [3, 1.5],
}

/* ------------------------------------------------------------------ layout */

/** The pond: centre across the stage and into the ground, and its width. */
const POND = { x: 0.64, d: 0.6, w: 0.3 }
/** Placed by hand: kind, across (0 to 1), depth (0 horizon to 1), phone too. */
const SET: [Kind, number, number, boolean][] = [
  ['tree', 0.07, 0.2, false],
  ['bush', 0.33, 0.15, true],
  ['hog', 0.17, 0.42, true],
  ['heart', 0.47, 0.55, true],
  ['heart', 0.86, 0.84, false],
]
/** At the pond: across it (-1 to 1), far bank -1 to near bank 1, phone too. */
const AT_POND: [Kind, number, number, boolean][] = [
  ['cattail', -0.62, -0.95, true],
  ['cattail', -0.5, -1.02, true],
  ['reed', 0.9, -0.5, false],
  ['pad', -0.25, 0.05, true],
  ['pad', 0.35, -0.3, false],
  ['lily', 0.08, 0.42, true],
  ['rock', 1.08, 0.6, true],
  ['pebble', -1.12, 0.5, true],
  ['pebble', 0.62, 1.4, false],
]
/** Where the healthy pot plant stands in the closing garden. */
const PLANT_AT = [0.91, 0.42]
/** The playground's mix of small flowers. */
const FLOWERS: [Flower, number][] = [
  ['lilac', 0.3],
  ['white', 0.22],
  ['pink', 0.18],
  ['daisy', 0.16],
  ['blue', 0.14],
]

/* ------------------------------------------------------------------- build */

const SKY = 255
const SHADED = 4

interface Placed {
  k: Kind
  x: number
  base: number
  flip: boolean
}

interface FlowerAt extends Placed {
  k: Flower
}

interface Built {
  top: number
  /** One tone per ground pixel (0 to 3, plus SHADED), or SKY. */
  ground: Uint8Array
  pond: { x: number; y: number; rx: number; ry: number }
  placed: Placed[]
}

const built = new Map<string, Built>()

const halfWidth = (it: Placed, W: number, H: number) =>
  it.k === 'hog'
    ? (HEDGEHOG_SIDE_SIZE.w * GS) / 2
    : it.k === 'plant'
      ? 18 * plantK(W, H)
      : (SPRITE[it.k].w * GS) / 2

function build(W: number, H: number, bloom: boolean): Built {
  const key = `${W}x${H}:${bloom}`
  const hit = built.get(key)
  if (hit) return hit
  const gy = groundTop(W, H)
  const rows = H - gy
  const wide = W >= 300
  const at = (d: number) => Math.round(gy + d * DEPTH)

  // Where a screen pixel lies on the ground, in playground cells: across, and
  // away from you. Near the front one cell is two pixels; at the horizon one
  // row of pixels spans many cells.
  const R0 = 6
  const K = DEPTH + R0
  const plane = (x: number, y: number) => {
    const s = K / (Math.max(0, y - gy) + R0)
    return [((x - W / 2) / GS) * s, (K / GS) * s] as const
  }

  const prx = Math.max(40, Math.min(70, (POND.w * W) / 2))
  const pond = { x: POND.x * W, y: gy + POND.d * DEPTH, rx: prx, ry: prx * 0.24 }

  const fixed: Placed[] = []
  for (const [k, x, d, phone] of SET) if (wide || phone) fixed.push({ k, x: Math.round(x * W), base: at(d), flip: false })
  for (const [k, u, v, phone] of AT_POND) {
    if (wide || phone) fixed.push({ k, x: Math.round(pond.x + u * pond.rx), base: Math.round(pond.y + v * pond.ry), flip: false })
  }

  // Flowers, scattered. Kept off the pond and its bank, and out of the strip
  // just in front of and behind anything placed by hand, where they would
  // cover it or be lost behind it.
  const rand = mulberry32(0x9a7d)
  const flowers: FlowerAt[] = []
  const blockers = () => fixed.filter((o) => o.k !== 'pad' && o.k !== 'lily')
  let blocking = blockers()
  const blocked = (x: number, base: number, half: number) => {
    const px = (x - pond.x) / (pond.rx + 7)
    const py = (base - pond.y) / (pond.ry + 5)
    if (px * px + py * py < 1) return true
    return blocking.some(
      (o) => Math.abs(x - o.x) < halfWidth(o, W, H) + half * 0.6 && base > o.base - 10 && base < o.base + 12,
    )
  }
  const pick = (): Flower => {
    let r = rand()
    for (const [k, w] of FLOWERS) if ((r -= w) < 0) return k
    return FLOWERS[0][0]
  }
  const scatter = (want: number) => {
    for (let i = 0; i < 6000 && flowers.length < want; i++) {
      const x = 4 + rand() * (W - 8)
      const r = 10 + rand() * (rows - 11)
      const base = Math.round(gy + r)
      const [wx, wz] = plane(x, base)
      // Thicker in some places, bare in others, and thinner toward the
      // horizon, where flowers the same size as near ones would crowd.
      const dense = 0.4 + 0.6 * clamp01((fbm(wx * 0.03 + 11.4, wz * 0.03 + 5.2) - 0.25) * 2.4)
      const far = 0.3 + 0.7 * smooth(clamp01((r - 10) / 40))
      if (rand() > dense * far) continue
      let k: Flower = rand() < 0.05 ? 'big' : pick()
      let nearest: FlowerAt | null = null
      let best = 28 * 28
      for (const f of flowers) {
        const dd = (f.x - x) ** 2 + ((f.base - base) * 2.4) ** 2
        if (dd < best) {
          best = dd
          nearest = f
        }
      }
      // Big star flowers stay single and far apart, as in the playground.
      if (nearest && nearest.k !== 'big' && rand() < 0.32) k = nearest.k
      if (k === 'big' && flowers.some((f) => f.k === 'big' && Math.abs(f.x - x) < 80)) k = pick()
      const half = (SPRITE[k].w * GS) / 2
      if (x - half < 0 || x + half > W || blocked(x, base, half)) continue
      if (flowers.some((f) => ((f.x - x) / 16) ** 2 + ((f.base - base) / 6) ** 2 < 1)) continue
      flowers.push({ k, x: Math.round(x), base, flip: rand() < 0.5 })
    }
  }
  const area = W * Math.max(0, rows - 8)
  scatter(Math.round(area / 1786))
  if (bloom) {
    // The closing garden is the same garden, plus the plant and more flowers.
    fixed.push({ k: 'plant', x: Math.round(PLANT_AT[0] * W), base: at(PLANT_AT[1]), flip: false })
    blocking = blockers()
    for (let i = flowers.length - 1; i >= 0; i--) {
      const f = flowers[i]
      if (blocked(f.x, f.base, (SPRITE[f.k].w * GS) / 2)) flowers.splice(i, 1)
    }
    scatter(Math.round(area / 1374))
  }
  const placed = [...fixed, ...flowers].sort((a, b) => a.base - b.base)

  // The ground: the playground's recipe, big flat patches dithered only at
  // their edges. Far away it settles to one green with no dither at all, and
  // a pale hill rolls along behind.
  const edge = (x: number) => gy + Math.round((valueNoise(x * 0.02 + 1.7, 3.3) - 0.5) * 4)
  const hill = (x: number) => gy - Math.round(3 + valueNoise(x * 0.007 + 8.1, 1.9) * 9)
  const top = gy - 13
  const ground = new Uint8Array(W * (H - top)).fill(SKY)
  for (let x = 0; x < W; x++) {
    const e = edge(x)
    for (let y = Math.min(hill(x), e); y < H; y++) {
      let tone = 3
      if (y >= e) {
        const [wx, wz] = plane(x, y)
        const show = smooth(clamp01((y - gy - 2) / 11))
        const base = fbm(wx * 0.016 + 3.1, wz * 0.016 + 7.7) * 2.3
        const v = 1.55 + (base - 1.55) * show
        const dither = (bayer(x >> 1, y >> 1) - 0.5) * 0.9 * show
        tone = Math.max(0, Math.min(2, Math.floor(v + dither)))
      }
      ground[(y - top) * W + x] = tone
    }
  }
  for (const it of placed) {
    const s = SHADOW[it.k]
    if (!s) continue
    const rx = s[0] * GS
    const ry = s[1] * GS
    const cy = it.base - 1
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      if (y < top || y >= H) continue
      for (let x = Math.floor(it.x - rx); x <= Math.ceil(it.x + rx); x++) {
        if (x < 0 || x >= W) continue
        const dx = (x + 0.5 - it.x) / rx
        const dy = (y + 0.5 - cy) / ry
        const o = (y - top) * W + x
        if (dx * dx + dy * dy <= 1 && ground[o] !== SKY) ground[o] |= SHADED
      }
    }
  }

  const b = { top, ground, pond, placed }
  built.set(key, b)
  return b
}

/* -------------------------------------------------------------------- draw */

const HOG = decodeLayer(HEDGEHOG_SIDE)
const HOG_PAL = BALANCE_LOGO.palette.map(toRgb)

function drawPond(p: Painter, { x, y, rx, ry }: Built['pond']) {
  p.ellipse(x, y, rx + 2, ry + 1.5, c('wetRing'))
  p.ellipse(x, y, rx, ry, c('water'))
  p.ellipse(x + rx * 0.06, y + ry * 0.18, rx - 7, ry - 4, c('waterDeep'))
  // A slim, broken foam line along the far bank, and one faint ripple.
  for (let a = 200; a <= 340; a += 2) {
    const t = (a * Math.PI) / 180
    if (valueNoise(a * 0.35, 1.1) < 0.45) continue
    p.box(x + Math.cos(t) * (rx - 1), y + Math.sin(t) * (ry - 1), 2, 1, c('foam'))
  }
  p.ring(x - rx * 0.25, y + ry * 0.3, 7, 2.5, 1, c('waterLight'))
}

export interface GardenFrame {
  time: number
  reduced: boolean
  /** The closing garden: more flowers, and the healthy pot plant. */
  bloom: boolean
  /** Draws the pot plant standing at native (x, base), in its turn front to back. */
  plant?: (x: number, base: number) => void
}

/** Draw the garden over the whole canvas, in native pixels. */
export function drawGarden(p: Painter, W: number, H: number, f: GardenFrame) {
  const b = build(W, H, f.bloom)
  p.native()
  const tones = [c('grass3'), c('grass1'), c('grass2'), c('grass4')]
  const shaded = tones.map((t) => mix(t, c('shadow'), 0.2))
  for (let y = b.top; y < H; y++) {
    const row = (y - b.top) * W
    for (let x = 0; x < W; x++) {
      const v = b.ground[row + x]
      if (v !== SKY) p.px(x, y, v & SHADED ? shaded[v & 3] : tones[v & 3])
    }
  }
  drawPond(p, b.pond)

  for (const it of b.placed) {
    if (it.k === 'hog') {
      // Breathing, facing the pond.
      const bob = f.reduced ? 0 : Math.round(Math.max(0, Math.sin(f.time * 2)))
      const w = HEDGEHOG_SIDE_SIZE.w * GS
      p.triples(HOG, HOG_PAL, it.x - w / 2, it.base - HEDGEHOG_SIDE_SIZE.h * GS - bob, GS, HEDGEHOG_SIDE_SIZE.w, true)
    } else if (it.k === 'plant') {
      f.plant?.(it.x, it.base)
      p.native()
    } else {
      const sp = SPRITE[it.k]
      p.sprite(sp.rows, legend, Math.round(it.x - (sp.w * GS) / 2), it.base - sp.h * GS, GS, it.flip)
    }
  }
}
