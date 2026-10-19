import { useEffect, useRef } from 'react'
import { useEscape } from '../hooks'
import { inline } from './RichText'
import type { Stakeholder } from './StakeholderGarden'
import { asset } from '../router'
import PixelPerson, { looksFor } from './PixelPerson'
import CreditLogo from './CreditLogo'

/** Everything a keyboard can land on inside the dialog. */
const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * One stakeholder's card, as a dialog over the page.
 *
 * Opened from their bloom in the garden or from any mention of their name in
 * the text. Closes on Escape, on the close button, or on a click outside the
 * card, and hands focus back to whatever opened it.
 */
export default function StakeholderModal({ person, onClose }: { person: Stakeholder; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  useEscape(true, onClose)

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
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
  }, [person.name])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-leaf-950/55 p-3" onClick={onClose} role="presentation">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="stakeholder-title"
        tabIndex={-1}
        className="panel relative flex max-h-full w-full max-w-xl flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Photograph beside the name, in the frame the team and attributions
            profiles use, falling back to the pixel person without one. */}
        <div className="flex items-start gap-4 border-b-[3px] border-leaf-300 px-5 py-4 pr-12">
          {person.logo ? (
            <span className="flex aspect-[4/5] w-20 shrink-0 items-center justify-center rounded-sm border-[3px] border-petal-daisy bg-petal-cream/60 sm:w-24">
              <CreditLogo id={person.logo} scale={2} />
            </span>
          ) : person.photo ? (
            <img
              src={asset(person.photo)}
              alt={person.name}
              className="aspect-[4/5] w-20 shrink-0 rounded-sm border-[3px] border-leaf-700 object-cover sm:w-24"
            />
          ) : (
            <span className="flex aspect-[4/5] w-20 shrink-0 items-end justify-center overflow-hidden rounded-sm border-[3px] border-leaf-300 bg-leaf-100 pb-1 sm:w-24">
              <PixelPerson traits={looksFor(person)} scale={3} />
            </span>
          )}
          <span className="min-w-0 flex-1 self-center">
            <p className="kicker">who we asked</p>
            <h2 id="stakeholder-title" className="text-lg sm:text-xl">
              {person.name}
            </h2>
            <p className="mt-1 text-note text-leaf-800">{person.role}</p>
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="pixel absolute right-2 top-2 rounded-sm border-2 border-leaf-700 bg-leaf-50 px-2 py-0.5 text-sm text-leaf-900 hover:bg-leaf-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {person.why && <p className="text-body-sm leading-relaxed">{inline(person.why)}</p>}
          <p className="mt-3 text-body-sm leading-relaxed">{inline(person.said)}</p>
          <p className="mt-3 border-l-[3px] border-petal-daisy pl-3 text-body-sm leading-relaxed">
            {inline(person.changed)}
          </p>
        </div>
      </div>
    </div>
  )
}
