import { Water, WORLD_W, WORLD_H } from './config'

export type DecorKind = 'lilac' | 'white' | 'daisy' | 'pink' | 'blue' | 'bigflower' | 'tuft' | 'pebble' | 'lilypad' | 'lilyflower' | 'watergrass'
export type ObjKind = 'tree' | 'berrybush' | 'bush' | 'reed' | 'heart' | 'fern' | 'rock' | 'cattail' | 'ledge'

export interface Decor {
  kind: DecorKind
  x: number
  y: number
}
export interface Obj {
  kind: ObjKind
  x: number // centre x (world px)
  y: number // base (feet) y in world px; the depth-sort key
}

/**
 * The ground a hedgehog walks on. The site only ever builds the flat, empty
 * world in src/site/flatWorld.ts; the generator that filled one with ponds and
 * a waterfall went with the original canvas game.
 */
export interface WorldData {
  waterMap: Uint8Array // WORLD_W*WORLD_H, values from Water enum
  shoreField: Int8Array // WORLD_W*WORLD_H, signed px depth into water (clamped) for shoreline detailing
  decor: Decor[]
  objects: Obj[]
  waterfall: { x: number; y: number; w: number; h: number }
  splash: { x: number; y: number }
  ripplePts: { x: number; y: number }[] // gentle surface-ripple sources
  spawn: { x: number; y: number }
}

export function waterAt(world: WorldData, x: number, y: number): Water {
  const xi = x | 0
  const yi = y | 0
  if (xi < 0 || yi < 0 || xi >= WORLD_W || yi >= WORLD_H) return Water.LAND
  return world.waterMap[yi * WORLD_W + xi] as Water
}

export function isSolidWater(w: Water) {
  return w === Water.DEEP || w === Water.FALL
}
