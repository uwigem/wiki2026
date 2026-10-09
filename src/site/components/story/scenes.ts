import { BALANCE_LOGO, HEDGEHOG_SIDE, HEDGEHOG_SIDE_SIZE, decodeLayer } from '../../content/balanceLogo'
import { CONDITIONS, STORY, type SceneId } from '../../content/homeStory'
import { hash2 } from '../../../engine/noise'
import { SITE_PALETTE } from '../../theme'
import { drawGarden as drawMeadow, plantK } from './garden'
import { Painter, clamp01, mix, smooth, span, toRgb, type Rgb } from './painter'

/**
 * The ten scenes of the Home 3 story, one drawing function each, in the order
 * of the team's script.
 *
 * Each scene is a pure function of its progress `t` (0 to 1). The stage plays
 * `t` forward on a clock once the reader arrives, and fast-forwards it when
 * they scroll on, so every frame a reader can stop on is a frame the scene
 * was designed to show. (The first draft drove `t` straight from the scroll
 * position, so stopping halfway froze half finished transitions on screen.)
 *
 * Each scene also draws its own ENTRY from the scene before, starting exactly
 * where that one ended, so there are no jumps between scenes: the body scene
 * opens by parting the garden like curtains, the cilium scene opens a lens on
 * the body, and the closing scene closes that lens again onto the garden.
 *
 * Words are never drawn into the canvas. Scenes push `Label`s with native
 * pixel positions, and the stage renders them as HTML over the picture.
 */

export interface Box {
  x: number
  y: number
  w: number
  h: number
}

export interface Label {
  id: string
  text: string
  /** Native-pixel anchor. */
  x: number
  y: number
  align: 'left' | 'right' | 'center'
  alpha: number
  kind?: 'plain' | 'chip' | 'condition'
  /** Small line above the text, for the condition buttons. */
  eyebrow?: string
  active?: boolean
}

export interface Frame {
  p: Painter
  /** Whole stage, native pixels. */
  W: number
  H: number
  /** Where split scenes compose their subject (the part not under the text). */
  art: Box
  t: number
  /** Ambient clock in seconds, for small motion. Frozen for reduced motion. */
  time: number
  /** 0 to 1, from the watering slider. */
  water: number
  reduced: boolean
  labels: Label[]
}

/* ------------------------------------------------------------------ colour */

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

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/* ----------------------------------------------------------------- sprites */

/** The same SMO hexagon as the explainer and the Home 2 pictures. */
const SMO_ROWS = [
  '....oooooo....',
  '..oohhhhhhoo..',
  '.ohhhhhhhhbbo.',
  'ohhhhhhbbbbbbo',
  'ohhhhbbbbbbbbo',
  'obbbbbbbbbbbbo',
  'obbbbbbbbbbbbo',
  'obbbbbbbbbbbbo',
  '.obbbbbbbbbbo.',
  '..oobbbbbboo..',
  '....oooooo....',
]
const smoInk = (ch: string) =>
  ch === 'o' ? c('eye') : ch === 'b' ? c('lilacPetal') : ch === 'h' ? c('lilacHi') : undefined

const HOG = decodeLayer(HEDGEHOG_SIDE)
const HOG_PAL = BALANCE_LOGO.palette.map(toRgb)

/* ------------------------------------------------------------------ camera */

/** Every scene is designed inside a 160 x 120 box of design units. */
const BOX_W = 160
const BOX_H = 120
const fitK = (art: Box) => Math.min(art.w / BOX_W, art.h / BOX_H) * 0.94

/** Put design point (dx, dy) at fraction (ax, ay) of the art area, zoomed by z. */
function cam(f: Frame, dx: number, dy: number, z: number, ax = 0.5, ay = 0.5) {
  const k = fitK(f.art) * z
  f.p.view(f.art.x + f.art.w * ax - dx * k, f.art.y + f.art.h * ay - dy * k, k)
  return k
}

/** The close-up on the cilium that scenes 4 and 6 to 9 share. */
const CLOSE = { dx: 96, dy: 40, z: 2.2, ax: 0.38, ay: 0.5 }
/** The whole cell, cilium and all. */
const WHOLE = { dx: 102, dy: 73, z: 0.88, ax: 0.5, ay: 0.5 }
const closeCam = (f: Frame) => cam(f, CLOSE.dx, CLOSE.dy, CLOSE.z, CLOSE.ax, CLOSE.ay)

function label(f: Frame, l: Omit<Label, 'x' | 'y'> & { dx: number; dy: number }) {
  const { dx, dy, ...rest } = l
  f.labels.push({ ...rest, x: f.p.nx(dx), y: f.p.ny(dy) })
}

/** On a narrow picture, long labels beside the cilium would cover it. */
const narrow = (f: Frame) => f.art.w < 230

/* ------------------------------------------------------------------ garden */

/** The pond garden, over the whole stage. Scenes 1, 2 (as it parts) and 10. */
function drawGarden(f: Frame, bloom: boolean) {
  const { p, W, H } = f
  drawMeadow(p, W, H, {
    time: f.time,
    reduced: f.reduced,
    bloom,
    // The plant from the watering scene, healthy and blooming in the garden.
    plant: (x, base) => {
      const k = plantK(W, H)
      p.view(x - 80 * k, base - 114 * k, k)
      drawPlant(f, 0.5, { chipAlpha: 0, can: false })
    },
  })
}

/* -------------------------------------------------------------------- body */

const REGIONS: Record<string, { x: number; y: number; rx: number; ry: number; lx: number; ly: number; side: 'left' | 'right' }> = {
  brain: { x: 80, y: 13, rx: 5.5, ry: 4.5, lx: 104, ly: 12, side: 'right' },
  skin: { x: 58, y: 55, rx: 3.6, ry: 5, lx: 38, ly: 46, side: 'left' },
  heart: { x: 85, y: 40, rx: 4.5, ry: 4.2, lx: 104, ly: 40, side: 'right' },
  muscle: { x: 74, y: 83, rx: 4, ry: 9, lx: 40, ly: 84, side: 'left' },
}
/** When each region lights, as progress through the self-playing scene. */
const LIT_AT = [0.2, 0.34, 0.48, 0.62]
const ALL_AT = 0.8

