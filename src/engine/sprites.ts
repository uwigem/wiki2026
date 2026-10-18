import type { ColorKey } from './palette'

// Shared legend: every sprite char maps to a semantic palette key.
// '.' / ' ' = transparent.
export const LEGEND: Record<string, ColorKey> = {
  // blob
  B: 'blobBody',
  H: 'blobHi',
  S: 'blobShade',
  D: 'blobDark',
  e: 'eye',
  k: 'cheek',
  p: 'sprout',
  q: 'sproutHi',
  // hedgehog quills
  z: 'quill',
  Z: 'quillDark',
  A: 'quillHi',
  // hedgehog face + spiky back
  o: 'hogSkin',
  a: 'hogSkinShade',
  E: 'spikeHi',
  Q: 'spikeMid',
  L: 'spikeLow',
  // foliage canopy
  x: 'bushDark',
  m: 'bushMid',
  l: 'bushLight',
  h: 'bushHi',
  // bark
  n: 'bark',
  N: 'barkDark',
  M: 'barkLight',
  // stems / leaves
  s: 'stem',
  f: 'leaf',
  F: 'leafHi',
  // lilac
  V: 'lilacPetal',
  v: 'lilacHi',
  y: 'lilacCore',
  // white flower
  w: 'petalWhite',
  W: 'petalWhiteHi',
  // periwinkle
  u: 'bluePetal',
  U: 'blueHi',
  // pink bell / heart bud
  P: 'pinkBud',
  r: 'pinkHi',
  R: 'pinkDark',
  // daisy
  Y: 'daisyPetal',
  j: 'daisyHi',
  J: 'daisyCore',
  // berry
  b: 'berry',
  O: 'berryHi',
  // rock
  g: 'rock',
  G: 'rockDark',
  i: 'rockSnow',
  I: 'rockSnowHi',
  // stone slab / ledge
  t: 'stoneLight',
  T: 'stoneMid',
  K: 'stoneDark',
  X: 'stoneCrack',
  // submerged water grass
  c: 'algae',
  C: 'algaeHi',
  // grass decal
  ',': 'bladeDark',
  "'": 'bladeLight',
  // fx
  '+': 'sparkle',
  '*': 'sparkleHi',
}

export interface Sprite {
  w: number
  h: number
  rows: string[]
}

function s(rows: string[]): Sprite {
  const w = Math.max(...rows.map((r) => r.length))
  return { w, h: rows.length, rows: rows.map((r) => r.padEnd(w, '.')) }
}

// ---------------- the sprout-hedgehog (player) ----------------
// A little two-leaf sprout (leaves splay out with a gap → reads as a seedling),
// pale face framed by a tan quill cap, shiny eyes + blush.
// front view: a cream face (two big shiny eyes + blush + little nose) framed by a
// domed tan-speckled maroon spiky crown, with a big splayed sprout and feet.
export const BLOB_DOWN = s([
  '...q.......q....',
  '...qp.....pq....',
  '....qp...pq.....',
  '.....pp.pp......',
  '......ppp.......',
  '...LLQEQEQLL....',
  '..LQEQEQEQEQL...',
  '.LQEoooooooEQL..',
  'LQEoooooooooEQL.',
  'LQooHeoooeHooQL.',
  'LEooeeoooeeooEL.',
  '.LokkooeeokkoL..',
  '..LooooooooooL..',
  '...aoo...ooa....',
  '....oo...oo.....',
  '....oo...oo.....',
])
// back view: the domed spiky back with a central "butt-line" cleft, sprout, feet.
export const BLOB_UP = s([
  '...q.......q....',
  '...qp.....pq....',
  '....qp...pq.....',
  '.....pp.pp......',
  '......ppp.......',
  '...LLQEQEQLL....',
  '..LQEQEQEQEQL...',
  '.LQEQEQLQEQEQL..',
  'LQEQEQELEQEQEQL.',
  'LEQEQEQLQEQEQEL.',
  '.LQEQEQLQEQEQL..',
  '..LQEQELEQEQL...',
  '...LQEQLQEQL....',
  '....aa...aa.....',
  '....aa...aa.....',
  '................',
])
// left/right side profile: cream snout and face to the front (left), domed maroon
// tan-speckled spikes over the back, big sprout on top, feet below.
export const BLOB_SIDE = s([
  '.....q.....q....',
  '.....qp...pq....',
  '......qp.pq.....',
  '.......ppp......',
  '........p.......',
  '.....LQQQL......',
  '...LQEQEQEQL....',
  '..LQEQEQEQEQL...',
  '.oLQEQEQEQEQEQL.',
  'ooHeoLQEQEQEQEQL',
  'ooeeokLQEQEQEQEQ',
  'eoooooaLQEQEQEQL',
  '.oooooaaLQEQEQL.',
  '..oooooaLQEQL...',
  '..oo..oo.LQL....',
  '..oo..oo........',
])

// ---------------- gnarled tree ----------------
export const TREE = s([
  '......xxxxxx......',
  '....xxmmmmmmxx....',
  '...xmmllllllmmx...',
  '..xmllhhhhhhllmx..',
  '..xmlhhhhhhhhlmx..',
  '.xmllhhhhhhhhllmx.',
  '.xmlllllwllllllmx.',
  '.xmllVllllllyllmx.',
  '.xmlllllllllllmx..',
  '..xmmllllllllmmx..',
  '..xxmmmmllmmmmx...',
  '....xxmmmmmmxx....',
  '......xnNMn.......',
  '......nNMNn.......',
  '.....nNMMNn.......',
  '.....nNMNn........',
  '......nNMNn.......',
  '.....nNMMNn.......',
  '....nNMNMNn.......',
  '...nN..nNMNn......',
  '..nN....nNNn......',
])

