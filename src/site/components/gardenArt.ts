import type { Sprite } from '../../engine/sprites'

/**
 * Stand-in pixel art for the Human Practices page, drawn in the engine's
 * sprite alphabet (see LEGEND in `src/engine/sprites.ts`) so it takes the
 * site's palette like everything else.
 *
 * These exist so the page works and so Creative can see what each picture is
 * for and roughly how big it is: the shed and its seven props, one glyph per
 * kind of membrane protein, and an accessory per researcher persona. Each is
 * meant to be replaced by Creative's drawing; swap the sprite, nothing else
 * changes.
 */

function s(rows: string[]): Sprite {
  const w = Math.max(...rows.map((r) => r.length))
  return { w, h: rows.length, rows: rows.map((r) => r.padEnd(w, '.')) }
}

/* ------------------------------------------------------------- the shed */

/** Closed: planks, a tiled roof, two doors with a latch. */
export const SHED_CLOSED = s([
  '..............KKKKKKKKKKKKKK..............',
  '............KKttttttttttttttKK............',
  '..........KKttTtTtTtTtTtTtTtttKK..........',
  '........KKttTtTtTtTtTtTtTtTtTtttKK........',
  '......KKttTtTtTtTtTtTtTtTtTtTtTtttKK......',
  '....KKttTtTtTtTtTtTtTtTtTtTtTtTtTtttKK....',
  '..KKttTtTtTtTtTtTtTtTtTtTtTtTtTtTtTtttKK..',
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',
  '.NnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnN.',
  '.NMnnnnnnnnnnnnNNNNNNNNNNNNnnnnnnnnnnnnMN.',
  '.NnnnnnnnnnnnnnNnnnnnnNnnnnNnnnnnnnnnnnnN.',
  '.NMnnnnnnnnnnnnNnnnnnnNnnnnNnnnnnnnnnnnMN.',
  '.NnnnnnnnnnnnnnNnnnnnnNnnnnNnnnnnnnnnnnnN.',
  '.NMnnnnnnnnnnnnNnnnnnnNnnnnNnnnnnnnnnnnMN.',
  '.NnnnnnnnnnnnnnNnnnnJnNnJnnnNnnnnnnnnnnnN.',
  '.NMnnnnnnnnnnnnNnnnnnnNnnnnNnnnnnnnnnnnMN.',
  '.NnnnnnnnnnnnnnNnnnnnnNnnnnNnnnnnnnnnnnnN.',
  '.NMnnnnnnnnnnnnNnnnnnnNnnnnNnnnnnnnnnnnMN.',
  '.NnnnnnnnnnnnnnNnnnnnnNnnnnNnnnnnnnnnnnnN.',
  '.NMnnnnnnnnnnnnNnnnnnnNnnnnNnnnnnnnnnnnMN.',
  '.NnnnnnnnnnnnnnNnnnnnnNnnnnNnnnnnnnnnnnnN.',
  'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
])

/** Open: the doors swung back, shelves inside. */
export const SHED_OPEN = s([
  '..............KKKKKKKKKKKKKK..............',
  '............KKttttttttttttttKK............',
  '..........KKttTtTtTtTtTtTtTtttKK..........',
  '........KKttTtTtTtTtTtTtTtTtTtttKK........',
  '......KKttTtTtTtTtTtTtTtTtTtTtTtttKK......',
  '....KKttTtTtTtTtTtTtTtTtTtTtTtTtTtttKK....',
  '..KKttTtTtTtTtTtTtTtTtTtTtTtTtTtTtTtttKK..',
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',
  '.NnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnN.',
  '.NMnnnnnnnnnNNNNDDDDDDDDDDDDNNNNnnnnnnnMN.',
  '.NnnnnnnnnnnNnnNDDDDDDDDDDDDNnnNnnnnnnnnN.',
  '.NMnnnnnnnnnNnnNDMMMMMMMMMMDNnnNnnnnnnnMN.',
  '.NnnnnnnnnnnNnnNDDDDDDDDDDDDNnnNnnnnnnnnN.',
  '.NMnnnnnnnnnNnnNDDDDDDDDDDDDNnnNnnnnnnnMN.',
  '.NnnnnnnnnnnNJnNDMMMMMMMMMMDNnJNnnnnnnnnN.',
  '.NMnnnnnnnnnNnnNDDDDDDDDDDDDNnnNnnnnnnnMN.',
  '.NnnnnnnnnnnNnnNDDDDDDDDDDDDNnnNnnnnnnnnN.',
  '.NMnnnnnnnnnNnnNDDDDDDDDDDDDNnnNnnnnnnnMN.',
  '.NnnnnnnnnnnNnnNDDDDDDDDDDDDNnnNnnnnnnnnN.',
  '.NMnnnnnnnnnNnnNDDDDDDDDDDDDNnnNnnnnnnnMN.',
  '.NnnnnnnnnnnNNNNDDDDDDDDDDDDNNNNnnnnnnnnN.',
  'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
])