/** A simplified, front-facing person, drawn as one outlined silhouette. */
function drawFigure(f: Frame) {
  const { p } = f
  const fill = c('petalWhite')
  const edge = c('bushDark')
  const k = p.k
  const limb = (x0: number, y0: number, x1: number, y1: number, w: number, col: Rgb, grow: number) =>
    p.line(x0, y0, x1, y1, w * k + grow, col)
  // Outline pass, then fill pass, so overlapping parts merge into one shape.
  for (const pass of [0, 1] as const) {
    const col = pass === 0 ? edge : fill
    const g = pass === 0 ? 4 : 0
    const e = pass === 0 ? 2 / k : 0
    limb(66, 32, 57, 62, 6.5, col, g)
    limb(94, 32, 103, 62, 6.5, col, g)
    p.ellipse(56.5, 64, 3.6 + e, 3.6 + e, col)
    p.ellipse(103.5, 64, 3.6 + e, 3.6 + e, col)
    p.rounded(67 - e, 64 - e, 11 + e * 2, 46 + e * 2, col)
    p.rounded(82 - e, 64 - e, 11 + e * 2, 46 + e * 2, col)
    p.ellipse(72, 111, 7 + e, 3 + e, col)
    p.ellipse(88, 111, 7 + e, 3 + e, col)
    p.rounded(64 - e, 28 - e, 32 + e * 2, 40 + e * 2, col)
    p.rect(76.5 - e, 23, 7 + e * 2, 7, col)
    p.ellipse(80, 15, 9.5 + e, 10.5 + e, col)
  }
}

/**
 * The lit regions and their buttons. One hue throughout: regions already
 * shown stay soft pink, and the newest is deep pink with a ring pulsing out
 * of it. (The draft lit the newest one yellow with a pale halo, which got
 * lost against the white figure, and changed its colour as it aged, which
 * read as a second meaning that was not there.)
 */
function drawRegions(f: Frame, t: number, fade = 1) {
  const { p } = f
  const lit = LIT_AT.filter((a) => t >= a).length
  const all = t >= ALL_AT
  const pulse = f.reduced ? 0.4 : (f.time * 0.9) % 1
  CONDITIONS.forEach((cond, i) => {
    if (i >= lit) return
    const r = REGIONS[cond.id]
    const active = all || i === lit - 1
    const grow = smooth(span(t, LIT_AT[i], LIT_AT[i] + 0.06))
    p.alpha = fade
    p.ellipse(r.x, r.y, Math.max(0.5, r.rx * grow), Math.max(0.5, r.ry * grow), active ? c('pinkDark') : c('pinkBud'))
    if (active && grow >= 1) {
      p.alpha = fade * (1 - pulse)
      p.ring(r.x, r.y, r.rx + 1.5 + pulse * 6, r.ry + 1.5 + pulse * 6, 2, c('pinkDark'))
    }
    // Leader line, drawn out from the region to where its button sits.
    p.alpha = fade
    const sx = r.side === 'right' ? r.x + r.rx + 1 : r.x - r.rx - 1
    p.line(sx, r.y, lerp(sx, r.lx, grow), lerp(r.y, r.ly, grow), 1.5, c('shadow'))
    p.alpha = 1
    // On a narrow picture the full names do not fit beside the figure (they
    // ran off both edges of a phone), so the button shows just the body part
    // and the name and explanation open in the text band when tapped.
    label(f, {
      id: `cond-${cond.id}`,
      kind: 'condition',
      text: narrow(f) ? cond.region : cond.name,
      eyebrow: narrow(f) ? undefined : cond.region,
      dx: r.side === 'right' ? r.lx + 1.5 : r.lx - 1.5,
      dy: r.ly,
      align: r.side === 'right' ? 'left' : 'right',
      alpha: grow * fade,
      active,
    })
  })
}

/* -------------------------------------------------------------------- cell */

/**
 * The cell is round and a little taller than wide, so in the close-up its
 * sides curve down and leave through the bottom of the picture. (The draft's
 * cell was wide and flat, and was cut off square by the edge of the picture.)
 */
const CELL = { cx: 102, cy: 98, rx: 33, ry: 36 }
const CIL_X = 96
const CIL_TOP = 12
const CIL_BASE = 66
const CIL_W = 9
/** Where each SMO sits up the cilium, bottom first. Eight fit below the tip. */
const smoY = (i: number) => 56 - i * 4.9

interface CellOpts {
  glow?: number
  smo?: number
  /** Let the SMO jiggle. Only while they are the subject. */
  jiggle?: boolean
}

function drawCell(f: Frame, o: CellOpts = {}) {
  const { p } = f
  const glow = o.glow ?? 0
  p.ellipse(CELL.cx, CELL.cy, CELL.rx, CELL.ry, c('bushLight'), c('bushDark'))
  p.ellipse(107, 104, 13, 9, c('bushMid'), c('bushDark'), 1)
  p.ellipse(104, 102, 3, 2.4, c('bushDark'))
  for (const [x, y, rx] of [
    [86, 88, 3.5],
    [120, 92, 3],
    [96, 121, 4],
    [117, 116, 3],
    [83, 108, 3],
  ])
    p.ellipse(x, y, rx, rx * 0.7, c('bushMid'))

  if (glow > 0) {
    p.alpha = glow * 0.55
    p.capsule(CIL_X, CIL_TOP - 3, CIL_BASE, CIL_W + 7, c('daisyHi'))
    p.alpha = 1
  }
  p.capsule(CIL_X, CIL_TOP, CIL_BASE, CIL_W, c('petalWhite'), mix(c('bushDark'), c('daisyCore'), glow))
  p.ellipse(CIL_X, CIL_BASE - 1.2, 2.4, 1.2, c('bushMid'))

  // SMO, filling up from the base. The fractional part slides in from below.
  const n = o.smo ?? 0
  const whole = Math.floor(n)
  const jig = (i: number) => (o.jiggle && !f.reduced ? Math.sin(f.time * 2.3 + i * 1.7) * 0.5 : 0)
  for (let i = 0; i < whole; i++) drawSmo(f, CIL_X + jig(i), smoY(i))
  const frac = n - whole
  if (frac > 0.01) {
    const keep = p.alpha
    p.alpha = keep * frac
    drawSmo(f, CIL_X, lerp(CIL_BASE + 4, smoY(whole), smooth(frac)))
    p.alpha = keep
  }
}

