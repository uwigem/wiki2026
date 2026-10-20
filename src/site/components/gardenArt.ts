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

export type ProteinLook = 'smo' | 'ptch' | 'gpr161' | 'glp1r' | 'mc4r' | 'sstr3' | 'pkd'

/**
 * A membrane protein, drawn as a chain of helices threaded through the
 * membrane.
 *
 * Each helix is a lit cylinder two pixels wide. Loops join them in pairs above
 * the membrane and on the offbeat below it, so the chain reads as one strand
 * snaking back and forth rather than as a row of separate bars. How many
 * helices, which way the loops start and what hangs off the ends is what tells
 * a seven-pass receptor from a ten-pass transporter before the label is read.
 */
function helices(
  n: number,
  body: string,
  hi: string,
  foot: string,
  opts: { phase?: 0 | 1; tail?: number } = {},
): string[] {
  const { phase = 0, tail = 0 } = opts
  const W = 3 * n - 1
  const col = (i: number) => 3 * i
  const blank = () => '.'.repeat(W).split('')
  const span = (line: string[], i: number, fill: string) => {
    if (i + 1 >= n) return
    for (let x = col(i); x <= col(i + 1) + 1; x++) line[x] = fill
  }
  const rows: string[] = []

  const top = blank()
  for (let i = phase; i + 1 < n; i += 2) span(top, i, hi)
  rows.push(top.join(''))

  for (let r = 0; r < 8; r++) {
    const line = blank()
    for (let i = 0; i < n; i++) {
      line[col(i)] = hi
      line[col(i) + 1] = body
    }
    rows.push(line.join(''))
  }

  const bottom = blank()
  for (let i = 0; i < n; i++) {
    bottom[col(i)] = foot
    bottom[col(i) + 1] = foot
  }
  for (let i = 1 - phase; i + 1 < n; i += 2) span(bottom, i, foot)
  rows.push(bottom.join(''))

  // A C-terminal tail off the last helix, so the two ends are not the same.
  for (let t = 0; t < tail; t++) {
    const line = blank()
    line[col(n - 1)] = foot
    rows.push(line.join(''))
  }
  return rows
}

/** A class B receptor: the helices under a tall extracellular domain. */
function withEcd(rows: string[], body: string, hi: string): string[] {
  const W = rows[0].length
  const mid = Math.floor(W / 2)
  const cap = (half: number, fill: string) => {
    const line = '.'.repeat(W).split('')
    for (let x = Math.max(0, mid - half); x <= Math.min(W - 1, mid + half); x++) line[x] = fill
    return line.join('')
  }
  return [cap(2, hi), cap(4, body), cap(4, hi), cap(4, body), cap(1, body), ...rows]
}

/** Two subunits around a pore: the polycystin channel. */
function channel(body: string, hi: string, foot: string): string[] {
  const w = (a: string, b: string, gap: string) => `${a}${b}${b}${b}${a}.${gap}.${a}${b}${b}${b}${a}`
  return [
    w(body, body, '.'),
    w(body, hi, '.'),
    w(body, hi, hi),
    w(body, hi, body),
    w(body, hi, hi),
    w(body, hi, body),
    w(body, hi, hi),
    w(body, body, '.'),
    w(foot, foot, '.'),
  ]
}

/**
 * One look per protein, so no two of the seven are the same drawing. The
 * colours follow Creative's membrane figure: Patched teal, Smoothened orange,
 * GPR161 magenta, SSTR3 purple, MC4R yellow.
 */
export const PROTEINS: Record<ProteinLook, Sprite> = {
  smo: s(helices(7, 'b', 'O', 'b', { tail: 2 })),
  ptch: s(helices(10, 'c', 'C', 'c')),
  gpr161: s(helices(7, 'P', 'r', 'R', { phase: 1, tail: 3 })),
  glp1r: s(withEcd(helices(7, 'f', 'F', 's'), 'f', 'F')),
  mc4r: s(helices(6, 'J', 'Y', 'J', { tail: 1 })),
  sstr3: s(helices(7, 'V', 'v', 'V', { phase: 1 })),
  pkd: s(channel('u', 'U', 'u')),
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

/* ------------------------------------------------------------ pixel numerals */

/** Numerals drawn as sprites, five pixels by seven, so 5 and S, 0 and 8 cannot be confused. */
const DIGITS: Record<string, string[]> = {
  '0': ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'],
  '1': ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  '2': ['.###.', '#...#', '....#', '...#.', '..#..', '.#...', '#####'],
  '3': ['####.', '....#', '....#', '.###.', '....#', '....#', '####.'],
  '4': ['...#.', '..##.', '.#.#.', '#..#.', '#####', '...#.', '...#.'],
  '5': ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.'],
  '6': ['..##.', '.#...', '#....', '####.', '#...#', '#...#', '.###.'],
  '7': ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...'],
  '8': ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
  '9': ['.###.', '#...#', '#...#', '.####', '....#', '...#.', '.##..'],
}

/** A figure such as "16" as one sprite in `ink`, each stroke doubled to the right for weight. */
export function numeral(value: string, ink = 'e'): Sprite {
  const glyphs = [...value].map((c) => DIGITS[c]).filter(Boolean)
  const rows = Array.from({ length: 7 }, (_, y) =>
    glyphs
      .map((g) => {
        const r = g[y] + '.'
        return [...r].map((c, x) => (c === '#' || r[x - 1] === '#' ? ink : '.')).join('')
      })
      .join('.'),
  )
  return s(rows)
}

/* -------------------------------------------------------- the counter's icons */

/* One picture per figure in the integration counter. `e` is the ink. */

/** A conversation: stakeholders consulted. */
export const ICON_TALK = s([
  '.eeeeeeeeeee.',
  'ellllllllllle',
  'ellllllllllle',
  'elleeleeleele',
  'elleeleeleele',
  'ellllllllllle',
  'ellllllllllle',
  '.eeelleeeeee.',
  '...elle......',
  '...ele.......',
  '...ee........',
])


/** Three people, one in front: professional communities. */
export const ICON_GROUP = s([
  '.........eee.........',
  '..mmm...eeeee...mmm..',
  '.mmmmm..eeeee..mmmmm.',
  '.mmmmm..eeeee..mmmmm.',
  '.mmmmm...eee...mmmmm.',
  '..mmm...........mmm..',
  '.......eeeeeee.......',
  '.mmmm.eeeeeeeee.mmmm.',
  'mmmmm.eeeeeeeee.mmmmm',
  'mmmmm.eeeeeeeee.mmmmm',
  'mmmmm.eeeeeeeee.mmmmm',
  'mmmmm.eeeeeeeee.mmmmm',
])

/** A checklist on a clipboard: shared adoption needs. */
export const ICON_LIST = s([
  '...eeeee...',
  'eeeemmmeeee',
  'ellllllllle',
  'elmmleeeele',
  'ellllllllle',
  'elmmleeeele',
  'ellllllllle',
  'elmmleeeele',
  'ellllllllle',
  'eeeeeeeeeee',
])
