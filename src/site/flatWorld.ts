import { WORLD_H, WORLD_W, Water } from '../engine/config'
import type { WorldData } from '../engine/world'

/**
 * A world of nothing but land, so a hedgehog walking it never collides with anything.
 *
 * `Player.update` only ever reads `waterMap`, so the rest of a real `WorldData`
 * (ponds, the waterfall, decor, the spawn point) is not needed and would cost a
 * full world bake to produce. Everything else is filled in with the empty value
 * of its type rather than cast away, so adding a field to `WorldData` shows up
 * here as a type error instead of as undefined at runtime.
 */
let flatWorld: WorldData | null = null
export function getFlatWorld(): WorldData {
  if (!flatWorld) {
    flatWorld = {
      waterMap: new Uint8Array(WORLD_W * WORLD_H).fill(Water.LAND),
      shoreField: new Int8Array(WORLD_W * WORLD_H),
      decor: [],
      objects: [],
      waterfall: { x: 0, y: 0, w: 0, h: 0 },
      splash: { x: 0, y: 0 },
      ripplePts: [],
      spawn: { x: WORLD_W / 2, y: WORLD_H / 2 },
    }
  }
  return flatWorld
}
