import { useEffect, useRef } from 'react'
import { SUBTEAM_NAME, type Member } from '../content/team'
import { useEscape } from '../hooks'
import PixelIcon from './PixelIcon'
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

const MAIL = [
  '............',
  '............',
  '############',
  '##........##',
  '#.#......#.#',
  '#..#....#..#',
  '#...#..#...#',
  '#....##....#',
  '#..........#',
  '#..........#',
  '############',
  '............',
]

/** The "in" mark, cut out of a rounded square. */
const LINKEDIN = [
  '.##########.',
  '############',
  '##..########',
  '##..########',
  '############',
  '##..#....###',
  '##..#..#..##',
  '##..#..#..##',
  '##..#..#..##',
  '##..#..#..##',
  '############',
  '.##########.',
]

const GLOBE = [
  '....####....',
  '..###..###..',
  '.#..#..#..#.',
  '.#..#..#..#.',
  '############',
  '#...#..#...#',
  '#...#..#...#',
  '############',
  '.#..#..#..#.',
  '.#..#..#..#.',
  '..###..###..',
  '....####....',
]

/** One square button with a glyph. The label is for screen readers and the tooltip. */
function ContactButton({ href, label, icon, external }: { href: string; label: string; icon: string[]; external?: boolean }) {
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      className="pixel-btn h-11 w-11 justify-center p-0 text-leaf-900"
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
    >
      <PixelIcon rows={icon} className="h-5 w-5" />
    </a>
  )
}

/**
 * A member's profile card, shown as a modal dialog.
 *
 * Their headshot when we have one, otherwise their pixel character. Then their
 * titles on one line, any subteam their title does not already name, their
 * bio, and a button each for email, LinkedIn and website.
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
  const first = member.name.split(' ')[0]
  // A lead's title already names their subteam ("Wet Lab Lead"), so only the
  // others are listed.
  const otherSubteams = member.subteams.filter(
    (id) => !member.leads?.includes(id) && !member.titles?.some((t) => t.includes(SUBTEAM_NAME[id])),
  )

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
        className="panel relative max-h-full w-full max-w-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="pixel absolute right-3 top-3 rounded-sm border-2 border-leaf-700 bg-leaf-50 px-2 py-0.5 text-sm text-leaf-900 hover:bg-leaf-200"
          aria-label="Close profile"
        >
          ✕
        </button>

        <div className="flex flex-col items-center gap-5 p-5 sm:flex-row sm:items-start sm:gap-6 sm:p-6">
          {member.photo ? (
            <img
              src={member.photo}
              alt={member.name}
              className="aspect-[4/5] w-40 shrink-0 rounded-sm border-[3px] border-leaf-700 object-cover sm:w-52"
            />
          ) : (
            <span className="flex aspect-[4/5] w-40 shrink-0 items-end justify-center overflow-hidden rounded-sm border-[3px] border-leaf-300 bg-leaf-100 pb-3 sm:w-52">
              <PixelPerson traits={looksFor(member)} scale={7} />
            </span>
          )}

          <div className="flex min-w-0 flex-1 flex-col self-stretch sm:pr-8">
            <h2 className="text-2xl text-leaf-950">{member.name}</h2>
            {member.titles && <p className="mt-1 text-body-sm text-leaf-900">{member.titles.join(' · ')}</p>}
            {otherSubteams.length > 0 && (
              <p className="kicker mt-1.5">{otherSubteams.map((id) => SUBTEAM_NAME[id]).join(' · ')}</p>
            )}
            {member.bio && <p className="mt-4 text-body-sm leading-relaxed">{member.bio}</p>}

            <div className="mt-5 flex gap-3 sm:mt-auto sm:pt-5">
              <ContactButton href={`mailto:${member.email}`} label={`Email ${first}`} icon={MAIL} />
              {linkedin && <ContactButton href={linkedin} label={`${first} on LinkedIn`} icon={LINKEDIN} external />}
              {website && <ContactButton href={website} label={`${first}’s website`} icon={GLOBE} external />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
