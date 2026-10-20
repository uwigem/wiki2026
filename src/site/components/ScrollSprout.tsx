import { useEffect, useRef } from 'react'
import { Player, type Input } from '../../engine/player'
import { getFlatWorld } from '../flatWorld'
import { useReducedMotion } from '../hooks'
import { SITE_PALETTE } from '../theme'

/** The frame Sprout is drawn into, in sprite pixels, with headroom for his hop. */
const VW = 24
const VH = 24
/** Where he stands in that frame: his middle, with room above for the hop. */
const MID_X = 12
const MID_Y = 12
/** The row of the frame the line runs through: across his body, as it leaves him. */
const LINE_ROW = 13
/** Sprite pixels to screen pixels. */
const SCALE = 2
/** How quickly he catches up with the scroll, per second. */
const CATCH_UP = 6
/**
 * His hops at this fraction of their usual pace. He is beside the content
 * here, not the subject of it, so he walks calmly and not for long.
 */
const HOP_PACE = 0.5

/**
 * The homepage's progress line, for the header to carry along its bottom edge.
 *
 * The header's green line is drawn only as far as the reader has scrolled
 * through the homepage, and Sprout, the hedgehog who walks the margins of
 * every other page, walks along its end: right going down, facing the reader
 * as the margin Sprout does on the way down a page, and back left going up,
 * side-on. Ahead of him the line is the header's pale edge, so the bar keeps
 * its shape at the top of the page.
 *
 * The walk is the engine's own, as in `HedgehogGuide`: a headless `Player`
 * on a world of nothing but land. Here it is kept quiet, because it sits in
 * the corner of the eye the whole time someone reads: a short, slow walk
 * when the page moves, and then he stands still the way he walked, with no
 * turn, no breathing and no blink. Between walks nothing is animated at all.
 */
export default function ScrollSprout() {
  const trailRef = useRef<HTMLDivElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    const out = canvas?.getContext('2d')
    if (!host || !canvas || !out) return
    canvas.width = VW * SCALE
    canvas.height = VH * SCALE
    out.imageSmoothingEnabled = false
    const buf = document.createElement('canvas')
    buf.width = VW
    buf.height = VH
    const bctx = buf.getContext('2d')!
    bctx.imageSmoothingEnabled = false

    const player = new Player({ x: 400, y: 300 })
    const world = getFlatWorld()
    const input: Input = { up: false, down: false, left: false, right: false }

    /** Where he should be: as far along the bar as the reader is down the page. */
    const goal = () => {
      const room = (host.parentElement?.clientWidth ?? 0) - VW * SCALE
      const max = document.documentElement.scrollHeight - window.innerHeight
      const through = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      return through * Math.max(0, room)
    }
    let x = goal()
    /** The way he last faced: the reader going down, left going up. He stands that way too. */
    let heading: 'down' | 'left' = 'down'

    const draw = (time: number) => {
      bctx.clearRect(0, 0, VW, VH)
      player.draw(bctx, player.x - MID_X, player.y - MID_Y, SITE_PALETTE, time)
      out.clearRect(0, 0, canvas.width, canvas.height)
      out.drawImage(buf, 0, 0, VW, VH, 0, 0, canvas.width, canvas.height)
    }
    const place = () => {
      host.style.transform = `translate3d(${Math.round(x)}px, 0, 0)`
      if (trailRef.current) trailRef.current.style.width = `${Math.round(x + MID_X * SCALE)}px`
    }

    /**
     * Standing still, the way he last faced. The engine turns him to face the
     * camera when he stops, so his heading is put back after it settles him,
     * and he is drawn at time 0, the bottom of his breath. A long settling step
     * also runs out any blink in progress, so his eyes are open.
     */
    const stand = () => {
      input.left = false
      input.down = false
      player.vx = 0
      player.vy = 0
      player.update(0.2, input, world, 0)
      player.facing = heading
      draw(0)
      place()
    }
    // Before any loop runs, so a page opened in a background tab still has
    // him on the line.
    stand()

    // Reduced motion: a still hedgehog, moved straight to his place.
    if (reduced) {
      const still = () => {
        const to = goal()
        if (Math.abs(to - x) > 1) heading = to > x ? 'down' : 'left'
        x = to
        stand()
      }
      still()
      window.addEventListener('scroll', still, { passive: true })
      window.addEventListener('resize', still)
      return () => {
        window.removeEventListener('scroll', still)
        window.removeEventListener('resize', still)
      }
    }

    // The loop runs only while he has somewhere to go.
    let raf = 0
    let last = 0
    const frame = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0
      last = now
      const to = goal()
      const gap = to - x
      if (Math.abs(gap) <= 1) {
        x = to
        stand()
        raf = 0
        last = 0
        return
      }
      x += gap * Math.min(1, dt * CATCH_UP)
      // Going down he hops toward the reader; the line still carries him right.
      heading = gap > 0 ? 'down' : 'left'
      input.down = gap > 0
      input.left = gap < 0
      player.update(dt * HOP_PACE, input, world, now / 1000)
      draw(now / 1000)
      place()
      raf = requestAnimationFrame(frame)
    }
    const wake = () => {
      if (!raf && !document.hidden) raf = requestAnimationFrame(frame)
    }
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf)
        raf = 0
        last = 0
      } else wake()
    }
    window.addEventListener('scroll', wake, { passive: true })
    window.addEventListener('resize', wake)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', wake)
      window.removeEventListener('resize', wake)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduced])

  return (
    <>
      <div ref={trailRef} aria-hidden className="pointer-events-none absolute -bottom-[3px] left-0 h-[3px] bg-leaf-700" />
      <div
        ref={hostRef}
        aria-hidden
        className="pointer-events-none absolute left-0 will-change-transform"
        // The 3px line's centre sits on the middle of LINE_ROW.
        style={{ bottom: Math.round(-((VH - LINE_ROW - 0.5) * SCALE + 1.5)) }}
      >
        <canvas ref={canvasRef} className="pixelated block" style={{ width: VW * SCALE, height: VH * SCALE }} />
      </div>
    </>
  )
}
