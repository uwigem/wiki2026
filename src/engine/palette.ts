// Semantic color palette for the top-down cozy overworld.
// Sprites and terrain reference these keys only, so day/dusk/night is a single
// transform over this map, and re-theming the whole world is trivial.

export type ColorKey =
  // grass / ground
  | 'grass1'
  | 'grass2'
  | 'grass3'
  | 'grass4'
  | 'bladeDark'
  | 'bladeLight'
  | 'wetRing'
  // water
  | 'water'
  | 'waterDeep'
  | 'waterLight'
  | 'foam'
  | 'fallLight'
  | 'fallDark'
  | 'mist'
  | 'algae'
  | 'algaeHi'
  // stone
  | 'stoneLight'
  | 'stoneMid'
  | 'stoneDark'
  | 'stoneCrack'
  // bush
  | 'bushDark'
  | 'bushMid'
  | 'bushLight'
  | 'bushHi'
  // flowers
  | 'lilacPetal'
  | 'lilacHi'
  | 'lilacCore'
  | 'pinkBud'
  | 'pinkHi'
  | 'pinkDark'
  | 'daisyPetal'
  | 'daisyHi'
  | 'daisyCore'
  | 'petalWhite'
  | 'petalWhiteHi'
  | 'stem'
  | 'leaf'
  | 'leafHi'
  | 'bluePetal'
  | 'blueHi'
  // trees / berries / rocks
  | 'bark'
  | 'barkDark'
  | 'barkLight'
  | 'berry'
  | 'berryHi'
  | 'rock'
  | 'rockDark'
  | 'rockSnow'
  | 'rockSnowHi'
  // blob creature
  | 'blobBody'
  | 'blobHi'
  | 'blobShade'
  | 'blobDark'
  | 'eye'
  | 'cheek'
  | 'sprout'
  | 'sproutHi'
  | 'quill'
  | 'quillDark'
  | 'quillHi'
  | 'hogSkin'
  | 'hogSkinShade'
  | 'spikeHi'
  | 'spikeMid'
  | 'spikeLow'
  // fx
  | 'sparkle'
  | 'sparkleHi'
  | 'shadow'

export type Palette = Record<ColorKey, string>

const BASE: Palette = {
  grass1: '#93bd8e',
  grass2: '#a9cd97',
  grass3: '#71a077',
  grass4: '#c3daa6',
  bladeDark: '#6b9a72',
  bladeLight: '#bcd7a2',
  wetRing: '#6f9d88',

  water: '#8cc3b6',
  waterDeep: '#63a794',
  waterLight: '#bce2d3',
  foam: '#e6f4ee',
  fallLight: '#d4ede4',
  fallDark: '#6cae9e',
  mist: '#eef8f4',
  algae: '#5a9a86',
  algaeHi: '#79b19c',

  stoneLight: '#c6c8c3',
  stoneMid: '#9a9e9b',
  stoneDark: '#6c716d',
  stoneCrack: '#565b58',

  bushDark: '#5f8f6e',
  bushMid: '#9dc79f',
  bushLight: '#cfe6c6',
  bushHi: '#eef6ea',

  lilacPetal: '#b79ad4',
  lilacHi: '#dbc8ef',
  lilacCore: '#f2e9a0',
  pinkBud: '#e79bb0',
  pinkHi: '#f8c8d4',
  pinkDark: '#c9718c',
  daisyPetal: '#f1ecb2',
  daisyHi: '#fbf7da',
  daisyCore: '#e8c86a',
  petalWhite: '#eef2ec',
  petalWhiteHi: '#ffffff',
  stem: '#5f9463',
  leaf: '#6fa86f',
  leafHi: '#93c78d',
  bluePetal: '#9fb0e0',
  blueHi: '#cdd8f5',

  bark: '#93989b',
  barkDark: '#62686a',
  barkLight: '#b8bdbf',
  berry: '#f0a565',
  berryHi: '#ffd39f',
  rock: '#aeb7b3',
  rockDark: '#767f7c',
  rockSnow: '#cdd8d4',
  rockSnowHi: '#e3ece8',

  blobBody: '#e0e1f1',
  blobHi: '#ffffff',
  blobShade: '#bcbedd',
  blobDark: '#9092ba',
  eye: '#3b3b57',
  cheek: '#ecaabe',
  sprout: '#7cc070',
  sproutHi: '#abdd98',
  quill: '#bfa07c',
  quillDark: '#8c765a',
  quillHi: '#dcc9a6',
  hogSkin: '#efd6b3',
  hogSkinShade: '#d8b78f',
  spikeHi: '#c8a670',
  spikeMid: '#7e4a50',
  spikeLow: '#54313a',

  sparkle: '#c2e7f5',
  sparkleHi: '#ffffff',
  shadow: '#3c5a4b',
}

