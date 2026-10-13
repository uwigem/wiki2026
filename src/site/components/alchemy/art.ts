import type { ColorKey } from '../../../engine/palette'

/**
 * The pictures for iGEM Alchemy, drawn by code rather than typed out pixel by
 * pixel, so all 47 share one light, one outline rule and one set of shapes.
 *
 * Each picture is 24 pixels square. A shape is a distance function (negative
 * inside); `fill` shades it as a small rounded object lit from the top left,
 * in five tones of one colour, and outlines it in the darkest of them. Later
 * shapes sit on top of earlier ones, like stickers. Colours are palette keys
 * from `src/engine/palette.ts`, so the site's theme is the only colour source.
 *
 * This file has no DOM in it: `draw(id)` returns a grid of palette keys, and
 * `ElementIcon` turns that into an image.
 */

export const SIZE = 24

type K = ColorKey | null
type Grid = K[]
/** A shape: distance from (x, y) to its edge, negative inside, in pixels. */
type SDF = (x: number, y: number) => number

/** Five tones, darkest first: outline, shade, base, light, highlight. */
type Ramp = readonly [ColorKey, ColorKey, ColorKey, ColorKey, ColorKey]

const R = {
  carbon: ['eye', 'stoneCrack', 'stoneDark', 'stoneMid', 'stoneLight'],
  red: ['spikeMid', 'pinkDark', 'pinkBud', 'pinkHi', 'petalWhiteHi'],
  blue: ['eye', 'blobDark', 'bluePetal', 'blueHi', 'petalWhiteHi'],
  orange: ['quillDark', 'spikeHi', 'berry', 'berryHi', 'daisyHi'],
  gold: ['quillDark', 'spikeHi', 'daisyCore', 'daisyPetal', 'daisyHi'],
  lilac: ['eye', 'blobDark', 'lilacPetal', 'lilacHi', 'petalWhiteHi'],
  water: ['algae', 'waterDeep', 'water', 'waterLight', 'foam'],
  sky: ['blobDark', 'bluePetal', 'sparkle', 'blueHi', 'petalWhiteHi'],
  hydrogen: ['stoneDark', 'stoneLight', 'petalWhite', 'petalWhiteHi', 'petalWhiteHi'],
  bell: ['eye', 'blobDark', 'lilacHi', 'petalWhite', 'petalWhiteHi'],
  green: ['shadow', 'stem', 'leaf', 'leafHi', 'sproutHi'],
  glow: ['stem', 'leaf', 'sprout', 'sproutHi', 'petalWhiteHi'],
  pink: ['spikeMid', 'pinkDark', 'pinkBud', 'pinkHi', 'petalWhiteHi'],
  cell: ['shadow', 'bushDark', 'bushMid', 'bushLight', 'bushHi'],
  steel: ['eye', 'stoneDark', 'rock', 'rockSnow', 'petalWhiteHi'],
  mito: ['spikeMid', 'pinkDark', 'berry', 'berryHi', 'daisyHi'],
  sugar: ['blobDark', 'blobShade', 'petalWhite', 'petalWhiteHi', 'petalWhiteHi'],
} as const satisfies Record<string, Ramp>

/* ------------------------------------------------------------------ shapes */

const len = (x: number, y: number) => Math.hypot(x, y)

const circle = (cx: number, cy: number, r: number): SDF => (x, y) => len(x - cx, y - cy) - r

const ellipse = (cx: number, cy: number, rx: number, ry: number): SDF => (x, y) =>
  (len((x - cx) / rx, (y - cy) / ry) - 1) * Math.min(rx, ry)

/** A box centred on (cx, cy), half-sizes hw and hh, corners rounded by r. */
const box = (cx: number, cy: number, hw: number, hh: number, r = 0): SDF => (x, y) => {
  const qx = Math.abs(x - cx) - hw + r
  const qy = Math.abs(y - cy) - hh + r
  return len(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r
}

const capsule = (ax: number, ay: number, bx: number, by: number, r: number): SDF => (x, y) => {
  const pax = x - ax
  const pay = y - ay
  const bax = bx - ax
  const bay = by - ay
  const h = Math.max(0, Math.min(1, (pax * bax + pay * bay) / (bax * bax + bay * bay || 1)))
  return len(pax - bax * h, pay - bay * h) - r
}

/** A filled polygon (points in order). */
const polygon = (pts: [number, number][]): SDF => (x, y) => {
  let d = Infinity
  let inside = false
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i]
    const [xj, yj] = pts[j]
    const ex = xj - xi
    const ey = yj - yi
    const wx = x - xi
    const wy = y - yi
    const t = Math.max(0, Math.min(1, (wx * ex + wy * ey) / (ex * ex + ey * ey)))
    d = Math.min(d, len(wx - ex * t, wy - ey * t))
    if (yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside
  }
  return inside ? -d : d
}

/** A regular polygon with n corners, the first pointing up. */
const ngon = (cx: number, cy: number, r: number, n: number, turn = 0): SDF => {
  const pts: [number, number][] = []
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + turn + (i * 2 * Math.PI) / n
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
  }
  return polygon(pts)
}

