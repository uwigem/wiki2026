import { TARGET_VIEW_H } from '../engine/config'

/**
 * Page geometry shared between the DOM and the canvases.
 *
 * The reading column is laid out with Tailwind classes on `GardenSection`, but
 * the three canvas layers (the page background, the hero and the scroll
 * hedgehog) have to line up with it in plain pixels. This file is where the two
 * agree. If you change the width or padding classes on `GardenSection`, change
 * the constants here in the same commit, or the garden margins will drift out
 * of alignment with the text.
 */

/** `max-w-4xl` on GardenSection's wrapper, in CSS pixels. */
export const CONTENT_MAX_W = 896

/**
 * GardenSection's horizontal padding per side, in CSS pixels, at each Tailwind
 * breakpoint. Mirrors `px-4 sm:px-6 lg:px-8`.
 */
function paddingFor(viewportW: number): number {
  if (viewportW >= 1024) return 32
  if (viewportW >= 640) return 24
  return 16
}

/**
 * The reading column's width at a given viewport width, and the margin band
 * left over on each side of it. The garden's plants are drawn into the bands so
 * the middle stays clean grass under the text.
 */
export function contentBand(viewportW: number): { content: number; band: number } {
  const content = Math.max(0, Math.min(viewportW - paddingFor(viewportW) * 2, CONTENT_MAX_W))
  return { content, band: Math.max(0, (viewportW - content) / 2) }
}

/**
 * The integer factor the engine's logical pixels are blown up by on screen.
 *
 * Every canvas on the site sizes itself with this, so one logical pixel is the
 * same size in the hero, in the page background and under the scroll hedgehog.
 * Integer only, or the pixel art gets uneven edges. Clamped to 2 through 6:
 * below 2 the sprites are too small to read, above 6 a handful of tiles fills
 * the screen.
 */
export function pixelScale(viewportW: number, viewportH: number): number {
  const fit = Math.round(Math.min(viewportW, viewportH) / TARGET_VIEW_H)
  return Math.max(2, Math.min(6, fit))
}

/** The viewport width at which the `lg:` layout starts, in CSS pixels. */
export const LG_BREAKPOINT = 1024
