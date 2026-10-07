import { useEffect, useRef, useState } from 'react'
import { parseStructure, type Structure } from '../content/structures'
import { useReducedMotion } from '../hooks'
import { SITE_PALETTE } from '../theme'

/**
 * A protein structure, drawn as pixel art.
 *
 * There is no 3D library here, for the same reason there is no router library:
 * the one thing this site must never do is fail to load on iGEM's host. A
 * molecular viewer from a CDN is a third-party script that can be blocked, and
 * bundling one would be a megabyte of JavaScript to draw a few hundred atoms.
 *
 * So this draws the structure itself, the same way the garden is drawn. The
 * alpha-carbon trace is interpolated into a smooth tube, each sample is splatted
 * into a small pixel buffer with a depth test, and the buffer is scaled up with
 * `image-rendering: pixelated`. The result is a real 3D render with real
 * occlusion that looks like it belongs on this site, in about 150 lines.
 *
 * Colour carries the only structural claim being made: which parts are helix,
 * which are strand. The bound ligand is drawn in a warm colour so it reads as a
 * separate thing sitting inside the protein.
 */

/** Internal buffer size. Small on purpose: this is the pixel grid you see. */
const BUF_W = 150
const BUF_H = 190
/** Backbone samples between one alpha carbon and the next. */
const SUB = 4

interface Props {
  structure: Structure
  /** Height of the drawn area in CSS pixels. Width follows the aspect ratio. */
  height?: number
}

type Rgb = [number, number, number]

