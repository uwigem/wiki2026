/**
 * A tiny pixel rasteriser for the Home 3 story.
 *
 * Every scene is drawn from simple shapes (rectangles, ellipses, capsules,
 * thick lines) and the team's sprites, rasterised straight into an ImageData
 * buffer at the canvas's native resolution and scaled up with
 * `image-rendering: pixelated`. That keeps the whole story in the site's pixel
 * style while still allowing a camera that zooms and pans: shapes are
 * described in "design units" and the view transform maps them to native
 * pixels every frame.
 *
 * Fades never blend colours. `alpha` is applied with a 4x4 ordered (Bayer)
 * dither, so a half-faded shape is every other pixel, which is how pixel art
 * fades and the only way a dissolve between two scenes stays crisp.
 */

export type Rgb = readonly [number, number, number]

/** 4x4 Bayer thresholds, centred in each step so alpha 0 and 1 are exact. */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16)

export function toRgb(hex: string): Rgb {
  const n = parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function mix(a: Rgb, b: Rgb, t: number): Rgb {
  const k = Math.max(0, Math.min(1, t))
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]
}

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
/** Progress of `t` through the window [a, b], clamped. */
export const span = (t: number, a: number, b: number) => clamp01((t - a) / (b - a))
export const smooth = (v: number) => v * v * (3 - 2 * v)

export class Painter {
  w = 0
  h = 0
  private img: ImageData | null = null
  private ctx: CanvasRenderingContext2D

