import type { Sprite } from '../../engine/sprites'

/**
 * Pixel art for the Human Practices page, drawn in the engine's sprite
 * alphabet (see LEGEND in `src/engine/sprites.ts`) so it takes the site's
 * palette like everything else.
 *
 * The shed and its seven props are finished drawings. The membrane protein
 * glyphs and the persona accessories are still stand-ins so the page works and
 * Creative can see what each picture is for and roughly how big it is; swap
 * the sprite, nothing else changes.
 */

function s(rows: string[]): Sprite {
  const w = Math.max(...rows.map((r) => r.length))
  return { w, h: rows.length, rows: rows.map((r) => r.padEnd(w, '.')) }
}

/* ------------------------------------------------------------- the shed */

/** Closed: quill-tone planks under a slate roof, a window with its flower box, double doors with a latch, a lantern on a hook. */
export const SHED_CLOSED = s([
  '....................KKKK....................',
  '..................KKtttTKK..................',
  '................KKTKTTKTTKKK................',
  '..............KKtTTtTTtTTtTTKK..............',
  '............KKTKTTKTTKTTKTTKTTKK............',
  '..........KKtTTtTTtTTtTTtTTtTTtTKK..........',
  '........KKTKTTKTTKTTKTTKTTKTTKTTKTKK........',
  '......KKtTTtTTtTTtTTtTTtTTtTTtTTtTTtKK......',
  '....KKTKTTKTTKTTKTTKTTKTTKTTKTTKTTKTTKKK....',
  '..KKtTTtTTtTTtTTtTTtTTtTTtTTtTTtTTtTTtTTKK..',
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',
  '.ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ.',
  '.ZzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzZ.',
  '.ZzzzAAAAAAAzzzzzKKKKKKKKKKKKzzzzzKzzzzzzzZ.',
  '.ZZZZAIUuAuAZZZZZKZzzzKKzzzZKZZZZKYKZZZZZZZ.',
  '.ZzzzAUuuAuAzzzzzKzZzzKKzzZzKzzzzKJKzzzzzzZ.',
  '.ZzzzAAAAAAAzzzzzKzzZzKKzZzzKzzzzzKzzzzzzzZ.',
  '.ZZZZAuuuAuAZZZZZKzzzZKKZzzzKZZZZZZZZZZZZZZ.',
  '.ZzzzAAAAAAAzzzzzKzzzZKKZzzzKzzzzzzzzzzzzzZ.',
  '.ZzzzZPyVZZZzzzzzKzzzJKKJzzzKzzzzzzzzzzzzzZ.',
  '.ZZZZAAAAAAAZZZZZKzzzZKKZzzzKZZZZZZZZZZZZZZ.',
  '.ZzzzzzzzzzzzzzzzKzzzZKKZzzzKzzzzzzzzzzzzzZ.',
  '.ZzzzzzzzzzzzzzzzKzzzZKKZzzzKzzzzzzzzzzzzzZ.',
  '.ZZZZZZZZZZZZZZZZKzzzZKKZzzzKZZZZZZZZZZZZZZ.',
  '.ZzzzzzzzzzzzzzzzKzzzzKKzzzzKzzzzzzzzzzzzzZ.',
  '.ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ.',
  '..,.tTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTt.,.',
  ",',,KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK,,,'",
])

/** Open: the doors folded back against the wall, two shelves of pots inside. */
export const SHED_OPEN = s([
  '....................KKKK....................',
  '..................KKtttTKK..................',
  '................KKTKTTKTTKKK................',
  '..............KKtTTtTTtTTtTTKK..............',
  '............KKTKTTKTTKTTKTTKTTKK............',
  '..........KKtTTtTTtTTtTTtTTtTTtTKK..........',
  '........KKTKTTKTTKTTKTTKTTKTTKTTKTKK........',
  '......KKtTTtTTtTTtTTtTTtTTtTTtTTtTTtKK......',
  '....KKTKTTKTTKTTKTTKTTKTTKTTKTTKTTKTTKKK....',
  '..KKtTTtTTtTTtTTtTTtTTtTTtTTtTTtTTtTTtTTKK..',
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',
  '.ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ.',
  '.ZzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzZ.',
  '.ZzzzAAAAAAAzKKKKKKKKKKKKKKKKKKKKzKzzzzzzzZ.',
  '.ZZZZAIUuAuAZKzzKKLLLLLLLLLLKKzzKKYKZZZZZZZ.',
  '.ZzzzAUuuAuAzKzzKKLLLLLLLLLLKKzzKKJKzzzzzzZ.',
  '.ZzzzAAAAAAAzKzzKKLVLLbLLuLLKKzzKzKzzzzzzzZ.',
  '.ZZZZAuuuAuAZKzzKKAAAAAAAAAAKKzzKZZZZZZZZZZ.',
  '.ZzzzAAAAAAAzKzzKKLLLLLLLLLLKKzzKzzzzzzzzzZ.',
  '.ZzzzZPyVZZZzKzzKKLLLLLLLLLLKKzzKzzzzzzzzzZ.',
  '.ZZZZAAAAAAAZKzzKKLLYLLLPLLLKKzzKZZZZZZZZZZ.',
  '.ZzzzzzzzzzzzKzzKKAAAAAAAAAAKKzzKzzzzzzzzzZ.',
  '.ZzzzzzzzzzzzKzzKKLLLLLLLLLLKKzzKzzzzzzzzzZ.',
  '.ZZZZZZZZZZZZKzzKKLLLLLLLLLLKKzzKZZZZZZZZZZ.',
  '.ZzzzzzzzzzzzKKKKKZZZZZZZZZZKKKKKzzzzzzzzzZ.',
  '.ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ.',
  '..,.tTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTt.,.',
  ",',,KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK,,,'",
])