/* ------------------------------------------------------------ the props */

export type PropKey = 'axe' | 'shears' | 'spray' | 'puller' | 'cart' | 'grabber' | 'tagger'

/** Removes the whole plant: genetic knockout. A felling axe, head and handle. */
const AXE = s([
  '.........nM...',
  '.........nM...',
  '.K.......nM...',
  'KKK......nM...',
  'KiiKK....nM...',
  'KiiiiKKKKnM...',
  'KiiiiKKKKnM...',
  'KiiKK....nM...',
  'KKK......nM...',
  '.K.......nM...',
  '.........nM...',
  '.........nM...',
])

/** Trims rather than uproots: gene silencing. Blades crossed over two loops. */
const SHEARS = s([
  '.i..........i.',
  '..i........i..',
  '...i......i...',
  '....i....i....',
  '.....i..i.....',
  '......KK......',
  '.....b..b.....',
  '....b....b....',
  '...bb....bb...',
  '..b..b..b..b..',
  '..b..b..b..b..',
  '...bb....bb...',
])

/** Dose and reach: small molecule antagonists. A spray bottle. */
const SPRAY = s([
  '.....KKK......',
  '....Kt.KW.....',
  '....KKKKWW....',
  '.....uu.......',
  '....uuuu......',
  '...uuuuuu.....',
  '..uUUuuuuu....',
  '..uUUuuuuu....',
  '..uuuuuuuu....',
  '..uuuuuuuu....',
  '...uuuuuu.....',
  '....uuuu......',
])

/** Lifts one weed out on demand: inducible degrons. A trowel. */
const PULLER = s([
  '......nM......',
  '......nM......',
  '......nM......',
  '......nM......',
  '...KKKnMKK....',
  '...KKKKKKK....',
  '...K..K..K....',
  '...K..K..K....',
  '...K..K..K....',
  '...K..K..K....',
  '....K.K.K.....',
  '..............',
])

/** Moves everything along the path at once: ciliary trafficking. A cart. */
const CART = s([
  '..............',
  '..............',
  '..NNNNNNNNNN..',
  '..NnnnnnnnnN..',
  '..NnMnnnMnnN..',
  '..NnnnnnnnnNnn',
  '..NNNNNNNNNN..',
  '...KK....KK...',
  '..KggK..KggK..',
  '..KggK..KggK..',
  '...KK....KK...',
  '..............',
])

/** Picks one thing out and holds it: targeted protein degradation. Tongs. */
const GRABBER = s([
  '......KK......',
  '......KK......',
  '......KK......',
  '.....KKKK.....',
  '....KK..KK....',
  '...K......K...',
  '..K..bbbb..K..',
  '..K..bOOb..K..',
  '..K..bbbb..K..',
  '..K........K..',
  '..KK......KK..',
  '...K......K...',
])

/** Marks one plant and leaves it standing: cilia-targeted ubiquitination. */
const TAGGER = s([
  '...YYYYYYYY...',
  '...YJJJjjjY...',
  '...YjJjJjjY...',
  '...YYYYYYYY...',
  '......nM......',
  '......nM......',
  '......nM......',
  '......nM......',
  '......nM......',
  '......nM......',
  '......nM......',
  '......nM......',
])

export const PROPS: Record<PropKey, Sprite> = {
  axe: AXE,
  shears: SHEARS,
  spray: SPRAY,
  puller: PULLER,
  cart: CART,
  grabber: GRABBER,
  tagger: TAGGER,
}

/* ------------------------------------------------- the membrane proteins */

export type ProteinLook = 'gpcr-blue' | 'gpcr-lilac' | 'gpcr-pink' | 'ptch' | 'channel'

/** Seven helices through the membrane: a GPCR. Three colourways so neighbours differ. */
const gpcr = (a: string, b: string) =>
  s([
    `.W.W.W.W.W.W.W.`,
    `.${a}.${a}.${a}.${a}.${a}.${a}.${a}.`,
    `.${a}.${b}.${a}.${b}.${a}.${b}.${a}.`,
    `.${a}.${a}.${a}.${a}.${a}.${a}.${a}.`,
    `.${a}.${b}.${a}.${b}.${a}.${b}.${a}.`,
    `.${a}.${a}.${a}.${a}.${a}.${a}.${a}.`,
    `.${a}.${a}.${a}.${a}.${a}.${a}.${a}.`,
    `.D.D.D.D.D.D.D.`,
  ])

