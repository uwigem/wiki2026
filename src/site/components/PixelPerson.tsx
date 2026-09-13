/**
 * Team pixel-people.
 *
 * The eight base sprites in `refSprites.ts` are pixel-accurate transcriptions of
 * the reference sheet. Each person is assigned one (shape + pose) and recoloured:
 * hair, skin, top and trousers are swapped in per person. Recolouring is done in
 * HSL. The target hue and saturation are used, but each pixel keeps the
 * reference's lightness delta from its role's base tone, so the natural shading
 * survives and skin never darkens into what reads as facial hair.
 */
import type { Member } from '../content/team'
import { REF_SPRITES, type Role } from '../refSprites'
import { hashStr, mulberry32 } from '../rng'

/** Default pool: the short-haired trouser templates. The longer-haired template
 *  (base 5) is never auto-assigned, because assigning hair length at random
 *  misgenders people. It is used only for people pinned in LOOK_OVERRIDES. */
const BASE_POOL = [0, 2, 4, 6]

/** 16 skin tones, fair → deep brown. */
export const SKIN: string[] = [
  '#ffe0c4', '#f8d0ac', '#f0c09a', '#e8b088',
  '#dda476', '#cf9463', '#c08653', '#ad7445',
  '#9c6539', '#8a5730', '#794b29', '#684022',
  '#59361d', '#4c2e1a', '#402716', '#361f12',
]
/** Hair, blonde → black (natural base tones; shading comes from the sprite). */
const HAIR: string[] = [
  '#e3c169', '#c9a855', '#b58a45', '#c96a2a',
  '#9c6033', '#7c5230', '#5f4027', '#4a3220', '#332417', '#211d29',
]
const SHIRT: string[] = [
  '#4a8a4a', '#cc4a3e', '#b9c6ea', '#8f61b4', '#4f86bd', '#3f9a8f', '#d98b3e', '#c85a86',
]
const TROUSERS: string[] = ['#3f5fa0', '#565b70', '#5b3a2a', '#3f6b46', '#333844']

const HOODIE = '#33333c'
const JEANS = '#3f5fa0'

type Recolor = Partial<Record<'skin' | 'hair' | 'top' | 'pants', string>>
export interface Look {
  base: number
  recolor: Recolor
}

/* ---- HSL helpers ---- */
function rgb2hsl(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  const r = ((n >> 16) & 255) / 255
  const g = ((n >> 8) & 255) / 255
  const b = (n & 255) / 255
  const mx = Math.max(r, g, b)
  const mn = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (mx + mn) / 2
  if (mx !== mn) {
    const d = mx - mn
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn)
    if (mx === r) h = (g - b) / d + (g < b ? 6 : 0)
    else if (mx === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h /= 6
  }
  return [h, s, l]
}
function hsl2rgb(h: number, s: number, l: number): string {
  let r: number
  let g: number
  let b: number
  if (s === 0) {
    r = g = b = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    const hue = (t: number) => {
      t = ((t % 1) + 1) % 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    r = hue(h + 1 / 3)
    g = hue(h)
    b = hue(h - 1 / 3)
  }
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v * 255)))
  return '#' + ((1 << 24) | (c(r) << 16) | (c(g) << 8) | c(b)).toString(16).slice(1)
}
const clamp01 = (v: number) => Math.max(0, Math.min(1, v))

/* ---- deterministic assignment ---- */

/**
 * Fallback for people who have not set `avatar` on their own entry in
 * content/team.ts: these names get the longer-haired template.
 *
 * This is a guess from first names and it is wrong for some people. The fix is
 * not to edit this list, it is to set `avatar: 'long' | 'short'` next to your
 * own name in team.ts, which takes priority over anything here. Unisex names in
 * particular (Skyler, Jaiden, Gurnoor) were guessed.
 */
const LONG_HAIR_FALLBACK = new Set<string>([
  'Samaira Bakshi', 'Eliza Dawley', 'Eva Trapido', 'Defne Dingiloglu', 'Aimee Furlan',
  'Ruhi Gottumukkala', 'Sanjana Iyer', 'Lakshmi Osorio', 'Victoria Wang', 'Navya Gupta',
  'Tanvi Penubothu', 'Selena Xu', 'Shannon Victor', 'Iris Guo', 'Sophia Nguyen',
  'Selina Shah', 'Ivy Lee', 'Charlotte Hsu', 'Winnie Lin', 'Mansi Patwardhan', 'Zaina Sheikh',
  'Skyler Choi', 'Gurnoor Sandhu',
])

