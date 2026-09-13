import { Water, WORLD_W, WORLD_H } from './config'
import { fbm } from './noise'

function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type DecorKind = 'lilac' | 'white' | 'daisy' | 'pink' | 'blue' | 'bigflower' | 'tuft' | 'pebble' | 'lilypad' | 'lilyflower' | 'watergrass'
export type ObjKind = 'tree' | 'berrybush' | 'bush' | 'reed' | 'heart' | 'fern' | 'rock' | 'cattail' | 'ledge'

export interface Decor {
  kind: DecorKind
  x: number
  y: number
}
export interface Obj {
  kind: ObjKind
  x: number // centre x (world px)
  y: number // base (feet) y in world px; the depth-sort key
}

export interface WorldData {
  waterMap: Uint8Array // WORLD_W*WORLD_H, values from Water enum
  shoreField: Int8Array // WORLD_W*WORLD_H, signed px depth into water (clamped) for shoreline detailing
  decor: Decor[]
  objects: Obj[]
  waterfall: { x: number; y: number; w: number; h: number }
  splash: { x: number; y: number }
  ripplePts: { x: number; y: number }[] // gentle surface-ripple sources
  spawn: { x: number; y: number }
}

interface Pond {
  cx: number
  cy: number
  r: number
  h: [number, number, number] // harmonic amplitudes
  p: [number, number, number] // harmonic phases
  sx?: number // horizontal stretch (>1 = wider), default 1
  sy?: number // vertical stretch (<1 = shorter), default 1
}