/** Twelve helices, a sterol-sensing transporter: Patched. */
const PTCH = s([
  'W.W.W.W.W.W.W.W.W.W.W.W',
  'g.g.g.g.g.g.g.g.g.g.g.g',
  'g.i.g.i.g.i.g.i.g.i.g.i',
  'g.g.g.g.g.g.g.g.g.g.g.g',
  'g.i.g.i.g.i.g.i.g.i.g.i',
  'g.g.g.g.g.g.g.g.g.g.g.g',
  'g.g.g.g.g.g.g.g.g.g.g.g',
  'D.D.D.D.D.D.D.D.D.D.D.D',
])

/** Two subunits around a pore: the polycystin channel. */
const CHANNEL = s([
  '.ccccc...ccccc.',
  '.cCCCc...cCCCc.',
  '.cCCCc.U.cCCCc.',
  '.cCCCc.u.cCCCc.',
  '.cCCCc.U.cCCCc.',
  '.cCCCc.u.cCCCc.',
  '.ccccc...ccccc.',
  '.DDDDD...DDDDD.',
])

export const PROTEINS: Record<ProteinLook, Sprite> = {
  'gpcr-blue': gpcr('u', 'U'),
  'gpcr-lilac': gpcr('V', 'v'),
  'gpcr-pink': gpcr('P', 'r'),
  ptch: PTCH,
  channel: CHANNEL,
}

/* ------------------------------------------------ the persona accessories */

export type PersonaKey = 'cilia' | 'gpcr' | 'developmental' | 'disease' | 'trafficking' | 'synbio'

/** A microscope: the ciliary biologist. */
const MICROSCOPE = s([
  '....KKK...',
  '...Kttt...',
  '...KtK....',
  '..KKtK....',
  '.KttK.....',
  '.Kt.KK....',
  '.KttttK...',
  '...KK.....',
  '.KKKKKK...',
  'KKKKKKKK..',
])

/** A receptor with the signal arriving: the GPCR researcher. */
const SIGNAL = s([
  'W........W',
  '.W..WW..W.',
  '..W.WW.W..',
  '....uu....',
  '....uu....',
  '...uUUu...',
  '...uUUu...',
  '....uu....',
  '....uu....',
  '....DD....',
])

/** A seedling in an egg: the developmental biologist. */
const SEEDLING = s([
  '....q.....',
  '..q.pq....',
  '...qpq....',
  '....p.....',
  '..wwwwww..',
  '.wWWwwwww.',
  '.wWwwwwww.',
  '.wwwwwwww.',
  '..wwwwww..',
  '...wwww...',
])

/** A first-aid cross: the disease researcher. */
const CROSS = s([
  '..wwwwww..',
  '.wwwwwwww.',
  '.www..www.',
  '.ww....ww.',
  '.ww....ww.',
  '.www..www.',
  '.wwwwwwww.',
  '..wwwwww..',
  '....bb....',
  '...bbbb...',
])

/** A tag on a chain: the trafficking and ubiquitination researcher. */
const TAG = s([
  '.YYYYY....',
  '.YJjJY....',
  '.YYYYY....',
  '...g......',
  '..g.g.....',
  '...g......',
  '..g.g.....',
  '...g......',
  '..g.g.....',
  '...g......',
])

/** A wrench: the tool developer. */
const WRENCH = s([
  '.....KKK..',
  '....Kt.tK.',
  '....Kt.tK.',
  '.....KtK..',
  '....KtK...',
  '...KtK....',
  '..KtK.....',
  '.KtK......',
  'KtK.......',
  'KK........',
])

export const ACCESSORIES: Record<PersonaKey, Sprite> = {
  cilia: MICROSCOPE,
  gpcr: SIGNAL,
  developmental: SEEDLING,
  disease: CROSS,
  trafficking: TAG,
  synbio: WRENCH,
}

/* --------------------------------------------------------- diagram parts */

/**
 * A sprite turned a quarter turn clockwise, so a protein drawn standing in a
 * flat membrane can also stand in the vertical wall of a cilium. Nothing is
 * redrawn: the same art serves both orientations.
 */
export function rotateCW(sprite: Sprite): Sprite {
  const rows: string[] = []
  for (let x = 0; x < sprite.w; x++) {
    let row = ''
    for (let y = sprite.h - 1; y >= 0; y--) row += sprite.rows[y][x] ?? '.'
    rows.push(row)
  }
  return { w: sprite.h, h: sprite.w, rows }
}

/** A Y of two heavy chains: the antibody in the neighbouring-markets strip. */
export const ANTIBODY = s([
  '..VV......VV..',
  '..VV......VV..',
  '...VV....VV...',
  '...VV....VV...',
  '....VV..VV....',
  '.....VVVV.....',
  '......VV......',
  '......VV......',
  '......VV......',
  '.....yyyy.....',
  '.....yyyy.....',
])
