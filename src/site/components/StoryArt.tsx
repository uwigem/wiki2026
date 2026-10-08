import { useEffect, useRef } from 'react'
import { HEDGEHOG_SIDE, HEDGEHOG_SIDE_SIZE, BALANCE_LOGO, decodeLayer } from '../content/balanceLogo'
import { SITE_PALETTE } from '../theme'

/**
 * One small pixel picture to sit beside one sentence of the homepage story.
 *
 * The pattern is borrowed from the clearest iGEM wikis (Barcelona-UB and McGill
 * 2025): one short statement, one simple drawing, lots of space, alternating
 * sides. So each picture here shows exactly ONE thing and is drawn once. No
 * animation loop, nothing competing with the sentence beside it.
 *
 * Words never go inside the canvas. Where a picture needs labels they sit in a
 * plain row underneath, in normal document flow, so they cannot overlap the
 * drawing or each other at any width.
 */

export type StoryArtKind = 'antenna' | 'smo' | 'band' | 'off' | 'dial'

const W = 160
const H = 112

type Rgb = [number, number, number]

function toRgb(hex: string): Rgb {
  const n = parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** The same SMO hexagon the explainer draws, so the two read as one thing. */
const SMO = [
  '....oooooo....',
  '..oohhhhhhoo..',
  '.ohhhhhhhhbbo.',
  'ohhhhhhbbbbbbo',
  'ohhhhbbbbbbbbo',
  'obbbbbbbbbbbbo',
  'obbbbbbbbbbbbo',
  'obbbbbbbbbbbbo',
  '.obbbbbbbbbbo.',
  '..oobbbbbboo..',
  '....oooooo....',
]

const LABELS: Partial<Record<StoryArtKind, string[]>> = {
  band: ['too quiet', 'healthy', 'too loud'],
  dial: ['quieter', 'louder'],
}

interface Props {
  kind: StoryArtKind
  className?: string
}

export default function StoryArt({ kind, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    canvas.width = W
    canvas.height = H
    const img = ctx.createImageData(W, H)

    const P = SITE_PALETTE
    const BG = toRgb(P.bushHi)
    const CELL = toRgb(P.bushMid)
    const EDGE = toRgb(P.bushDark)
    const PALE = toRgb(P.bushLight)
    const DARK = toRgb(P.shadow)
    const RIM = toRgb(P.petalWhite)
    const GOLD = toRgb(P.daisyCore)
    const PINK = toRgb(P.pinkBud)
    const PINK_DARK = toRgb(P.pinkDark)
    const STONE = toRgb(P.stoneMid)
    const INK: Record<string, Rgb> = { o: toRgb(P.eye), b: toRgb(P.lilacPetal), h: toRgb(P.lilacHi) }

    const set = (x: number, y: number, c: Rgb) => {
      x = Math.round(x)
      y = Math.round(y)
      if (x < 0 || y < 0 || x >= W || y >= H) return
      const o = (y * W + x) * 4
      img.data[o] = c[0]
      img.data[o + 1] = c[1]
      img.data[o + 2] = c[2]
      img.data[o + 3] = 255
    }
    const box = (x: number, y: number, w: number, h: number, c: Rgb) => {
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) set(x + i, y + j, c)
    }
    const ellipse = (cx: number, cy: number, rx: number, ry: number, fill: Rgb, edge?: Rgb) => {
      for (let y = -ry; y <= ry; y++)
        for (let x = -rx; x <= rx; x++) {
          const d = (x * x) / (rx * rx) + (y * y) / (ry * ry)
          if (d > 1) continue
          const onEdge = edge && d > (1 - 2.4 / Math.min(rx, ry)) ** 2
          set(cx + x, cy + y, onEdge ? edge : fill)
        }
    }
    /** A vertical capsule: the drawing of a cilium everywhere on the site. */
    const capsule = (x: number, y0: number, w: number, y1: number, fill: Rgb, edge: Rgb) => {
      const r = w / 2
      for (let y = y0; y <= y1; y++)
        for (let i = 0; i < w; i++) {
          const dy = y < y0 + r ? y0 + r - y : 0
          const dx = i + 0.5 - r
          if (dx * dx + dy * dy > r * r) continue
          const inner = dx * dx + dy * dy <= (r - 2) * (r - 2) && i >= 2 && i < w - 2
          set(x + i, y, inner ? fill : edge)
        }
    }
    const stamp = (g: readonly string[], x: number, y: number) =>
      g.forEach((row, j) => {
        for (let i = 0; i < row.length; i++) {
          const c = INK[row[i]]
          if (c) set(x + i, y + j, c)
        }
      })
    const hog = decodeLayer(HEDGEHOG_SIDE)
    const hogPal = BALANCE_LOGO.palette.map(toRgb)
    /** The hedgehog, facing right, and how many sound dashes it is giving off. */
    const hedgehog = (x: number, y: number, s: number, dashes: number) => {
      for (let i = 0; i < hog.length; i += 3) {
        const mx = HEDGEHOG_SIDE_SIZE.w - 1 - hog[i]
        box(x + mx * s, y + hog[i + 1] * s, s, s, hogPal[hog[i + 2] - 1])
      }
      const ox = x + HEDGEHOG_SIDE_SIZE.w * s + 2
      const oy = y + 4
      for (let k = 0; k < dashes; k++) {
        const a = (-80 + k * (60 / Math.max(1, dashes - 1))) * (Math.PI / 180)
        for (let r = 3; r < 13; r++) box(ox + Math.cos(a) * r, oy + Math.sin(a) * r, 2, 2, GOLD)
      }
    }
    const arrow = (x: number, y: number, w: number) => {
      box(x, y - 1, w - 5, 3, DARK)
      for (let i = 0; i < 6; i++) box(x + w - 6 + i, y - 5 + i, 1, 11 - 2 * i, DARK)
    }

    for (let i = 0; i < img.data.length; i += 4) {
      img.data[i] = BG[0]
      img.data[i + 1] = BG[1]
      img.data[i + 2] = BG[2]
      img.data[i + 3] = 255
    }

    if (kind === 'antenna') {
      // A cell, and the one antenna growing out of the top of it. Round, not
      // flat: a flattened ellipse with a stick read as a spinning top.
      capsule(86, 6, 14, 52, PALE, EDGE)
      ellipse(80, 76, 50, 32, CELL, EDGE)
      ellipse(68, 82, 16, 11, EDGE)
      ellipse(64, 79, 5, 3, PALE)
    } else if (kind === 'smo') {
      // Close up on the antenna: SMO inside it, and the hedgehog hearing it.
      box(0, 100, W, 12, CELL)
      box(0, 100, W, 2, EDGE)
      capsule(24, 6, 30, 101, RIM, EDGE)
      for (let i = 0; i < 4; i++) stamp(SMO, 32, 18 + i * 20)
      arrow(60, 64, 22)
      hedgehog(88, 28, 3, 3)
    } else if (kind === 'band') {
      // The narrow band: dangerous at both ends, healthy only in the middle.
      // Drawn low in the frame so its labels sit right underneath it.
      const x0 = 8
      const x1 = 152
      const third = (x1 - x0) / 3
      box(x0 - 2, 78, x1 - x0 + 4, 30, DARK)
      box(x0, 80, third, 26, PINK)
      box(x0 + third, 80, third + 1, 26, CELL)
      box(x0 + third * 2, 80, third, 26, PINK)
      for (let i = 0; i < 9; i++) box(80 - 8 + i, 58 + i, 17 - 2 * i, 1, DARK)
      box(79, 67, 3, 11, DARK)
    } else if (kind === 'off') {
      // A switch thrown to OFF, and a hedgehog with nothing left to say.
      box(4, 40, 80, 40, DARK)
      box(6, 42, 76, 36, STONE)
      box(9, 45, 32, 30, RIM)
      box(9, 45, 32, 3, PALE)
      for (let i = -9; i <= 9; i++) {
        box(61 + i - 1, 60 + i - 1, 4, 4, PINK_DARK)
        box(61 + i - 1, 60 - i - 1, 4, 4, PINK_DARK)
      }
      hedgehog(96, 24, 3, 0)
    } else if (kind === 'dial') {
      // The storyboard's gauge, turned to the middle: a setting, not a switch.
      // Hub at the bottom of the frame so the end labels sit just under it.
      const cx = 80
      const cy = 100
      const N = 24
      for (let i = 0; i < N; i++) {
        const a = (-80 + (160 * i) / (N - 1)) * (Math.PI / 180)
        box(cx + Math.sin(a) * 58 - 5, cy - Math.cos(a) * 58 - 5, 11, 11, RIM)
      }
      for (let i = 0; i < N; i++) {
        const f = i / (N - 1)
        const a = (-80 + 160 * f) * (Math.PI / 180)
        const c: Rgb = [
          PALE[0] + (EDGE[0] - PALE[0]) * f,
          PALE[1] + (EDGE[1] - PALE[1]) * f,
          PALE[2] + (EDGE[2] - PALE[2]) * f,
        ]
        box(cx + Math.sin(a) * 52 - 4, cy - Math.cos(a) * 52 - 4, 9, 9, c)
      }
      const na = 12 * (Math.PI / 180)
      for (let r = 4; r < 42; r++) {
        const w = r < 22 ? 5 : 3
        box(cx + Math.sin(na) * r - (w >> 1), cy - Math.cos(na) * r - (w >> 1), w, w, DARK)
      }
      ellipse(cx, cy, 7, 7, DARK)
      ellipse(cx, cy, 3, 3, RIM)
    }

    ctx.putImageData(img, 0, 0)
  }, [kind])

  const labels = LABELS[kind]
  return (
    <figure className={'mx-auto w-full max-w-[320px] ' + (className ?? '')}>
      <canvas
        ref={ref}
        aria-hidden
        className="pixelated block w-full"
        style={{ aspectRatio: `${W} / ${H}` }}
      />
      {labels && (
        <figcaption
          className={
            'pixel mt-1 flex justify-between text-xs text-leaf-800 sm:text-sm ' +
            (kind === 'dial' ? 'px-[12%]' : 'px-1')
          }
        >
          {labels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </figcaption>
      )}
    </figure>
  )
}