/** One SMO hexagon, centred on a design-space point, always 1 native px per cell. */
function drawSmo(f: Frame, x: number, y: number) {
  f.p.sprite(SMO_ROWS, smoInk, x - 7 / f.p.k, y - 5.5 / f.p.k, 1)
}

/* ---------------------------------------------------------------- proteins */

function megf8(f: Frame, x: number, y: number) {
  f.p.rounded(x - 2.6, y - 7, 5.2, 14, c('bluePetal'), c('eye'), 1)
  f.p.rect(x - 1.6, y - 5.5, 1.2, 9, c('blueHi'))
}
function mosmo(f: Frame, x: number, y: number) {
  f.p.rounded(x - 2.6, y - 3, 5.2, 6, c('daisyPetal'), c('eye'), 1)
  f.p.rect(x - 1.6, y - 2, 1.2, 3, c('daisyHi'))
}
function mgrn1(f: Frame, x: number, y: number) {
  f.p.ellipse(x, y, 4.6, 4.2, c('pinkBud'), c('pinkDark'), 1)
  f.p.ellipse(x - 1.4, y - 1.4, 1.2, 1, c('pinkHi'))
}
function target(f: Frame, x: number, y: number) {
  f.p.rounded(x - 3, y - 3, 6, 6, c('sprout'), c('eye'), 1)
  f.p.rect(x - 2, y - 2, 1.4, 1.4, c('sproutHi'))
}

/** Where the three parts float before they assemble, and where they dock. */
const FLOAT = { megf8: [114, 40], mosmo: [125, 33], mgrn1: [136, 40] } as const
const DOCK = { megf8: [107.5, 62], mosmo: [112, 56.5], mgrn1: [113.5, 49.5] } as const
const PART_NAMES = ['megf8', 'mosmo', 'mgrn1'] as const
const PART_DRAW = { megf8, mosmo, mgrn1 }
/** The "MMM complex" chip sits here in every scene, so it never jumps. */
const MMM_AT = [123, 48] as const

function partAt(f: Frame, name: (typeof PART_NAMES)[number], i: number, u: number) {
  const a = FLOAT[name]
  const b = DOCK[name]
  const e = smooth(u)
  const bob = (f.reduced ? 0 : Math.sin(f.time * 1.6 + i) * 0.8) * (1 - e)
  return [lerp(a[0], b[0], e), lerp(a[1], b[1], e) + bob] as const
}

function partLabel(f: Frame, name: (typeof PART_NAMES)[number], x: number, y: number, alpha: number) {
  label(f, {
    id: name,
    kind: 'chip',
    text: name.toUpperCase(),
    dx: x,
    dy: name === 'mosmo' ? y - 7 : y + (name === 'megf8' ? 11 : 8),
    align: 'center',
    alpha,
  })
}

function mmmLabel(f: Frame, alpha: number, dx = 0, dy = 0) {
  label(f, { id: 'mmm', kind: 'chip', text: 'MMM complex', dx: MMM_AT[0] + dx, dy: MMM_AT[1] + dy, align: 'left', alpha })
}

/** The assembled complex, inside one outline so it reads as one machine. */
function drawComplex(f: Frame, dx = 0, dy = 0, alpha = 1) {
  const { p } = f
  p.alpha = alpha
  p.ellipse(110.5 + dx, 56 + dy, 8.5, 12.5, c('daisyHi'), c('daisyCore'), 1)
  for (const name of PART_NAMES) PART_DRAW[name](f, DOCK[name][0] + dx, DOCK[name][1] + dy)
  p.alpha = 1
}

/* ------------------------------------------------------------------- chain */

const pathLength = (pts: [number, number][]) => {
  let n = 0
  for (let i = 1; i < pts.length; i++) n += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
  return n
}

/** A run of chain links along a polyline, drawn up to `len` design units of it. */
function drawChain(f: Frame, pts: [number, number][], len = Infinity, alpha = 1) {
  const { p } = f
  const end = Math.min(len, pathLength(pts))
  const keep = p.alpha
  p.alpha = keep * alpha
  let n = 0
  for (let s = 0; s <= end; s += 2.4, n++) {
    let rem = s
    let i = 1
    while (i < pts.length - 1) {
      const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
      if (rem <= d) break
      rem -= d
      i++
    }
    const a = pts[i - 1]
    const b = pts[i]
    const d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    const x = lerp(a[0], b[0], Math.min(1, rem / d))
    const y = lerp(a[1], b[1], Math.min(1, rem / d))
    const wide = n % 2 === 0
    p.ellipse(x, y, wide ? 1.5 : 1, wide ? 1 : 1.5, c('stoneMid'), c('stoneDark'), 1)
  }
  p.alpha = keep
}

/** The linker: out of MGRN1, up beside the cilium, and in to a target. */
const chainPath = (ty: number): [number, number][] => [
  [DOCK.mgrn1[0], DOCK.mgrn1[1] - 4],
  [106, 34],
  [104, ty],
  [CIL_X + 3, ty],
]
/** Where targets sit, and how far down the linker drags one before throwing it out. */
const TARGET_Y = 22
const PULL_TO = 37
/** How much chain stays out of MGRN1 between targets. */
const CHAIN_REST = 6

/* ------------------------------------------------------------------- plant */

/**
 * A watering can that tips further as it pours, with a rose (the perforated
 * head) on the end of its spout. Returns the mouth of the rose, which is where
 * the water leaves.
 */
