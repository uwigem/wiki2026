import { SITE_PALETTE as P } from '../theme'

/**
 * The three medals, as pixel art.
 *
 * One drawing, recoloured three times: a ribbon, a rimmed disc lit from the
 * upper left, and a star on the face. Every tone is a garden palette colour
 * rather than a metal picked out of the air, so the medals sit in the same
 * world as the rest of the site: copper from the berry, silver from the
 * stones, gold from the daisy's middle.
 *
 * In `ROWS` each character is one pixel. `r` and `R` are the ribbon, `o` the
 * rim, `h` the lit face, `m` the face, `s` the shaded face, `x` the star, and
 * `.` is empty.
 */
export type MedalTier = 'bronze' | 'silver' | 'gold'

export const MEDAL_ROWS = [
  '.rR.......rR.',
  '.rR.......rR.',
  '..rR.....rR..',
  '..rR.....rR..',
  '...rR...rR...',
  '...rR...rR...',
  '....rR.rR....',
  '....ooooo....',
  '...ohhhmmo...',
  '..ohhhmmmmo..',
  '.ohhhmxmmmmo.',
  '.ohhmxxxmmmo.',
  '.ohmxxxxxmso.',
  '.ommmxmxmsso.',
  '.ommxmmmxsso.',
  '..ommmmssso..',
  '...ommssso...',
  '....ooooo....',
]

export const MEDAL_W = MEDAL_ROWS[0].length
export const MEDAL_H = MEDAL_ROWS.length

/** Ribbon, the same on all three. */
const RIBBON: Record<string, string> = { r: P.bushMid, R: P.bushDark }

/** Rim, face, shade and highlight, per tier. */
export const MEDAL_TONES: Record<MedalTier, Record<string, string>> = {
  bronze: { o: P.quillDark, s: P.quill, m: P.berry, h: P.berryHi, x: P.berryHi, ...RIBBON },
  silver: { o: P.stoneDark, s: P.stoneMid, m: P.stoneLight, h: P.rockSnowHi, x: P.rockSnowHi, ...RIBBON },
  gold: { o: P.quillDark, s: P.quill, m: P.daisyCore, h: P.daisyHi, x: P.daisyHi, ...RIBBON },
}
