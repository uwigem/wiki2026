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

const JEANS = '#3f5fa0'

type Recolor = Partial<Record<'skin' | 'hair' | 'top' | 'pants' | 'eyes', string>>

/** Small additions people asked for on the avatar form. */
export type Extra = 'glasses' | 'flower' | 'stripe' | 'necklace'

export interface Look {
  base: number
  recolor: Recolor
  /** The row under the jaw takes the hair colour instead of the skin's. */
  beard?: true
  extras?: Extra[]
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
 * Fallback for people with no pinned look below and no `avatar` on their own
 * entry in content/team.ts: these names get the longer-haired template. It is
 * a guess, so it only covers the three people who did not fill in the avatar
 * form. Anyone can override it with `avatar: 'long' | 'short'` on their line.
 */
const LONG_HAIR_FALLBACK = new Set<string>(['Charlotte Hsu', 'Ruhi Gottumukkala', 'Winnie Lin'])

/* Colours people asked for on the avatar form (October 2026). */
const BLACK_HAIR = '#211d29'
const DARK_BROWN_HAIR = '#3a2a1e'
const BROWN_HAIR = '#5f4027'
const BLACK_TOP = '#34323d'
const BLACK_PANTS = '#2a2932'
const WHITE_TOP = '#f7f4ee'
const LIGHT_BLUE = '#9cc3e6'
const BLUE = '#4f86bd'
const RED = '#cc4a3e'
const GREEN = '#4a8a4a'
const MAROON = '#6a2433'
const BROWN_EYES = '#5a3a24'
const DARK_BROWN_EYES = '#3e2a1e'
const BLUE_EYES = '#3f7fd0'
const GREEN_EYES = '#3f8f5a'

/**
 * Each person's own avatar, from the avatar form. Base 5 is the longer hair,
 * base 8 the longer hair on a man, the rest are short. Bases 9 and 10 are
 * Samaira's and Rishabh's own drawings, picked from rendered options. Eye colour is left out where it is black, which is what
 * the sprite already draws.
 *
 * Two looks are reserved: only Rishabh is in all black, and only Samaira wears
 * a white top. Sophia and Selena asked for white, so they have another colour.
 *
 * Asked for and not drawn, because a 16-pixel-wide person has no room for
 * them: Sanjana's tortoise, and the Valorant outfit Darrien offered as the less
 * serious option (the other option was the current avatar with lighter skin,
 * which is what is here). Ho Ren left the question blank, so that avatar is the
 * one the name used to generate.
 */
export const LOOK_OVERRIDES: Record<string, Look> = {
  // The only white top on the team, at Rishabh's request. Keep it that way.
  'Samaira Bakshi': { base: 9, recolor: { hair: BLACK_HAIR, skin: '#edc9af', top: WHITE_TOP, pants: BLACK_PANTS } },
  'Alex Devgan': {
    base: 8,
    recolor: { hair: BLACK_HAIR, skin: SKIN[5], top: BLACK_TOP, pants: JEANS, eyes: BROWN_EYES },
    beard: true,
  },
  'Eliza Dawley': { base: 5, recolor: { hair: '#b58a45', skin: SKIN[1], top: '#d9603a', pants: JEANS, eyes: BLUE_EYES } },
  'Aimee Furlan': { base: 5, recolor: { hair: '#c4562a', skin: SKIN[1], top: GREEN, pants: JEANS, eyes: BLUE_EYES } },
  'Jaiden Poon': { base: 4, recolor: { hair: BLACK_HAIR, skin: SKIN[4], top: BLACK_TOP, pants: '#c9b48a' } },
  // The only one in all black, at Rishabh's request. Keep it that way.
  'Rishabh Goenka': { base: 10, recolor: { hair: BLACK_HAIR, skin: SKIN[6], top: BLACK_TOP, pants: BLACK_PANTS, eyes: BROWN_EYES } },
  'Neel Sundar': {
    base: 0,
    recolor: { hair: BLACK_HAIR, skin: SKIN[8], top: RED, pants: '#6b6e78', eyes: DARK_BROWN_EYES },
    extras: ['glasses'],
  },
  'Skyler Choi': { base: 5, recolor: { hair: BLACK_HAIR, skin: SKIN[2], top: '#6f9fd8', pants: JEANS } },
  'Rohith Dinesh': { base: 2, recolor: { hair: BLACK_HAIR, skin: SKIN[8], top: RED, pants: '#2f4a80' } },
  'Defne Dingiloglu': { base: 5, recolor: { hair: BROWN_HAIR, skin: SKIN[2], top: BLACK_TOP, pants: JEANS, eyes: BROWN_EYES } },
  'Teo Fine': { base: 6, recolor: { hair: BLACK_HAIR, skin: SKIN[5], top: MAROON, pants: JEANS } },
  'Alvin Fu': { base: 0, recolor: { hair: BLACK_HAIR, skin: SKIN[4], top: GREEN, pants: '#5b3a2a' }, extras: ['stripe'] },
  'Iris Guo': { base: 5, recolor: { hair: BLACK_HAIR, skin: SKIN[3], top: RED, pants: BLACK_PANTS, eyes: BROWN_EYES } },
  'Navya Gupta': {
    base: 5,
    recolor: { hair: BLACK_HAIR, skin: SKIN[8], top: '#e88aa8', pants: JEANS, eyes: DARK_BROWN_EYES },
    extras: ['flower'],
  },
  'Sanjana Iyer': { base: 5, recolor: { hair: BLACK_HAIR, skin: SKIN[8], top: BLACK_TOP, pants: '#4a6fae', eyes: BROWN_EYES } },
  'Darrien Liang': { base: 0, recolor: { hair: '#7c5230', skin: SKIN[5], top: '#8f61b4', pants: JEANS } },
  'Sophia Nguyen': { base: 5, recolor: { hair: BLACK_HAIR, skin: SKIN[4], top: '#e8937a', pants: JEANS } },
  'Mansi Patwardhan': {
    base: 5,
    recolor: { hair: BLACK_HAIR, skin: SKIN[4], top: LIGHT_BLUE, pants: BLACK_PANTS, eyes: BROWN_EYES },
    extras: ['necklace'],
  },
  'Tanvi Penubothu': { base: 5, recolor: { hair: BLACK_HAIR, skin: SKIN[8], top: '#8f61b4', pants: '#4a4d5a' } },
  'Ho Ren': { base: 2, recolor: { hair: '#c9a855', skin: '#ad7445', top: BLUE, pants: '#3f6b46' } },
  'Gurnoor Sandhu': { base: 5, recolor: { hair: BLACK_HAIR, skin: SKIN[6], top: '#b79ad8', pants: JEANS, eyes: BROWN_EYES } },
  'Selina Shah': { base: 5, recolor: { hair: BLACK_HAIR, skin: SKIN[7], top: MAROON, pants: '#7c9fd0', eyes: BROWN_EYES } },
  'Zaina Sheikh': { base: 5, recolor: { hair: '#2a2020', skin: SKIN[5], top: '#8f61b4', pants: '#565b70', eyes: BROWN_EYES } },
  'Eva Trapido': { base: 5, recolor: { hair: '#6b4528', skin: SKIN[1], top: GREEN, pants: JEANS, eyes: GREEN_EYES } },
  'Shannon Victor': { base: 5, recolor: { hair: BLACK_HAIR, skin: SKIN[8], top: RED, pants: '#565b70', eyes: BROWN_EYES } },
  'Victoria Wang': { base: 5, recolor: { hair: BLACK_HAIR, skin: SKIN[2], top: BLUE, pants: BLACK_PANTS } },
  'Trevor White': {
    base: 4,
    recolor: { hair: DARK_BROWN_HAIR, skin: '#f5d8c4', top: '#3f6b46', pants: BLACK_PANTS, eyes: GREEN_EYES },
  },
  'Selena Xu': { base: 5, recolor: { hair: '#381106', skin: '#facf9d', top: '#c89f78', pants: '#67798f', eyes: '#301a0b' } },
}

/**
 * The pixel character for one person.
 *
 * Order of precedence: a full pin in LOOK_OVERRIDES, then the person's own
 * `avatar` choice in team.ts, then the name-based fallback above. Unpinned
 * colours come from the name, so they are the same on every visit.
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

const FLOWER_PETAL = '#f4a3bf'
const FLOWER_EYE = '#f6d66f'
const STRIPE = '#e8c64a'
const GOLD = '#e0b545'

/** Where a hair flower sits, per template: a spot on the hair, top left. */
const FLOWER_AT: Record<number, [number, number]> = { 5: [3, 3] }
/** The pendant, per template: the bottom of the neckline. */
const NECKLACE_AT: Record<number, [number, number][]> = { 5: [[9, 12], [10, 12]] }

/** Pixels drawn over the recoloured sprite for each extra, as [x, y, colour]. */
function extraPixels(look: Look, cells: (x: number, y: number) => Role | null, outline: string) {
  const sp = REF_SPRITES[look.base % REF_SPRITES.length]
  const px: [number, number, string][] = []
  for (const extra of look.extras ?? []) {
    if (extra === 'glasses') {
      // A frame line along the top of both eyes and across the nose, and a rim
      // under each eye. The lashes above the eyes already close the top.
      const eye: [number, number][] = []
      for (let y = 0; y < sp.h; y++)
        for (let x = 0; x < sp.w; x++) if (cells(x, y) === 'eye' || cells(x, y) === 'pupil') eye.push([x, y])
      const top = Math.min(...eye.map(([, y]) => y))
      const bottom = Math.max(...eye.map(([, y]) => y))
      const xs = [...new Set(eye.map(([x]) => x))].sort((a, b) => a - b)
      const left = xs.slice(0, 2)
      const right = xs.slice(-2)
      for (let x = left[0] - 1; x <= right[1] + 1; x++) if (!xs.includes(x)) px.push([x, top, outline])
      for (const x of [...left, ...right]) px.push([x, bottom + 1, outline])
    } else if (extra === 'flower') {
      const at = FLOWER_AT[look.base]
      if (!at) continue
      const [x, y] = at
      px.push([x, y - 1, FLOWER_PETAL], [x - 1, y, FLOWER_PETAL], [x + 1, y, FLOWER_PETAL], [x, y + 1, FLOWER_PETAL])
      px.push([x, y, FLOWER_EYE])
    } else if (extra === 'stripe') {
      // Across the middle row of the shirt.
      const rows = [...new Set(Array.from({ length: sp.h }, (_, y) => y).filter((y) =>
        Array.from({ length: sp.w }, (_, x) => cells(x, y)).includes('top'),
      ))]
      const y = rows[Math.floor(rows.length / 2)]
      for (let x = 0; x < sp.w; x++) if (cells(x, y) === 'top') px.push([x, y, STRIPE])
    } else if (extra === 'necklace') {
      for (const [x, y] of NECKLACE_AT[look.base] ?? []) px.push([x, y, GOLD])
    }
  }
  return px
}

function personURL(look: Look): string {
  const sp = REF_SPRITES[look.base % REF_SPRITES.length]
  const rc = look.recolor
  const key = JSON.stringify(look)
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
    if (role === 'prop') return hex
    if (role === 'pupil') return rc.eyes ?? hex
    if (role === 'shine') {
      // White on the reference's blonde; on darker hair, a light shade of it.
      if (!rc.hair) return hex
      const [th, ts, tl] = rgb2hsl(rc.hair)
      return hsl2rgb(th, ts * 0.6, clamp01(Math.max(tl + 0.3, 0.55)))
    }
    if (role === 'chin') {
      const from = look.beard ? rc.hair : rc.skin
      if (!from) return hex
      const [th, ts, tl] = rgb2hsl(from)
      // A slight shade under the jaw, so the face keeps its shape.
      return hsl2rgb(th, ts, clamp01(tl - (look.beard ? 0.02 : 0.05)))
    }
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

  const cells = (x: number, y: number): Role | null => {
    const ch = sp.rows[y]?.[x]
    return ch && ch !== '.' ? sp.pal[parseInt(ch, 36)][1] : null
  }

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
  for (const [x, y, colour] of extraPixels(look, cells, sp.pal[0][0])) {
    ctx.fillStyle = colour
    ctx.fillRect(x, y, 1, 1)
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
