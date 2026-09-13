import { useEffect, useRef } from 'react'
import { WORLD_H, WORLD_W, Water } from '../../engine/config'
import { Player, type Input } from '../../engine/player'
import type { WorldData } from '../../engine/world'
import { useReducedMotion } from '../hooks'
import { LG_BREAKPOINT, contentBand, pixelScale } from '../layout'
import { SITE_PALETTE } from '../theme'

/**
 * The scroll-following hedgehog.
 *
 * It walks down the page margin, but it is clipped to the band between the green
 * fold line (top) and the footer (bottom). So it is not toggled on and off: it
 * emerges from under the fold line as that line scrolls up, and it sinks under
 * the footer as the footer scrolls in. On the hero the fold line is at the bottom
 * of the screen, so the whole thing is clipped away and nothing shows.
 *
 * The clip lives on a full-viewport outer layer; the inner element is the
 * hedgehog, positioned by transform. The animation itself is the engine's:
 * a headless `Player` drawing its own hop-walk and blink.
 */

/**
 * A world of nothing but land, so the guide never collides with anything.
 *
 * `Player.update` only ever reads `waterMap`, so the rest of a real `WorldData`
 * (ponds, the waterfall, decor, the spawn point) is not needed and would cost a
 * full world bake to produce. Everything else is filled in with the empty value
 * of its type rather than cast away, so adding a field to `WorldData` shows up
 * here as a type error instead of as undefined at runtime.
 */
let flatWorld: WorldData | null = null
function getFlatWorld(): WorldData {
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

/** Fraction of the viewport height it travels between, top to bottom. */
const TOP = 0.2
const TRAVEL = 0.58

export default function HedgehogGuide({ side = 'left' }: { side?: 'left' | 'right' }) {
  const outerRef = useRef<HTMLDivElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const outer = outerRef.current
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!outer || !host || !canvas) return

    const VW = 24
    const VH = 26
    const buf = document.createElement('canvas')
    buf.width = VW
    buf.height = VH
    const bctx = buf.getContext('2d')!
    bctx.imageSmoothingEnabled = false

    const player = new Player({ x: 400, y: 300 })
    const world = getFlatWorld()
    const input: Input = { up: false, down: false, left: false, right: false }

    /** One still frame, for visitors who asked for reduced motion. */
    const drawStill = () => {
      player.update(0.016, input, world, 0)
      bctx.clearRect(0, 0, VW, VH)
      player.draw(bctx, player.x - VW / 2, player.y - VH / 2 + 3, SITE_PALETTE, 0)
      const out = canvas.getContext('2d')
      if (!out) return
      out.imageSmoothingEnabled = false
      out.drawImage(buf, 0, 0, VW, VH, 0, 0, canvas.width, canvas.height)
    }

    let scale = 3
    const resize = () => {
      // Two steps down from the page scale: the guide stands beside the text,
      // not in the world, and at full scale it crowds the reading column.
      scale = Math.max(2, pixelScale(window.innerWidth, window.innerHeight) - 2)
      canvas.width = VW * scale
      canvas.height = VH * scale
      canvas.style.width = VW * scale + 'px'
      canvas.style.height = VH * scale + 'px'
      // Assigning canvas.width wipes the bitmap, and the reduced-motion branch
      // has no loop to repaint it, so redraw the still frame here.
      if (reduced) drawStill()
    }
    resize()
    window.addEventListener('resize', resize)

    /** Straight down the margin, linear in scroll. */
    const targetY = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const prog = Math.min(1, Math.max(0, window.scrollY / max))
      const h = window.innerHeight
      return (TOP + prog * TRAVEL) * h
    }

    /** Against the inner edge of the margin, next to the reading column. */
    const targetX = () => {
      const { band } = contentBand(window.innerWidth)
      const w = VW * scale
      const inset = Math.max(2, band - w - 10)
      return side === 'left' ? inset : window.innerWidth - w - inset
    }

    /**
     * Clip the layer to the content band. Top edge is just under the green fold
     * line (the hedgehog is revealed from under it); bottom edge is the top of
     * the footer (it sinks under it). Where either is missing, that edge is open.
     */
    const applyClip = () => {
      const vh = window.innerHeight
      const fold = document.querySelector('[data-hero-fold]')
      const footer = document.querySelector('footer')
      let top = 0
      let bottom = 0
      if (fold) top = Math.max(0, Math.min(vh, fold.getBoundingClientRect().bottom))
      if (footer) bottom = Math.max(0, Math.min(vh, vh - footer.getBoundingClientRect().top))
      outer.style.clipPath = `inset(${Math.round(top)}px 0px ${Math.round(bottom)}px 0px)`
    }

    let curY = targetY()
    const place = () => {
      host.style.transform = `translate3d(${Math.round(targetX())}px, ${Math.round(curY)}px, 0)`
      applyClip()
    }
    place()

    let raf = 0
    let last = performance.now()
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      const want = targetY()
      const ny = curY + (want - curY) * Math.min(1, dt * 3)
      const dy = ny - curY
      curY = ny

      // Walking direction comes from actual movement, so a still page shows the idle breathe.
      const MOVING = 0.15
      input.up = dy < -MOVING
      input.down = dy > MOVING
      input.left = false
      input.right = false

      player.update(dt, input, world, now / 1000)
      bctx.clearRect(0, 0, VW, VH)
      player.draw(bctx, player.x - VW / 2, player.y - VH / 2 + 3, SITE_PALETTE, now / 1000)

      const out = canvas.getContext('2d')!
      out.imageSmoothingEnabled = false
      out.clearRect(0, 0, canvas.width, canvas.height)
      out.drawImage(buf, 0, 0, VW, VH, 0, 0, canvas.width, canvas.height)

      place()
      raf = requestAnimationFrame(frame)
    }

    // Reduced motion: a still hedgehog, repositioned and reclipped on scroll.
    // No loop, and no redraw on scroll either: moving the canvas with a
    // transform leaves its bitmap alone.
    const reducedPlace = () => {
      curY = targetY()
      place()
    }

    // The guide is display:none below lg, where there is no margin to walk in.
    // Running a 60fps loop to draw something no phone visitor can see is pure
    // battery cost, so the loop follows the same breakpoint the class does.
    const wide = window.matchMedia(`(min-width: ${LG_BREAKPOINT}px)`)
    const shouldRun = () => wide.matches && !document.hidden && !reduced

    const startLoop = () => {
      if (raf || !shouldRun()) return
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
    const stopLoop = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    if (reduced) {
      drawStill()
      reducedPlace()
      window.addEventListener('scroll', reducedPlace, { passive: true })
    } else {
      startLoop()
    }

    const onVisibility = () => (shouldRun() ? startLoop() : stopLoop())
    document.addEventListener('visibilitychange', onVisibility)
    wide.addEventListener('change', onVisibility)

    return () => {
      stopLoop()
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', reducedPlace)
      document.removeEventListener('visibilitychange', onVisibility)
      wide.removeEventListener('change', onVisibility)
    }
  }, [side, reduced])

  return (
    <div
      ref={outerRef}
      aria-hidden
      // Full-viewport clip layer. Hidden below lg, where there is no margin to
      // walk in. z-[5] puts the guide above the garden canvas (z-0) but below
      // the content layer (z-10): at z-20 it sat outside that layer's stacking
      // context and painted over the member dialog inside it.
      className="pointer-events-none fixed inset-0 z-[5] hidden overflow-hidden lg:block"
    >
      <div ref={hostRef} className="absolute left-0 top-0 will-change-transform">
        <canvas ref={canvasRef} className="pixelated block" />
      </div>
    </div>
  )
}
