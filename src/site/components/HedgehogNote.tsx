import { useEffect, useRef } from 'react'
import {
  BALANCE_LOGO,
  HEDGEHOG_SIDE,
  HEDGEHOG_SIDE_SIZE,
  decodeLayer,
} from '../content/balanceLogo'
import { SITE_PALETTE } from '../theme'
import RichText from './RichText'

/**
 * The guide, stopping to explain something in plain words.
 *
 * Every page here carries real science, and real science has vocabulary.
 * Rather than thinning the writing out, the precise version stays in the body
 * copy and the hedgehog gives the plain-language version beside it. A reader
 * who knows the field skips the bubble; a reader who does not gets a way in.
 *
 * It is inline content, not an overlay on the scrolling guide in the margin:
 * that guide is `aria-hidden` and hidden below `lg`, so anything said there
 * would be lost on a phone and lost to a screen reader. This is a real
 * paragraph in the page.
 *
 * **The hedgehog stands to the RIGHT of what it is saying.** The drawing faces
 * left, and a speaker should face their own words: put it on the left and it
 * turns its back on the sentence it is meant to be delivering. Mirroring it
 * instead would have been the other option, but the quills, the paw and the
 * lit side of its face are all drawn for this direction, and flipping pixel
 * art lights it from the wrong side.
 */

const { w: HOG_W, h: HOG_H } = HEDGEHOG_SIDE_SIZE
const SCALE = 3

/**
 * The tail, as a stepped taper rather than a smooth triangle, so it belongs
 * with everything else on the page. Only the top and bottom are stroked: the
 * left edge is left open and tucked under the bubble's own border, which is
 * what makes the two read as one shape instead of a panel with a flag on it.
 */
const TAIL_W = 18
const TAIL_H = 20
const TAIL_OUTLINE =
  '0,0 5,0 5,3 10,3 10,7 14,7 14,9 18,9 18,11 14,11 14,13 10,13 10,17 5,17 5,20 0,20'

interface Props {
  /** Paragraphs in the bubble. Inline formatting works, same as body copy. */
  body: string[]
  /** Small label above the bubble, for example "in plain words". */
  label?: string
}

export default function HedgehogNote({ body, label = 'in plain words' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = HOG_W
    canvas.height = HOG_H
    const img = ctx.createImageData(HOG_W, HOG_H)
    const cells = decodeLayer(HEDGEHOG_SIDE)
    for (let i = 0; i < cells.length; i += 3) {
      const x = cells[i]
      const y = cells[i + 1]
      const n = parseInt(BALANCE_LOGO.palette[cells[i + 2] - 1], 16)
      const o = (y * HOG_W + x) * 4
      img.data[o] = (n >> 16) & 255
      img.data[o + 1] = (n >> 8) & 255
      img.data[o + 2] = n & 255
      img.data[o + 3] = 255
    }
    ctx.putImageData(img, 0, 0)
  }, [])

  return (
    <aside className="flex items-end justify-end gap-0">
      <div className="relative min-w-0 flex-1">
        <div className="panel-flat px-4 py-3">
          <p className="kicker">{label}</p>
          <div className="prose-garden mt-1 text-body-sm leading-relaxed">
            <RichText paragraphs={body} />
          </div>
        </div>

        <svg
          aria-hidden
          width={TAIL_W}
          height={TAIL_H}
          viewBox={`0 0 ${TAIL_W} ${TAIL_H}`}
          // Pulled left by the border width so it sits on the bubble's edge
          // rather than floating a hair off it, and raised so it points at the
          // hedgehog's face rather than at its feet. The sprite is bottom
          // aligned with the bubble, so its head is a fixed distance up.
          className="absolute left-full bottom-9 -ml-[3px] hidden sm:block"
        >
          <polygon
            points={TAIL_OUTLINE}
            fill={SITE_PALETTE.bushHi}
            shapeRendering="crispEdges"
          />
          <polyline
            points={TAIL_OUTLINE}
            fill="none"
            stroke={SITE_PALETTE.grass4}
            strokeWidth={3}
            shapeRendering="crispEdges"
          />
        </svg>
      </div>

      <canvas
        ref={canvasRef}
        aria-hidden
        className="pixelated ml-4 hidden shrink-0 sm:block"
        style={{ width: HOG_W * SCALE, height: HOG_H * SCALE }}
      />
    </aside>
  )
}
