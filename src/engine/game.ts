import { Water, WORLD_W, WORLD_H } from './config'
import { buildPalette, type Mode, type Palette } from './palette'
import { Renderer } from './renderer'
import { buildWorld, waterAt, type WorldData } from './world'
import { bakeWorld } from './terrain'
import { Player, type Input } from './player'
import { diamond, drawSprite } from './paint'
import { hash2 } from './noise'
import { BERRY_BUSH, BUSH, CATTAIL, FERN, HEART_PLANT, REED, ROCK, STONE_LEDGE, TREE, type Sprite } from './sprites'

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

const OBJ_SPRITE: Record<string, Sprite> = {
  tree: TREE,
  berrybush: BERRY_BUSH,
  bush: BUSH,
  reed: REED,
  heart: HEART_PLANT,
  fern: FERN,
  rock: ROCK,
  cattail: CATTAIL,
  ledge: STONE_LEDGE,
}
const OBJ_SWAY: Record<string, number> = { tree: 0.05, berrybush: 0.06, bush: 0.06, reed: 0.14, heart: 0.1, fern: 0.1, rock: 0, cattail: 0.13, ledge: 0 }

interface Sparkle {
  x: number
  y: number
  phase: number
  freq: number
  r: number
}
const MAX_SPARKLES = 200

export class Game {
  private world: WorldData
  private renderer: Renderer
  private worldBuf: HTMLCanvasElement
  private pal: Palette
  private mode: Mode
  private player: Player
  private camX = 0
  private camY = 0
  private time = 0
  private sparkles: Sparkle[] = []
  private density = 45

  constructor(renderer: Renderer, mode: Mode) {
    this.renderer = renderer
    this.mode = mode
    this.world = buildWorld()
    this.pal = buildPalette(mode)
    this.worldBuf = bakeWorld(this.world, this.pal)
    this.player = new Player(this.world.spawn)
    this.camX = clamp(this.player.x - renderer.w / 2, 0, WORLD_W - renderer.w)
    this.camY = clamp(this.player.y - renderer.h / 2, 0, WORLD_H - renderer.h)
    this.initSparkles()
  }

  private initSparkles() {
    for (let i = 0; i < MAX_SPARKLES; i++) {
      let x = Math.random() * WORLD_W
      let y = Math.random() * WORLD_H
      for (let tries = 0; tries < 24; tries++) {
        x = Math.random() * WORLD_W
        y = Math.random() * WORLD_H
        if (waterAt(this.world, x, y) !== Water.LAND) break // bias onto water
      }
      this.sparkles.push({ x, y, phase: Math.random() * 6.28, freq: 0.4 + Math.random() * 1.0, r: Math.random() > 0.7 ? 2 : 1 })
    }
  }

  setMode(m: Mode) {
    if (m === this.mode) return
    this.mode = m
    this.pal = buildPalette(m)
    this.worldBuf = bakeWorld(this.world, this.pal)
  }
  setDensity(d: number) {
    this.density = clamp(Math.round(d), 0, MAX_SPARKLES)
  }

  update(dt: number, input: Input) {
    this.time += dt
    const vw = this.renderer.w
    const vh = this.renderer.h
    this.player.update(dt, input, this.world, this.time)
    const k = Math.min(1, dt * 6)
    this.camX = clamp(this.camX + (this.player.x - vw / 2 - this.camX) * k, 0, Math.max(0, WORLD_W - vw))
    this.camY = clamp(this.camY + (this.player.y - vh / 2 - this.camY) * k, 0, Math.max(0, WORLD_H - vh))
  }

  draw(display: HTMLCanvasElement) {
    const r = this.renderer
    const ctx = r.ctx
    const pal = this.pal
    const vw = r.w
    const vh = r.h
    const camX = Math.round(this.camX)
    const camY = Math.round(this.camY)

    r.blitWorld(this.worldBuf, camX, camY)
    this.drawWaterfall(ctx, camX, camY, vw, vh, pal)
    this.drawRipples(ctx, camX, camY, vw, vh, pal)
    this.drawEntities(ctx, camX, camY, vw, vh, pal)
    this.drawSparkles(ctx, camX, camY, vw, vh, pal)
    r.present(display)
  }