function drawCan(f: Frame, w: number): [number, number] {
  const { p } = f
  const a = 0.12 + 0.48 * w
  const cs = Math.cos(a)
  const sn = Math.sin(a)
  /** Can-space to design-space, so the whole can tilts as one object. */
  const R = (x: number, y: number): [number, number] => [28 + x * cs - y * sn, 31 + x * sn + y * cs]
  const ink = c('eye')
  const blue = c('bluePetal')
  const hi = c('blueHi')
  const wpx = Math.max(2, Math.round(2.4 * p.k))
  const run = (pts: [number, number][], width: number, col: Rgb) => {
    for (let i = 1; i < pts.length; i++) p.line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], width, col)
  }
  const handle = [R(1, -7), R(-3, -13), R(-12, -11), R(-14, -3), R(-11, 3)]
  const spout = [R(9, 4), R(24, -9)]
  run(handle, wpx + 2, ink)
  run(spout, wpx + 2, ink)
  p.poly([R(-10, -7), R(10, -7), R(11, 8), R(-11, 8)], blue, ink, 1)
  p.poly([R(-10.6, 1), R(10.6, 1), R(10.8, 3), R(-10.8, 3)], mix(blue, ink, 0.22))
  p.poly([R(-8, -5), R(-6.2, -5), R(-6.6, 6), R(-8.5, 6)], hi)
  run(handle, wpx, blue)
  run(spout, wpx, blue)
  // The rose: a flat perforated head across the end of the spout, so it reads
  // as something water sprays out of rather than a ball stuck on a pipe. Its
  // corners are the spout axis and its perpendicular, which keeps it square to
  // the spout at every tilt.
  p.poly([R(21.8, -13), R(27.7, -6.2), R(30.2, -8.3), R(24.3, -15.1)], hi, ink, 1)
  p.line(22.9, -14, 25.4, -11.1, Math.max(1, p.k), mix(blue, ink, 0.3))
  return R(27.4, -11.8)
}

/**
 * The water: a shower of droplets out of the rose.
 *
 * Not a few drops on one path, which is what a single arc of evenly spaced
 * drops looks like: a dotted line. A rose makes a cone of many fine droplets,
 * so every droplet gets its own lane across the fan, its own speed and its own
 * place in the fall, all from a hash of its index, so it is the same droplet
 * frame to frame rather than a flicker of new ones. They fall under gravity,
 * which bunches them near the rose and spreads them out lower down by itself.
 *
 * The first stretch out of the rose is drawn unbroken, because water leaves a
 * spout as a stream and only breaks up once it is moving.
 */
function drawWater(f: Frame, w: number, from: [number, number]) {
  const { p } = f
  if (w < 0.04) return
  /** The top of the soil, where the water lands. */
  const soil = 92.4
  const fall = soil - from[1]
  const spread = 3 + w * 9
  const t = f.reduced ? 0.42 : f.time * 0.8
  /** One water pixel, kept whole so droplets stay crisp at any zoom. */
  const u = Math.max(1, Math.round(p.k * 0.75))
  const lane = (r: number) => 77 + (r - 0.5) * 2 * spread
  /** Where a droplet in `land`'s lane is, `q` of the way down. */
  const at = (land: number, q: number) =>
    [lerp(from[0], land, q), from[1] + fall * q * q] as const

  // Out of the rose: a short unbroken stream, narrowing as it picks up speed.
  for (const r of [0.3, 0.5, 0.7]) {
    const land = lane(r)
    const [bx, by] = at(land, 0.1)
    const [cx, cy] = at(land, 0.24)
    p.line(from[0], from[1], bx, by, u * 2, c('waterDeep'))
    p.line(bx, by, cx, cy, u, c('waterDeep'))
  }

  const n = Math.round(16 + w * 34)
  for (let i = 0; i < n; i++) {
    const land = lane(hash2(i, 11))
    const speed = 0.85 + hash2(i, 23) * 0.35
    const q = (t * speed + hash2(i, 37)) % 1
    if (q < 0.22) continue
    const [x, y] = at(land, q)
    // Droplets stretch as they speed up, which is what falling water does.
    const tall = 1 + Math.round(q * 2)
    const nx = Math.round(p.nx(x)) - u
    const ny = Math.round(p.ny(y)) - u * tall
    p.box(nx, ny, u * 2, u * (tall + 1), c('waterDeep'))
    p.box(nx + u, ny + u, u, u, c('water'))

    // The splash each droplet throws as it arrives.
    if (q > 0.9 && !f.reduced) {
      const e = (q - 0.9) / 0.1
      const keep = p.alpha
      p.alpha = keep * (1 - e)
      for (const side of [-1, 1]) {
        const sx = Math.round(p.nx(land + side * (1.4 + e * 2.2)))
        p.box(sx, Math.round(p.ny(soil - Math.sin(e * Math.PI) * 3.5)), u, u, c('waterLight'))
      }
      p.alpha = keep
    }
  }

  // A wet sheen where it is landing, so the soil looks rained on.
  const keep = p.alpha
  p.alpha = keep * 0.45
  p.ellipse(77, soil + 0.8, spread + 2, 1.2, c('waterLight'))
  p.alpha = keep
}

/**
 * The watering-analogy plant, entirely from one number. Under half: drier,
 * straw coloured, bending over. Over half: pale, drooping, standing in a
 * puddle. A dead zone around the middle keeps "just right" generous.
 *
 * Drawn back to front so nothing crosses wrongly: puddle, pot, rim, the soil
 * showing over the rim, and only then the stem, which grows out of the soil
 * instead of running down across the pot.
 */
