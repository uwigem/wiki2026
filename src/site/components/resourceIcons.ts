/**
 * Pixel glyphs for the things a reader can open: a handbook, a reel, a video,
 * a repository, a page somewhere else.
 *
 * A page of resource cards is otherwise a wall of words about words. One
 * glyph per card gives the eye something to land on and says what kind of
 * thing is behind the button before the label is read. They are drawn on the
 * same 12 by 12 grid as the section icons on the homepage, in `#` and `.`,
 * and `PixelIcon` paints them in whatever colour they inherit.
 */

/** A sheet with a folded corner and lines of writing: anything to read. */
export const DOCUMENT = [
  '.########...',
  '.#......##..',
  '.#......#.#.',
  '.#......####',
  '.#.........#',
  '.#.######..#',
  '.#.........#',
  '.#.######..#',
  '.#.........#',
  '.#.####....#',
  '.#.........#',
  '.##########.',
]

/**
 * A portrait frame with a play triangle inside it: a reel, shot the way a
 * phone shoots. The triangle keeps a clear pixel off the frame on every side,
 * or at the size these render it merges into the border and the glyph reads
 * as an empty box.
 */
export const REEL = [
  '..########..',
  '..#......#..',
  '..#......#..',
  '..#.#....#..',
  '..#.##...#..',
  '..#.###..#..',
  '..#.###..#..',
  '..#.##...#..',
  '..#.#....#..',
  '..#......#..',
  '..#......#..',
  '..########..',
]

/** A screen on a stand with a play triangle: an episode to watch. */
export const SCREEN = [
  '############',
  '#..........#',
  '#...#......#',
  '#...##.....#',
  '#...###....#',
  '#...####...#',
  '#...####...#',
  '#...###....#',
  '#...##.....#',
  '#...#......#',
  '#..........#',
  '############',
]

/** Angle brackets: code to clone. */
export const CODE = [
  '............',
  '............',
  '...##....##.',
  '..##......##',
  '.##........#',
  '##..........',
  '##..........',
  '.##........#',
  '..##......##',
  '...##....##.',
  '............',
  '............',
]

/** A box with an arrow leaving it: a page that lives somewhere else. */
export const OUTBOUND = [
  '......######',
  '......#...##',
  '......#..#.#',
  '......#.#..#',
  '......##...#',
  '.......#####',
  '............',
  '#########...',
  '#.......#...',
  '#.......#...',
  '#.......#...',
  '#########...',
]

/** A flask with bubbles: the game. */
export const FLASK = [
  '...######...',
  '...#....#...',
  '....#..#....',
  '....#..#....',
  '....#..#....',
  '...#....#...',
  '...#.##.#...',
  '..#..##..#..',
  '..#.####.#..',
  '..#.####.#..',
  '..########..',
  '............',
]

/**
 * Which glyph a link gets, from where it points and what it is labelled.
 *
 * Derived rather than written into the content, so a card picks up the right
 * picture the moment its address is added and nobody has to remember a second
 * field.
 */
export function iconFor(href: string, tag?: string): string[] {
  const h = href.toLowerCase()
  const t = (tag ?? '').toLowerCase()
  if (/\.(pdf|docx?|pptx?|xlsx?|csv)$/.test(h) || t.includes('pdf') || t.includes('word')) return DOCUMENT
  if (h.includes('instagram.com') || t.includes('reel')) return REEL
  if (h.includes('youtube.com') || h.includes('youtu.be') || t.includes('episode')) return SCREEN
  if (h.includes('github.com') || h.includes('gitlab') || t.includes('repository')) return CODE
  if (h.includes('docs.google.com') || h.includes('drive.google.com') || h.includes('overleaf.com')) return DOCUMENT
  if (h.startsWith('/') || h.includes('alchemy')) return FLASK
  return OUTBOUND
}
