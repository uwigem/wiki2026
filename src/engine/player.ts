import { Water } from './config'
import type { Palette } from './palette'
import { drawSprite, rect } from './paint'
import { BLOB_DOWN, BLOB_SIDE, BLOB_UP, type Sprite } from './sprites'
import { isSolidWater, waterAt, type WorldData } from './world'

export interface Input {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
}

const ACC = 620
const MAX = 82
const FRICTION = 740

function approach(v: number, target: number, step: number) {
  if (v > target) return Math.max(target, v - step)
  if (v < target) return Math.min(target, v + step)
  return v
}

export class Player {
  x: number
  y: number
  vx = 0
  vy = 0
  facing: 'down' | 'up' | 'left' | 'right' = 'down'
  private phase = 0
  private moving = false
  private wade = false
  private blink = 0
  private blinkT = 2.5

  constructor(spawn: { x: number; y: number }) {
    this.x = spawn.x
    this.y = spawn.y
  }

  get feetY() {
    return this.y + 7
  }

  private feetSolid(world: WorldData, px: number, py: number): boolean {
    const pts: [number, number][] = [
      [px - 3, py + 6],
      [px + 3, py + 6],
      [px, py + 7],
    ]
    for (const [sx, sy] of pts) if (isSolidWater(waterAt(world, sx, sy))) return true
    return false
  }

  update(dt: number, input: Input, world: WorldData, time: number) {
    const ix = (input.right ? 1 : 0) - (input.left ? 1 : 0)
    const iy = (input.down ? 1 : 0) - (input.up ? 1 : 0)
    let ax = ix
    let ay = iy
    if (ax && ay) {
      const inv = 1 / Math.SQRT2
      ax *= inv
      ay *= inv
    }
    this.vx += ax * ACC * dt
    this.vy += ay * ACC * dt
    if (!ix) this.vx = approach(this.vx, 0, FRICTION * dt)
    if (!iy) this.vy = approach(this.vy, 0, FRICTION * dt)
    const sp = Math.hypot(this.vx, this.vy)
    if (sp > MAX) {
      this.vx = (this.vx / sp) * MAX
      this.vy = (this.vy / sp) * MAX
    }

    // integrate with per-axis collision → slide along walls
    const nx = this.x + this.vx * dt
    if (!this.feetSolid(world, nx, this.y)) this.x = nx
    else this.vx = 0
    const ny = this.y + this.vy * dt
    if (!this.feetSolid(world, this.x, ny)) this.y = ny
    else this.vy = 0

    const speed = Math.hypot(this.vx, this.vy)
    this.moving = speed > 5
    if (this.moving) {
      if (Math.abs(this.vx) > Math.abs(this.vy)) this.facing = this.vx > 0 ? 'right' : 'left'
      else this.facing = this.vy > 0 ? 'down' : 'up'
      this.phase += speed * dt * 0.16
    } else {
      // the moment it stops, it turns to face the camera (front)
      this.facing = 'down'
      this.phase = 0
    }

    this.wade = waterAt(world, this.x, this.feetY) === Water.SHALLOW

    this.blinkT -= dt
    if (this.blinkT <= 0) {
      this.blink = 0.11
      this.blinkT = 2 + (time % 3)
    }
    if (this.blink > 0) this.blink -= dt
  }

  draw(ctx: CanvasRenderingContext2D, camX: number, camY: number, pal: Palette, time: number) {
    const vx = Math.round(this.x - camX)
    const vy = Math.round(this.y - camY)

    let sprite: Sprite = BLOB_DOWN
    let flip = false
    if (this.facing === 'up') sprite = BLOB_UP
    else if (this.facing === 'left') sprite = BLOB_SIDE // sprite is authored facing left
    else if (this.facing === 'right') {
      sprite = BLOB_SIDE
      flip = true
    }

    // bouncy hop-walk: the body pops up each step and squashes on contact
    // (squashY stays <= 1 so it only ever compresses, with no stretch gaps).
    let bob: number
    let squashY: number
    if (this.moving) {
      const hop = Math.abs(Math.sin(this.phase))
      bob = -hop * 2.6
      squashY = 0.85 + hop * 0.15 // 0.85 squashed at contact → 1.0 rounded at peak
    } else {
      const breathe = Math.abs(Math.sin(time * 1.8))
      bob = -breathe * 0.5
      squashY = 1 - breathe * 0.03
    }

    const ox = vx - (sprite.w >> 1)
    const oy = vy - (sprite.h >> 1) + Math.round(bob)

    // ground shadow, which shrinks a touch as it hops up, for weight
    const sw = 7 - Math.round(-bob * 0.5)
    ctx.globalAlpha = 0.24
    ctx.fillStyle = pal.shadow
    for (let yy = -1; yy <= 1; yy++) {
      const w = yy === 0 ? sw : sw - 2
      ctx.fillRect(vx - w, vy + 6 + yy, w * 2, 1)
    }
    ctx.globalAlpha = 1

    drawSprite(ctx, sprite, ox, oy, pal, { flipX: flip, squashY })

    // blink: briefly repaint the eye band with the cream face colour
    if (this.blink > 0 && this.facing !== 'up') {
      rect(ctx, ox + 3, oy + 9, sprite.w - 6, 2, pal.hogSkin)
    }

    // wade ripple + partial submerge
    if (this.wade) {
      rect(ctx, ox + 2, oy + 12, sprite.w - 4, 3, pal.water, 0.6)
      const rw = 6 + Math.round(Math.sin(time * 4) * 2)
      ctx.globalAlpha = 0.5
      ctx.fillStyle = pal.foam
      ctx.fillRect(vx - rw, vy + 11, rw * 2, 1)
      ctx.globalAlpha = 1
    }
  }
}
