import { ALL_ROUTES, activeGroup } from '../content/nav'

/**
 * The page backgrounds, as fixed images.
 *
 * Every page has its own garden down its margins, drawn once by
 * `npm run gardens` (scripts/bake-gardens.ts, using the recipe in
 * `generate.ts`) and saved under public/gardens/. Nothing is generated in the
 * browser: the page shows two images, a small tiling lawn for the whole page
 * and one tall picture holding that page's two margin strips, and the browser
 * paints them like any other background.
 *
 * This file is the small part the site itself needs: which file belongs to
 * which page, and the sizes the images were drawn at. The drawing code lives
 * in `generate.ts` and never ships to the browser.
 */

/*
 * Sizes below are in logical garden pixels. The page shows each one as 2 to 5
 * CSS pixels depending on the window, by the rule in index.css (--gs).
 */

/** Width of one margin strip, in logical pixels. */
export const STRIP_W = 128

/** Height of a page's garden, in logical pixels. It repeats below that, on a very long page. */
export const GARDEN_ROWS = 6000

/** The tiling lawn is this many logical pixels square. */
export const LAWN_SIZE = 256

export const LAWN_FILE = 'gardens/lawn.png'

export type Variant = 'meadow' | 'wetland' | 'orchard'

/** The planting each page family uses. Every page in a family still gets its own layout. */
export function variantFor(path: string): Variant {
  const group = activeGroup(path)?.label
  if (group === 'Human Practices') return 'wetland'
  if (group === 'Team and Resources') return 'orchard'
  return 'meadow'
}

/**
 * The pages that have a garden: all of them except the homepage, which
 * paints its own background, and the full-screen playground.
 */
export const GARDEN_ROUTES: string[] = ALL_ROUTES.map((r) => r.to).filter((to) => to !== '/' && to !== '/playground')

/** `/human-practices` becomes `human-practices`. */
export function gardenName(path: string): string {
  return path.replace(/^\/+|\/+$/g, '').replace(/\//g, '-')
}

/** The image holding a page's margin strips, or null for a page without one. */
export function gardenFile(path: string): string | null {
  return GARDEN_ROUTES.includes(path) ? `gardens/${gardenName(path)}.png` : null
}

/** A stable number from a page path (FNV-1a), so each page's garden is laid out the same way every time it is drawn. */
export function seedFor(path: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < path.length; i++) {
    h ^= path.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}
