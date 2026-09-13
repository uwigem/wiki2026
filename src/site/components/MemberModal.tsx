import { useEffect, useRef } from 'react'
import type { Member, Subteam } from '../content/team'
import { useEscape } from '../hooks'
import PixelPerson, { looksFor } from './PixelPerson'

interface Props {
  member: Member
  subteam: Subteam
  onClose: () => void
}

/** Everything a keyboard can land on inside the dialog. */
const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * A member's profile card, shown as a modal dialog.
 *
 * Clean panel, plain type, the person's real photo when we have one. Without
 * one, their pixel character stands in.
 */
export default function MemberModal({ member, subteam, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  useEscape(true, onClose)

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    closeRef.current?.focus()

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Keep Tab inside the dialog. Without this, a keyboard user tabs straight
    // out of a dialog that claims aria-modal and walks the whole page behind it.
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const dialog = dialogRef.current
      if (!dialog) return
      const stops = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (stops.length === 0) {
        e.preventDefault()
        dialog.focus()
        return
      }
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
      document.body.style.overflow = prevOverflow
      // Put focus back on the bloom that opened this, not at the top of the page.
      opener?.focus()
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-leaf-950/55 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${member.name}, ${subteam.name}`}
        tabIndex={-1}
        className="panel relative w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="pixel absolute right-2 top-2 rounded-sm border-2 border-leaf-700 bg-leaf-50 px-2 py-0.5 text-sm text-leaf-900 hover:bg-leaf-200"
          aria-label="Close profile"
        >
          ✕
        </button>

        <div className="flex items-center gap-4 border-b-[3px] border-leaf-300 bg-leaf-50 px-5 py-5 pr-12">
          {/* The member's real photo when we have it, otherwise their pixel
              character stands in. TODO(ops): headshots into /public/team/. */}
          {member.photo ? (
            <img
              src={member.photo}
              alt={member.name}
              className="h-32 w-24 shrink-0 rounded-sm border-[3px] border-leaf-700 object-cover"
            />
          ) : (
            <span className="flex h-32 w-24 shrink-0 items-end justify-center overflow-hidden rounded-sm border-[3px] border-leaf-300 bg-leaf-100">
              <PixelPerson traits={looksFor(member)} scale={3} />
            </span>
          )}
          <div className="min-w-0">
            <h2 className="text-xl text-leaf-950">{member.name}</h2>
            {member.role && <p className="text-sm text-leaf-900">{member.role}</p>}
            <p className="kicker mt-1">{subteam.name}</p>
          </div>
        </div>

        <div className="px-5 py-4">
          {member.bio ? (
            <p className="text-body-sm leading-relaxed">{member.bio}</p>
          ) : (
            <p className="todo-note">
              <span aria-hidden>▸</span>
              <span>TODO: {member.name} to write a one-line bio (and add a photo).</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
