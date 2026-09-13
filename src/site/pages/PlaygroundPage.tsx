import { useEffect, useState } from 'react'
import PixelCanvas from '../../components/PixelCanvas'
import { useAmbientAudio } from '../../hooks/useAmbientAudio'
import type { Mode } from '../../engine/palette'
import { Link } from '../router'

/**
 * The playground: the team's pixel overworld, full screen and walkable.
 *
 * The same engine that paints the rest of the site, with its own controls for
 * time of day, sparkle density and ambient audio. This route replaces the whole
 * shell (see App.tsx), so the nav, footer and page background do not render and
 * only one copy of the engine is ever running.
 */

const MODES: { id: Mode; label: string; icon: string }[] = [
  { id: 'day', label: 'day', icon: '☀' },
  { id: 'dusk', label: 'dusk', icon: '✦' },
  { id: 'night', label: 'night', icon: '☾' },
]

export default function PlaygroundPage() {
  const [mode, setMode] = useState<Mode>('day')
  const [sparklePct, setSparklePct] = useState(30)
  const { enabled: audioOn, toggle: toggleAudio } = useAmbientAudio()

  // full-screen toy: stop the page behind it from scrolling
  useEffect(() => {
    document.body.classList.add('playground-open')
    return () => document.body.classList.remove('playground-open')
  }, [])

  const density = Math.round((sparklePct / 100) * 140)

  return (
    /*
     * `fixed inset-0`, not `h-full w-full`. index.css sets `min-height: 100%`
     * on html, body and #root so the wiki can scroll, and under that `h-full`
     * resolves against a zero-height ancestor and collapses the toy box off the
     * bottom of the screen. Pinning to the viewport is height-independent.
     */
    <main className="fixed inset-0 select-none overflow-hidden">
      <h1 className="sr-only">Playground</h1>
      <p className="sr-only">
        A walkable pixel-art meadow, drawn live on a canvas. Move the hedgehog with the W, A, S and D
        keys or the arrow keys. The controls below change the time of day, the number of sparkles, and
        the ambient soundscape. Nothing on this page is needed to read the wiki.
      </p>

      <PixelCanvas mode={mode} density={density} />

      {/* controls hint */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-3 top-3 border-2 border-leaf-700/60 bg-leaf-50/80 px-2 py-1 text-[11px] text-leaf-800 shadow-[2px_2px_0_var(--p-bushDark)]"
      >
        <span className="font-semibold">WASD</span> / <span className="font-semibold">← ↑ ↓ →</span> to walk
      </div>

      <Link
        to="/"
        className="pixel absolute right-3 top-3 border-2 border-leaf-700/60 bg-leaf-50/80 px-2 py-1 text-[11px] text-leaf-800 shadow-[2px_2px_0_var(--p-bushDark)] hover:bg-leaf-200"
      >
        ← back to the wiki
      </Link>

      {/* toy box */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-col gap-3 border-2 border-leaf-700 bg-leaf-50/85 p-3 text-leaf-800 shadow-[4px_4px_0_var(--p-bushDark)] backdrop-blur-sm sm:flex-row sm:items-center sm:gap-5">
        <div className="flex items-center gap-2">
          <span id="pg-time" className="text-xs">
            time
          </span>
          <div className="flex" role="group" aria-labelledby="pg-time">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                aria-pressed={mode === m.id}
                className={
                  'border-2 px-2 py-1 text-sm transition-colors ' +
                  (mode === m.id
                    ? 'border-leaf-800 bg-pool-400 text-leaf-950'
                    : 'border-leaf-400 bg-transparent text-leaf-800 hover:bg-leaf-200')
                }
                title={m.label}
              >
                <span className="mr-1">{m.icon}</span>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs">
          sparkles
          <input
            type="range"
            min={0}
            max={100}
            value={sparklePct}
            onChange={(e) => setSparklePct(Number(e.target.value))}
            // The canvas listens for arrow keys on the window and calls
            // preventDefault, which would swallow the slider's own arrow-key
            // steps. Stopping the event here keeps it from reaching that
            // listener, so the slider works from the keyboard.
            onKeyDown={(e) => e.stopPropagation()}
            className="pond-range w-28"
            aria-label="Sparkle density, percent"
            aria-valuetext={`${sparklePct} percent`}
          />
        </label>

        <button
          type="button"
          onClick={toggleAudio}
          aria-pressed={audioOn}
          aria-label="Ambient sound"
          className={
            'border-2 px-3 py-1 text-sm transition-colors ' +
            (audioOn
              ? 'border-leaf-800 bg-pool-400 text-leaf-950'
              : 'border-leaf-400 bg-transparent text-leaf-800 hover:bg-leaf-200')
          }
        >
          <span aria-hidden>♪ </span>
          {audioOn ? 'on' : 'off'}
        </button>
      </div>
    </main>
  )
}