// ---------------- berry bush ----------------
export const BERRY_BUSH = s([
  '...xxx....xxx...',
  '.xxmmmxxxmmmmx..',
  'xmmlllmmmlllmmx.',
  'xmllhblmmlbhlmx.',
  'xmlllOmlmmOlllx.',
  'xmlbllmlmllblmx.',
  'xmlllmmmmmlllmx.',
  '.xmmlllmmlllmmx.',
  '..xmmmmmmmmmx...',
  '...xxxmmmmxx....',
])

// ---------------- tall reed cluster ----------------
export const REED = s([
  '..s...s.....',
  '..s..ss..s..',
  '.ss..s...s..',
  '.s...s..ss..',
  '.s..fs..s.s.',
  'fs..s...s.s.',
  's...s..ss.s.',
  's..fs..s..s.',
  's..s...s..sf',
  's..s..ss.ss.',
  'fs.s..s..s.s',
  's..sf.s..s.s',
  's..s..sf.s.s',
  's..s..s..s.s',
  '.s.s..s..s.s',
  '.s.s..s..s.s',
])

// ---------------- pink heart-bud plant (buds on upright stems, leafy base) ----------------
export const HEART_PLANT = s([
  '..P.......P..',
  '.PrP.....PrP.',
  '..R.......R..',
  '..s...P...s..',
  '..s..PrP..s..',
  '..s...R...s..',
  '..s...s...s..',
  '..fs..s..sf..',
  '.ffFssssFff..',
  'ffFFfFfFFFf..',
  '.fFFfFfFFf...',
  '..ffFfFff....',
  '...fffff.....',
  '....fff......',
])

// ---------------- small green bush (was the white "orb") ----------------
export const BUSH = s([
  '....xxxxx....',
  '..xxmmmmmxx..',
  '.xmmlllllmmx.',
  'xmllhhhllllmx',
  'xmlhhhhllllmx',
  'xmllllllllmmx',
  'xmmllllllmmmx',
  '.xmmllllllmx.',
  '..xmmmmmmmx..',
  '...xxmmmxx...',
])

// ---------------- fern ----------------
export const FERN = s([
  '.....s.....',
  '..F..s..F..',
  '.FfF.s.FfF.',
  'FfdfFsFfdfF',
  '.FfF.s.FfF.',
  '..F..s..F..',
  '.....s.....',
])

// ---------------- mossy stone (small light cap, mostly grey) ----------------
export const ROCK = s([
  '...iiii.....',
  '..giIIig....',
  '.gggiigg....',
  'ggggggggg...',
  'gggggggGGg..',
  'gGggggGGGGg.',
  'GGgggGGGGGg.',
  '.GGGgGGGGG..',
  '..GGGGGGG...',
])

// ---------------- flat grey stone ledge (frames the waterfall spill) ----------------
export const STONE_LEDGE = s([
  '.....tttttt.....',
  '...ttTTTTTTtt...',
  '..tTTTTTTTTTTt..',
  '.tTTTKTTTTKTTTt.',
  'tTTTTTTTTTTTTTTt',
  'TTKTTTTTTTTTKTTT',
  '.KTTTXTTTTTTKK..',
  '..KKTTTTTTKKK...',
  '....KKKKKKK.....',
])

// ---------------- lilypad (with a notch), plain + budding ----------------
export const LILYPAD = s([
  '.xffx.',
  'xfFFfx',
  'xff.fx',
  '.xffx.',
])
export const LILY_FLOWER = s([
  '..r...',
  '.xrfx.',
  'xfFPfx',
  'xff.fx',
  '.xffx.',
])

// ---------------- submerged water grass (soft algae blades) ----------------
export const WATER_GRASS = s([
  'c..c..',
  'cC.c.c',
  'cCcCcc',
  'ccc.cc',
])

// ---------------- cattail / water reed (brown spike, sways) ----------------
export const CATTAIL = s([
  '..Z..',
  '..z..',
  '..z..',
  '..Z..',
  '.fsf.',
  '..s..',
  '.fs..',
  '..s.f',
  '..s..',
  '..s..',
])

// ---------------- flowers ----------------
export const LILAC = s([
  '..V.V..',
  '.VvyvV.',
  '.VyyyV.',
  '..VvV..',
  '...s...',
  '..FsF..',
  '...s...',
])
export const WHITE_FLOWER = s([
  '..w.w..',
  '.wWyWw.',
  '.wWyWw.',
  '..wWw..',
  '...s...',
  '..FsF..',
  '...s...',
])
export const BLUEBELL = s([
  '..u.u..',
  '.uUyUu.',
  '.uUyUu.',
  '..uUu..',
  '...s...',
  '..FsF..',
  '...s...',
])
export const DAISY = s([
  '..Y.Y..',
  '.YjJjY.',
  '.YJJJY.',
  '..YjY..',
  '...s...',
  '..FsF..',
  '...s...',
])
export const PINK_BELL = s([
  '.P...P..',
  'PrP.PrP.',
  '.R...R..',
  '...P....',
  '..PrP...',
  '...R....',
  '.s.s.s..',
  '.FsssF..',
  '..sss...',
  '...s....',
])
// big cream star daisy (radiating pointed petals, warm centre)
export const BIG_FLOWER = s([
  '....w....',
  '..w.w.w..',
  '...www...',
  '..wWWWw..',
  'wwWWjWWww',
  '..wWWWw..',
  '...www...',
  '..w.w.w..',
  '....s....',
  '...FsF...',
  '....s....',
])

export const TUFT = s([
  '.,...,...',
  ",.,.,.,.,",
  ".,'.,'.,,",
  ',,,,,,,,,',
])
export const PEBBLE = s([
  '.gg..',
  'giig.',
  '.gg..',
])
