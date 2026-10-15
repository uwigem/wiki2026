import { useEffect, useRef } from 'react'
import { LEGEND, type Sprite } from '../../engine/sprites'
import { SITE_PALETTE } from '../theme'
import { PROTEINS, rotateCW } from './gardenArt'

/**
 * The two diagrams the Human Practices background needs: the Hedgehog
 * pathway off and on, and the difference between switching a protein off in
 * the whole cell and tuning how much of it sits in the cilium.
 *
 * Drawn the way the rest of the site draws explanatory pictures (see
 * `StoryArt` and `SignalDial`): one still image on a canvas, no animation and
 * no controls, with every word as HTML over the top so nothing blurs when the
 * figure is scaled. The proteins are the same sprites the membrane landscape
 * uses, so a reader meets one drawing of SMO, not two.
 *
 * Each figure shows only what the text beside it already says. Nothing here
 * is our own construct: this is the pathway as it occurs, and the contrast
 * between existing methods and the control we are aiming for.
 */

export type ScienceFigureKind = 'pathway' | 'cell-vs-cilium'

type Rgb = [number, number, number]

function toRgb(hex: string): Rgb {
  const n = parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** A word sitting over the drawing, placed in source pixels. */
interface Label {
  text: string
  x: number
  y: number
  /** Which corner of the label the coordinates name. Default is the left. */
  anchor?: 'left' | 'centre' | 'right'
  /** Panel titles and captions are drawn plainer than the part labels. */
  tone?: 'chip' | 'title' | 'caption'
}

interface Figure {
  w: number
  h: number
  labels: Label[]
  /**
   * The narrowest the drawing may be rendered before its words start to
   * collide. Below this the figure scrolls sideways instead of shrinking,
   * the same way the membrane landscape on this page does.
   */
  minPx: number
  /** Read out in place of the picture. */
  alt: string
}

const SMO = PROTEINS['gpcr-blue']
const SMO_UP = rotateCW(SMO)
const GPCR = PROTEINS['gpcr-lilac']
const GPCR_UP = rotateCW(GPCR)
const PTCH_UP = rotateCW(PROTEINS.ptch)

/* ------------------------------------------------------------- the pathway */

/** Panel geometry, shared by both halves so a reader can diff them by eye. */
const P = {
  w: 172,
  h: 150,
  /** Left edge of each panel. */
  at: [0, 188],
  membrane: 96,
  tube: { x0: 62, x1: 92, top: 14 },
  nucleus: { x: 77, y: 130, r: 14 },
}

/** The three steps of the clearance band, left to right. */
const MMM = { y: 174, at: [12, 132, 252], w: 96 }

const PATHWAY: Figure = {
  w: 360,
  h: 258,
  minPx: 560,
  labels: [
    { text: 'no ligand', x: 86, y: 2, anchor: 'centre', tone: 'title' },
    { text: 'Hedgehog ligand bound', x: 274, y: 2, anchor: 'centre', tone: 'title' },
    { text: 'PTCH1', x: 18, y: 30 },
    { text: 'SMO kept out', x: 96, y: 74 },
    { text: 'genes off', x: 96, y: 128, tone: 'caption' },
    { text: 'Hh', x: 206, y: 28 },
    { text: 'SMO', x: 286, y: 20 },
    { text: 'GLI', x: 284, y: 112 },
    { text: 'genes on', x: 284, y: 128, tone: 'caption' },
    { text: 'one SMO stays in the flat membrane in both', x: 180, y: 156, anchor: 'centre', tone: 'caption' },
    { text: 'MEGF8, MOSMO and MGRN1 find SMO', x: 60, y: 240, anchor: 'centre', tone: 'caption' },
    { text: 'MGRN1 tags it', x: 180, y: 240, anchor: 'centre', tone: 'caption' },
    { text: 'the cell degrades it', x: 300, y: 240, anchor: 'centre', tone: 'caption' },
  ],
  alt:
    'Two panels of the same cell, side by side. With no ligand, PTCH1 sits in the wall of the cilium, a bar closes the base, no SMO is in the cilium and the genes in the nucleus are dim. With a Hedgehog ligand bound to PTCH1, SMO stands in the ciliary membrane, an arrow labelled GLI runs down to the nucleus and the genes are lit. One SMO sits in the flat cell membrane in both panels, unchanged. Below, three steps: MEGF8 with MOSMO and MGRN1 beside SMO in a membrane, then MGRN1 putting a tag on SMO, then SMO broken up.',
}

/* ------------------------------------------------- cell against cilium */

const C = {
  w: 150,
  h: 118,
  /** Left edge of each panel, and how far down the panels start. */
  at: [0, 166],
  top: 16,
  membrane: 76,
  tube: { x0: 56, x1: 86, top: 10 },
  /** Where the receptors stand: along the flat membrane, and in the walls. */
  flat: [12, 32, 104],
  wall: [
    [52, 22],
    [82, 46],
  ],
}

const CELL_VS_CILIUM: Figure = {
  w: 316,
  h: 158,
  minPx: 440,
  labels: [
    { text: 'same receptor, different place', x: 158, y: 0, anchor: 'centre', tone: 'title' },
    { text: 'CRISPR or RNAi: gone from the whole cell', x: 75, y: 140, anchor: 'centre', tone: 'caption' },
    { text: 'what we are aiming for: less of it in the cilium', x: 241, y: 140, anchor: 'centre', tone: 'caption' },
  ],
  alt:
    'Two identical cells side by side, each with three receptors in its flat membrane and two in the wall of its cilium. In the first, every receptor is faded and struck through: the protein is gone from the whole cell. In the second, the three receptors in the flat membrane are untouched and only the two in the cilium are faded.',
}

const FIGURES: Record<ScienceFigureKind, Figure> = { pathway: PATHWAY, 'cell-vs-cilium': CELL_VS_CILIUM }

export default function ScienceFigure({
  kind,
  className,
}: {
  kind: ScienceFigureKind
  className?: string
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const fig = FIGURES[kind]

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const { w: W, h: H } = fig
    canvas.width = W
    canvas.height = H
    const img = ctx.createImageData(W, H)

    const pal = SITE_PALETTE
    const CREAM = toRgb(pal.petalWhite)
    const PAPER = toRgb(pal.petalWhiteHi)
    const LINE = toRgb(pal.shadow)
    const SOFT = toRgb(pal.stoneDark)
    const DIM = toRgb(pal.rock)
    const GOLD = toRgb(pal.daisyCore)
    const GOLD_HI = toRgb(pal.daisyPetal)
    const ALGAE = toRgb(pal.algae)
    const BERRY = toRgb(pal.berry)
    const STONE = toRgb(pal.stoneMid)
    const ROCK_D = toRgb(pal.rockDark)

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
    const frame = (x: number, y: number, w: number, h: number, c: Rgb) => {
      box(x, y, w, 1, c)
      box(x, y + h - 1, w, 1, c)
      box(x, y, 1, h, c)
      box(x + w - 1, y, 1, h, c)
    }
    const disc = (cx: number, cy: number, r: number, fill: Rgb, edge: Rgb) => {
      for (let y = -r; y <= r; y++)
        for (let x = -r; x <= r; x++) {
          const d = x * x + y * y
          if (d > r * r) continue
          set(cx + x, cy + y, d > (r - 1.5) * (r - 1.5) ? edge : fill)
        }
    }
    /** A membrane: two dark rules with cream between them. */
    const membrane = (x: number, y: number, w: number) => {
      box(x, y, w, 2, LINE)
      box(x, y + 2, w, 2, CREAM)
      box(x, y + 4, w, 2, LINE)
    }
    /** An arrow, pointing down or right. */
    const arrow = (x: number, y: number, len: number, down: boolean, c: Rgb) => {
      if (down) {
        box(x, y, 2, len - 5, c)
        for (let i = 0; i < 5; i++) box(x - 4 + i, y + len - 5 + i, 10 - 2 * i, 1, c)
      } else {
        box(x, y, len - 5, 2, c)
        for (let i = 0; i < 5; i++) box(x + len - 5 + i, y - 4 + i, 1, 10 - 2 * i, c)
      }
    }
    /**
     * Stamps one of the engine's sprites. `tint` paints every set pixel one
     * colour (a protein shown faded); `strike` rules a line through it.
     */
    const stamp = (sp: Sprite, x: number, y: number, opts: { tint?: Rgb; strike?: boolean } = {}) => {
      sp.rows.forEach((row, j) => {
        for (let i = 0; i < row.length; i++) {
          const key = LEGEND[row[i]]
          if (!key) continue
          set(x + i, y + j, opts.tint ?? toRgb(pal[key]))
        }
      })
      if (opts.strike) {
        // Ruled past the edges of the sprite, or at this size it reads as
        // part of the protein rather than a line through it.
        const n = sp.w + 6
        for (let i = -3; i < n; i++) {
          const px = x + i
          const py = y + Math.round(((sp.h + 4) * (i + 3)) / n) - 2
          set(px, py, LINE)
          set(px, py + 1, LINE)
        }
      }
    }

    box(0, 0, W, H, PAPER)

    if (kind === 'pathway') {
      P.at.forEach((px, side) => {
        const on = side === 1
        box(px, 0, P.w, P.h, PAPER)
        frame(px, 0, P.w, P.h, SOFT)
        // The cell: cytoplasm under a flat membrane.
        box(px + 1, P.membrane + 6, P.w - 2, P.h - P.membrane - 7, CREAM)
        membrane(px + 1, P.membrane, P.w - 2)
        // The cilium: a tall tube standing on the membrane, capped at the top.
        const { x0, x1, top } = P.tube
        const mid = (x0 + x1) / 2
        const r = (x1 - x0) / 2
        for (let y = top; y < P.membrane; y++)
          for (let i = x0; i < x1; i++) {
            const dy = y < top + r ? top + r - y : 0
            const dx = i + 0.5 - mid
            const d = dx * dx + dy * dy
            if (d > r * r) continue
            set(px + i, y, d > (r - 2) * (r - 2) ? LINE : PAPER)
          }
        // The nucleus, and the genes inside it.
        disc(px + P.nucleus.x, P.nucleus.y, P.nucleus.r, PAPER, LINE)
        for (let k = 0; k < 3; k++) box(px + P.nucleus.x - 8, P.nucleus.y - 5 + k * 5, 16, 2, on ? GOLD : DIM)
        // PTCH1 in the wall of the cilium, the same in both panels.
        stamp(PTCH_UP, px + x0 - 4, 26)
        // One SMO out in the flat cell membrane, the same in both panels.
        stamp(SMO, px + 122, P.membrane - 1)
        if (on) {
          // A ligand on the outer face of PTCH1, and SMO now in the wall.
          box(px + 50, 34, 7, 7, GOLD)
          frame(px + 50, 34, 7, 7, GOLD_HI)
          stamp(SMO_UP, px + x1 - 4, 22)
          stamp(SMO_UP, px + x1 - 4, 52)
          stamp(SMO_UP, px + x0 - 4, 56)
          arrow(px + mid - 1, P.membrane + 8, 14, true, LINE)
        } else {
          // Nothing gets in.
          box(px + x0 + 3, P.membrane - 10, x1 - x0 - 6, 3, SOFT)
        }
      })

      // The clearance band: the cell's own way of removing SMO, in three steps.
      box(0, 164, W, 1, SOFT)
      MMM.at.forEach((bx, step) => {
        const my = MMM.y + 22
        box(bx, MMM.y, MMM.w, 60, CREAM)
        frame(bx, MMM.y, MMM.w, 60, SOFT)
        membrane(bx + 1, my, MMM.w - 2)
        // SMO in that membrane: whole for the first two steps, broken in the last.
        const sx = bx + 58
        if (step === 2) {
          stamp(SMO, sx, my - 1, { tint: ROCK_D })
          for (let k = 0; k < 4; k++) box(sx + 1 + k * 4, my - 1 + (k % 2) * 5, 3, 4, CREAM)
        } else {
          stamp(SMO, sx, my - 1)
        }
        if (step < 2) {
          // MEGF8 spans the membrane, MOSMO beside it, MGRN1 underneath.
          box(bx + 20, my - 5, 20, 16, STONE)
          frame(bx + 20, my - 5, 20, 16, ROCK_D)
          box(bx + 12, my - 3, 7, 7, ALGAE)
          box(bx + 26, my + 13, 8, 8, BERRY)
          if (step === 1) {
            // The tag, now on SMO.
            box(sx + 4, my - 8, 7, 5, GOLD)
            frame(sx + 4, my - 8, 7, 5, GOLD_HI)
          } else {
            box(bx + 27, my + 9, 6, 4, GOLD)
          }
        }
        if (step < 2) arrow(bx + MMM.w + 3, MMM.y + 28, 16, false, SOFT)
      })
    } else {
      C.at.forEach((cx, side) => {
        const out = side === 0
        const { x0, x1, top } = C.tube
        const mid = (x0 + x1) / 2
        const r = (x1 - x0) / 2
        box(cx, C.top, C.w, C.h, PAPER)
        frame(cx, C.top, C.w, C.h, SOFT)
        // The cell body, under its flat membrane.
        box(cx + 1, C.top + C.membrane + 6, C.w - 2, C.h - C.membrane - 7, CREAM)
        membrane(cx + 1, C.top + C.membrane, C.w - 2)
        // The cilium, the same shape as the one in the pathway figure.
        for (let y = top; y < C.membrane; y++)
          for (let i = x0; i < x1; i++) {
            const dy = y < top + r ? top + r - y : 0
            const dx = i + 0.5 - mid
            const d = dx * dx + dy * dy
            if (d > r * r) continue
            set(cx + i, C.top + y, d > (r - 2) * (r - 2) ? LINE : PAPER)
          }
        // Three receptors in the flat membrane, two in the ciliary wall. On
        // the left the whole cell loses them; on the right only the cilium
        // changes, and nothing is struck out because nothing is deleted.
        C.flat.forEach((x) =>
          stamp(GPCR, cx + x, C.top + C.membrane - 1, out ? { tint: DIM, strike: true } : {}),
        )
        C.wall.forEach(([x, y]) =>
          stamp(GPCR_UP, cx + x, C.top + y, out ? { tint: DIM, strike: true } : { tint: DIM }),
        )
      })
    }

    ctx.putImageData(img, 0, 0)
  }, [kind, fig])

  const place = (l: Label) => {
    const left = (l.x / fig.w) * 100
    const style =
      l.anchor === 'centre'
        ? { left: `${left}%`, top: `${(l.y / fig.h) * 100}%`, transform: 'translateX(-50%)' }
        : l.anchor === 'right'
          ? { right: `${100 - left}%`, top: `${(l.y / fig.h) * 100}%` }
          : { left: `${left}%`, top: `${(l.y / fig.h) * 100}%` }
    const look =
      l.tone === 'title'
        ? 'pixel text-[0.55rem] text-leaf-800 sm:text-[0.7rem]'
        : l.tone === 'caption'
          ? 'text-[0.5rem] italic leading-none text-leaf-800 sm:text-[0.65rem]'
          : 'pixel rounded-sm border-2 border-leaf-300 bg-leaf-50 px-1 text-[0.5rem] leading-tight sm:text-[0.6rem]'
    return (
      <span key={l.text + l.x} className={'absolute whitespace-nowrap ' + look} style={style}>
        {l.text}
      </span>
    )
  }

  return (
    <div className={'w-full overflow-x-auto ' + (className ?? '')}>
      <div
        role="img"
        aria-label={fig.alt}
        className="relative mx-auto w-full"
        style={{ minWidth: fig.minPx, maxWidth: fig.w * 2 }}
      >
        <canvas
          ref={ref}
          aria-hidden
          className="pixelated block w-full"
          style={{ aspectRatio: `${fig.w} / ${fig.h}` }}
        />
        {fig.labels.map(place)}
      </div>
    </div>
  )
}