export type Mode = 'day' | 'dusk' | 'night'

// Each time of day RECOLOURS the world in HSL rather than tinting it. Hues rotate
// toward the light's hue by `huePull`, so colours converge: grass, water and
// flowers move by different amounts, changing their relationships), saturation and
// lightness scale. Result reads as a different palette, not day with a filter.
interface Grade {
  hueTarget: number // hue (deg) the light pulls colours toward
  huePull: number // 0..1, how far each hue rotates toward hueTarget
  sat: number // saturation multiplier
  light: number // lightness multiplier
  lightAdd: number // lightness offset
  coolShiftOnly?: boolean // only rotate cool hues (grass/water); warm colours keep their hue, just darken
}
const GRADES: Record<Mode, Grade> = {
  day: { hueTarget: 50, huePull: 0.0, sat: 1.0, light: 1.03, lightAdd: 0.0 },
  dusk: { hueTarget: 32, huePull: 0.2, sat: 0.85, light: 0.92, lightAdd: 0.0 }, // soft warm golden hour
  night: { hueTarget: 218, huePull: 0.55, sat: 0.78, light: 0.6, lightAdd: 0.04, coolShiftOnly: true }, // cool moonlight: grass/water go deep blue, warm things just darken
}
// Highlights and light sources, recoloured gently so they keep glowing.
const GLOW_GRADES: Record<Mode, Grade> = {
  day: { hueTarget: 50, huePull: 0.0, sat: 1.0, light: 1.0, lightAdd: 0.0 },
  dusk: { hueTarget: 38, huePull: 0.12, sat: 1.0, light: 0.98, lightAdd: 0.0 },
  night: { hueTarget: 210, huePull: 0.16, sat: 0.85, light: 0.96, lightAdd: 0.0 },
}

// Light sources / highlights that stay bright even at dusk / night.
const LUMINOUS = new Set<ColorKey>([
  'sparkle',
  'sparkleHi',
  'foam',
  'waterLight',
  'fallLight',
  'mist',
  'blobHi',
])

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
function rgbToHex(r: number, g: number, b: number): string {
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v)))
  return '#' + ((1 << 24) + (c(r) << 16) + (c(g) << 8) + c(b)).toString(16).slice(1)
}
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0)
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
  }
  return [h, s, l]
}
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h = (((h % 360) + 360) % 360) / 360
  if (s === 0) return [l * 255, l * 255, l * 255]
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const t2 = (t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  return [t2(h + 1 / 3) * 255, t2(h) * 255, t2(h - 1 / 3) * 255]
}
function hueTowards(h: number, target: number, amt: number): number {
  const diff = ((target - h + 540) % 360) - 180 // shortest signed path
  return (h + diff * amt + 360) % 360
}
const clamp01 = (v: number) => Math.max(0, Math.min(1, v))

export function buildPalette(mode: Mode): Palette {
  const out = {} as Palette
  for (const key of Object.keys(BASE) as ColorKey[]) {
    const gr = (LUMINOUS.has(key) ? GLOW_GRADES : GRADES)[mode]
    const [r, g, b] = hexToRgb(BASE[key])
    const [h0, s0, l0] = rgbToHsl(r, g, b)
    // only cool hues (grass/water, ~90–285°) rotate toward the light; warm colours
    // (hedgehog cream, maroon spikes, pink flowers) keep their hue and just darken,
    // so nothing swings the "short way" round into red/magenta.
    const rotate = gr.huePull > 0 && (!gr.coolShiftOnly || (h0 >= 90 && h0 <= 285))
    const h = rotate ? hueTowards(h0, gr.hueTarget, gr.huePull) : h0
    const s = clamp01(s0 * gr.sat)
    const l = clamp01(l0 * gr.light + gr.lightAdd)
    const [nr, ng, nb] = hslToRgb(h, s, l)
    out[key] = rgbToHex(nr, ng, nb)
  }
  return out
}
