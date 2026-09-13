import { Water, WORLD_W, WORLD_H } from './config'
import type { Palette } from './palette'
import { bayer, fbm, valueNoise } from './noise'
import { drawSprite } from './paint'
import { BIG_FLOWER, BLUEBELL, DAISY, LILAC, LILYPAD, LILY_FLOWER, PEBBLE, PINK_BELL, TUFT, WATER_GRASS, WHITE_FLOWER, type Sprite } from './sprites'
import type { WorldData } from './world'

function hexRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

// Bake the static world into an offscreen canvas. Re-run only on palette change.
export function bakeWorld(world: WorldData, pal: Palette): HTMLCanvasElement {
  const { waterMap, shoreField } = world
  const canvas = document.createElement('canvas')
  canvas.width = WORLD_W
  canvas.height = WORLD_H
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingEnabled = false

  // ground tones for the three large patches (dark → light)
  const g = [hexRgb(pal.grass3), hexRgb(pal.grass1), hexRgb(pal.grass2)]
  const wet = hexRgb(pal.wetRing)
  const foam = hexRgb(pal.foam)
  const shallow = hexRgb(pal.water)
  const deep = hexRgb(pal.waterDeep)
  const wlite = hexRgb(pal.waterLight)
  const mix3 = (a: [number, number, number], b: [number, number, number], t: number): [number, number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
  const deepMottle = mix3(deep, shallow, 0.38) // soft lighter patches in open deep water
  const contour = mix3(wlite, shallow, 0.5) // faint inner ripple line, gentler than foam

  const img = ctx.createImageData(WORLD_W, WORLD_H)
  const data = img.data
  for (let y = 0; y < WORLD_H; y++) {
    for (let x = 0; x < WORLD_W; x++) {
      const idx0 = y * WORLD_W + x
      const cls = waterMap[idx0] as Water
      let c: [number, number, number]
      if (cls === Water.LAND) {
        // large flat patches; ordered dither ONLY near a patch boundary
        const v = fbm(x * 0.016, y * 0.016) * 1.15 * 2 // ~0..2.3
        const gi = Math.max(0, Math.min(2, Math.floor(v + (bayer(x, y) - 0.5) * 0.9)))
        c = g[gi]
      } else if (cls === Water.WET) {
        c = wet
      } else {
        // Every wet surface (shallow, deep and the waterfall) is coloured purely
        // by depth, so the fall matches the surrounding water (no visible rectangle).
        const d = shoreField[idx0] // px into the water
        c = d > 5 ? (fbm(x * 0.045, y * 0.045) > 0.6 ? deepMottle : deep) : shallow
        // a slim, broken foam line right at the waterline (thin, not a fat halo)…
        if (d >= -0.5 && d <= 1 && valueNoise(x * 0.2, y * 0.2) > 0.46) {
          c = foam
        }
        // …and a single faint contour ripple just inside the shore
        else if (d >= 6 && d <= 7 && valueNoise(x * 0.13 + 4, y * 0.13) > 0.55) {
          c = contour
        }
      }
      const i = idx0 * 4
      data[i] = c[0]
      data[i + 1] = c[1]
      data[i + 2] = c[2]
      data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)

  // baked shadows under depth-sorted objects (flat on the ground). Things that
  // stand in water (cattails) cast none.
  const shadowFor: Record<string, number> = { tree: 9, berrybush: 7, bush: 6, fern: 5, reed: 4, heart: 4, rock: 6, ledge: 8, cattail: 0 }
  for (const o of world.objects) shadowEllipse(ctx, o.x, o.y - 1, shadowFor[o.kind] ?? 5, 2.5, pal.shadow)

  // baked flat decor (flowers / tufts / pebbles / lilypads / submerged grass)
  const spriteFor: Record<string, Sprite> = {
    lilac: LILAC,
    white: WHITE_FLOWER,
    daisy: DAISY,
    pink: PINK_BELL,
    blue: BLUEBELL,
    bigflower: BIG_FLOWER,
    tuft: TUFT,
    pebble: PEBBLE,
    lilypad: LILYPAD,
    lilyflower: LILY_FLOWER,
    watergrass: WATER_GRASS,
  }
  const noShadow = new Set(['tuft', 'pebble', 'lilypad', 'lilyflower', 'watergrass'])
  for (const d of world.decor) {
    const sp = spriteFor[d.kind]
    if (!sp) continue
    if (!noShadow.has(d.kind)) shadowEllipse(ctx, d.x, d.y + sp.h / 2 - 1, 3, 1.5, pal.shadow)
    drawSprite(ctx, sp, Math.round(d.x - sp.w / 2), Math.round(d.y - sp.h / 2), pal)
  }

  return canvas
}

function shadowEllipse(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number, color: string) {
  ctx.globalAlpha = 0.18
  ctx.fillStyle = color
  for (let y = -ry; y <= ry; y++) {
    const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry))))
    if (w > 0) ctx.fillRect((cx - w) | 0, (cy + y) | 0, w * 2, 1)
  }
  ctx.globalAlpha = 1
}
