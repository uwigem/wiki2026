import { BLOB_DOWN } from '../engine/sprites'
import { drawSprite, rect } from '../engine/paint'
import { SITE_PALETTE } from './theme'

/**
 * The favicon is the hedgehog, and it blinks.
 *
 * Both frames are drawn from the engine's own sprite and its own blink. The open
 * frame is `BLOB_DOWN`; the closed frame repaints the eye band with the face
 * colour, which is what `Player.draw` does:
 *
 *     rect(ctx, ox + 3, oy + 9, sprite.w - 6, 2, pal.hogSkin)
 *
 * The timing is `player.ts`'s too: a 110ms blink every couple of seconds.
 */

const SCALE = 2 // 16×16 sprite → a 32×32 icon, the size browsers actually want
const BLINK_MS = 110
const GAP_MS = 2600

function frame(blinking: boolean): string {
  const pal = SITE_PALETTE
  const canvas = document.createElement('canvas')
  canvas.width = BLOB_DOWN.w * SCALE
  canvas.height = BLOB_DOWN.h * SCALE
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingEnabled = false
  ctx.scale(SCALE, SCALE)
  drawSprite(ctx, BLOB_DOWN, 0, 0, pal)
  if (blinking) rect(ctx, 3, 9, BLOB_DOWN.w - 6, 2, pal.hogSkin)
  return canvas.toDataURL('image/png')
}

export function installBlinkingFavicon() {
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  link.type = 'image/png'

  const open = frame(false)
  const shut = frame(true)
  link.href = open

  // A blink is a brief close, not a 50/50 flicker. Same rhythm as the sprite in
  // the garden, so the tab and the page read as the same creature.
  const tick = () => {
    link!.href = shut
    window.setTimeout(() => {
      link!.href = open
    }, BLINK_MS)
  }
  window.setInterval(tick, GAP_MS)
}
