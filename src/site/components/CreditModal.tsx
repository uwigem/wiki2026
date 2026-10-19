import { useEffect, useRef } from 'react'
import { TASK_LABEL, type Contribution, type Credit } from '../content/attributions'
import type { Profile } from '../content/team'
import { useEscape } from '../hooks'
import { asset } from '../router'
import { LogoSet } from './CreditLogo'
import PixelPerson, { looksFor } from './PixelPerson'
import { inline } from './RichText'

/** Everything a keyboard can land on inside the dialog. */
const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

/** Only full https addresses become links. Anything else in the data is dropped. */
function safeUrl(url: string): string | undefined {
  return url.startsWith('https://') ? url : undefined
}

export type CreditSubject =
  | { kind: 'person'; person: Profile; kicker: string; contributions: Contribution[] }
  | { kind: 'credit'; credit: Credit; kicker: string }

/**
 * One card on the attributions page, opened as a dialog: a person and what
 * they did, or an organisation or tool and what it gave us.
 *
 * Laid out like the team page's profile card. A person's headshot when there
 * is one, otherwise their pixel character; an organisation's logo. Closes on
 * Escape, on the close button, or on a click outside the card, and hands focus
 * back to the card that opened it.
 */
export default function CreditModal({ subject, onClose }: { subject: CreditSubject; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  useEscape(true, onClose)

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    closeRef.current?.focus()

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

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
      opener?.focus()
    }
  }, [])

  const name = subject.kind === 'person' ? subject.person.name : subject.credit.name

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
        aria-label={name}
        tabIndex={-1}
        className="panel relative max-h-full w-full max-w-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="pixel absolute right-3 top-3 rounded-sm border-2 border-leaf-700 bg-leaf-50 px-2 py-0.5 text-sm text-leaf-900 hover:bg-leaf-200"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="flex flex-col items-center gap-5 p-5 sm:flex-row sm:items-start sm:gap-6 sm:p-6">
          {subject.kind === 'person' ? <Portrait person={subject.person} /> : <LogoPanel credit={subject.credit} />}

          <div className="flex min-w-0 flex-1 flex-col self-stretch sm:pr-8">
            <p className="kicker">{subject.kicker}</p>
            <h2 className="mt-1 text-2xl text-leaf-950">{name}</h2>
            {subject.kind === 'person' ? <PersonBody {...subject} /> : <CreditBody credit={subject.credit} />}
          </div>
        </div>
      </div>
    </div>
  )
}

function Portrait({ person }: { person: Profile }) {
  return person.photo ? (
    <img
      src={asset(person.photo)}
      alt={person.name}
      className="aspect-[4/5] w-40 shrink-0 rounded-sm border-[3px] border-leaf-700 object-cover sm:w-52"
    />
  ) : (
    <span className="flex aspect-[4/5] w-40 shrink-0 items-end justify-center overflow-hidden rounded-sm border-[3px] border-leaf-300 bg-leaf-100 pb-3 sm:w-52">
      <PixelPerson traits={looksFor(person)} scale={7} />
    </span>
  )
}

function LogoPanel({ credit }: { credit: Credit }) {
  return (
    <span className="flex aspect-square w-40 shrink-0 items-center justify-center rounded-sm border-[3px] border-petal-daisy bg-petal-cream/60 sm:w-52">
      <LogoSet ids={credit.logos} width={140} height={140} />
    </span>
  )
}

function PersonBody({ person, contributions }: { person: Profile; contributions: Contribution[] }) {
  return (
    <>
      {person.titles && <p className="mt-1 text-body-sm text-leaf-900">{person.titles.join(' · ')}</p>}
      {contributions.length > 0 && (
        <dl className="mt-4 flex flex-col gap-3">
          {contributions.map((c, i) => (
            <div key={i}>
              <dt className="pixel text-tag tracking-wide text-leaf-800">{TASK_LABEL[c.task]}</dt>
              <dd className="mt-0.5 text-body-sm leading-relaxed">{inline(c.did)}</dd>
            </div>
          ))}
        </dl>
      )}
    </>
  )
}

function CreditBody({ credit }: { credit: Credit }) {
  const links = credit.links.flatMap((l) => {
    const href = safeUrl(l.href)
    return href ? [{ ...l, href }] : []
  })
  return (
    <>
      <p className="mt-4 text-body leading-relaxed">{inline(credit.did)}</p>
      {links.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2 sm:mt-auto sm:pt-5">
          {links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer noopener" className="pixel-btn text-sm">
              {l.label} ↗
            </a>
          ))}
        </div>
      )}
    </>
  )
}