function drawPlant(f: Frame, w: number, opt: { chipAlpha?: number; can?: boolean } = {}) {
  const { p } = f
  const dev = (w - 0.5) / 0.5
  const d = smooth(clamp01((Math.abs(dev) - 0.22) / 0.78))
  const under = dev < 0
  const sick = under ? c('quill') : c('daisyPetal')

  if (!under && dev > 0.35) {
    const pw = (dev - 0.35) / 0.65
    p.ellipse(80, 114, 14 + pw * 16, 2 + pw * 2.5, c('waterLight'), c('water'), 1)
  }
  // Terracotta pot, lit from the left and shaded on the right.
  const shade = mix(c('berry'), c('spikeMid'), 0.35)
  for (let y = 97; y < 114; y++) {
    const half = 14 - (y - 97) * 0.22
    p.rect(80 - half, y, half * 2, 1, c('berry'))
    p.rect(80 + half * 0.4, y, half * 0.6, 1, shade)
    p.rect(80 - half + 1, y, 1, 1, c('berryHi'))
  }
  p.rect(69.6, 113, 20.8, 1, shade)
  p.rect(63, 93.5, 34, 4, c('berry'))
  p.rect(63 + 34 * 0.72, 93.5, 34 * 0.28, 4, shade)
  p.rect(63, 93.5, 34, 0.9, c('berryHi'))
  p.rect(63, 96.8, 34, 0.9, shade)
  const wet = clamp01(w * 1.25)
  p.ellipse(80, 93.6, 14.5, 1.7, mix(c('quillDark'), c('spikeLow'), wet))
  if (under && dev < -0.4) {
    p.line(73, 93.6, 76, 93.9, 1, c('spikeLow'))
    p.line(84, 93.4, 87, 93.8, 1, c('spikeLow'))
  }

  // Stem: segments that bend more toward the tip as the plant suffers.
  const L = 4.1
  const N = 12
  const pts: [number, number][] = [[80, 93.6]]
  const dir = under ? 1 : -1
  let ang = 0
  for (let i = 1; i <= N; i++) {
    ang = d * 1.75 * Math.pow(i / N, 1.5) * dir
    const [px, py] = pts[i - 1]
    pts.push([px + Math.sin(ang) * L, py - Math.cos(ang) * L])
  }
  const stemCol = mix(c('stem'), sick, d * 0.8)
  for (let i = 1; i <= N; i++) p.line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], Math.max(2, 1.3 * p.k), stemCol)

  // Leaves, alternating sides, lifting when healthy and hanging when not.
  const leafCol = mix(c('leaf'), sick, d)
  const leafHi = mix(c('leafHi'), sick, d)
  ;[3, 5, 7, 9].forEach((si, n) => {
    const side = n % 2 === 0 ? 1 : -1
    const segAng = d * 1.75 * Math.pow(si / N, 1.5) * dir
    const lift = ((55 - 120 * d) * Math.PI) / 180
    const a = segAng + side * (Math.PI / 2 - lift)
    const [sx, sy] = pts[si]
    const len = 9
    const ex = sx + Math.sin(a) * len
    const ey = sy - Math.cos(a) * len
    p.line(sx, sy, lerp(sx, ex, 0.8), lerp(sy, ey, 0.8), Math.max(2, 2.8 * p.k), leafCol)
    p.line(lerp(sx, ex, 0.8), lerp(sy, ey, 0.8), ex, ey, Math.max(1, 1.4 * p.k), leafCol)
    p.line(sx, sy, lerp(sx, ex, 0.65), lerp(sy, ey, 0.65), Math.max(1, 0.8 * p.k), leafHi)
  })

  // Flower: outlined pink petals round a gold centre. Open when healthy;
  // closing, paling and dropping petals when not.
  const [tx, ty] = pts[N]
  const open = 1 - d
  const petal = mix(c('pinkBud'), sick, d * 0.8)
  const edge = mix(c('pinkDark'), sick, d * 0.5)
  const pr = 3 * (0.5 + 0.5 * open)
  const dist = 1.4 + 3.7 * open
  const petals: [number, number][] = []
  for (let i = 0; i < 6; i++) {
    if (d > 0.55 && i % 2 === 1) continue
    const a = (i / 6) * Math.PI * 2 + ang
    petals.push([tx + Math.cos(a) * dist, ty + Math.sin(a) * dist])
  }
  const ring = 1 / p.k
  for (const [x, y] of petals) p.ellipse(x, y, pr + ring, pr + ring, edge)
  for (const [x, y] of petals) p.ellipse(x, y, pr, pr, petal)
  for (const [x, y] of petals) p.ellipse(x - pr * 0.3, y - pr * 0.3, pr * 0.32, pr * 0.32, mix(c('pinkHi'), sick, d))
  const cr = 2.6 * (0.6 + 0.4 * open)
  p.ellipse(tx, ty, cr, cr, c('daisyCore'), c('spikeMid'), 1)
  p.ellipse(tx - cr * 0.3, ty - cr * 0.3, cr * 0.35, cr * 0.35, c('daisyHi'))
  if (under && d > 0.5) {
    p.ellipse(70, 92.8, 1.6, 0.9, petal)
    p.ellipse(90, 93, 1.6, 0.9, petal)
  }

  if (opt.can !== false) drawWater(f, w, drawCan(f, w))

  const chip = opt.chipAlpha ?? 1
  if (chip > 0) {
    const word = dev < -0.35 ? 'Wilting' : dev > 0.35 ? 'Overwatered' : 'Blooming'
    label(f, { id: 'plant-state', kind: 'chip', text: word, dx: 80, dy: 120, align: 'center', alpha: chip })
  }
}

/* --------------------------------------------------------- signal readout */

/**
 * The hedgehog as the Hedgehog-signal readout, in the right of the picture.
 * Its sound lines are clamped inside the picture (in the draft they ran off
 * the right edge), and the meter is outlined, with green, orange and pink
 * steps, because pale yellow steps on cream could not be seen.
 */
function drawReadout(f: Frame, level: number, alpha = 1, slide = 0) {
  const { p, art } = f
  p.native()
  const keep = p.alpha
  p.alpha = keep * alpha
  const hs = Math.max(2, Math.min(3, Math.floor(Math.min((art.w * 0.3) / 19, (art.h * 0.34) / 24))))
  const cx = Math.round(art.x + art.w * 0.74 + slide)
  const top = Math.round(art.y + art.h * 0.2)
  const hx = Math.round(cx - (19 * hs) / 2)
  p.triples(HOG, HOG_PAL, hx, top, hs, HEDGEHOG_SIDE_SIZE.w, true)

  // Sound arcs in front of its nose, like a speaker icon: one, two or three.
  const ox = hx + 18 * hs
  const oy = top + 6 * hs
  const n = 1 + Math.round(level * 2)
  const maxX = art.x + art.w - 4
  for (const pass of [0, 1]) {
    for (let i = 0; i < n; i++) {
      const r = (4 + i * 3.5) * hs
      for (let deg = -48; deg <= 48; deg += 2) {
        const a = (deg * Math.PI) / 180
        const x = ox + Math.cos(a) * r
        if (x + 3 > maxX) continue
        const y = oy + Math.sin(a) * r
        if (pass === 0) p.box(x - 1, y - 1, 4, 4, c('spikeMid'))
        else p.box(x, y, 2, 2, c('berry'))
      }
    }
  }

  const mw = 19 * hs
  const seg = Math.floor((mw - 4) / 3)
  const sh = 4 * hs
  const my = top + 24 * hs + 6
  const fills = [c('leaf'), c('berry'), c('pinkDark')]
  for (let i = 0; i < 3; i++) {
    const x = hx + i * (seg + 2)
    const on = level * 2 >= i - 0.01
    p.box(x - 1, my - 1, seg + 2, sh + 2, c('shadow'))
    p.box(x, my, seg, sh, on ? fills[i] : c('bushHi'))
  }
  p.alpha = keep
  const word = level < 0.25 ? 'Low' : level < 0.75 ? 'Intermediate' : 'High'
  f.labels.push({ id: 'readout-title', text: 'Hedgehog signal', x: cx, y: top - 14, align: 'center', alpha })
  f.labels.push({ id: 'readout-level', kind: 'chip', text: word, x: cx, y: my + sh + 12, align: 'center', alpha })
}

