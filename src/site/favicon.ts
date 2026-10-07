import { TEAM_LOGO, logoPath } from './content/teamLogo'
import { SITE_PALETTE } from './theme'

/**
 * The browser-tab icon: the team logo on a cream tile.
 *
 * Drawn here from the logo's own pixel data, like everything else on the site,
 * rather than shipped as an image file.
 *
 * The tile is there for dark tab bars. The logo is a dark purple, and on a dark
 * browser theme a bare dark icon all but disappears; on the panel cream it
 * reads on light and dark tabs alike. The cream comes from the site palette.
 *
 * At 32 pixels the logo's thin strings and leash fall below one pixel, so the
 * icon reads as the balance and its two pans rather than in detail. That is
 * expected for a drawing this intricate. The path is drawn antialiased, which
 * keeps those thin lines as a faint trace instead of dropping them outright.
 */

/** Browsers want a 32 × 32 tab icon; it covers 16-point tabs on high-density screens. */
const SIZE = 32

function roundedSquare(ctx: CanvasRenderingContext2D, size: number, radius: number) {
  ctx.beginPath()
  ctx.moveTo(radius, 0)
  ctx.arcTo(size, 0, size, size, radius)
  ctx.arcTo(size, size, 0, size, radius)
  ctx.arcTo(0, size, 0, 0, radius)
  ctx.arcTo(0, 0, size, 0, radius)
  ctx.closePath()
}

function drawIcon(size: number): string {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  roundedSquare(ctx, size, size * 0.18)
  ctx.fillStyle = SITE_PALETTE.bushHi
  ctx.fill()

  // The logo is wider than it is tall, so its width sets the scale.
  const pad = size * 0.07
  const scale = (size - pad * 2) / TEAM_LOGO.width
  ctx.translate(pad, (size - TEAM_LOGO.height * scale) / 2)
  ctx.scale(scale, scale)
  ctx.fillStyle = '#' + TEAM_LOGO.ink
  ctx.fill(new Path2D(logoPath()))

  return canvas.toDataURL('image/png')
}

export function installFavicon() {
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  link.type = 'image/png'
  link.sizes.value = `${SIZE}x${SIZE}`
  link.href = drawIcon(SIZE)
}