/* ------------------------------------------------------------ the props */

export type PropKey = 'axe' | 'shears' | 'spray' | 'puller' | 'cart' | 'grabber' | 'tagger'

/** Removes the whole plant: genetic knockout. A felling axe, wedge head and long handle. */
const AXE = s([
  '......KKKK......',
  '....KKtttTK.....',
  '..KKtItttTTK....',
  '.KttttttTTTK....',
  '.KTtttTTTTTK....',
  '..KTTTTTTTKZ....',
  '...KKKKKKZAz....',
  '........ZAzZ....',
  '.........ZAzZ...',
  '..........ZAzZ..',
  '...........ZAzZ.',
  '............ZAzZ',
  '.............ZzZ',
  '..............Z.',
  '................',
  '................',
])

/** Trims rather than uproots: gene silencing. Secateurs, blades open, orange grips. */
const SHEARS = s([
  '.K..........K...',
  'KtK........KtK..',
  'KItK......KtTK..',
  '.KttK....KtTK...',
  '..KttK..KtTK....',
  '...KttKKTTK.....',
  '....KtKKTK......',
  '.....KKXK.......',
  '....KbbKbbK.....',
  '...KbObKbObK....',
  '...KbbbKbbbK....',
  '...KbbbKbbbK....',
  '...KbbbKbbbK....',
  '....KbbKbbK.....',
  '.....KK.KK......',
  '................',
])

/** Dose and reach: small molecule antagonists. A spray bottle with a trigger head. */
const SPRAY = s([
  '......KKK.......',
  '.....KtTTKK.....',
  '..KKKKtttTK.....',
  '.KtIKKKKKtK.....',
  '.KtK...KTK......',
  '..K....KuUK.....',
  '......KuUuuK....',
  '.....KuUuuuuK...',
  '.....KuuuuuuK...',
  '.....KwwwwwwK...',
  '.....KwWwwwwK...',
  '.....KuuuuuuK...',
  '.....KuuuuuuK...',
  '.....KuuuuuuK...',
  '......KuuuuK....',
  '.......KKKK.....',
])

/** Lifts one weed out on demand: inducible degrons. A hand fork. */
const PULLER = s([
  '......KZZK......',
  '.....KZAAzK.....',
  '.....KZAzzK.....',
  '.....KZzzzK.....',
  '.....KZzzzK.....',
  '......KZzK......',
  '......KTtK......',
  '....KKKTtKKK....',
  '...KtTTTTTTtK...',
  '...KTKKTTKKTK...',
  '...KTK.KtK.KTK..',
  '...KTK.KTK.KTK..',
  '...KTK.KTK.KTK..',
  '....K..KK..K....',
  '................',
  '................',
])

/** Moves everything along the path at once: ciliary trafficking. A wheelbarrow with a sprout aboard. */
const CART = s([
  '......qp..q.....',
  '.......pqp......',
  '........p.......',
  '.ZZZZZZZZZZZZZ..',
  '.ZAzzzzzzzzzzZ..',
  '.ZzNnnnnnnnnzZ..',
  '.ZzNnnnnnnnnzZZZ',
  '..ZzzzzzzzzzZAaZ',
  '..ZZZZZZZZZZZ.ZZ',
  '.....ZKKZ.......',
  '....KtTTtK......',
  '...KTKKKKTK.....',
  '...KTKtIKTK.....',
  '...KTKKKKTK.....',
  '....KtTTtK......',
  '.....KKKK.......',
])

/** Picks one thing out and holds it: targeted protein degradation. Tongs on a berry. */
const GRABBER = s([
  '.......KK.......',
  '......KtTK......',
  '......KtTK......',
  '.....KtTTTK.....',
  '....KtTKKTTK....',
  '...KtTK..KTTK...',
  '..KtTK....KTTK..',
  '..KTK......KTK..',
  '..KTK.KKKK.KTK..',
  '..KTK.KbOK.KTK..',
  '..KTKKbbbbKKTK..',
  '..KTKKbbbbKKTK..',
  '...KTKKbbKKTK...',
  '....KKKKKKKK....',
  '................',
  '................',
])

/** Marks one plant and leaves it standing: cilia-targeted ubiquitination. A plant tag on a stake. */
const TAGGER = s([
  '....KKKKKKKK....',
  '...KYjjjjjjYK...',
  '...KYjJYjjjYK...',
  '...KYjjjjjjYK...',
  '...KYJJJJJjYK...',
  '...KYjjjjjjYK...',
  '...KYJJJJjjYK...',
  '...KYjjjjjjYK...',
  '....KKKZZKKK....',
  '.......ZA.......',
  '.......ZA.......',
  '.......ZA.......',
  '.......ZA.......',
  '.......ZA.......',
  '......,ZA,......',
  "....,',ZA,',....",
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