/* ------------------------------------------------------------------- lens */

/** Draw `inner` inside a circle of the picture, with a rim, like a lens. */
function lens(f: Frame, cx: number, cy: number, r: number, inner: () => void) {
  const { p } = f
  if (r <= 0.5) return
  p.mask = { cx, cy, r }
  p.native()
  p.wash(c('bushHi'))
  inner()
  p.mask = null
  p.native()
  p.ring(cx, cy, r + 2, r + 2, 3, c('bushDark'))
}

/** A lens radius that covers the whole stage from (cx, cy). */
const coverAll = (f: Frame, cx: number, cy: number) =>
  Math.max(Math.hypot(cx, cy), Math.hypot(f.W - cx, cy), Math.hypot(cx, f.H - cy), Math.hypot(f.W - cx, f.H - cy)) + 4

/** The cilium as scene 9 leaves it, for the closing lens. */
function drawRecovered(f: Frame) {
  closeCam(f)
  drawCell(f)
  for (const i of [0, 1]) drawSmo(f, CIL_X, smoY(i))
  for (const y of [TARGET_Y, 30, 38]) target(f, CIL_X, y)
}

/* ------------------------------------------------------------------ scenes */

function sceneGarden(f: Frame) {
  drawGarden(f, false)
}

function sceneDiseases(f: Frame) {
  const { p, W, t } = f
  cam(f, 80, 60, 1)
  drawFigure(f)
  drawRegions(f, t)
  // Entry: the garden parts like curtains to reveal the figure behind it.
  const e = smooth(span(t, 0, 0.13))
  if (e < 1) {
    p.clip(0, W / 2)
    p.shiftX = -e * W * 0.62
    drawGarden(f, false)
    p.clip(W / 2, Infinity)
    p.shiftX = e * W * 0.62
    drawGarden(f, false)
    p.clip()
    p.shiftX = 0
  }
}

/**
 * Zoom toward the chest while a lens opens on a cell; the lens grows until it
 * is the whole picture, and the camera travels up the cell to its cilium,
 * which lights up. The camera starts exactly where scene 2 left it.
 */
function sceneCilium(f: Frame) {
  const { p, t, art } = f
  const zoom = smooth(span(t, 0, 0.38))
  const open = smooth(span(t, 0.06, 0.38))
  const travel = smooth(span(t, 0.38, 0.62))
  const glow = smooth(span(t, 0.6, 0.72))

  const cellView = () => {
    cam(
      f,
      lerp(WHOLE.dx, CLOSE.dx, travel),
      lerp(WHOLE.dy, CLOSE.dy, travel),
      lerp(WHOLE.z, CLOSE.z, travel),
      lerp(WHOLE.ax, CLOSE.ax, travel),
      lerp(WHOLE.ay, CLOSE.ay, travel),
    )
    drawCell(f, { glow })
  }
  if (open < 1) {
    cam(f, lerp(80, 84, zoom), lerp(60, 44, zoom), lerp(1, 3.4, zoom))
    drawFigure(f)
    // The disease buttons go before the zoom carries them anywhere: left to
    // fade with it, they slid under the text column on a wide screen.
    drawRegions(f, 1, 1 - span(t, 0, 0.05))
    const cx = lerp(p.nx(84), art.x + art.w / 2, open)
    const cy = lerp(p.ny(44), art.y + art.h / 2, open)
    lens(f, cx, cy, (Math.hypot(art.w, art.h) / 2 + 8) * open, cellView)
  } else {
    cellView()
  }
  closeCam(f)
  label(f, { id: 'cilium', kind: 'chip', text: 'primary cilium', dx: CIL_X + 9, dy: 18, align: 'left', alpha: glow })
}

/** Smooth steps between the three levels: low, intermediate, high. */
const LEVEL_AT = [0.42, 0.7]
const smoLevel = (t: number) =>
  smooth(span(t, LEVEL_AT[0], LEVEL_AT[0] + 0.1)) * 0.5 + smooth(span(t, LEVEL_AT[1], LEVEL_AT[1] + 0.1)) * 0.5
const SMO_LOW = 2
const SMO_MID = 5
const SMO_HIGH = 8
const smoCount = (level: number) => lerp(SMO_LOW, SMO_HIGH, level)

function smoLabel(f: Frame, alpha: number, dy = smoY(0)) {
  const text = narrow(f) ? 'SMO' : 'SMO (Smoothened)'
  label(f, { id: 'smo', kind: 'chip', text, dx: CIL_X - 8, dy, align: 'right', alpha })
}

function sceneSmo(f: Frame) {
  const { t } = f
  closeCam(f)
  const enter = smooth(span(t, 0, 0.14))
  const level = smoLevel(t)
  // The first two SMO arrive one by one; then the level steps up twice.
  const n = t < 0.32 ? SMO_LOW * span(t, 0.1, 0.32) : smoCount(level)
  drawCell(f, { glow: lerp(1, 0.25, enter), smo: n, jiggle: true })
  label(f, { id: 'cilium', kind: 'chip', text: 'primary cilium', dx: CIL_X + 9, dy: 18, align: 'left', alpha: 1 - enter })
  smoLabel(f, span(t, 0.32, 0.4))
  // The readout slides in instead of appearing from one frame to the next.
  drawReadout(f, level, enter, (1 - enter) * 16)
}

