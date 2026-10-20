import { useEffect, useRef } from 'react'
import { SITE_PALETTE } from '../theme'

/**
 * The diagram the Human Practices background needs: the Hedgehog pathway
 * off and on, and the cell's own way of clearing SMO out of the cilium.
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

export type ScienceFigureKind = 'pathway'

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
    { text: 'No Hedgehog ligand', x: 86, y: 2, anchor: 'centre', tone: 'title' },
    { text: 'Hedgehog ligand bound', x: 274, y: 2, anchor: 'centre', tone: 'title' },
    { text: 'PTCH1', x: 60, y: 104, anchor: 'centre' },
    { text: 'SMO', x: 146, y: 74, anchor: 'centre' },
    { text: 'genes off', x: 96, y: 128, tone: 'caption' },
    { text: 'Hh', x: 196, y: 68 },
    { text: 'PTCH1', x: 227, y: 104, anchor: 'centre' },
    { text: 'SMO', x: 265, y: 20, anchor: 'centre' },
    { text: 'GLI', x: 284, y: 112 },
    { text: 'genes on', x: 284, y: 128, tone: 'caption' },
    { text: 'MEGF8, MOSMO and MGRN1 find SMO', x: 60, y: 240, anchor: 'centre', tone: 'caption' },
    { text: 'MGRN1 tags it', x: 180, y: 240, anchor: 'centre', tone: 'caption' },
    { text: 'SMO is removed', x: 300, y: 240, anchor: 'centre', tone: 'caption' },
  ],
  alt:
    'Two panels of the same cell, side by side. With no ligand, PTCH1 sits as a lump across the mouth of the cilium, and an arrow from SMO in the flat membrane towards the cilium is crossed out: SMO cannot get in, and the genes in the nucleus are dim. With a Hedgehog ligand bound to it, PTCH1 has moved off the mouth, SMO now stands inside the cilium, an arrow labelled GLI runs down to the nucleus and the genes are lit. Below, three steps of the cell clearing SMO on its own: MEGF8, MOSMO and MGRN1 gathered at SMO in a membrane, then a tag placed under the membrane on the cytoplasmic side, then SMO gone from the membrane and its pieces drifting away.'
}

const FIGURES: Record<ScienceFigureKind, Figure> = { pathway: PATHWAY }

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
    const ROCK_D = toRgb(pal.rockDark)
    const LILAC = toRgb(pal.lilacPetal)
    const LILAC_D = toRgb(pal.quillDark)
    const WATER = toRgb(pal.waterLight)
    const WATER_D = toRgb(pal.waterDeep)
    const LEAF = toRgb(pal.leaf)
    // The palette has no true red; this rose is the closest it goes.
    const ROSE = toRgb(pal.pinkDark)

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
      } else if (len < 0) {
        // Pointing left: the same arrow, mirrored.
        const n = -len
        box(x - n + 5, y, n - 5, 2, c)
        for (let i = 0; i < 5; i++) box(x - n + 5 - i, y - 4 + i, 1, 10 - 2 * i, c)
      } else {
        box(x, y, len - 5, 2, c)
        for (let i = 0; i < 5; i++) box(x + len - 5 + i, y - 4 + i, 1, 10 - 2 * i, c)
      }
    }
    /** A rounded lump: how the description page draws a protein. */
    const blob = (x: number, y: number, w: number, h: number, fill: Rgb, edge: Rgb) => {
      const r = Math.min(w, h) / 2
      for (let j = 0; j < h; j++)
        for (let i = 0; i < w; i++) {
          const dx = Math.min(i, w - 1 - i)
          const dy = Math.min(j, h - 1 - j)
          const corner = dx < r && dy < r
          const d2 = corner ? (r - dx) * (r - dx) + (r - dy) * (r - dy) : 0
          if (corner && d2 > r * r) continue
          const rim = dx < 1 || dy < 1 || (corner && d2 > (r - 1.4) * (r - 1.4))
          set(x + i, y + j, rim ? edge : fill)
        }
    }
    /** A cross over something, for a route that is closed. */
    const cross = (cx: number, cy: number, r: number, c: Rgb) => {
      for (let i = -r; i <= r; i++) {
        set(cx + i, cy + i, c)
        set(cx + i + 1, cy + i, c)
        set(cx + i, cy - i, c)
        set(cx + i + 1, cy - i, c)
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
        // One SMO out in the flat cell membrane, the same in both panels.
        blob(px + 136, P.membrane - 5, 20, 14, WATER, WATER_D)
        if (on) {
          // PTCH1 has the ligand on it and has moved off the mouth of the
          // cilium, so SMO can get in and is now standing in its wall.
          blob(px + 24, P.membrane - 7, 30, 16, LILAC, LILAC_D)
          box(px + 32, P.membrane - 18, 8, 8, GOLD)
          frame(px + 32, P.membrane - 18, 8, 8, GOLD_HI)
          blob(px + mid - 10, 34, 20, 14, WATER, WATER_D)
          blob(px + mid - 10, 56, 20, 14, WATER, WATER_D)
          arrow(px + mid - 1, P.membrane + 8, 14, true, LINE)
        } else {
          // PTCH1 sits across the mouth of the cilium. SMO tries to get in
          // from the flat membrane, and cannot: the route is crossed out.
          blob(px + mid - 18, P.membrane - 9, 36, 18, LILAC, LILAC_D)
          arrow(px + 132, P.membrane - 1, -26, false, SOFT)
          cross(px + 120, P.membrane, 7, ROSE)
        }
      })

      // The clearance band: the cell's own way of removing SMO, in three steps.
      box(0, 164, W, 1, SOFT)
      MMM.at.forEach((bx, step) => {
        const my = MMM.y + 22
        box(bx, MMM.y, MMM.w, 60, CREAM)
        frame(bx, MMM.y, MMM.w, 60, SOFT)
        membrane(bx + 1, my, MMM.w - 2)
        // Everything here is a lump, the way the description page draws it.
        const sx = bx + 62
        if (step === 2) {
          // The protein is gone: a gap in the membrane where it stood, and
          // the pieces of it drifting off underneath.
          box(sx - 2, my, 20, 6, CREAM)
          for (let k = 0; k < 3; k++) blob(sx - 2 + k * 7, my + 14 + (k % 2) * 6, 5, 5, DIM, ROCK_D)
        } else {
          blob(sx, my - 5, 18, 16, WATER, WATER_D)
        }
        if (step < 2) {
          // MEGF8 across the membrane, MOSMO beside it, MGRN1 underneath.
          blob(bx + 22, my - 6, 22, 18, LILAC, LILAC_D)
          blob(bx + 12, my - 4, 12, 14, LEAF, ALGAE)
          blob(bx + 18, my + 14, 24, 12, GOLD, BERRY)
          // The tag goes on under the membrane, which is the side MGRN1 is on.
          const tag = step === 1 ? [sx + 5, my + 14] : [bx + 28, my + 17]
          blob(tag[0], tag[1], 7, 7, GOLD, GOLD_HI)
        }
        if (step < 2) arrow(bx + MMM.w + 3, MMM.y + 28, 16, false, SOFT)
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