/** Fully-pinned looks for specific people (checked before the WOMEN rule). */
export const LOOK_OVERRIDES: Record<string, Look> = {
  'Rishabh Goenka': { base: 0, recolor: { hair: '#241f2b', skin: SKIN[6], top: HOODIE, pants: JEANS } },
  'Samaira Bakshi': { base: 5, recolor: { hair: '#241f2b', skin: SKIN[4], pants: JEANS } },
  // lighter skin than the random assignment gave him
  'Trevor White': { base: 4, recolor: { hair: '#9c6033', skin: SKIN[6], top: '#4f86bd', pants: '#5b3a2a' } },
}

/**
 * The pixel character for one person.
 *
 * Order of precedence: a full pin in LOOK_OVERRIDES, then the person's own
 * `avatar` choice in team.ts, then the name-based fallback above.
 */
export function looksFor(member: Member): Look {
  const { name } = member
  const pinned = LOOK_OVERRIDES[name]
  if (pinned) return pinned
  const r = mulberry32(hashStr('look:' + name))
  // Always pull this value, even when it is discarded below: the generator is a
  // stream, and skipping a call would change everyone's colours downstream.
  const shortBase = BASE_POOL[Math.floor(r() * BASE_POOL.length)]
  const longHair = member.avatar ? member.avatar === 'long' : LONG_HAIR_FALLBACK.has(name)
  const base = longHair ? 5 : shortBase
  const recolor: Recolor = {
    hair: HAIR[Math.floor(r() * HAIR.length)],
    skin: SKIN[Math.floor(r() * SKIN.length)],
    top: SHIRT[Math.floor(r() * SHIRT.length)],
    pants: TROUSERS[Math.floor(r() * TROUSERS.length)],
  }
  return { base, recolor }
}

/* ---- rasterise ---- */
const cache = new Map<string, string>()
/** How much of the reference's shading each role keeps (for hair/clothes, which
 *  should read as fabric). Skin is handled separately: it never darkens, because
 *  any dark cheek/jaw pixel reads as facial hair. */
const SHADE_KEEP: Partial<Record<Role, number>> = { hair: 0.85, top: 0.8, pants: 0.8 }

function personURL(look: Look): string {
  const sp = REF_SPRITES[look.base % REF_SPRITES.length]
  const rc = look.recolor
  const key = `${look.base}|${rc.skin ?? ''}|${rc.hair ?? ''}|${rc.top ?? ''}|${rc.pants ?? ''}`
  const hit = cache.get(key)
  if (hit) return hit

  // mean lightness/saturation of each role, so recolour centres on the target
  const mean: Partial<Record<Role, { l: number; s: number }>> = {}
  for (const role of ['skin', 'hair', 'top', 'pants'] as Role[]) {
    const es = sp.pal.filter(([, r]) => r === role).map(([h]) => rgb2hsl(h))
    if (es.length) {
      mean[role] = {
        l: es.reduce((a, e) => a + e[2], 0) / es.length,
        s: es.reduce((a, e) => a + e[1], 0) / es.length,
      }
    }
  }
  const colours = sp.pal.map(([hex, role]) => {
    const target = rc[role as 'skin' | 'hair' | 'top' | 'pants']
    const m = mean[role]
    if (!target || !m) return hex
    const [, es, el] = rgb2hsl(hex)
    const [th, ts, tl] = rgb2hsl(target)
    if (role === 'skin') {
      // Skin is kept even. Only the lightest pixels lift slightly (a soft cheek
      // highlight). It NEVER darkens, so there is no dark lower-face "beard".
      return hsl2rgb(th, ts, clamp01(tl + Math.max(0, el - m.l) * 0.3))
    }
    const k = SHADE_KEEP[role] ?? 0.8
    return hsl2rgb(th, clamp01(ts + (es - m.s) * 0.5), clamp01(tl + (el - m.l) * k))
  })

  const canvas = document.createElement('canvas')
  canvas.width = sp.w
  canvas.height = sp.h
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingEnabled = false
  for (let y = 0; y < sp.h; y++) {
    const row = sp.rows[y]
    for (let x = 0; x < sp.w; x++) {
      const ch = row[x]
      if (ch === '.') continue
      ctx.fillStyle = colours[parseInt(ch, 36)]
      ctx.fillRect(x, y, 1, 1)
    }
  }
  const url = canvas.toDataURL()
  cache.set(key, url)
  return url
}

/** One pixel person, scaled up with crisp pixels. Decorative by default. */
export default function PixelPerson({
  traits,
  scale = 4,
  className,
  alt = '',
}: {
  traits: Look
  scale?: number
  className?: string
  alt?: string
}) {
  const sp = REF_SPRITES[traits.base % REF_SPRITES.length]
  return (
    <img
      src={personURL(traits)}
      alt={alt}
      aria-hidden={alt === '' ? true : undefined}
      width={sp.w * scale}
      height={sp.h * scale}
      draggable={false}
      className={'pixelated select-none ' + (className ?? '')}
    />
  )
}
