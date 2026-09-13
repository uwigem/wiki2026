// World & view dimensions (all in logical low-res pixels).
export const TILE = 16
export const WORLD_TX = 48
export const WORLD_TY = 36
export const WORLD_W = WORLD_TX * TILE // 768
export const WORLD_H = WORLD_TY * TILE // 576

// Logical viewport is dynamic (computed from window size ÷ pixel scale) so the
// world always fills the screen at whatever aspect ratio. These are only the
// initial defaults + the target on-screen height of one logical pixel-view.
export const DEFAULT_VIEW_W = 256
export const DEFAULT_VIEW_H = 192
export const TARGET_VIEW_H = 188 // aim for ~this many logical rows; drives pixel scale

// Per-pixel water classification (precomputed into a map from a smooth field).
export enum Water {
  LAND = 0,
  WET = 1, // damp grass just outside the shoreline
  FOAM = 2, // bright shoreline rim
  SHALLOW = 3, // wadeable water
  DEEP = 4, // blocks
  FALL = 5, // waterfall column (blocks; animated on top)
}