const union = (...s: SDF[]): SDF => (x, y) => Math.min(...s.map((f) => f(x, y)))
const cut = (a: SDF, b: SDF): SDF => (x, y) => Math.max(a(x, y), -b(x, y))
const inter = (a: SDF, b: SDF): SDF => (x, y) => Math.max(a(x, y), b(x, y))
/** The edge band of a shape, w wide: a ring from a circle, a tube from a capsule. */
const shell = (a: SDF, w: number): SDF => (x, y) => Math.abs(a(x, y)) - w
/** Union with a soft join, so blobs melt together. */
const blend = (k: number, ...s: SDF[]): SDF => (x, y) => {
  let d = s[0](x, y)
  for (let i = 1; i < s.length; i++) {
    const b = s[i](x, y)
    const h = Math.max(k - Math.abs(d - b), 0) / k
    d = Math.min(d, b) - h * h * k * 0.25
  }
  return d
}

/* ------------------------------------------------------------------ paint */

const LIGHT = (() => {
  const v = [-0.55, -0.7, 0.62]
  const m = Math.hypot(v[0], v[1], v[2])
  return v.map((c) => c / m)
})()

class Canvas {
  g: Grid = new Array(SIZE * SIZE).fill(null)

  inside(s: SDF, x: number, y: number) {
    return x >= 0 && y >= 0 && x < SIZE && y < SIZE && s(x + 0.5, y + 0.5) < 0
  }

  set(x: number, y: number, k: ColorKey) {
    if (x >= 0 && y >= 0 && x < SIZE && y < SIZE) this.g[y * SIZE + x] = k
  }

  /**
   * A shaded, outlined shape. `depth` is how far in from the edge it takes to
   * reach the top of the dome: the radius for a ball, less for a flat thing.
   */
  fill(s: SDF, ramp: Ramp, opt: { depth?: number; outline?: boolean; flat?: boolean; shine?: boolean } = {}) {
    const depth = opt.depth ?? 4
    const e = 0.5
    let best = -1
    let bx = -1
    let by = -1
    for (let y = 0; y < SIZE; y++)
      for (let x = 0; x < SIZE; x++) {
        if (!this.inside(s, x, y)) continue
        const edge =
          !this.inside(s, x - 1, y) || !this.inside(s, x + 1, y) || !this.inside(s, x, y - 1) || !this.inside(s, x, y + 1)
        if (edge && opt.outline !== false) {
          this.set(x, y, ramp[0])
          continue
        }
        if (opt.flat) {
          this.set(x, y, ramp[2])
          continue
        }
        const px = x + 0.5
        const py = y + 0.5
        const d = s(px, py)
        let gx = s(px + e, py) - s(px - e, py)
        let gy = s(px, py + e) - s(px, py - e)
        const gm = Math.hypot(gx, gy) || 1
        gx /= gm
        gy /= gm
        const t = Math.min(1, -d / depth)
        const h = Math.sqrt(1 - (1 - t) * (1 - t))
        let nx = gx * (1 - h)
        let ny = gy * (1 - h)
        let nz = h
        const nm = Math.hypot(nx, ny, nz) || 1
        nx /= nm
        ny /= nm
        nz /= nm
        const i = nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]
        const k = i > 0.72 ? 3 : i > 0.4 ? 2 : 1
        this.set(x, y, ramp[k])
        if (i > best) {
          best = i
          bx = x
          by = y
        }
      }
    // One bright pixel where the light hits hardest: the shine on a ball.
    if (opt.shine !== false && bx >= 0 && best > 0.9) this.set(bx, by, ramp[4])
  }

  /** A flat-coloured shape with no shading or outline, for small details. */
  flat(s: SDF, k: ColorKey) {
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) if (this.inside(s, x, y)) this.set(x, y, k)
  }

  /** A 3 by 5 letter, or a bold 6 by 7 one, for the atoms. */
  letter(ch: string, x: number, y: number, k: ColorKey, bold = false) {
    const rows = (bold ? BOLD : GLYPHS)[ch]
    rows.forEach((row, j) => [...row].forEach((c, i) => c === '#' && this.set(x + i, y + j, k)))
  }

  px(x: number, y: number, k: ColorKey) {
    this.set(x, y, k)
  }
}

/** Bold 6 by 7 letters, for the atoms on their own, which are seen at 24 pixels. */
const BOLD: Record<string, string[]> = {
  C: ['.####.', '##..##', '##....', '##....', '##....', '##..##', '.####.'],
  H: ['##..##', '##..##', '##..##', '######', '##..##', '##..##', '##..##'],
  O: ['.####.', '##..##', '##..##', '##..##', '##..##', '##..##', '.####.'],
  N: ['##..##', '###.##', '###.##', '######', '##.###', '##.###', '##..##'],
  P: ['#####.', '##..##', '##..##', '#####.', '##....', '##....', '##....'],
}

const GLYPHS: Record<string, string[]> = {
  C: ['###', '#..', '#..', '#..', '###'],
  H: ['#.#', '#.#', '###', '#.#', '#.#'],
  O: ['###', '#.#', '#.#', '#.#', '###'],
  N: ['#.#', '###', '###', '###', '#.#'],
  P: ['###', '#.#', '###', '#..', '#..'],
  R: ['##.', '#.#', '##.', '#.#', '#.#'],
}

/* ----------------------------------------------------------- parts kit */

/** A thick smooth line through the given points (Catmull-Rom), as one shape. */
function curve(pts: [number, number][], r: number): SDF {
  const parts: SDF[] = []
  const at = (i: number) => pts[Math.max(0, Math.min(pts.length - 1, i))]
  let prev = pts[0]
  for (let i = 0; i < pts.length - 1; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)]
    for (let s = 1; s <= 8; s++) {
      const t = s / 8
      const t2 = t * t
      const t3 = t2 * t
      const q = [0, 1].map(
        (k) =>
          0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3),
      ) as [number, number]
      parts.push(capsule(prev[0], prev[1], q[0], q[1], r))
      prev = q
    }
  }
  return union(...parts)
}

