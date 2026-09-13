import { useEffect, useRef } from 'react'
import type { Mode } from '../engine/palette'
import { Renderer } from '../engine/renderer'
import { Game } from '../engine/game'
import type { Input } from '../engine/player'
import { TARGET_VIEW_H, WORLD_W, WORLD_H } from '../engine/config'

interface Props {
  mode: Mode
  density: number
}

export default function PixelCanvas({ mode, density }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const modeRef = useRef(mode)
  const densityRef = useRef(density)
  modeRef.current = mode
  densityRef.current = density

  useEffect(() => {
    const canvas = canvasRef.current!
    const renderer = new Renderer()
    const game = new Game(renderer, modeRef.current)

    const resize = () => {
      const cssW = window.innerWidth
      const cssH = window.innerHeight
      // scale off the SHORTER side so the zoom (tiles-across) is consistent in
      // portrait or landscape and never over-zooms one axis
      const scale = Math.max(2, Math.min(6, Math.round(Math.min(cssW, cssH) / TARGET_VIEW_H)))
      const vw = Math.min(WORLD_W, Math.ceil(cssW / scale))
      const vh = Math.min(WORLD_H, Math.ceil(cssH / scale))
      renderer.resize(vw, vh)
      canvas.width = cssW
      canvas.height = cssH
      canvas.style.width = cssW + 'px'
      canvas.style.height = cssH + 'px'
    }
    resize()
    window.addEventListener('resize', resize)

    const input: Input = { up: false, down: false, left: false, right: false }
    const set = (code: string, down: boolean): boolean => {
      switch (code) {
        case 'KeyW':
        case 'ArrowUp':
          input.up = down
          return true
        case 'KeyS':
        case 'ArrowDown':
          input.down = down
          return true
        case 'KeyA':
        case 'ArrowLeft':
          input.left = down
          return true
        case 'KeyD':
        case 'ArrowRight':
          input.right = down
          return true
      }
      return false
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (set(e.code, true)) e.preventDefault()
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (set(e.code, false)) e.preventDefault()
    }
    const onBlur = () => {
      input.up = input.down = input.left = input.right = false
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)

    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      game.setMode(modeRef.current)
      game.setDensity(densityRef.current)
      game.update(dt, input)
      game.draw(canvas)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [])

  return <canvas ref={canvasRef} className="pixelated fixed inset-0 block h-full w-full" />
}