function sceneWater(f: Frame) {
  const { p, t } = f
  const inAmt = smooth(span(t, 0, 0.12))
  cam(f, 80, 64, 1)
  drawPlant(f, f.water, { chipAlpha: span(t, 0.1, 0.16) })
  if (inAmt < 1) {
    // Dissolve out of the cilium close-up, readout and all.
    p.alpha = 1 - inAmt
    p.wash(c('bushHi'))
    closeCam(f)
    drawCell(f, { glow: 0.25, smo: SMO_HIGH, jiggle: true })
    smoLabel(f, 1 - inAmt)
    drawReadout(f, 1, 1 - inAmt)
    p.alpha = 1
  }
}

function sceneParts(f: Frame) {
  const { p, t } = f
  const inAmt = smooth(span(t, 0, 0.16))
  closeCam(f)
  drawCell(f, { smo: SMO_MID })
  const show = [span(t, 0.2, 0.3), span(t, 0.4, 0.5), span(t, 0.6, 0.7)]
  PART_NAMES.forEach((name, i) => {
    if (show[i] <= 0) return
    const [x, y] = partAt(f, name, i, 0)
    p.alpha = show[i]
    PART_DRAW[name](f, x, y)
    p.alpha = 1
    partLabel(f, name, x, y, show[i])
  })
  if (inAmt < 1) {
    p.alpha = 1 - inAmt
    p.wash(c('bushHi'))
    cam(f, 80, 64, 1)
    drawPlant(f, f.water, { chipAlpha: 1 - inAmt })
    p.alpha = 1
  }
}

/**
 * The three parts assemble into the complex at the base of the cilium, and
 * then it does its job once: it tags the lowest SMO, which leaves through the
 * base, and the rest settle down as a new one arrives. One pass, ending at
 * rest, so the next scene starts from exactly this picture.
 */
function sceneMmm(f: Frame) {
  const { p, t } = f
  closeCam(f)
  if (t < 0.5) {
    const u = span(t, 0.05, 0.42)
    drawCell(f, { smo: SMO_MID })
    const merge = span(t, 0.36, 0.46)
    PART_NAMES.forEach((name, i) => {
      const [x, y] = partAt(f, name, i, u)
      PART_DRAW[name](f, x, y)
      partLabel(f, name, x, y, 1 - merge)
    })
    if (merge > 0) drawComplex(f, 0, 0, merge)
    mmmLabel(f, merge)
    return
  }
  const cyc = span(t, 0.5, 0.96)
  const tagGo = smooth(span(cyc, 0, 0.35))
  const leave = smooth(span(cyc, 0.35, 0.7))
  const arrive = span(cyc, 0.7, 1)
  drawCell(f)
  for (let i = 1; i < SMO_MID; i++) drawSmo(f, CIL_X, lerp(smoY(i), smoY(i - 1), leave))
  const ly = lerp(smoY(0), CIL_BASE + 10, leave)
  p.alpha = 1 - leave
  drawSmo(f, CIL_X + leave * 6, ly)
  if (tagGo >= 1) p.ellipse(CIL_X + 3 + leave * 6, ly - 2, 1.3, 1.3, c('pinkDark'))
  p.alpha = arrive
  drawSmo(f, CIL_X, smoY(SMO_MID - 1))
  p.alpha = 1
  drawComplex(f)
  if (tagGo < 1) {
    const x = lerp(DOCK.mgrn1[0] - 3, CIL_X + 3, tagGo)
    const y = lerp(DOCK.mgrn1[1], smoY(0) - 2, tagGo)
    p.ellipse(x, y, 1.6, 1.6, c('pinkDark'), c('sparkleHi'), 1)
  }
  mmmLabel(f, 1)
  smoLabel(f, span(t, 0.5, 0.56), smoY(2))
}

/**
 * The linker, one step at a time, so the eye always knows where to look: a
 * target appears and pings, the linker reaches it, drags it down and throws
 * it out of the cilium, then a second target appears and the linker reaches
 * that, holding on so scene 9 can break it. (The draft ran all of this on a
 * loop at once.)
 */
function sceneRecruit(f: Frame) {
  const { p, t } = f
  closeCam(f)
  drawCell(f)
  const thin = span(t, 0, 0.1)
  for (let i = 0; i < SMO_MID; i++) {
    p.alpha = i < 2 ? 1 : 1 - thin
    drawSmo(f, CIL_X, smoY(i))
  }
  p.alpha = 1
  drawComplex(f)

  const aIn = smooth(span(t, 0.08, 0.2))
  const reachA = smooth(span(t, 0.24, 0.42))
  const pull = smooth(span(t, 0.44, 0.6))
  const fling = span(t, 0.6, 0.74)
  const bIn = smooth(span(t, 0.74, 0.86))
  const reachB = smooth(span(t, 0.86, 1))

  const ping = (from: number, y: number) => {
    const u = span(t, from, from + 0.16)
    if (u <= 0 || u >= 1) return
    p.alpha = 1 - u
    p.ring(CIL_X, y, 4 + u * 7, 4 + u * 7, 2, c('shadow'))
    p.alpha = 1
  }

  if (t < 0.6) {
    const ty = lerp(TARGET_Y, PULL_TO, pull)
    p.alpha = aIn
    target(f, CIL_X, ty)
    p.alpha = 1
    ping(0.12, ty)
    const path = chainPath(ty)
    drawChain(f, path, lerp(CHAIN_REST, pathLength(path), reachA), aIn)
  } else {
    if (fling < 1) {
      p.alpha = 1 - fling
      target(f, lerp(CIL_X, CIL_X - 30, fling), PULL_TO - Math.sin(fling * Math.PI) * 22 + fling * 14)
      p.alpha = 1
    }
    if (bIn <= 0) {
      const path = chainPath(PULL_TO)
      drawChain(f, path, lerp(pathLength(path), CHAIN_REST, smooth(fling)))
    } else {
      p.alpha = bIn
      target(f, CIL_X, TARGET_Y)
      p.alpha = 1
      ping(0.76, TARGET_Y)
      const path = chainPath(TARGET_Y)
      drawChain(f, path, lerp(CHAIN_REST, pathLength(path), reachB))
    }
  }

  const tText = narrow(f) ? 'target' : 'target protein'
  const tAlpha = Math.max(aIn * (1 - span(t, 0.44, 0.5)), span(t, 0.76, 0.86))
  label(f, { id: 'target', kind: 'chip', text: tText, dx: CIL_X - 8, dy: TARGET_Y, align: 'right', alpha: tAlpha })
  label(f, { id: 'linker', kind: 'chip', text: 'engineered linker', dx: 109, dy: 30, align: 'left', alpha: span(t, 0.3, 0.4) })
  mmmLabel(f, 1)
}

