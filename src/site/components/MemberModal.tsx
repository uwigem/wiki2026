import { useEffect, useRef } from 'react'
import { SUBTEAM_NAME, type Member } from '../content/team'
import { useEscape } from '../hooks'
import PixelPerson, { looksFor } from './PixelPerson'

interface Props {
  member: Member
  onClose: () => void
}

/** Everything a keyboard can land on inside the dialog. */
const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

/** Only full https addresses become links. Anything else in the data is dropped. */
function safeUrl(url: string | undefined): string | undefined {
  return url && url.startsWith('https://') ? url : undefined
}

/** `https://www.linkedin.com/in/someone/` reads as `linkedin.com/in/someone`. */
function shortUrl(url: string): string {
  return url.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '')
}

/**
 * A member's profile card, shown as a modal dialog.
 *
 * Their headshot when we have one, otherwise their pixel character. Then their
 * titles, subteams and major, their bio if they have written one, and how to
 * reach them.
 */
export default function MemberModal({ member, onClose }: Props) {
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
      // Put focus back on the tile that opened this, not at the top of the page.
      opener?.focus()
    }
  }, [])

  const linkedin = safeUrl(member.linkedin)
  const website = safeUrl(member.website)

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
        aria-label={member.name}
        tabIndex={-1}
        className="panel relative max-h-full w-full max-w-md overflow-y-auto"
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
            {member.titles?.map((t) => (
              <p key={t} className="text-sm text-leaf-900">
                {t}
              </p>
            ))}
            <p className="kicker mt-1">{member.subteams.map((id) => SUBTEAM_NAME[id]).join(' · ')}</p>
            {member.major && <p className="mt-1 text-note text-leaf-800">{member.major}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-3 px-5 py-4">
          {member.bio && <p className="text-body-sm leading-relaxed">{member.bio}</p>}
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-body-sm">
            <dt className="pixel text-note text-leaf-800">Email</dt>
            <dd className="min-w-0 break-words">
              <a href={`mailto:${member.email}`} className="cross-link">
                {member.email}
              </a>
            </dd>
            {linkedin && (
              <>
                <dt className="pixel text-note text-leaf-800">LinkedIn</dt>
                <dd className="min-w-0 break-words">
                  <a href={linkedin} target="_blank" rel="noreferrer noopener" className="cross-link">
                    {shortUrl(linkedin)}
                  </a>
                </dd>
              </>
            )}
            {website && (
              <>
                <dt className="pixel text-note text-leaf-800">Website</dt>
                <dd className="min-w-0 break-words">
                  <a href={website} target="_blank" rel="noreferrer noopener" className="cross-link">
                    {shortUrl(website)}
                  </a>
                </dd>
              </>
            )}
          </dl>
        </div>
      </div>
    </div>
  )
}