  private drawWaterfall(ctx: CanvasRenderingContext2D, camX: number, camY: number, vw: number, vh: number, pal: Palette) {
    const wf = this.world.waterfall
    const t = this.time
    const cxw = wf.x + wf.w / 2 // fall centre (world x)
    const half = wf.w / 2
    const lipY = wf.y
    const streakEnd = wf.y + wf.h - 4 // run the streaks nearly to the pool (the splash draws on top)
    const tick = (t * 7) | 0
    const dot = (x: number, y: number, c: string, a = 1) => {
      const vx = x - camX
      const vy = y - camY
      if (vx < 0 || vx >= vw || vy < 0 || vy >= vh) return
      if (a < 1) ctx.globalAlpha = a
      ctx.fillStyle = c
      ctx.fillRect(vx, vy, 1, 1)
      if (a < 1) ctx.globalAlpha = 1
    }
    // a short horizontal surface-ripple mark with a tiny trailing dip: the little
    // ~ / ⌄ glyphs from the reference that show the water's surface moving
    const ripple = (x: number, y: number, a: number) => {
      dot(x, y, pal.fallLight, a)
      dot(x + 1, y, pal.fallLight, a)
      dot(x + 2, y, pal.fallLight, a)
      dot(x + 3, y + 1, pal.waterLight, a * 0.8)
    }

    // (1) INFLOW: small ROUNDED ripples on the upper pond drift DOWN toward the lip
    //     and funnel toward the fall mouth, brightening as they near the edge → the
    //     pond water visibly gathering and flowing INTO the fall.
    const roundRipple = (rcx: number, rcy: number, w: number, a: number) => {
      // a shallow rounded ripple: a flat top row with the two ends stepping down a
      // single pixel. A soft curved crest, not a diagonal peak (no triangles)
      for (let dx = -w; dx <= w; dx++) {
        const shoulder = Math.abs(dx) > w - 2 // only the outermost pixel on each side lifts
        dot(rcx + dx, rcy - (shoulder ? 1 : 0), shoulder ? pal.waterLight : pal.fallLight, a)
      }
    }
    for (let i = 0; i < 16; i++) {
      const span = 58
      const prog = ((t * 9 + i * 5.7) % span) / span // 0 far above → 1 at the lip
      const yy = Math.round(lipY - span * (1 - prog))
      const spread = (1 - prog) * (wf.w + 30) + 5 // wide upstream, narrowing to the mouth
      const xx = Math.round(cxw + (hash2(i, 3) - 0.5) * spread)
      const a = 0.5 * Math.min(1, prog * 1.35) // brightens as it nears the lip
      roundRipple(xx, yy, 3 + (hash2(i, 4) > 0.55 ? 1 : 0), a) // 7–9px wide rounded crest
    }

    // (2) foam lip across the mouth, feathered at the ends (denser in the middle)
    for (let wx = wf.x - 2; wx <= wf.x + wf.w + 1; wx++) {
      const hr = Math.abs(wx + 0.5 - cxw) / (half + 2)
      for (let dy = -1; dy < 3; dy++) {
        if (hash2(wx * 2, tick + dy) > 0.4 + hr * 0.45) dot(wx, lipY + dy, pal.foam)
      }
    }

    // (3) falling water: thin vertical trails of VARIED length, each with a brighter
    //     head and a soft tail, scrolling down at a gentle NATURAL speed; densest in
    //     the centre, feathering to the sides, fading above the splash (no rectangle).
    // jagged down-arrows (∨ chevrons) scrolling slowly DOWN, kept to the DEEP main
    // water only, clamped by shore-depth so they never touch the pale shoreline band.
    const fallStart = lipY + 4 // begin just under the lip so the whole fall is covered
    const fallSpan = streakEnd - fallStart
    const wput = (x: number, y: number, c: string) => {
      const xi = x | 0
      const yi = y | 0
      if (xi < 0 || yi < 0 || xi >= WORLD_W || yi >= WORLD_H) return
      if (this.world.shoreField[yi * WORLD_W + xi] > 6) dot(xi, yi, c) // deep water only, off the light border
    }
    for (let ax = Math.round(cxw - half + 1); ax <= Math.round(cxw + half - 1); ax += 3) {
      const lane = hash2(ax, 7)
      const speed = 9 + lane * 11 // slower, varied downward speed per lane
      const period = 7 + ((hash2(ax, 9) * 5) | 0) // vertical spacing between arrows
      const count = Math.ceil(fallSpan / period) + 1
      for (let k = 0; k < count; k++) {
        const ay = fallStart + Math.round((((k * period + t * speed + lane * period) % fallSpan) + fallSpan) % fallSpan)
        if (ay >= streakEnd - 1) continue
        wput(ax, ay + 1, pal.foam) // arrow point (leading edge, flowing down)
        wput(ax - 1, ay, pal.fallLight) // ∨ left barb
        wput(ax + 1, ay, pal.fallLight) // ∨ right barb
      }
    }

    // (4) splash pool, drawn last so it is never covered: a churny foam band plus
    //     ripple rings spreading outward/down across the lower-pond surface.
    const sx = this.world.splash.x
    const sy = this.world.splash.y
    // a churny foam mound right where the water lands
    for (let wx = wf.x + 3; wx < wf.x + wf.w - 3; wx++) {
      for (let dy = -1; dy < 2; dy++) {
        if (hash2(wx, tick * 2 + dy) > 0.44) dot(wx, sy + dy, pal.foam)
      }
    }
    // spray flecks scattered around the impact, biased downstream into the pond
    for (let i = 0; i < 26; i++) {
      if (hash2(i * 3, tick) > 0.32) {
        const px = Math.round(sx + (hash2(i, 1) - 0.5) * (wf.w + 4))
        const py = Math.round(sy + 1 + hash2(i, 2) * 8)
        dot(px, py, hash2(i, 5) > 0.5 ? pal.foam : pal.fallLight)
      }
    }
    // surface ripples spreading outward / downstream from the splash on the pool
    for (let i = 0; i < 10; i++) {
      const span = 30
      const prog = ((t * 10 + i * 7.1) % span) / span
      const side = i % 2 === 0 ? -1 : 1
      const xx = Math.round(sx + side * (6 + prog * (wf.w * 0.6)))
      const yy = Math.round(sy + 4 + prog * 12)
      const a = 0.4 * (1 - prog)
      if (a > 0.03) ripple(xx, yy, a)
    }
    // a couple of gentle expanding rings underneath it all
    for (let i = 0; i < 2; i++) {
      const rr = ((t * 6 + i * 11) % 22) + 4
      this.ellipseOutline(ctx, sx - camX, sy + 4 - camY, rr, rr * 0.4, vw, vh, pal.waterLight, 0.4 * (1 - rr / 26))
    }
  }

