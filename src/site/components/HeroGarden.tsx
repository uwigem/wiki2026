import { useEffect, useRef } from 'react'
import { WORLD_H, WORLD_W } from '../../engine/config'
import { Game } from '../../engine/game'
import { Renderer } from '../../engine/renderer'
import type { Input } from '../../engine/player'
import { useReducedMotion } from '../hooks'
import { pixelScale } from '../layout'
import { SITE_MODE } from '../theme'

/**
 * The live garden, in the homepage hero only.
 *
 * `src/engine/game.ts` runs here unmodified: baked terrain, the animated
 * waterfall, pond ripples, depth-sorted plants, sparkles, the palette. It fills
 * the hero and nothing else. Below the fold the page switches to `PageGarden`,
 * whose middle is kept clear for text.
 *
 * The hedgehog is not steered by scroll here. The only movement asked of the
 * engine is the intro beat, and that is the engine's own hop-walk:
 * `gardenStage.walk()` writes the same `Input` struct the keyboard writes to.
 */

export const gardenStage = {
  script: null as { dir: keyof Input; until: number } | null,
  /** Ask the engine to walk the hedgehog, using its own hop-walk. */
  walk(dir: keyof Input, ms: number) {
    this.script = { dir, until: performance.now() + ms }
  },
}

export default function HeroGarden() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const host = canvas.parentElement
    if (!host) return

    const renderer = new Renderer()
    const game = new Game(renderer, SITE_MODE)
    const input: Input = { up: false, down: false, left: false, right: false }

    /** One still frame, for visitors who asked for reduced motion. */
    const renderStill = () => {
      game.update(0.016, input)
      game.draw(canvas)
    }

    // Sized to the hero box, at the shared pixel scale so one logical pixel is
    // the same size everywhere on the site.
    const resize = () => {
      const cssW = Math.max(1, host.clientWidth)
      const cssH = Math.max(1, host.clientHeight)
      const scale = pixelScale(cssW, cssH)
      renderer.resize(Math.min(WORLD_W, Math.ceil(cssW / scale)), Math.min(WORLD_H, Math.ceil(cssH / scale)))
      canvas.width = cssW
      canvas.height = cssH
      canvas.style.width = cssW + 'px'
      canvas.style.height = cssH + 'px'
      // Assigning canvas.width wipes the bitmap. Under reduced motion nothing
      // else ever repaints it, so the still frame has to be redrawn here or the
      // hero goes blank on the ResizeObserver's first call.
      if (reduced) renderStill()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(host)

    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      input.up = input.down = input.left = input.right = false
      const s = gardenStage.script
      if (s) {
        if (performance.now() < s.until) input[s.dir] = true
        else gardenStage.script = null
      }
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      game.update(dt, input)
      game.draw(canvas)
      raf = requestAnimationFrame(loop)
    }

    if (reduced) renderStill()
    else raf = requestAnimationFrame(loop)

    const onVisibility = () => {
      if (reduced) return
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf)
        raf = 0
      } else if (!raf) {
        last = performance.now()
        raf = requestAnimationFrame(loop)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduced])

  return <canvas ref={canvasRef} aria-hidden className="pixelated absolute inset-0 block h-full w-full" />
}
