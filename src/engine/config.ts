// World & view dimensions (all in logical low-res pixels).
export const TILE = 16
export const WORLD_TX = 48
export const WORLD_TY = 36
export const WORLD_W = WORLD_TX * TILE // 768
export const WORLD_H = WORLD_TY * TILE // 576

// The on-screen height aimed for, in logical pixels. Drives the integer pixel
// scale every canvas on the site is drawn at (see src/site/layout.ts).
export const TARGET_VIEW_H = 188

// Per-pixel water classification (precomputed into a map from a smooth field).
export enum Water {
  LAND = 0,
  WET = 1, // damp grass just outside the shoreline
  FOAM = 2, // bright shoreline rim
  SHALLOW = 3, // wadeable water
  DEEP = 4, // blocks
  FALL = 5, // waterfall column (blocks; animated on top)
}
