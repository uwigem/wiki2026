/**
 * Seeded randomness.
 *
 * Several parts of the site look random but must not change between renders: a
 * subteam's plot colours, a teammate's pixel character, the scatter of plants
 * down the page margins. Each of those seeds a generator from a fixed string or
 * number, so the same input always draws the same picture.
 *
 * Never use `Math.random()` for anything that gets drawn. React re-renders, and
 * a colour that changes on every render reads as a flicker.
 */

/** FNV-1a. Turns a name or an id into a stable 32-bit seed. */
export function hashStr(s: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/**
 * mulberry32. Returns a function that yields the next number in [0, 1) each
 * time it is called. Small, fast, and good enough for picking colours and
 * positions.
 *
 * Calls are a stream: pulling one extra value shifts everything after it. If
 * you stop using a value, keep the call and discard the result, or every
 * teammate's avatar downstream of it changes.
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