export function buildWorld(seed = 21): WorldData {
  const rng = mulberry32(seed)

  // Lakes are smooth organic blobs: radius varies by angle through a few sine
  // harmonics, so the edge is always smooth and organic (no spikes, no perfect
  // circles). A source lake sits in the top-left corner; the main lake (that we
  // spawn beside) is lower-centre; a stream + waterfall connect the two so the
  // water is one continuous body, not appearing from nowhere.
  // Two small ponds stacked vertically, connected by a DIRECT vertical waterfall
  // (upper pond spills straight down into the lower pond, framed by stone ledges;
  // like the inspo). Plus two tiny accent puddles. Radius wobbles by angle through
  // a few sine harmonics so every shore is organic: no perfect circles, no spikes.
  const lakes: Pond[] = [
    { cx: 362, cy: 146, r: 78, sx: 1.5, sy: 0.9, h: [0.16, 0.1, 0.06], p: [1.9, 3.4, 0.6] }, // upper pond. Wide ellipse: broad mouth without creeping down
    { cx: 372, cy: 372, r: 94, h: [0.15, 0.09, 0.05], p: [0.7, 2.1, 4.0] }, // lower pond (catches the splash)
    { cx: 664, cy: 92, r: 30, h: [0.2, 0.13, 0.08], p: [2.6, 0.4, 3.1] }, // accent puddle (top-right)
    { cx: 118, cy: 498, r: 32, h: [0.19, 0.11, 0.07], p: [1.1, 4.2, 2.0] }, // accent puddle (bottom-left)
  ]
  const main = lakes[1]
  const lakeSDF = (pd: Pond, x: number, y: number) => {
    const dx = (x - pd.cx) / (pd.sx ?? 1) // horizontal / vertical stretch → ellipse
    const dy = (y - pd.cy) / (pd.sy ?? 1)
    const dist = Math.sqrt(dx * dx + dy * dy)
    const a = Math.atan2(dy, dx)
    const R = pd.r * (1 + pd.h[0] * Math.sin(a * 3 + pd.p[0]) + pd.h[1] * Math.sin(a * 2 + pd.p[1]) + pd.h[2] * Math.sin(a * 5 + pd.p[2]))
    return R - dist
  }

  // nearest-point on a segment: returns both the distance and the param t along
  // it (t drives the channel's width taper).
  const segDistT = (px: number, py: number, ax: number, ay: number, bx: number, by: number) => {
    const dx = bx - ax
    const dy = by - ay
    const l2 = dx * dx + dy * dy || 1
    let t = ((px - ax) * dx + (py - ay) * dy) / l2
    t = t < 0 ? 0 : t > 1 ? 1 : t
    return { d: Math.hypot(px - (ax + t * dx), py - (ay + t * dy)), t }
  }

  // the waterfall: a direct vertical drop. The upper pond spills straight down
  // into the lower pond. The drop itself IS the connection (no horizontal channel).
  const fx = 362
  const fallTop = 214 // well inside the upper pond's lower edge (the lip)
  const fallBot = 286 // just inside the lower pond's upper edge (the splash)
  const fallHalf = 15
  const waterfall = { x: fx - fallHalf, y: fallTop, w: fallHalf * 2, h: fallBot - fallTop }
  const splash = { x: fx, y: 280 }
  const fallDist = (x: number, y: number) => segDistT(x, y, fx, fallTop, fx, fallBot).d

  const fieldAt = (x: number, y: number) => {
    let f = -1e9
    for (const pd of lakes) f = Math.max(f, lakeSDF(pd, x, y))
    f = Math.max(f, fallHalf + 4 - fallDist(x, y)) // fall column bridges the ponds; +4 gives a soft wobbly water margin (no hard rectangle)
    // low-frequency wobble breaks every shoreline so nothing reads as a clean arc
    f += (fbm(x * 0.035, y * 0.035) - 0.46) * 7
    return f
  }
  const inFall = (x: number, y: number) => fallDist(x, y) <= fallHalf && y >= fallTop && y < fallBot - 6

  // precompute per-pixel water classification + a signed shore-depth field (once)
  const waterMap = new Uint8Array(WORLD_W * WORLD_H)
  const shoreField = new Int8Array(WORLD_W * WORLD_H)
  for (let y = 0; y < WORLD_H; y++) {
    for (let x = 0; x < WORLD_W; x++) {
      const f = fieldAt(x, y)
      let cls: Water
      if (inFall(x, y)) cls = Water.FALL
      // thin shoreline bands: a slim foam rim + a slim damp ring, no fat halo
      else cls = f > 5 ? Water.DEEP : f > 1.5 ? Water.SHALLOW : f > -0.6 ? Water.FOAM : f > -2.5 ? Water.WET : Water.LAND
      const i = y * WORLD_W + x
      waterMap[i] = cls
      shoreField[i] = Math.max(-40, Math.min(120, Math.round(f)))
    }
  }
  const clsAt = (x: number, y: number): Water => {
    const xi = x | 0
    const yi = y | 0
    if (xi < 0 || yi < 0 || xi >= WORLD_W || yi >= WORLD_H) return Water.LAND
    return waterMap[yi * WORLD_W + xi] as Water
  }
  // ---- scatter plants / flowers / rocks on land, richer near the banks ----
  const decor: Decor[] = []
  const objects: Obj[] = []
  const count: Record<string, number> = {}
  const cap = (k: string, n: number) => (count[k] = (count[k] || 0) + 1) <= n

  // Independent per-category gates (own rng draw each) → things intersperse
  // naturally instead of banding by distance. Caps keep the meadow from
  // turning into a carpet; flowers are deliberately sparse and spread out.
  for (let i = 0; i < 16000; i++) {
    const x = 8 + rng() * (WORLD_W - 16)
    const y = 12 + rng() * (WORLD_H - 24)
    if (clsAt(x, y) !== Water.LAND) continue
    const inland = -fieldAt(x, y) // px from shoreline (bigger = deeper inland)
    const shore = inland < 70
    const g = rng

    // tall plants, dotted across the whole meadow (depth-sorted objects)
    if (inland > 6 && g() < 0.02 && cap('tree', 30)) {
      objects.push({ kind: 'tree', x, y })
      continue
    }
    if (inland > 6 && inland < 190 && g() < 0.03 && cap('berrybush', 22)) {
      objects.push({ kind: 'berrybush', x, y })
      continue
    }
    if (inland > 6 && g() < 0.03 && cap('bush', 22)) {
      objects.push({ kind: 'bush', x, y })
      continue
    }
    if (inland > 6 && g() < 0.035 && cap('fern', 18)) {
      objects.push({ kind: 'fern', x, y })
      continue
    }
    if (shore && inland > 2 && inland < 26 && g() < 0.2 && cap('reed', 24)) {
      objects.push({ kind: 'reed', x, y })
      continue
    }
    if (shore && inland > 4 && inland < 42 && g() < 0.2 && cap('heart', 14)) {
      objects.push({ kind: 'heart', x, y })
      continue
    }
    if (inland > -2 && inland < 30 && g() < 0.28 && cap('rock', 16)) {
      objects.push({ kind: 'rock', x, y })
      continue
    }

    // big cream-star flowers: sparser and larger, 36 of them
    if (g() < (shore ? 0.03 : 0.017) && cap('bigflower', 36)) {
      decor.push({ kind: 'bigflower', x, y })
      continue
    }
    // small flowers: sparse, spread across the field, mild shore bias (+15%)
    if (g() < (shore ? 0.09 : 0.045) && cap('flower', 152)) {
      const fk = rng()
      const kind: DecorKind = fk < 0.3 ? 'lilac' : fk < 0.52 ? 'white' : fk < 0.7 ? 'pink' : fk < 0.86 ? 'daisy' : 'blue'
      decor.push({ kind, x, y })
      continue
    }
    if (g() < 0.32 && cap('tuft', 120)) {
      decor.push({ kind: 'tuft', x, y })
      continue
    }
    if (inland < 24 && g() < 0.4 && cap('pebble', 40)) decor.push({ kind: 'pebble', x, y })
  }

  // frame the fall lip with two grey stone ledges so it reads as a spill over a
  // rocky shelf (like the reference), with a gap in the middle for the water
  objects.push({ kind: 'ledge', x: fx - 20, y: fallTop + 8 })
  objects.push({ kind: 'ledge', x: fx + 20, y: fallTop + 6 })

  // ---- aquatic greenery: plants growing in and at the water (near the banks) ----
  for (let i = 0; i < 12000; i++) {
    const x = 6 + rng() * (WORLD_W - 12)
    const y = 10 + rng() * (WORLD_H - 20)
    const xi = x | 0
    const yi = y | 0
    const cls = waterMap[yi * WORLD_W + xi] as Water
    if (cls === Water.FALL || cls === Water.LAND) continue
    const d = shoreField[yi * WORLD_W + xi] // signed px into the water
    const g = rng
    // cattails / reeds stand right at the waterline
    if (d >= -2 && d <= 5 && g() < 0.12 && cap('cattail', 20)) {
      objects.push({ kind: 'cattail', x, y })
      continue
    }
    // lilypads float on the calm shallows near the bank
    if (d >= 3 && d <= 22 && g() < 0.06 && cap('lilypad', 30)) {
      decor.push({ kind: g() < 0.22 ? 'lilyflower' : 'lilypad', x, y })
      continue
    }
    // submerged grass blades sway just under the surface
    if (d >= 2 && d <= 15 && g() < 0.09 && cap('watergrass', 40)) {
      decor.push({ kind: 'watergrass', x, y })
      continue
    }
  }

  // ---- spawn on OPEN GRASS beside the fall (never wedged in water) ----
  const solid = (x: number, y: number) => {
    const c = clsAt(x, y)
    return c === Water.DEEP || c === Water.FALL
  }
  const tx = fx
  const ty = fallBot + 20 // aim near the fall so it stays on-screen
  let spawn = { x: main.cx - main.r - 26, y: main.cy }
  let best = 1e9
  for (let yy = fallTop - 12; yy < main.cy + 120; yy += 3) {
    for (let xx = fx - 170; xx < fx + 170; xx += 3) {
      if (xx < 22 || xx > WORLD_W - 22 || yy < 22 || yy > WORLD_H - 22) continue
      if (clsAt(xx, yy) !== Water.LAND) continue
      // require open ground on all sides so the blob starts free to move
      if (solid(xx - 10, yy) || solid(xx + 10, yy) || solid(xx, yy - 10) || solid(xx, yy + 10)) continue
      const d = (xx - tx) * (xx - tx) + (yy - ty) * (yy - ty)
      if (d < best) {
        best = d
        spawn = { x: xx, y: yy }
      }
    }
  }

  // gentle surface-ripple sources on the open water of the two ponds
  const ripplePts = [
    { x: lakes[0].cx - 16, y: lakes[0].cy - 8 },
    { x: lakes[1].cx + 22, y: lakes[1].cy + 20 },
    { x: lakes[1].cx - 30, y: lakes[1].cy - 26 },
  ]
  return { waterMap, shoreField, decor, objects, waterfall, splash, ripplePts, spawn }
}

export function waterAt(world: WorldData, x: number, y: number): Water {
  const xi = x | 0
  const yi = y | 0
  if (xi < 0 || yi < 0 || xi >= WORLD_W || yi >= WORLD_H) return Water.LAND
  return world.waterMap[yi * WORLD_W + xi] as Water
}

export function isSolidWater(w: Water) {
  return w === Water.DEEP || w === Water.FALL
}