function toRgb(hex: string): Rgb {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** Catmull-Rom through four control points, used to round off the backbone. */
function spline(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const t2 = t * t
  return (
    0.5 *
    (2 * p1 + (p2 - p0) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t2 * t)
  )
}

export default function StructureView({ structure, height = 320 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const [spinning, setSpinning] = useState(true)
  /**
   * The camera. All three live in refs because they are written on every
   * pointer move and read by the draw loop: putting them in state would
   * re-render React sixty times a second to change three numbers nothing else
   * reads.
   */
  const yaw = useRef(0.6)
  const pitch = useRef(0.32)
  const zoom = useRef(1)
  const dragging = useRef(false)
  /** Set by the draw effect, called by the pointer and key handlers. */
  const redraw = useRef<(() => void) | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const maybeCtx = canvas.getContext('2d')
    if (!maybeCtx) return
    // Narrowing does not survive into the draw closures below, which run later.
    const ctx = maybeCtx

    const { xyz, ss, ligand, radius, spanAcross, spanUp } = parseStructure(structure)
    const n = xyz.length / 3

    // Backbone samples, each with a colour index: 0 coil, 1 helix, 2 strand.
    const count = (n - 1) * SUB
    const px = new Float32Array(count)
    const py = new Float32Array(count)
    const pz = new Float32Array(count)
    const kind = new Uint8Array(count)
    const at = (i: number, c: number) => xyz[Math.min(n - 1, Math.max(0, i)) * 3 + c]
    let w = 0
    for (let i = 0; i < n - 1; i++) {
      const code = ss[i]
      for (let s = 0; s < SUB; s++) {
        const t = s / SUB
        px[w] = spline(at(i - 1, 0), at(i, 0), at(i + 1, 0), at(i + 2, 0), t)
        py[w] = spline(at(i - 1, 1), at(i, 1), at(i + 1, 1), at(i + 2, 1), t)
        pz[w] = spline(at(i - 1, 2), at(i, 2), at(i + 1, 2), at(i + 2, 2), t)
        kind[w] = code === 'H' ? 1 : code === 'E' ? 2 : 0
        w++
      }
    }

    const coil = toRgb(SITE_PALETTE.stoneMid)
    const helix = toRgb(SITE_PALETTE.lilacPetal)
    const strand = toRgb(SITE_PALETTE.sparkle)
    const lig = toRgb(SITE_PALETTE.daisyCore)
    // Shade toward the palette's near-black rather than its green shadow: a
    // green cast turns the lilac helices muddy where they fall away.
    const deep = toRgb(SITE_PALETTE.eye)
    const bg = toRgb(SITE_PALETTE.bushHi)
    const palette: Rgb[] = [coil, helix, strand, lig]

    const img = ctx.createImageData(BUF_W, BUF_H)
    const depth = new Float32Array(BUF_W * BUF_H)
    // Orthographic: the molecule is small enough that perspective only distorts.
    // Sized against both extents so a tall receptor fills the frame without its
    // widest turn clipping the sides.
    const scale = Math.min((BUF_W * 0.46) / spanAcross, (BUF_H * 0.47) / spanUp)

    /** Splats one sphere into the buffer, depth tested per pixel. */
    function splat(x: number, y: number, z: number, r: number, col: Rgb) {
      const x0 = Math.max(0, Math.ceil(x - r))
      const x1 = Math.min(BUF_W - 1, Math.floor(x + r))
      const y0 = Math.max(0, Math.ceil(y - r))
      const y1 = Math.min(BUF_H - 1, Math.floor(y + r))
      const rr = r * r
      for (let yy = y0; yy <= y1; yy++) {
        const dy = yy - y
        for (let xx = x0; xx <= x1; xx++) {
          const dx = xx - x
          const d2 = dx * dx + dy * dy
          if (d2 > rr) continue
          // Height of the sphere surface at this pixel, so nearer parts of a
          // sphere win the depth test against its own far side.
          const bulge = Math.sqrt(rr - d2)
          const zz = z + bulge
          const k = yy * BUF_W + xx
          if (zz <= depth[k]) continue
          depth[k] = zz
          // Two shading terms: how round the sphere is here, and how far back
          // it sits. Depth fade is what makes the far side read as behind.
          const round = 0.55 + 0.45 * (bulge / r)
          const fade = 0.45 + 0.55 * ((zz / (radius * 1.15) + 1) / 2)
          const m = Math.max(0, Math.min(1, round * fade))
          const o = k * 4
          img.data[o] = deep[0] + (col[0] - deep[0]) * m
          img.data[o + 1] = deep[1] + (col[1] - deep[1]) * m
          img.data[o + 2] = deep[2] + (col[2] - deep[2]) * m
          img.data[o + 3] = 255
        }
      }
    }

    function render() {
      const ca = Math.cos(yaw.current)
      const sa = Math.sin(yaw.current)
      const cp = Math.cos(pitch.current)
      const sp = Math.sin(pitch.current)
      const z = scale * zoom.current
      depth.fill(-Infinity)
      for (let i = 0; i < img.data.length; i += 4) {
        img.data[i] = bg[0]
        img.data[i + 1] = bg[1]
        img.data[i + 2] = bg[2]
        img.data[i + 3] = 255
      }

      // Two turns: first about the upright axis, then tip the result toward or
      // away from the viewer. Doing it in this order means dragging sideways
      // always spins the molecule about its own axis, however far it is tipped,
      // which is what a hand expects from a model on a turntable.
      const project = (x: number, y: number, zc: number) => {
        const rx = x * ca + zc * sa
        const rz = zc * ca - x * sa
        const ry = y * cp - rz * sp
        const rz2 = y * sp + rz * cp
        // Plus, not minus: the deposited coordinates run with the outside of
        // the cell at negative y, and a membrane receptor is read with its
        // extracellular end up.
        return [BUF_W / 2 + rx * z, BUF_H / 2 + ry * z, rz2] as const
      }

      for (let i = 0; i < count; i++) {
        const [sx, sy, sz] = project(px[i], py[i], pz[i])
        splat(sx, sy, sz, 2.6 * zoom.current, palette[kind[i]])
      }
      for (let i = 0; i < ligand.length; i += 3) {
        const [sx, sy, sz] = project(ligand[i], ligand[i + 1], ligand[i + 2])
        splat(sx, sy, sz, 3.4 * zoom.current, lig)
      }
      ctx.putImageData(img, 0, 0)
    }

    canvas.width = BUF_W
    canvas.height = BUF_H
    render()
    // Exposed so the pointer and key handlers outside this effect can repaint
    // after they move the camera, without rebuilding any of the geometry.
    redraw.current = render

    if (reduced || !spinning) return

    let raf = 0
    let last = performance.now()
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!dragging.current) yaw.current += dt * 0.5
      render()
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf)
      } else {
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [structure, reduced, spinning])

  /**
   * Tip is clamped short of straight up and straight down. Past vertical the
   * molecule appears to spin the wrong way when you then drag sideways, because
   * its own axis has passed the viewer's, and there is nothing to see from
   * directly overhead anyway.
   */
  const PITCH_LIMIT = 1.35
  const ZOOM_MIN = 0.6
  const ZOOM_MAX = 3

  const clampCamera = () => {
    pitch.current = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, pitch.current))
    zoom.current = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, zoom.current))
  }

  /** Repaints after a camera change. Set by the draw effect. */
  const paint = () => redraw.current?.()

  // All of these write straight to the refs and repaint the canvas, so moving
  // the camera never re-renders React.
  const startDrag = (clientX: number, clientY: number) => {
    dragging.current = true
    let prevX = clientX
    let prevY = clientY
    const move = (x: number, y: number) => {
      yaw.current += (x - prevX) * 0.012
      pitch.current += (y - prevY) * 0.012
      prevX = x
      prevY = y
      clampCamera()
      paint()
    }
    const onMouse = (e: MouseEvent) => move(e.clientX, e.clientY)
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length === 1) move(e.touches[0].clientX, e.touches[0].clientY)
    }
    const end = () => {
      dragging.current = false
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('mouseup', end)
      window.removeEventListener('touchend', end)
    }
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('touchmove', onTouch)
    window.addEventListener('mouseup', end)
    window.addEventListener('touchend', end)
  }

  /** Two fingers: pinch to zoom, without rotating. */
  const startPinch = (e: React.TouchEvent) => {
    dragging.current = true
    const span = () => {
      const [a, b] = [e.touches[0], e.touches[1]]
      return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
    }
    let prev = span()
    const base = zoom.current
    const onTouch = (ev: TouchEvent) => {
      if (ev.touches.length < 2) return
      ev.preventDefault()
      const now = Math.hypot(
        ev.touches[0].clientX - ev.touches[1].clientX,
        ev.touches[0].clientY - ev.touches[1].clientY,
      )
      if (prev > 0) {
        zoom.current = base * (now / prev)
        clampCamera()
        paint()
      }
    }
    const end = () => {
      dragging.current = false
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('touchend', end)
    }
    window.addEventListener('touchmove', onTouch, { passive: false })
    window.addEventListener('touchend', end)
  }

  const resetCamera = () => {
    yaw.current = 0.6
    pitch.current = 0.32
    zoom.current = 1
    paint()
  }

  return (
    <figure className="panel m-0 px-5 py-5 sm:px-7 sm:py-6">
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`Three dimensional structure of ${structure.name}, PDB ${structure.id}. ${structure.caption}`}
          tabIndex={0}
          onMouseDown={(e) => {
            e.preventDefault()
            startDrag(e.clientX, e.clientY)
          }}
          onTouchStart={(e) => {
            if (e.touches.length >= 2) startPinch(e)
            else startDrag(e.touches[0].clientX, e.touches[0].clientY)
          }}
          onWheel={(e) => {
            // No preventDefault: this listener is passive, and hijacking the
            // page scroll because the pointer happened to cross a figure is
            // hostile. Zoom follows the wheel, the page keeps scrolling.
            zoom.current *= e.deltaY < 0 ? 1.1 : 1 / 1.1
            clampCamera()
            paint()
          }}
          onKeyDown={(e) => {
            const k = e.key
            if (k === 'ArrowLeft') yaw.current -= 0.25
            else if (k === 'ArrowRight') yaw.current += 0.25
            else if (k === 'ArrowUp') pitch.current -= 0.2
            else if (k === 'ArrowDown') pitch.current += 0.2
            else if (k === '+' || k === '=') zoom.current *= 1.15
            else if (k === '-' || k === '_') zoom.current /= 1.15
            else if (k === '0') {
              resetCamera()
              e.preventDefault()
              return
            } else return
            clampCamera()
            paint()
            e.preventDefault()
          }}
          className="pixelated shrink-0 cursor-grab touch-none rounded-sm border-[3px] border-leaf-700 bg-leaf-50 active:cursor-grabbing"
          style={{ height, width: (height * BUF_W) / BUF_H }}
        />

        <div className="min-w-0 flex-1">
          <h3 className="text-lg">{structure.name}</h3>
          <p className="mt-1 text-body-sm leading-relaxed">{structure.caption}</p>

          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-note">
            <Key colour={SITE_PALETTE.lilacPetal} label="helix" />
            <Key colour={SITE_PALETTE.sparkle} label="strand" />
            <Key colour={SITE_PALETTE.stoneMid} label="loop" />
            <Key colour={SITE_PALETTE.daisyCore} label={structure.ligandName} />
          </ul>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button type="button" className="pixel-btn" onClick={() => setSpinning((s) => !s)}>
              {spinning ? 'Stop spinning' : 'Spin'}
            </button>
            <button type="button" className="pixel-btn" onClick={resetCamera}>
              Reset view
            </button>
          </div>
          <p className="mt-2 text-note">
            Drag to turn it in any direction, scroll or pinch to zoom. With the canvas focused: arrow
            keys turn, plus and minus zoom, and 0 resets.
          </p>

          <p className="mt-3 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">
            Published structure{' '}
            <a
              className="underline"
              href={`https://www.rcsb.org/structure/${structure.id}`}
              target="_blank"
              rel="noreferrer"
            >
              PDB {structure.id}
            </a>
            , drawn as an alpha-carbon trace. Not one of our own designs.
          </p>
        </div>
      </div>
    </figure>
  )
}

function Key({ colour, label }: { colour: string; label: string }) {
  return (
    <li className="flex items-center gap-1.5">
      <span
        aria-hidden
        className="inline-block h-3 w-3 rounded-sm border-2 border-leaf-800"
        style={{ background: colour }}
      />
      {label}
    </li>
  )
}