/** An atom as a lettered ball. */
/** An atom on its own: a big ball with a bold letter that can be read at 24 pixels. */
function bigAtom(c: Canvas, ramp: Ramp, letter: string, ink: ColorKey, r = 10.5) {
  c.fill(circle(12, 12, r), ramp, { depth: r, shine: false })
  c.flat(ellipse(12 - r * 0.5, 12 - r * 0.55, r * 0.2, r * 0.13), ramp[4])
  c.letter(letter, 9, 9, ink, true)
}

function atom(c: Canvas, cx: number, cy: number, r: number, ramp: Ramp, letter?: string, ink?: ColorKey) {
  c.fill(circle(cx, cy, r), ramp, { depth: r, shine: false })
  if (r >= 3.5) c.flat(ellipse(cx - r * 0.45, cy - r * 0.5, Math.max(0.8, r * 0.18), Math.max(0.6, r * 0.12)), ramp[4])
  if (letter && r >= 5) c.letter(letter, Math.round(cx - 1.5), Math.round(cy - 2.5), ink ?? ramp[0])
}

/** A bond: a short grey stick between two atoms, drawn under them. */
function bond(c: Canvas, ax: number, ay: number, bx: number, by: number, w = 1.1) {
  c.fill(capsule(ax, ay, bx, by, w), R.steel, { depth: w, shine: false })
}

/** A sugar ring: a pentagon outline with an oxygen in the top corner. */
function ring5(c: Canvas, cx: number, cy: number, r: number, ramp: Ramp) {
  c.fill(ngon(cx, cy, r, 5), [ramp[0], ramp[3], ramp[3], ramp[3], ramp[3]], { flat: true })
  c.fill(shell(ngon(cx, cy, r - 1, 5), 1.6), ramp, { depth: 1.6, shine: false })
  atom(c, cx, cy - r + 0.5, 2.4, R.red)
}

/** One phospholipid standing up: round head, two separate tails, one with a slight kink. */
function lipid(c: Canvas, cx: number, top: number, h: number, flip = false, headR = 2.8, w = 0.75) {
  const dir = flip ? -1 : 1
  const headY = flip ? top + h - headR : top + headR
  const y0 = headY + dir * headR * 0.6
  const y1 = flip ? top + 0.8 : top + h - 0.8
  const gap = Math.max(1.1, headR * 0.5)
  const kink = y0 + (y1 - y0) * 0.55
  const tails = union(
    capsule(cx - gap, y0, cx - gap, y1, w),
    capsule(cx + gap, y0, cx + gap, kink, w),
    capsule(cx + gap, kink, cx + gap + w * 1.6, y1, w),
  )
  c.fill(tails, R.gold, { depth: w, shine: false })
  c.fill(circle(cx, headY, headR), R.blue, { depth: headR, shine: false })
  if (headR >= 3) c.flat(ellipse(cx - headR * 0.4, headY - headR * 0.45, headR * 0.22, headR * 0.15), 'petalWhiteHi')
}

/** A strand of a helix from top to bottom, front half only or back half only. */
function strand(c: Canvas, cx: number, amp: number, phase: number, ramp: Ramp, front: boolean, y0 = 1.5, y1 = 22.5) {
  const parts: SDF[] = []
  const steps = 26
  for (let i = 0; i < steps; i++) {
    const ya = y0 + ((y1 - y0) * i) / steps
    const yb = y0 + ((y1 - y0) * (i + 1)) / steps
    const a = phase + ya * 0.42
    const b = phase + yb * 0.42
    const isFront = Math.cos((a + b) / 2) > 0
    if (isFront !== front) continue
    parts.push(capsule(cx + amp * Math.sin(a), ya, cx + amp * Math.sin(b), yb, 1.25))
  }
  if (parts.length) c.fill(union(...parts), ramp, { depth: 1.2, shine: false })
}

/** The rungs of a helix: base pairs between two strands, coloured in turn. */
function rungs(c: Canvas, cx: number, amp: number, phase: number, oneSided = false, y0 = 3, y1 = 22) {
  const colours: ColorKey[] = ['daisyCore', 'pinkBud']
  let n = 0
  for (let y = y0; y <= y1; y += 3) {
    const a = phase + (y + 0.5) * 0.42
    const xa = cx + amp * Math.sin(a)
    const xb = oneSided ? cx + amp * Math.sin(a) * -0.1 : cx - amp * Math.sin(a)
    if (Math.abs(xa - xb) < 2) continue
    const lo = Math.round(Math.min(xa, xb))
    const hi = Math.round(Math.max(xa, xb))
    for (let x = lo; x <= hi; x++) c.px(x, y, colours[n % 2])
    n++
  }
}

/** Sugar, phosphate, sugar, phosphate, zigzagging down. RNA's sugars carry an extra OH. */
function backbone(c: Canvas, rna: boolean) {
  // The live idea, a chain down the middle (phosphate, sugar, phosphate),
  // made bigger. RNA's sugars carry the extra OH that DNA's lack.
  bond(c, 12, 1, 12, 23, 1.2)
  for (const y of [3, 13.5]) atom(c, 12, y, 2.8, R.orange)
  atom(c, 12, 23.5, 2.8, R.orange)
  for (const y of [8.2, 18.6]) {
    c.fill(ngon(12, y, 4.2, 5), rna ? R.pink : R.blue, { depth: 2.5 })
    if (rna) {
      bond(c, 14, y + 1, 17.5, y + 1)
      atom(c, 18.5, y + 1, 2, R.red)
    }
  }
}

