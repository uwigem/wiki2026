import { useEffect, useRef } from 'react'
import { ELEMENT, LEVELS } from '../../content/alchemy'
import { useEscape } from '../../hooks'
import ElementIcon from './ElementIcon'
import type { Alchemy } from './useAlchemy'

/** Everything a keyboard can land on inside the dialog. */
const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * The encyclopedia: everything found so far, level by level, with the
 * team's description and what it was made from.
 */
export default function FieldGuide({ game, onClose }: { game: Alchemy; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  useEscape(true, onClose)

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    // Open at the level being played, not always at level 1.
    document.getElementById(`guide-${game.level.id}`)?.scrollIntoView({ block: 'start' })
    // Keep Tab inside the dialog, the same way the team profile does.
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const dialog = dialogRef.current
      if (!dialog) return
      const stops = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (stops.length === 0) return
      const first = stops[0]
      const last = stops[stops.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      opener?.focus()
    }
  }, [])

  const total = LEVELS.reduce((n, l) => n + game.foundIn(l.id).length, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-leaf-950/55 p-3" onClick={onClose} role="presentation">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-title"
        tabIndex={-1}
        className="panel relative flex max-h-full w-full max-w-xl flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b-[3px] border-leaf-300 px-4 py-2.5 pr-12">
          <div className="min-w-0 flex-1">
            <p className="kicker">encyclopedia</p>
            <h2 id="guide-title" className="text-base">
              {total === 0 ? 'Nothing found yet' : `${total} thing${total === 1 ? '' : 's'} found`}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="pixel absolute right-2 top-2 rounded-sm border-2 border-leaf-700 bg-leaf-50 px-2 py-0.5 text-sm text-leaf-900 hover:bg-leaf-200"
            aria-label="Close the encyclopedia"
          >
            ✕
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
          {total === 0 && (
            <p className="text-body-sm text-leaf-800">Combine two things on the bench and whatever you make is written up here.</p>
          )}
          {LEVELS.map((l) => {
            const ids = game.foundIn(l.id)
            if (ids.length === 0) return null
            return (
              <section key={l.id} className="mb-4" aria-labelledby={`guide-${l.id}`}>
                <h3 id={`guide-${l.id}`} className="kicker mb-1.5">
                  {l.name}
                </h3>
                <ul className="flex flex-col gap-1.5">
                  {ids.map((id) => {
                    const e = ELEMENT[id]
                    const from = game.how[id]
                    return (
                      <li key={id} className="panel-flat flex gap-2.5 px-2.5 py-1.5">
                        <ElementIcon id={id} scale={2} className="self-start" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold leading-tight">{e.name}</p>
                          <p className="text-body-sm leading-snug text-leaf-800">{e.description}</p>
                          {from && (
                            <p className="pixel mt-0.5 text-xs text-leaf-800">{from.map((f) => ELEMENT[f].name).join(' + ')}</p>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </section>
            )
          })}
        </div>

        <div className="flex items-center justify-between gap-3 border-t-[3px] border-leaf-300 px-4 py-2">
          <p className="text-[11px] text-leaf-800">Progress is saved in this browser only.</p>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Start over? This forgets everything found so far.')) {
                game.reset()
                onClose()
              }
            }}
            className="pixel-btn alc-btn"
          >
            Start over
          </button>
        </div>
      </div>
    </div>
  )
}
