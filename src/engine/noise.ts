// Tiny deterministic value-noise for grass texturing. No Math.random, so
// everything is a pure hash of coordinates so the world bakes identically.

export function hash2(x: number, y: number): number {
  let h = (x | 0) * 374761393 + (y | 0) * 668265263
  h = (h ^ (h >> 13)) * 1274126177
  return ((h ^ (h >> 16)) >>> 0) / 4294967296
}

function smooth(t: number) {
  return t * t * (3 - 2 * t)
}

export function valueNoise(x: number, y: number): number {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = smooth(x - xi)
  const yf = smooth(y - yi)
  const a = hash2(xi, yi)
  const b = hash2(xi + 1, yi)
  const c = hash2(xi, yi + 1)
  const d = hash2(xi + 1, yi + 1)
  const top = a + (b - a) * xf
  const bot = c + (d - c) * xf
  return top + (bot - top) * yf
}

export function fbm(x: number, y: number): number {
  let v = 0
  let amp = 0.5
  let freq = 1
  for (let i = 0; i < 3; i++) {
    v += valueNoise(x * freq, y * freq) * amp
    freq *= 2.1
    amp *= 0.5
  }
  return v // ~0..0.875
}

// 4x4 ordered (Bayer) dither threshold in [0,1). Used to dither ONLY at the
// boundary between two flat colour bands, leaving each band smooth.
const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
export function bayer(x: number, y: number): number {
  return (BAYER4[((y & 3) << 2) + (x & 3)] + 0.5) / 16
}
