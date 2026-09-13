import { buildPalette, type Mode } from '../engine/palette'
import { SITE_MODE } from './theme'

/**
 * The single source of colour truth for the website.
 *
 * Every colour the DOM uses is published as a CSS custom property generated from
 * the ENGINE's palette (`src/engine/palette.ts`). Nothing is hand-copied, so the
 * site cannot drift from the garden: edit `BASE` in palette.ts and the panels,
 * buttons, signs and borders all follow.
 *
 * Called from main.tsx before the first render, so there is no unstyled flash.
 */
export function installPaletteVars(mode: Mode = SITE_MODE) {
  const pal = buildPalette(mode)
  const root = document.documentElement
  for (const [key, hex] of Object.entries(pal)) {
    root.style.setProperty(`--p-${key}`, hex)
  }
}
