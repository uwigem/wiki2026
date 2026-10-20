import { SITE_PALETTE } from '../theme'

/**
 * Shared pieces for the data charts (line, scatter and interval bars): axis
 * ticks, number formatting and the series colours.
 *
 * Every colour is a palette name, never a hex value, so a chart re-themes with
 * the rest of the site. Content files name a colour by its palette key, which
 * keeps them free of colour literals too.
 */

export type PaletteKey = keyof typeof SITE_PALETTE

/** A palette colour by name, falling back to the axis ink if the name is wrong. */
export function ink(key: PaletteKey | undefined, fallback: PaletteKey = 'shadow'): string {
  const v = key ? SITE_PALETTE[key] : undefined
  return typeof v === 'string' ? v : (SITE_PALETTE[fallback] as string)
}

/**
 * Series colours in the order they are handed out. The site's palette is
 * pastel, so these are its deepest shades: every one keeps a 3 to 1 contrast
 * against the panel, which is the minimum for a line a reader has to follow.
 */
export const SERIES: PaletteKey[] = ['pinkDark', 'stem', 'eye', 'quillDark', 'waterDeep', 'spikeMid', 'blobDark', 'stoneDark']

/**
 * A step of 1, 2 or 5 times a power of ten, the steps a person would pick.
 *
 * The nearest of those is taken rather than the next one up. Rounding up turns
 * a series that ends at 120 hours into an axis that runs to 150, leaving a
 * quarter of the plot empty; the nearest step ends it at 120.
 */
function niceStep(span: number, count: number): number {
  const raw = span / Math.max(1, count)
  const mag = 10 ** Math.floor(Math.log10(raw))
  const f = raw / mag
  const choices = [1, 2, 5, 10]
  const best = choices.reduce((a, b) => (Math.abs(Math.log(f / b)) < Math.abs(Math.log(f / a)) ? b : a))
  return best * mag
}

export interface Axis {
  min: number
  max: number
  ticks: number[]
  log: boolean
}

/**
 * An axis that covers the data with readable ticks. On a log axis the ticks are
 * whole decades, and a range that does not reach a decade is widened to one so
 * the axis always has at least two labelled ticks.
 */
export function makeAxis(lo: number, hi: number, opts: { log?: boolean; count?: number; min?: number; max?: number } = {}): Axis {
  if (opts.log) {
    const a = Math.floor(Math.log10(opts.min ?? lo))
    let b = Math.ceil(Math.log10(opts.max ?? hi))
    if (b === a) b = a + 1
    const ticks: number[] = []
    for (let e = a; e <= b; e++) ticks.push(10 ** e)
    return { min: 10 ** a, max: 10 ** b, ticks, log: true }
  }
  let min = opts.min ?? lo
  let max = opts.max ?? hi
  if (min === max) {
    min -= 1
    max += 1
  }
  const step = niceStep(max - min, opts.count ?? 5)
  if (opts.min === undefined) min = Math.floor(min / step) * step
  if (opts.max === undefined) max = Math.ceil(max / step) * step
  const ticks: number[] = []
  for (let v = min; v <= max + step * 1e-6; v += step) ticks.push(Number(v.toPrecision(12)))
  return { min, max, ticks, log: false }
}

/** Where a value falls along an axis, from 0 at its start to 1 at its end. */
export function frac(axis: Axis, v: number): number {
  if (axis.log) return (Math.log10(v) - Math.log10(axis.min)) / (Math.log10(axis.max) - Math.log10(axis.min))
  return (v - axis.min) / (axis.max - axis.min)
}

/**
 * A number as a tick or a value label: no trailing zeros, thousands grouped,
 * and small or large magnitudes kept short.
 */
export function fmt(v: number, digits = 3): string {
  if (v === 0) return '0'
  const a = Math.abs(v)
  if (a >= 10000) return v.toLocaleString('en-GB', { maximumFractionDigits: 0 })
  if (a >= 1000) return v.toLocaleString('en-GB', { maximumFractionDigits: 0 })
  if (a < 0.001) return v.toExponential(1).replace('e', ' × 10^')
  return Number(v.toPrecision(digits)).toString()
}

/** Least squares fit of y on x, or through the origin, with its R squared. */
export function fitLine(points: { x: number; y: number }[], throughOrigin: boolean) {
  const n = points.length
  const mx = points.reduce((s, p) => s + p.x, 0) / n
  const my = points.reduce((s, p) => s + p.y, 0) / n
  let slope: number
  let intercept: number
  if (throughOrigin) {
    const sxy = points.reduce((s, p) => s + p.x * p.y, 0)
    const sxx = points.reduce((s, p) => s + p.x * p.x, 0)
    slope = sxx === 0 ? 0 : sxy / sxx
    intercept = 0
  } else {
    const sxy = points.reduce((s, p) => s + (p.x - mx) * (p.y - my), 0)
    const sxx = points.reduce((s, p) => s + (p.x - mx) ** 2, 0)
    slope = sxx === 0 ? 0 : sxy / sxx
    intercept = my - slope * mx
  }
  const ssRes = points.reduce((s, p) => s + (p.y - (slope * p.x + intercept)) ** 2, 0)
  const ssTot = points.reduce((s, p) => s + (p.y - my) ** 2, 0)
  return { slope, intercept, r2: ssTot === 0 ? 1 : 1 - ssRes / ssTot }
}

/** Text drawn inside a chart's SVG: one size and weight for every chart. */
export const CHART_TEXT = { fontSize: 10, fill: 'currentColor' } as const