  private ellipseOutline(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number, vw: number, vh: number, color: string, alpha: number) {
    if (alpha <= 0) return
    ctx.globalAlpha = alpha
    ctx.fillStyle = color
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * Math.PI * 2
      const x = Math.round(cx + Math.cos(a) * rx)
      const y = Math.round(cy + Math.sin(a) * ry)
      if (x >= 0 && x < vw && y >= 0 && y < vh) ctx.fillRect(x, y, 1, 1)
    }
    ctx.globalAlpha = 1
  }

  // gentle expanding ripple rings on the open water (calm, sparse)
  private drawRipples(ctx: CanvasRenderingContext2D, camX: number, camY: number, vw: number, vh: number, pal: Palette) {
    const t = this.time
    const period = 5.5
    const pts = this.world.ripplePts
    for (let k = 0; k < pts.length; k++) {
      const p = pts[k]
      const phase = (t + k * 1.9) % period
      const rr = 2 + phase * 4.6
      const a = 0.3 * (1 - phase / period)
      this.ellipseOutline(ctx, p.x - camX, p.y - camY, rr, rr * 0.5, vw, vh, pal.waterLight, a)
    }
  }

  private drawEntities(ctx: CanvasRenderingContext2D, camX: number, camY: number, vw: number, vh: number, pal: Palette) {
    type Ent = { feetY: number; draw: () => void }
    const ents: Ent[] = []
    for (const o of this.world.objects) {
      const sp = OBJ_SPRITE[o.kind]
      if (!sp) continue
      if (o.x < camX - 30 || o.x > camX + vw + 30 || o.y < camY - 40 || o.y > camY + vh + 30) continue
      const amp = OBJ_SWAY[o.kind] ?? 0
      const skew = amp ? Math.sin(this.time * 0.8 + o.x * 0.1) * amp : 0
      const ox = Math.round(o.x - sp.w / 2 - camX)
      const oy = Math.round(o.y - sp.h - camY)
      ents.push({ feetY: o.y, draw: () => drawSprite(ctx, sp, ox, oy, pal, { skew }) })
    }
    ents.push({ feetY: this.player.feetY, draw: () => this.player.draw(ctx, camX, camY, pal, this.time) })
    ents.sort((a, b) => a.feetY - b.feetY)
    for (const e of ents) e.draw()
  }

  private drawSparkles(ctx: CanvasRenderingContext2D, camX: number, camY: number, vw: number, vh: number, pal: Palette) {
    const t = this.time
    for (let i = 0; i < this.density; i++) {
      const s = this.sparkles[i]
      const vx = Math.round(s.x - camX)
      const vy = Math.round(s.y - camY)
      if (vx < 0 || vx >= vw || vy < 0 || vy >= vh) continue
      const tw = Math.sin(t * s.freq + s.phase)
      if (tw < 0.5) continue // mostly invisible → sparse & calm
      diamond(ctx, vx, vy, s.r, pal.sparkle, pal.sparkleHi, ((tw - 0.5) / 0.5) * 0.85)
    }
  }
}
