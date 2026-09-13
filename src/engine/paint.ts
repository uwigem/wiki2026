import type { Palette } from './palette'
import { LEGEND, type Sprite } from './sprites'

// Low-level pixel primitives that operate on any 2D context. Shared by the
// on-screen Renderer (view buffer) and the offscreen terrain bake (world buffer).

type Ctx = CanvasRenderingContext2D

export function px(ctx: Ctx, x: number, y: number, color: string, alpha = 1) {
  if (alpha <= 0) return
  ctx.globalAlpha = alpha
  ctx.fillStyle = color
  ctx.fillRect(x | 0, y | 0, 1, 1)
  ctx.globalAlpha = 1
}

export function rect(ctx: Ctx, x: number, y: number, w: number, h: number, color: string, alpha = 1) {
  if (alpha <= 0) return
  ctx.globalAlpha = alpha
  ctx.fillStyle = color
  ctx.fillRect(x | 0, y | 0, w | 0, h | 0)
  ctx.globalAlpha = 1
}

export interface SpriteOpts {
  flipX?: boolean
  alpha?: number
  skew?: number // horizontal lean, px per row from the bottom (used for the waddle)
  squashY?: number // vertical scale about the base (1 = none)
}

export function drawSprite(ctx: Ctx, sp: Sprite, ox: number, oy: number, pal: Palette, opts: SpriteOpts = {}) {
  const { flipX = false, alpha = 1, skew = 0, squashY = 1 } = opts
  ctx.globalAlpha = alpha
  const baseY = sp.h
  for (let y = 0; y < sp.h; y++) {
    const row = sp.rows[y]
    const shift = skew ? Math.round(skew * (sp.h - 1 - y)) : 0
    // squash about the base: rows near the bottom barely move, top moves most
    const sy = squashY === 1 ? y : baseY - (baseY - y) * squashY
    for (let x = 0; x < sp.w; x++) {
      const ch = row[flipX ? sp.w - 1 - x : x]
      const key = LEGEND[ch]
      if (!key) continue
      ctx.fillStyle = pal[key]
      ctx.fillRect((ox + x + shift) | 0, (oy + sy) | 0, 1, 1)
    }
  }
  ctx.globalAlpha = 1
}

// A little 4-point diamond twinkle (soft, for the subtle sparkles).
export function diamond(ctx: Ctx, x: number, y: number, r: number, color: string, hi: string, alpha: number) {
  if (alpha <= 0 || r <= 0) return
  const cx = x | 0
  const cy = y | 0
  ctx.globalAlpha = Math.min(1, alpha)
  ctx.fillStyle = color
  const arm = Math.max(1, Math.round(r))
  for (let i = 1; i <= arm; i++) {
    ctx.fillRect(cx, cy - i, 1, 1)
    ctx.fillRect(cx, cy + i, 1, 1)
    ctx.fillRect(cx - i, cy, 1, 1)
    ctx.fillRect(cx + i, cy, 1, 1)
  }
  ctx.fillStyle = hi
  ctx.fillRect(cx, cy, 1, 1)
  ctx.globalAlpha = 1
}
