import { DEFAULT_VIEW_W, DEFAULT_VIEW_H } from './config'

// The Renderer owns a resizable low-res VIEW buffer whose dimensions track the
// window's aspect ratio (window size ÷ pixel scale). The game blits the visible
// slice of the pre-baked world into it, draws animated entities on top in
// view-space, then scales it up crisply to exactly fill the display.

export class Renderer {
  readonly view: HTMLCanvasElement
  readonly ctx: CanvasRenderingContext2D

  constructor() {
    this.view = document.createElement('canvas')
    this.view.width = DEFAULT_VIEW_W
    this.view.height = DEFAULT_VIEW_H
    const ctx = this.view.getContext('2d')
    if (!ctx) throw new Error('2d context unavailable')
    ctx.imageSmoothingEnabled = false
    this.ctx = ctx
  }

  get w() {
    return this.view.width
  }
  get h() {
    return this.view.height
  }

  resize(w: number, h: number) {
    if (w === this.view.width && h === this.view.height) return
    this.view.width = Math.max(16, w)
    this.view.height = Math.max(16, h)
    this.ctx.imageSmoothingEnabled = false
  }

  clear(color: string) {
    this.ctx.fillStyle = color
    this.ctx.fillRect(0, 0, this.w, this.h)
  }

  blitWorld(world: HTMLCanvasElement, camX: number, camY: number) {
    this.ctx.drawImage(world, camX | 0, camY | 0, this.w, this.h, 0, 0, this.w, this.h)
  }

  // Scale the view buffer to exactly fill the display (aspect already matches).
  present(display: HTMLCanvasElement) {
    const dctx = display.getContext('2d')
    if (!dctx) return
    dctx.imageSmoothingEnabled = false
    dctx.drawImage(this.view, 0, 0, this.w, this.h, 0, 0, display.width, display.height)
  }
}