/**
 * Lightning breaks the linker, the complex drifts away, and the targets come
 * back one at a time. Ends on that recovered cilium; the garden returns in
 * the closing scene, through the lens, not as a dissolve halfway through.
 */
function sceneRelease(f: Frame) {
  const { p, t } = f
  closeCam(f)
  const strike = span(t, 0.1, 0.2)
  const away = smooth(span(t, 0.2, 0.46))
  const back = span(t, 0.46, 0.82)

  drawCell(f)
  for (const i of [0, 1]) drawSmo(f, CIL_X, smoY(i))
  // The target the linker was holding is let go, not removed: it stays.
  target(f, CIL_X, TARGET_Y)
  ;[30, 38].forEach((y, i) => {
    const a = smooth(span(back, i * 0.45, i * 0.45 + 0.55))
    if (a <= 0) return
    p.alpha = a
    target(f, CIL_X, y + (1 - a) * 6)
    p.alpha = 1
  })

  const dx = away * 60
  const dy = -away * 22
  drawComplex(f, dx, dy, 1 - away)
  const path = chainPath(TARGET_Y)
  if (strike < 1) {
    drawChain(f, path)
  } else if (away < 1) {
    drawChain(f, path.slice(0, 2).map(([x, y]) => [x + dx, y + dy] as [number, number]), Infinity, 1 - away)
    drawChain(f, path.slice(1).map(([x, y]) => [x, y + away * 10] as [number, number]), Infinity, 1 - away)
  }
  if (strike > 0 && strike < 1) {
    const bolt: [number, number][] = [
      [124, -8],
      [114, 8],
      [119, 12],
      [109, 26],
      [113, 28],
      [106, 34],
    ]
    for (let i = 1; i < bolt.length; i++) p.line(bolt[i - 1][0], bolt[i - 1][1], bolt[i][0], bolt[i][1], 6, c('spikeMid'))
    for (let i = 1; i < bolt.length; i++) p.line(bolt[i - 1][0], bolt[i - 1][1], bolt[i][0], bolt[i][1], 3, c('daisyCore'))
    if (!f.reduced) {
      // A burst where it hits, not a flash over the whole picture.
      p.alpha = 1 - strike
      p.ellipse(106, 34, 3 + strike * 9, 3 + strike * 9, c('daisyHi'), c('daisyCore'), 1)
      p.alpha = 1
    }
  }
  label(f, { id: 'linker', kind: 'chip', text: 'engineered linker', dx: 109, dy: 30, align: 'left', alpha: 1 - span(t, 0.1, 0.18) })
  mmmLabel(f, 1 - span(t, 0.18, 0.3), dx, dy)
  const rText = narrow(f) ? 'returned' : 'targets return'
  label(f, { id: 'returning', kind: 'chip', text: rText, dx: CIL_X - 8, dy: 30, align: 'right', alpha: span(back, 0.4, 0.7) })
}

/** The lens closes on the recovered cilium, leaving the blooming garden. */
function sceneClosing(f: Frame) {
  const { t, art } = f
  drawGarden(f, true)
  const close = smooth(span(t, 0, 0.42))
  if (close < 1) {
    const cx = art.x + art.w / 2
    const cy = art.y + art.h / 2
    lens(f, cx, cy, coverAll(f, cx, cy) * (1 - close), () => drawRecovered(f))
  }
}

/**
 * Where each scene's entry ends, as progress through the scene: the stretch
 * that turns the previous scene's last frame into this scene (the garden
 * parting, the lens opening on the body, the dissolve out of the plant). The
 * values are the windows the scene functions above use.
 *
 * Scrolling back up skims quickly through the rest of a scene and then plays
 * this stretch backwards at a readable speed, so going up mirrors coming down
 * instead of the garden snapping shut in a few frames.
 */
export const ENTRY_ENDS: Record<SceneId, number> = {
  garden: 0,
  diseases: 0.13,
  cilium: 0.38,
  smo: 0.14,
  water: 0.12,
  parts: 0.16,
  mmm: 0,
  recruit: 0.1,
  release: 0,
  closing: 0.42,
}

const SCENES = {
  garden: sceneGarden,
  diseases: sceneDiseases,
  cilium: sceneCilium,
  smo: sceneSmo,
  water: sceneWater,
  parts: sceneParts,
  mmm: sceneMmm,
  recruit: sceneRecruit,
  release: sceneRelease,
  closing: sceneClosing,
} as const

/** Draw scene `idx` at its progress `f.t`. Returns the labels to show. */
export function drawStory(f: Frame, idx: number): Label[] {
  const { p } = f
  p.alpha = 1
  p.clip()
  p.shiftX = 0
  p.mask = null
  p.native()
  p.clear(c('bushHi'))
  f.labels = []
  const id = STORY[idx].id
  SCENES[id](f)
  // On a phone the words sit under the picture, so the cell would be cut off
  // by a straight line where they start. Dither it away into the background.
  const bottom = Math.round(f.art.y + f.art.h)
  if (bottom < f.H - 20 && id !== 'garden' && id !== 'diseases' && id !== 'closing') {
    p.native()
    const fade = 14
    for (let i = 0; i < fade; i++) {
      p.alpha = (i + 1) / fade
      p.box(0, bottom - fade + i, f.W, 1, c('bushHi'))
    }
    p.alpha = 1
    p.box(0, bottom, f.W, f.H - bottom, c('bushHi'))
  }
  p.flush()
  return f.labels
}
