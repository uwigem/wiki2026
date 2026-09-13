import { buildPalette, type Mode } from '../engine/palette'

/**
 * The site's colour.
 *
 * The wiki is always painted in day light, even though the engine can also do
 * dusk and night (the playground lets you switch). Both values live here so
 * that "which palette is the site using" is one answer in one file rather than
 * a string typed into several.
 *
 * Every colour the DOM uses comes from this palette by way of the `--p-*` CSS
 * variables that `palette-vars.ts` publishes at startup. To re-theme the whole
 * site, edit `BASE` in `src/engine/palette.ts`.
 */
export const SITE_MODE: Mode = 'day'

export const SITE_PALETTE = buildPalette(SITE_MODE)
