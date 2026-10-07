import { useEffect, useRef } from 'react'
import { BALANCE_LOGO as L, LOGO_LAYERS, decodeLayer } from '../content/balanceLogo'
import { useReducedMotion } from '../hooks'

/**
 * Two hedgehogs on a balance, rocking slowly.
 *
 * The team's own drawing, animated. The beam swings through a shallow arc, each
 * pan assembly rides its end of the beam, the leash between the two hedgehogs
 * is re-curved every frame, and they blink on separate timers.
 *
 * It is the project in one image: a balance is a thing you set, not a thing you
 * switch, which is the whole claim the wiki is making. The motion is kept small
 * on purpose. A logo that waves at the reader competes with the page.
 *
 * Everything moves in whole pixels and the beam angle is quantised to half a
 * degree, because this is pixel art: smooth sub-pixel rotation would blur the
 * one quality the drawing has. Honouring `prefers-reduced-motion` holds it at
 * the original pose.
 */

const SWING_SECONDS = 6.5
/** The shallow end of the swing, in degrees. The drawing's own tilt is the other end. */
const MIN_ANGLE_DEG = 2
const BEZIER_SAMPLES = 400

type Rgb = [number, number, number]

function toRgb(hex: string): Rgb {
  const n = parseInt(hex, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

interface Props {
  /** Rendered width in CSS pixels. Height follows the artwork's aspect ratio. */
  width?: number
  /** Use the palette mixed for a green page rather than for a cream panel. */
  onGreen?: boolean
  /** Describes the drawing. Leave empty where it is pure decoration. */
  alt?: string
  className?: string
}

export default function BalanceLogo({ width = 260, onGreen = false, alt = '', className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const got = canvas.getContext('2d')
    if (!got) return
    const ctx = got

    const W = L.w
    const H = L.h
    canvas.width = W
    canvas.height = H

    const palette = (onGreen ? L.paletteOnGreen : L.palette).map(toRgb)
    const layers = {
      pole: decodeLayer(LOGO_LAYERS.pole),
      grass: decodeLayer(LOGO_LAYERS.grass),
      ballLeft: decodeLayer(LOGO_LAYERS.ballLeft),
      ballRight: decodeLayer(LOGO_LAYERS.ballRight),
      left: decodeLayer(LOGO_LAYERS.left),
      right: decodeLayer(LOGO_LAYERS.right),
    }

    const img = ctx.createImageData(W, H)
    /** Palette index per pixel, 0 meaning transparent. */
    const buf = new Uint8Array(W * H)

    const put = (x: number, y: number, c: number) => {
      x = Math.round(x)
      y = Math.round(y)
      if (x >= 0 && y >= 0 && x < W && y < H) buf[y * W + x] = c
    }
    const stamp = (cells: Int16Array, dx: number, dy: number) => {
      for (let i = 0; i < cells.length; i += 3) put(cells[i] + dx, cells[i + 1] + dy, cells[i + 2])
    }

    const [px, py] = L.pivot
    const half = L.halfLength

    /**
     * The beam, drawn a column at a time rather than as a rotated rectangle.
     * One fixed stack of four pixels per column keeps the top edge, the
     * underline and the shadow present at every angle; rasterising it as a
     * rotated shape makes those one-pixel details flicker in and out as the
     * beam passes level.
     */
    function drawBeam(angle: number) {
      const tan = Math.tan(angle)
      const lx = px - Math.cos(angle) * half
      const ly = py - Math.sin(angle) * half
      const rx = px + Math.cos(angle) * half
      const ry = py + Math.sin(angle) * half
      const top = (x: number) => Math.floor(py + (x + 0.5 - px) * tan + L.beamOffset)
      for (let x = Math.floor(lx); x <= Math.floor(rx); x++) {
        const r = top(x)
        // Lighten the top pixel where the stack steps down, so the edge reads
        // as a continuous line rather than a staircase of flat blocks.
        const corner = tan > 0 ? top(x + 1) > r : top(x - 1) > r
        put(x, r, corner ? L.beam.edge : L.beam.main)
        put(x, r + 1, L.beam.main)
        put(x, r + 2, L.beam.under)
        put(x, r + 3, L.beam.shadow)
      }
      return { lx, ly, rx, ry }
    }

    const bezX = new Float64Array(BEZIER_SAMPLES)
    const bezY = new Float64Array(BEZIER_SAMPLES)
    const startA = L.leash.A
    const endD = L.leash.D
    const restSpan = Math.hypot(endD[0] - startA[0], endD[1] - startA[1])

    /**
     * The leash. Two pixels thick, one span per column, and each column is
     * stretched to meet its neighbour so a steep section never breaks into
     * separate dashes.
     */
    function drawLeash(kl: readonly [number, number], kr: readonly [number, number], t: number) {
      const ax = startA[0] + kl[0]
      const ay = startA[1] + kl[1]
      const ex = endD[0] + kr[0]
      const ey = endD[1] + kr[1]
      // Slack: the closer the two ends come, the more the rope bellies down.
      const sag = Math.max(0, restSpan - Math.hypot(ex - ax, ey - ay)) * 0.9 + Math.sin(t * 1.3) * 0.35
      const c1x = L.leash.C1[0] + kl[0] * 0.75 + kr[0] * 0.25
      const c1y = L.leash.C1[1] + kl[1] * 0.75 + kr[1] * 0.25 + sag
      const c2x = L.leash.C2[0] + kr[0] * 0.75 + kl[0] * 0.25
      const c2y = L.leash.C2[1] + kr[1] * 0.75 + kl[1] * 0.25 + sag
      for (let i = 0; i < BEZIER_SAMPLES; i++) {
        const s = i / (BEZIER_SAMPLES - 1)
        const u = 1 - s
        bezX[i] = u * u * u * ax + 3 * u * u * s * c1x + 3 * u * s * s * c2x + s * s * s * ex
        bezY[i] = u * u * u * ay + 3 * u * u * s * c1y + 3 * u * s * s * c2y + s * s * s * ey
      }
      const first = Math.ceil(ax - 1e-9)
      const last = Math.floor(ex + 1e-9)
      const spans: [number, number][] = []
      for (let c = first, j = 1; c <= last; c++) {
        while (j < BEZIER_SAMPLES - 1 && bezX[j] < c) j++
        const f = bezX[j] !== bezX[j - 1] ? (c - bezX[j - 1]) / (bezX[j] - bezX[j - 1]) : 0
        const lo = Math.ceil(bezY[j - 1] + f * (bezY[j] - bezY[j - 1]) - 1)
        spans.push([lo, lo + 1])
      }
      for (let i = 0; i + 1 < spans.length; i++) {
        const a = spans[i]
        const b = spans[i + 1]
        if (a[1] < b[0]) b[0] = a[1]
        else if (b[1] < a[0]) a[0] = b[1]
      }
      spans.forEach(([lo, hi], i) => {
        for (let r = lo; r <= hi; r++) put(first + i, r, L.leash.col)
      })
    }

    let lastKey = ''

    function render(t: number) {
      const rest = L.restAngle
      const minRad = (MIN_ANGLE_DEG * Math.PI) / 180
      let angle = reduced ? rest : minRad + (rest - minRad) * Math.cos((t * 2 * Math.PI) / SWING_SECONDS)
      // Half a degree at a time: pixel art, not a smooth rotation.
      angle = (Math.round((angle * 360) / Math.PI) / 2) * (Math.PI / 180)

      const blinkLeft = !reduced && (t + 2) % 4.1 < 0.14
      const blinkRight = !reduced && (t + 1.7) % 4.6 < 0.14
      const key = `${angle.toFixed(4)}${blinkLeft}${blinkRight}${Math.round(t * 4)}`
      if (key === lastKey) return
      lastKey = key

      buf.fill(0)
      stamp(layers.pole, 0, 0)
      const { lx, ly, rx, ry } = drawBeam(angle)
      // Whole-pixel offsets only. A half-pixel shift would resample the
      // hedgehogs and turn crisp pixels into mush.
      const kl = [Math.round(lx - L.leftAnchor[0]), Math.round(ly - L.leftAnchor[1])] as const
      const kr = [Math.round(rx - L.rightAnchor[0]), Math.round(ry - L.rightAnchor[1])] as const
      stamp(layers.ballLeft, kl[0], kl[1])
      stamp(layers.ballRight, kr[0], kr[1])
      stamp(layers.left, kl[0], kl[1])
      stamp(layers.right, kr[0], kr[1])
      if (blinkLeft) for (const [x, y] of L.eyesLeft) put(x + kl[0], y + kl[1], L.faceColour)
      if (blinkRight) for (const [x, y] of L.eyesRight) put(x + kr[0], y + kr[1], L.faceColour)
      drawLeash(kl, kr, t)
      stamp(layers.grass, 0, 0)

      // Unpainted pixels stay transparent, so the logo sits on whatever is
      // behind it rather than carrying its own background panel.
      const d = img.data
      for (let i = 0; i < W * H; i++) {
        const idx = buf[i]
        const o = i * 4
        if (!idx) {
          d[o + 3] = 0
          continue
        }
        const c = palette[idx - 1]
        d[o] = c[0]
        d[o + 1] = c[1]
        d[o + 2] = c[2]
        d[o + 3] = 255
      }
      ctx.putImageData(img, 0, 0)
    }

    render(0)
    if (reduced) return

    let raf = 0
    let running = false
    let clock = 0
    let prev = 0
    const frame = (now: number) => {
      if (prev) clock += Math.min(0.05, (now - prev) / 1000)
      prev = now
      render(clock)
      raf = requestAnimationFrame(frame)
    }
    const start = () => {
      if (running) return
      running = true
      prev = 0
      raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    // Run only while the canvas is on screen AND the tab is in front.
    //
    // Being on screen and the tab being visible both feed one `sync`, the only
    // thing allowed to start or stop the loop. With a separate handler for
    // each, switching tabs and back would leave the animation stopped: the
    // observer has nothing new to report, so nothing would restart it.
    let onScreen = false
    const sync = () => (onScreen && !document.hidden ? start() : stop())

    if (!('IntersectionObserver' in window)) {
      onScreen = true
      sync()
      document.addEventListener('visibilitychange', sync)
      return () => {
        stop()
        document.removeEventListener('visibilitychange', sync)
      }
    }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) onScreen = e.isIntersecting
      sync()
    })
    io.observe(canvas)
    document.addEventListener('visibilitychange', sync)
    return () => {
      stop()
      io.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [onGreen, reduced])

  return (
    <canvas
      ref={canvasRef}
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={'pixelated block ' + (className ?? '')}
      style={{ width, height: (width * L.h) / L.w }}
    />
  )
}