/** Round cell: membrane ring, cytoplasm inside. */
function cellBody(c: Canvas, cx = 12, cy = 12, r = 10.5) {
  c.fill(circle(cx, cy, r), R.cell, { depth: 3, shine: false })
  c.fill(circle(cx, cy, r - 2.2), ['bushMid', 'bushLight', 'bushHi', 'bushHi', 'petalWhiteHi'], { depth: 6, outline: true, shine: false })
}

function sparkle(c: Canvas, x: number, y: number, k: ColorKey = 'petalWhiteHi') {
  c.px(x, y, k)
  c.px(x - 1, y, 'sparkle')
  c.px(x + 1, y, 'sparkle')
  c.px(x, y - 1, 'sparkle')
  c.px(x, y + 1, 'sparkle')
}

/* --------------------------------------------------------------- icons */

const DRAW: Record<string, (c: Canvas) => void> = {
  carbon: (c) => bigAtom(c, R.carbon, 'C', 'petalWhiteHi'),
  hydrogen: (c) => bigAtom(c, R.hydrogen, 'H', 'eye', 9.5),
  oxygen: (c) => bigAtom(c, R.red, 'O', 'spikeLow'),
  nitrogen: (c) => bigAtom(c, R.blue, 'N', 'eye'),
  phosphorus: (c) => bigAtom(c, R.orange, 'P', 'spikeLow'),

  hydroxyl: (c) => {
    bond(c, 9, 14, 18, 8, 1.3)
    atom(c, 9, 14, 8.2, R.red, 'O', 'spikeLow')
    atom(c, 18.5, 7.5, 5, R.hydrogen)
  },
  carboxyl: (c) => {
    bond(c, 9, 12, 17, 6.5, 1.3)
    bond(c, 9, 12, 17, 17.5, 1.3)
    atom(c, 17.5, 6, 5.5, R.red, 'O', 'spikeLow')
    atom(c, 17.5, 18, 5.5, R.red, 'O', 'spikeLow')
    atom(c, 7.5, 12, 6.5, R.carbon, 'C', 'petalWhiteHi')
  },
  amine: (c) => {
    bond(c, 12, 10, 5, 18, 1.3)
    bond(c, 12, 10, 19, 18, 1.3)
    atom(c, 5, 18.5, 4.5, R.hydrogen)
    atom(c, 19, 18.5, 4.5, R.hydrogen)
    atom(c, 12, 9, 8, R.blue, 'N', 'eye')
  },
  'side-chain': (c) => {
    bond(c, 12, 15, 12, 6)
    bond(c, 12, 15, 5, 19)
    bond(c, 12, 15, 19, 19)
    atom(c, 12, 5, 3.6, R.hydrogen)
    atom(c, 4.5, 19.5, 3.6, R.hydrogen)
    atom(c, 19.5, 19.5, 3.6, R.hydrogen)
    atom(c, 12, 14, 6, R.carbon, 'R', 'petalWhiteHi')
  },
  'amino-acid': (c) => {
    bond(c, 4, 9, 12, 9)
    bond(c, 12, 9, 20, 9)
    bond(c, 12, 9, 12, 17)
    bond(c, 20, 9, 20, 3)
    atom(c, 12, 18, 4.5, R.lilac)
    atom(c, 4, 9, 3.8, R.blue)
    atom(c, 20.2, 3.5, 2.8, R.red)
    atom(c, 20, 9.5, 3.8, R.red)
    atom(c, 12, 9, 3.8, R.carbon)
  },
  protein: (c) => {
    // The picture every biologist knows: an alpha helix (the coil) and a beta
    // sheet (the broad arrow), joined by a loop. Two big turns and one arrow
    // so it still reads at list size.
    const front: SDF[] = []
    const back: SDF[] = []
    for (let i = 0; i < 32; i++) {
      const t0 = (i / 32) * Math.PI * 4
      const t1 = ((i + 1) / 32) * Math.PI * 4
      const p = (t: number): [number, number] => [7 + 5 * Math.sin(t), 2.5 + t * 1.45]
      const [x0, y0] = p(t0)
      const [x1, y1] = p(t1)
      if (Math.cos((t0 + t1) / 2) > 0) front.push(capsule(x0, y0, x1, y1, 2))
      else back.push(capsule(x0, y0, x1, y1, 1.1))
    }
    c.fill(union(...back), ['spikeMid', 'pinkDark', 'pinkDark', 'pinkDark', 'pinkDark'], { depth: 1.1, shine: false })
    c.fill(union(...front), R.pink, { depth: 2, shine: false })
    c.fill(curve([[7, 21], [11.5, 23.5], [17.5, 21.5]], 0.9), R.steel, { depth: 0.9, shine: false })
    c.fill(union(box(18, 14.5, 3, 6.5), polygon([[12.2, 9], [23.8, 9], [18, 1.5]])), R.gold, { depth: 2.6, shine: false })
  },
  phosphate: (c) => {
    for (const [x, y] of [[12, 3.5], [3.5, 12], [20.5, 12], [12, 20.5]] as [number, number][]) bond(c, 12, 12, x, y)
    for (const [x, y] of [[12, 3.5], [3.5, 12], [20.5, 12], [12, 20.5]] as [number, number][]) atom(c, x, y, 3.3, R.red)
    atom(c, 12, 12, 6, R.orange, 'P', 'spikeLow')
  },
  deoxyribose: (c) => {
    // Ribose with one oxygen gone: an H where ribose has its second OH. Blue,
    // like the DNA it builds.
    ring5(c, 12, 11, 8.5, R.blue)
    bond(c, 16.5, 17.5, 19.5, 21)
    bond(c, 7.5, 17.5, 4.5, 21)
    atom(c, 19.5, 21, 2.6, R.red)
    atom(c, 4.5, 21.3, 2.2, R.hydrogen)
  },
  ribose: (c) => {
    // Pink, like the RNA it builds.
    ring5(c, 12, 11, 8.5, R.pink)
    bond(c, 16.5, 17.5, 19.5, 21)
    bond(c, 7.5, 17.5, 4.5, 21)
    atom(c, 19.5, 21, 2.6, R.red)
    atom(c, 4.5, 21, 2.6, R.red)
  },
  'dna-backbone': (c) => backbone(c, false),
  'rna-backbone': (c) => backbone(c, true),
  dna: (c) => {
    // The live idea, two strands and simple rungs, in two colours rather than a rainbow.
    strand(c, 12, 7, 0, ['eye', 'blobDark', 'blobDark', 'blobShade', 'bluePetal'], false)
    strand(c, 12, 7, Math.PI, ['eye', 'blobDark', 'blobDark', 'blobShade', 'lilacPetal'], false)
    rungs(c, 12, 7, 0)
    strand(c, 12, 7, 0, R.blue, true)
    strand(c, 12, 7, Math.PI, R.lilac, true)
  },
  rna: (c) => {
    // The live idea, a pink strand, with short coloured bases sticking out.
    const path: [number, number][] = [[7, 1.5], [11, 6], [7, 11], [11, 16], [7, 21], [9, 23]]
    const bases: [number, number, Ramp][] = [[10, 5, R.gold], [9, 10, R.blue], [10, 15.5, R.green], [9, 20.5, R.gold]]
    for (const [x, y, ramp] of bases) c.fill(capsule(x, y, x + 8, y, 1.3), ramp, { depth: 1.3, shine: false })
    c.fill(curve(path, 1.6), R.pink, { depth: 1.6, shine: false })
  },
  sugar: (c) => {
    // A sugar cube: three faces.
    c.fill(polygon([[12, 3], [21, 7.5], [12, 12], [3, 7.5]]), R.sugar, { flat: true })
    c.fill(polygon([[3, 7.5], [12, 12], [12, 22], [3, 17]]), ['blobDark', 'blobShade', 'blobShade', 'blobShade', 'blobShade'], { flat: true })
    c.fill(polygon([[21, 7.5], [12, 12], [12, 22], [21, 17]]), ['blobDark', 'blobBody', 'blobBody', 'blobBody', 'blobBody'], { flat: true })
    for (const [x, y] of [[7, 13], [6, 16], [16, 14], [18, 11], [11, 6], [14, 8]] as [number, number][]) c.px(x, y, 'petalWhiteHi')
    sparkle(c, 20, 3)
  },
  'fatty-acid': (c) => {
    // The live idea: an acid head on the left, a long tail to the right.
    const tail: SDF[] = []
    const pts: [number, number][] = [[8, 12], [11, 9], [14, 13], [17, 9], [20, 13], [23, 10]]
    for (let i = 0; i < pts.length - 1; i++) tail.push(capsule(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], 1.6))
    c.fill(union(...tail), R.gold, { depth: 1.6, shine: false })
    atom(c, 5.5, 12, 4.8, R.red)
  },
  glycerol: (c) => {
    bond(c, 9, 4, 9, 20)
    for (const y of [4, 12, 20]) {
      bond(c, 9, y, 17, y)
      atom(c, 17, y, 3, R.red)
      atom(c, 21, y - 2.5, 1.8, R.hydrogen)
      atom(c, 9, y, 3.6, R.carbon)
    }
  },
  head: (c) => {
    // A water-loving head: the blue ball with its phosphate cap, a heart, and a drop of water.
    c.fill(circle(10, 13.5, 8.5), R.blue, { depth: 8.5, shine: false })
    c.flat(ellipse(6.5, 10, 1.6, 1), 'petalWhiteHi')
    atom(c, 10, 5, 3.4, R.orange)
    const heart = ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...']
    c.fill((x, y) => (heart[Math.floor(y)]?.[Math.floor(x - 16)] === '#' ? -1 : 1), R.red, { flat: true })
    c.fill(union(circle(20, 18, 3), polygon([[17.4, 17.1], [22.6, 17.1], [20, 12]])), R.sky, { depth: 2.5, shine: false })
  },
  phospholipid: (c) => lipid(c, 11, 1, 22.5, false, 5.5, 1.7),
  bilayer: (c) => {
    // Two rows of heads facing out, plain tails meeting in the middle.
    for (const x of [2.5, 7.25, 12, 16.75, 21.5]) {
      for (const [y0, y1] of [[4, 11], [13, 20]] as [number, number][]) {
        for (let y = y0; y <= y1; y++) {
          c.px(Math.round(x - 1), y, 'daisyCore')
          c.px(Math.round(x + 1), y, 'spikeHi')
        }
      }
      c.fill(circle(x, 2.6, 2.3), R.blue, { depth: 2.3, shine: false })
      c.fill(circle(x, 21.4, 2.3), R.blue, { depth: 2.3, shine: false })
    }
  },
  organelle: (c) => {
    c.fill(ellipse(12, 12, 10.5, 8), R.cell, { depth: 3, shine: false })
    c.fill(ellipse(12, 12, 8.3, 5.8), ['bushMid', 'bushLight', 'bushHi', 'bushHi', 'petalWhiteHi'], { depth: 5, shine: false })
    for (const [x, y, r] of [[9, 11, 1.8], [14, 13, 2.2], [12, 9, 1.2]] as [number, number, number][])
      c.fill(circle(x, y, r), R.lilac, { depth: r })
  },
  vacuole: (c) => {
    // A storage sac: a soft, lumpy membrane bag, part full of water.
    const bag = blend(4, ellipse(12, 13.5, 10.5, 8), circle(7, 8, 4.8), circle(17, 8.5, 4.5))
    const inner: SDF = (x, y) => bag(x, y) + 1.6
    c.fill(bag, R.cell, { depth: 2, shine: false })
    c.flat(inner, 'bushHi')
    const below: SDF = (x, y) => 12 + 0.9 * Math.sin(x * 0.7) - y
    c.fill(inter(inner, below), R.water, { depth: 5, outline: false, shine: false })
    for (let x = 2; x < 23; x++) {
      const y = Math.round(12 + 0.9 * Math.sin((x + 0.5) * 0.7) - 0.5)
      if (inner(x + 0.5, y + 0.5) < 0) c.px(x, y, 'foam')
    }
    c.flat(ellipse(6.5, 7.5, 1.6, 1), 'petalWhiteHi')
  },
  nucleus: (c) => {
    // Double membrane with pores (the gaps), chromatin, and a dark nucleolus.
    c.fill(circle(12, 12, 10.5), R.lilac, { depth: 2, shine: false })
    c.flat(shell(circle(12, 12, 8.6), 0.5), 'blobDark')
    c.flat(circle(12, 12, 8), 'lilacHi')
    for (const ang of [0.4, 1.6, 2.8, 4.0, 5.2]) {
      const x = Math.round(12 + 9.6 * Math.cos(ang))
      const y = Math.round(12 + 9.6 * Math.sin(ang))
      c.px(x, y, 'lilacHi')
    }
    for (const [ax, ay, bx, by] of [[6, 9, 9, 12], [14, 6, 17, 9], [7, 16, 10, 17]] as [number, number, number, number][])
      c.flat(capsule(ax, ay, bx, by, 0.5), 'lilacPetal')
    c.fill(circle(13.5, 13.5, 3.4), ['eye', 'eye', 'blobDark', 'blobShade', 'lilacHi'], { depth: 3, shine: false })
  },
  mitochondria: (c) => {
    c.fill(ellipse(12, 12, 10.8, 6.8), R.mito, { depth: 4 })
    c.fill(ellipse(12, 12, 8.4, 4.4), ['pinkDark', 'berryHi', 'berryHi', 'berryHi', 'daisyHi'], { flat: true })
    // The folded inner membrane.
    const fold: SDF[] = []
    for (let i = 0; i < 6; i++) {
      const x = 5.5 + i * 2.6
      const y0 = i % 2 === 0 ? 8.5 : 15.5
      fold.push(capsule(x, y0, x + 1.3, 12, 0.6), capsule(x + 1.3, 12, x + 2.6, i % 2 === 0 ? 15.5 : 8.5, 0.6))
    }
    c.flat(inter(union(...fold), ellipse(12, 12, 8, 4.2)), 'berry')
  },
  energy: (c) => {
    c.fill(polygon([[14, 1], [4, 13], [11, 13], [8, 23], [20, 9.5], [12.5, 9.5], [16.5, 1]]), R.gold, { depth: 2.5 })
    sparkle(c, 20, 18)
    sparkle(c, 4, 4)
  },
  movement: (c) => {
    c.fill(union(box(10, 12, 7, 2.6, 1), polygon([[14, 5], [22, 12], [14, 19]])), R.orange, { depth: 2.5 })
    for (const [y, x0, x1] of [[6, 2, 7], [18, 1, 6], [12, 0, 1.5]] as [number, number, number][])
      c.fill(capsule(x0, y, x1, y, 0.7), R.steel, { flat: true, outline: false })
  },
  ribosome: (c) => {
    // The big and small subunits, and the new protein chain coming out of the top.
    c.fill(blend(3, circle(10, 9.5, 6.5), circle(15.5, 10.5, 5.5)), R.lilac, { depth: 6, shine: false })
    c.flat(ellipse(7.5, 6.5, 1.5, 1), 'petalWhiteHi')
    c.fill(ellipse(12.5, 18, 7, 3.6), R.blue, { depth: 3.6, shine: false })
    for (const [x, y] of [[18.5, 4.5], [20.5, 2.8], [22.5, 1.8]] as [number, number][]) c.fill(circle(x, y, 1.4), R.gold, { depth: 1.4, shine: false })
  },
  'rough-er': (c) => {
    // The live idea, folded sheets dotted with ribosomes, cleaned up: three
    // gently curved sheets, ribosomes along their top edges.
    for (const y of [6, 12.5, 19]) {
      const sheet: SDF = (x, yy) => capsule(3, y, 21, y, 2.1)(x, yy - 0.04 * (x - 12) * (x - 12))
      c.fill(sheet, R.blue, { depth: 2, shine: false })
      for (let x = 4; x <= 20; x += 2.6) c.px(Math.round(x), Math.round(y + 0.04 * (x - 12) * (x - 12) - 3), 'quillDark')
    }
  },
  'smooth-er': (c) => {
    // The same membrane as the rough ER, as a net of looping tubes, with no ribosomes.
    const net = union(shell(ellipse(8.5, 7.5, 6, 4.5), 1.5), shell(ellipse(15.5, 12, 6, 4.5), 1.5), shell(ellipse(9, 17, 6.5, 4), 1.5))
    c.fill(net, R.blue, { depth: 1.5, shine: false })
  },
  golgi: (c) => {
    for (let i = 0; i < 4; i++) {
      const y = 5 + i * 4.3
      const w = 9 - Math.abs(i - 1.5) * 1.2
      const arc: SDF = (x, yy) => capsule(12 - w, y + 2, 12 + w, y + 2, 1.5)(x, yy + 0.06 * (x - 12) * (x - 12))
      c.fill(arc, R.pink, { depth: 1.5, shine: false })
    }
    for (const [x, y] of [[3, 4], [21, 6], [20, 21]] as [number, number][]) c.fill(circle(x, y, 1.8), R.pink, { depth: 1.8 })
  },
  lysosome: (c) => {
    // The cell's recycling: a bubble with the recycling arrows inside.
    const bag = circle(12, 12, 10.5)
    c.fill(bag, R.cell, { depth: 2, shine: false })
    c.flat((x, y) => bag(x, y) + 1.5, 'bushHi')
    for (let i = 0; i < 3; i++) {
      const a0 = -Math.PI / 2 + (i * 2 * Math.PI) / 3 + 0.25
      const a1 = a0 + 1.2
      const pts: [number, number][] = []
      for (let s = 0; s <= 6; s++) {
        const t = a0 + ((a1 - a0) * s) / 6
        pts.push([12 + 5.4 * Math.cos(t), 12 + 5.4 * Math.sin(t)])
      }
      c.fill(curve(pts, 1.1), R.green, { depth: 1.1, shine: false })
      const tx = 12 + 5.4 * Math.cos(a1)
      const ty = 12 + 5.4 * Math.sin(a1)
      const dx = -Math.sin(a1)
      const dy = Math.cos(a1)
      const nx = Math.cos(a1)
      const ny = Math.sin(a1)
      c.fill(
        polygon([
          [tx + dx * 3.8, ty + dy * 3.8],
          [tx + nx * 3.2, ty + ny * 3.2],
          [tx - nx * 3.2, ty - ny * 3.2],
        ]),
        R.green,
        { depth: 1.6, shine: false },
      )
    }
  },
  cytoplasm: (c) => {
    const gel = blend(4, ellipse(12, 15, 10.5, 7), circle(8, 9.5, 4.2), circle(15.5, 9, 4.5))
    c.fill(gel, ['blobDark', 'sparkle', 'blueHi', 'petalWhite', 'petalWhiteHi'], { depth: 6, shine: false })
    const bits: [number, number, Ramp][] = [[7, 14, R.lilac], [15, 16, R.pink], [11, 18, R.gold], [17, 11.5, R.green], [10, 10.5, R.orange]]
    for (const [x, y, ramp] of bits) c.fill(circle(x, y, 1.4), ramp, { depth: 1.2, shine: false })
    c.flat(ellipse(7, 8, 1.4, 0.9), 'petalWhiteHi')
  },
  'cell-structure': (c) => {
    // The membrane, and the web of fibres inside that holds its shape.
    cellBody(c)
    for (const [ax, ay, bx, by] of [[5, 9, 19, 15], [7, 18, 17, 5], [12, 4, 12, 20], [4, 13, 20, 11]] as [number, number, number, number][])
      c.flat(capsule(ax, ay, bx, by, 0.5), 'bushDark')
  },
  'cell-function': (c) => {
    // A cell with a gear turning inside it: the cell at work.
    cellBody(c)
    const teeth: SDF[] = []
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2 + 0.26
      const [cx, cy] = [12 + 5.6 * Math.cos(ang), 12 + 5.6 * Math.sin(ang)]
      teeth.push((x, y) => {
        const u = (x - cx) * Math.cos(ang) + (y - cy) * Math.sin(ang)
        const v = -(x - cx) * Math.sin(ang) + (y - cy) * Math.cos(ang)
        return Math.max(Math.abs(u) - 1.6, Math.abs(v) - 1.5)
      })
    }
    c.fill(cut(union(circle(12, 12, 5), ...teeth), circle(12, 12, 1.9)), R.gold, { depth: 3, shine: false })
  },
  'animal-cell': (c) => {
    cellBody(c)
    c.fill(circle(10, 10, 4), ['eye', 'blobDark', 'lilacPetal', 'lilacHi', 'petalWhiteHi'], { depth: 4 })
    c.px(11, 11, 'blobDark')
    c.fill(ellipse(16, 15, 3.4, 2), R.mito, { depth: 2, shine: false })
    c.fill(circle(8, 16, 1.6), R.green, { depth: 1.6 })
    c.fill(circle(16, 8, 1.3), R.water, { depth: 1.3 })
  },

  life: (c) => {
    // A heart with a heartbeat running through it: it keeps going.
    const heart = union(circle(8, 8.5, 5.8), circle(16, 8.5, 5.8), polygon([[2.5, 10.5], [21.5, 10.5], [12, 22]]))
    c.fill(heart, R.red, { depth: 5, shine: false })
    c.flat(inter(curve([[1, 12], [6.5, 12], [8.5, 9], [10.5, 15.5], [13, 6], [15, 13.5], [16.5, 12], [23, 12]], 0.75), (x, y) => heart(x, y) + 1.2), 'petalWhiteHi')
    c.flat(ellipse(6, 6.2, 1.6, 1), 'petalWhiteHi')
  },
  enzyme: (c) => {
    c.fill(cut(blend(3, circle(11, 12, 9), circle(6, 7, 4)), polygon([[13, 12], [24, 5], [24, 19]])), R.lilac, { depth: 7 })
    c.fill(polygon([[17, 12], [22, 9], [22, 15]]), R.gold, { depth: 1.5 })
  },
  'restriction-enzyme': (c) => {
    // Scissors cutting a strand of DNA.
    c.fill(capsule(1, 18, 23, 18, 1.4), R.blue, { depth: 1.4, shine: false })
    for (let x = 2; x < 23; x += 3) c.px(x, 18, 'pinkBud')
    c.fill(polygon([[3, 2], [5.5, 2], [15.5, 14], [13.5, 15.5]]), R.steel, { depth: 1.5 })
    c.fill(polygon([[21, 2], [18.5, 2], [8.5, 14], [10.5, 15.5]]), R.steel, { depth: 1.5 })
    c.fill(shell(circle(15.5, 15.5, 2.6), 0.9), R.red, { depth: 1 })
    c.fill(shell(circle(8.5, 15.5, 2.6), 0.9), R.red, { depth: 1 })
    c.px(12, 9, 'eye')
  },
  plasmid: (c) => {
    c.fill(shell(circle(12, 12, 8), 2.2), R.blue, { depth: 2.2, shine: false })
    c.fill(inter(shell(circle(12, 12, 8), 2.2), polygon([[12, 12], [0, 0], [12, -4]])), R.gold, { depth: 2.2, shine: false })
    c.fill(inter(shell(circle(12, 12, 8), 2.2), polygon([[12, 12], [0, 24], [-4, 14]])), R.pink, { depth: 2.2, shine: false })
  },
  water: (c) => {
    // The live icon's light blue drop, shaded.
    c.fill(union(circle(12, 15, 7.5), polygon([[5.5, 13], [18.5, 13], [12, 1.5]])), R.sky, { depth: 6, shine: false })
    c.flat(ellipse(9, 15, 1.2, 2.4), 'petalWhiteHi')
    c.px(10, 10, 'petalWhiteHi')
  },
  ocean: (c) => {
    // Rolling waves in the site's own water colour, lighter at the top, with
    // foam on the round crests.
    const rows: [number, Ramp][] = [
      [5, ['algae', 'water', 'waterLight', 'foam', 'petalWhiteHi']],
      [11, ['algae', 'waterDeep', 'water', 'waterLight', 'foam']],
      [17, ['shadow', 'algae', 'waterDeep', 'water', 'waterLight']],
    ]
    rows.forEach(([top, ramp], i) => {
      const crest = (x: number) => top + 1.8 * Math.cos(x * 0.55 + i * 1.6)
      const band: SDF = (x, y) => Math.max(crest(x) - y, y - 23.5, -x, x - 24)
      c.fill(band, ramp, { depth: 3, shine: false })
      for (let x = 0; x < 24; x++) {
        const k = Math.cos((x + 0.5) * 0.55 + i * 1.6)
        if (k > 0.6) c.px(x, Math.round(crest(x + 0.5)) + 1, 'petalWhiteHi')
      }
    })
  },
  jellyfish: (c) => {
    // Aequorea victoria, the jellyfish GFP comes from: a clear bell with
    // green lights round its rim, soft frilly arms and fine tentacles.
    for (const [x, ph] of [[4, 0], [7.5, 2], [16.5, 1], [20, 3]] as [number, number][])
      for (let y = 12; y < 24; y++) c.px(Math.round(x + Math.sin(y * 0.8 + ph)), y, y % 3 ? 'blueHi' : 'sparkle')
    for (const [pts, k] of [
      [[[10.5, 11], [9.5, 15], [11, 18.5], [10, 22]], 'pinkBud'],
      [[[13.5, 11], [14.5, 15], [13, 18.5], [14, 22]], 'pinkHi'],
    ] as [[number, number][], ColorKey][])
      c.flat(curve(pts, 1), k)
    const bell = inter(ellipse(12, 11.5, 10.5, 9.5), box(12, 6, 11, 6.2))
    c.fill(bell, R.bell, { depth: 6, shine: false })
    for (const x of [7, 10, 14, 17]) c.flat(capsule(12, 3.5, x, 11, 0.4), 'blobShade')
    for (const x of [3, 6, 9, 12, 15, 18, 21]) {
      c.px(x, 11, 'sprout')
      c.px(x, 10, 'sproutHi')
    }
    c.flat(ellipse(7.5, 5.5, 1.6, 1), 'petalWhiteHi')
  },
  'gfp-plasmid': (c) => {
    // The plasmid ring with the glowing green gene in it, lit up all round.
    for (let ang = 0; ang < Math.PI * 2; ang += 0.2) c.px(Math.round(12 + 11 * Math.cos(ang)), Math.round(12 + 11 * Math.sin(ang)), 'sproutHi')
    c.fill(shell(circle(12, 12, 8), 2.4), R.blue, { depth: 2.4, shine: false })
    c.fill(inter(shell(circle(12, 12, 8), 2.4), polygon([[12, 12], [24, -6], [24, 30]])), R.glow, { depth: 2.4, shine: false })
    c.fill(circle(12, 12, 3.4), ['sprout', 'sproutHi', 'sproutHi', 'sproutHi', 'petalWhiteHi'], { depth: 3, outline: false, shine: false })
    sparkle(c, 21, 3)
    sparkle(c, 21, 21)
  },
}

/** The picture for one element, as a SIZE by SIZE grid of palette keys (null is clear). */
export function draw(id: string): Grid {
  const c = new Canvas()
  DRAW[id]?.(c)
  return c.g
}

export const DRAWN = Object.keys(DRAW)
