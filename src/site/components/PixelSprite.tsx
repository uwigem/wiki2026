import type { CSSProperties } from 'react'
import type { Sprite } from '../../engine/sprites'
import type { Palette } from '../../engine/palette'
import { spriteURL } from '../hooks'

interface Props {
  sprite: Sprite
  /** Upscale factor. Must be a whole number, or the pixels come out uneven. */
  scale?: number
  className?: string
  style?: CSSProperties
  /** Leave empty for pure decoration (the image is then hidden from screen readers). */
  alt?: string
  flip?: boolean
  /** Draw in a palette other than the site's. The rail's deeper lilac is the one use. */
  palette?: Palette
}

/**
 * Renders one of the engine's char-map sprites as a crisp <img>.
 *
 * The sprite is rasterised once at 1:1 into a data URL (see `spriteURL`) and
 * scaled up by CSS with `image-rendering: pixelated`, so a 16×16 hedgehog costs
 * the same few hundred bytes whether it's 3× or 10× on screen.
 */
export default function PixelSprite({ sprite, scale = 3, className, style, alt = '', flip, palette }: Props) {
  return (
    <img
      src={spriteURL(sprite, palette)}
      alt={alt}
      aria-hidden={alt === '' ? true : undefined}
      width={sprite.w * scale}
      height={sprite.h * scale}
      draggable={false}
      className={'pixelated select-none ' + (className ?? '')}
      style={{ ...style, transform: `${flip ? 'scaleX(-1) ' : ''}${style?.transform ?? ''}`.trim() || undefined }}
    />
  )
}