  /** View transform: native = o + design * k. */
  ox = 0
  oy = 0
  k = 1
  /** 0 to 1, applied with an ordered dither. */
  alpha = 1
  /** Native-pixel clip rectangle. */
  cx0 = 0
  cx1 = Infinity
  cy0 = 0
  cy1 = Infinity
  /** Native-pixel offset added after the view, for sliding layers aside. */
  shiftX = 0
  /**
   * Only draw inside this native-pixel circle. The magnifying lens that zooms
   * from the body into a cell, and closes again onto the garden at the end.
   */
  mask: { cx: number; cy: number; r: number } | null = null

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
  }

  resize(w: number, h: number) {
    if (w === this.w && h === this.h && this.img) return
    this.w = w
    this.h = h
    this.img = this.ctx.createImageData(w, h)
  }

  view(ox: number, oy: number, k: number) {
    this.ox = ox
    this.oy = oy
    this.k = k
  }

  /** Back to plain native pixels. */
  native() {
    this.view(0, 0, 1)
  }

  clip(x0 = 0, x1 = Infinity, y0 = 0, y1 = Infinity) {
    this.cx0 = x0
    this.cx1 = x1
    this.cy0 = y0
    this.cy1 = y1
  }

  clear(c: Rgb) {
    const d = this.img!.data
    for (let i = 0; i < d.length; i += 4) {
      d[i] = c[0]
      d[i + 1] = c[1]
      d[i + 2] = c[2]
      d[i + 3] = 255
    }
  }

  /**
   * Cover the whole canvas in one colour, THROUGH the dither. Unlike `clear`,
   * this respects `alpha`, which is how one scene dissolves over another.
   */
  wash(c: Rgb) {
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) this.px(x, y, c)
  }

  /**
   * One native pixel, through the clip and the dither.
   *
   * The clip is tested BEFORE `shiftX` is applied, so it selects which part of
   * the drawing moves rather than where it may land. That is what lets the
   * garden part like curtains: clip to the left half, shift it left, and none
   * of the right half can slide into view behind it.
   */
  px(x: number, y: number, c: Rgb) {
    x = Math.floor(x)
    y = Math.floor(y)
    if (x < this.cx0 || x >= this.cx1 || y < this.cy0 || y >= this.cy1) return
    if (this.mask) {
      const dx = x + 0.5 - this.mask.cx
      const dy = y + 0.5 - this.mask.cy
      if (dx * dx + dy * dy > this.mask.r * this.mask.r) return
    }
    x += Math.round(this.shiftX)
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return
    if (this.alpha < 1 && BAYER[(y & 3) * 4 + (x & 3)] >= this.alpha) return
    const o = (y * this.w + x) * 4
    const d = this.img!.data
    d[o] = c[0]
    d[o + 1] = c[1]
    d[o + 2] = c[2]
  }

  /** Native rectangle. */
  box(x: number, y: number, w: number, h: number, c: Rgb) {
    const x0 = Math.round(x)
    const y0 = Math.round(y)
    const x1 = Math.round(x + w)
    const y1 = Math.round(y + h)
    for (let j = y0; j < y1; j++) for (let i = x0; i < x1; i++) this.px(i, j, c)
  }

  /** Design-space point to native. */
  nx(x: number) {
    return this.ox + x * this.k
  }
  ny(y: number) {
    return this.oy + y * this.k
  }

  rect(x: number, y: number, w: number, h: number, c: Rgb) {
    this.box(this.nx(x), this.ny(y), w * this.k, h * this.k, c)
  }

  /**
   * Filled ellipse in design space, with an optional outline of `edge` that
   * is always `edgePx` NATIVE pixels thick, so outlines stay crisp at any zoom.
   */
  ellipse(cx: number, cy: number, rx: number, ry: number, fill: Rgb, edge?: Rgb, edgePx = 2) {
    const ncx = this.nx(cx)
    const ncy = this.ny(cy)
    const nrx = rx * this.k
    const nry = ry * this.k
    if (edge) this.nEllipse(ncx, ncy, nrx + edgePx, nry + edgePx, edge)
    this.nEllipse(ncx, ncy, nrx, nry, fill)
  }

  private nEllipse(cx: number, cy: number, rx: number, ry: number, c: Rgb) {
    if (rx <= 0 || ry <= 0) return
    const y0 = Math.floor(cy - ry)
    const y1 = Math.ceil(cy + ry)
    for (let y = y0; y <= y1; y++) {
      const dy = (y + 0.5 - cy) / ry
      if (dy * dy > 1) continue
      const half = rx * Math.sqrt(1 - dy * dy)
      const x0 = Math.round(cx - half)
      const x1 = Math.round(cx + half)
      for (let x = x0; x < x1; x++) this.px(x, y, c)
    }
  }

  /**
   * An ellipse OUTLINE only, `thickPx` native pixels thick. For the pulse that
   * marks the region that just lit up: a filled halo in a pale colour vanished
   * against the white figure, an outline in a strong colour does not.
   */
  ring(cx: number, cy: number, rx: number, ry: number, thickPx: number, c: Rgb) {
    const ncx = this.nx(cx)
    const ncy = this.ny(cy)
    const orx = rx * this.k
    const ory = ry * this.k
    const irx = Math.max(0.1, orx - thickPx)
    const iry = Math.max(0.1, ory - thickPx)
    // Only the part on the canvas: the lens rim is far bigger than the stage
    // while it opens and closes.
    const ya = Math.max(0, Math.floor(ncy - ory))
    const yb = Math.min(this.h - 1, Math.ceil(ncy + ory))
    const xa = Math.max(0, Math.floor(ncx - orx))
    const xb = Math.min(this.w - 1, Math.ceil(ncx + orx))
    for (let y = ya; y <= yb; y++) {
      for (let x = xa; x <= xb; x++) {
        const dx = x + 0.5 - ncx
        const dy = y + 0.5 - ncy
        if ((dx * dx) / (orx * orx) + (dy * dy) / (ory * ory) > 1) continue
        if ((dx * dx) / (irx * irx) + (dy * dy) / (iry * iry) <= 1) continue
        this.px(x, y, c)
      }
    }
  }

  /** A vertical capsule (both ends rounded): the cilium, and anything pill shaped. */
  capsule(cx: number, top: number, bottom: number, width: number, fill: Rgb, edge?: Rgb, edgePx = 2) {
    const r = width / 2
    if (edge) {
      const e = edgePx / this.k
      this.capsuleFill(cx, top - e, bottom + e, r + e, edge)
    }
    this.capsuleFill(cx, top, bottom, r, fill)
  }

  private capsuleFill(cx: number, top: number, bottom: number, r: number, c: Rgb) {
    this.rect(cx - r, top + r, r * 2, Math.max(0, bottom - top - r * 2), c)
    this.ellipse(cx, top + r, r, r, c)
    this.ellipse(cx, bottom - r, r, r, c)
  }

  /** A rectangle with its corners knocked off, in design space. */
  rounded(x: number, y: number, w: number, h: number, fill: Rgb, edge?: Rgb, edgePx = 2) {
    if (edge) {
      const e = edgePx / this.k
      this.roundFill(x - e, y - e, w + e * 2, h + e * 2, edge)
    }
    this.roundFill(x, y, w, h, fill)
  }

  private roundFill(x: number, y: number, w: number, h: number, c: Rgb) {
    const nx0 = Math.round(this.nx(x))
    const ny0 = Math.round(this.ny(y))
    const nx1 = Math.round(this.nx(x + w))
    const ny1 = Math.round(this.ny(y + h))
    const cut = Math.max(1, Math.min(3, Math.floor(Math.min(nx1 - nx0, ny1 - ny0) / 4)))
    for (let j = ny0; j < ny1; j++) {
      const fromEdge = Math.min(j - ny0, ny1 - 1 - j)
      const inset = fromEdge < cut ? cut - fromEdge : 0
      for (let i = nx0 + inset; i < nx1 - inset; i++) this.px(i, j, c)
    }
  }

  /** A thick line between two design-space points, `widthPx` native pixels wide. */
  line(x0: number, y0: number, x1: number, y1: number, widthPx: number, c: Rgb) {
    const ax = this.nx(x0)
    const ay = this.ny(y0)
    const bx = this.nx(x1)
    const by = this.ny(y1)
    const steps = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay)))
    const half = widthPx / 2
    for (let s = 0; s <= steps; s++) {
      const x = ax + ((bx - ax) * s) / steps
      const y = ay + ((by - ay) * s) / steps
      this.box(x - half, y - half, widthPx, widthPx, c)
    }
  }

  /**
   * A filled polygon in design space, with an optional outline `edgePx` native
   * pixels thick. For shapes that tilt, like the watering can as it pours.
   */
  poly(pts: [number, number][], fill: Rgb, edge?: Rgb, edgePx = 2) {
    if (edge) {
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i]
        const b = pts[(i + 1) % pts.length]
        this.line(a[0], a[1], b[0], b[1], edgePx * 2, edge)
      }
    }
    const n = pts.map(([x, y]) => [this.nx(x), this.ny(y)] as const)
    const y0 = Math.floor(Math.min(...n.map((q) => q[1])))
    const y1 = Math.ceil(Math.max(...n.map((q) => q[1])))
    for (let y = y0; y <= y1; y++) {
      const sy = y + 0.5
      const xs: number[] = []
      for (let i = 0; i < n.length; i++) {
        const a = n[i]
        const b = n[(i + 1) % n.length]
        if (a[1] <= sy !== b[1] <= sy) xs.push(a[0] + ((sy - a[1]) / (b[1] - a[1])) * (b[0] - a[0]))
      }
      xs.sort((p, q) => p - q)
      for (let i = 0; i + 1 < xs.length; i += 2) {
        for (let x = Math.round(xs[i]); x < Math.round(xs[i + 1]); x++) this.px(x, y, fill)
      }
    }
  }

  /**
   * A pixel-art grid at an integer pixel size. `x, y` is the design-space
   * position of its top left corner; each grid cell becomes `size` native
   * pixels, so sprites never resample.
   */
  sprite(
    rows: readonly string[],
    color: (ch: string) => Rgb | undefined,
    x: number,
    y: number,
    size: number,
    flip = false,
  ) {
    const sx = Math.round(this.nx(x))
    const sy = Math.round(this.ny(y))
    const w = rows.reduce((m, r) => Math.max(m, r.length), 0)
    rows.forEach((row, j) => {
      for (let i = 0; i < row.length; i++) {
        const c = color(row[i])
        if (!c) continue
        const col = flip ? w - 1 - i : i
        this.box(sx + col * size, sy + j * size, size, size, c)
      }
    })
  }

  /** Pixel triples from `decodeLayer`, for the hedgehog and the logo pieces. */
  triples(cells: ArrayLike<number>, palette: Rgb[], x: number, y: number, size: number, w: number, flip = false) {
    const sx = Math.round(this.nx(x))
    const sy = Math.round(this.ny(y))
    for (let i = 0; i < cells.length; i += 3) {
      const col = flip ? w - 1 - cells[i] : cells[i]
      this.box(sx + col * size, sy + cells[i + 1] * size, size, size, palette[cells[i + 2] - 1])
    }
  }

  flush() {
    if (this.img) this.ctx.putImageData(this.img, 0, 0)
  }
}
