/**
 * Pixel glyphs for the things a reader can open: a handbook, a reel, a video,
 * a repository, a page somewhere else.
 *
 * A page of resource cards is otherwise a wall of words about words. One
 * glyph per card gives the eye something to land on and says what kind of
 * thing is behind the button before the label is read.
 *
 * Every one of these is a **solid silhouette with its detail knocked out of
 * it**, not an outline. Drawn as outlines on a 12 by 12 grid, every stroke is
 * one pixel and every shape is mostly background: at the size a card renders
 * them they lose their detail and read as empty boxes. A filled shape keeps
 * its outline at any size, and the holes in it stay legible because they are
 * surrounded by ink rather than made of it.
 */

/** A page with its corner turned down and three lines of writing knocked out. */
export const DOCUMENT = [
  '..#######...',
  '..#######...',
  '..########..',
  '..#.....###.',
  '..#######.#.',
  '..#.....###.',
  '..#########.',
  '..#.....###.',
  '..#########.',
  '..#...#####.',
  '..#########.',
  '............',
]

/** A phone-shaped frame with a play triangle knocked out: a reel. */
export const REEL = [
  '..########..',
  '..########..',
  '..###.####..',
  '..###..###..',
  '..###...##..',
  '..###....#..',
  '..###...##..',
  '..###..###..',
  '..###.####..',
  '..########..',
  '..########..',
  '............',
]

/** A screen with a play triangle knocked out: an episode to watch. */
export const SCREEN = [
  '############',
  '############',
  '####.#######',
  '####..######',
  '####...#####',
  '####....####',
  '####....####',
  '####...#####',
  '####..######',
  '####.#######',
  '############',
  '############',
]

/** Angle brackets cut out of a solid block: code to clone. */
export const CODE = [
  '############',
  '############',
  '###.####.###',
  '##.######.##',
  '#.########.#',
  '#.########.#',
  '#.########.#',
  '#.########.#',
  '##.######.##',
  '###.####.###',
  '############',
  '############',
]

/** A box with an arrow leaving it: a page that lives somewhere else. */
export const OUTBOUND = [
  '.....#######',
  '.....#######',
  '.....##...##',
  '.....#.##.##',
  '.....#.###.#',
  '.....##.####',
  '............',
  '########....',
  '########....',
  '##....##....',
  '########....',
  '########....',
]

/** A flask with the liquid knocked out of it: the game. */
export const FLASK = [
  '..######....',
  '..#....#....',
  '..#.##.#....',
  '..#.##.#....',
  '..#.##.#....',
  '.##.##.##...',
  '.#.####.#...',
  '.#......#...',
  '.#.####.#...',
  '.#.####.#...',
  '.########...',
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
