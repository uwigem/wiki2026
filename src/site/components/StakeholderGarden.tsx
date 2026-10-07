import { useState } from 'react'
import {
  BIG_FLOWER,
  BLUEBELL,
  DAISY,
  LILAC,
  PINK_BELL,
  WHITE_FLOWER,
  type Sprite,
} from '../../engine/sprites'
import PixelSign from './PixelSign'
import PixelSprite from './PixelSprite'
import { inline } from './RichText'

/**
 * The people who shaped the project, planted as beds in the garden.
 *
 * One bed per kind of expertise, one bloom per person. This is the stakeholder
 * map from the Human Practices sketches, with two deliberate departures from
 * it: names are printed under their flower rather than revealed on hover, and
 * the detail opens in a panel rather than a pop-up. A map whose content only
 * appears when a mouse passes over it is unreadable on a phone and invisible
 * to a screen reader, and this is the page where a judge most needs to be able
 * to read everything.
 *
 * Every entry carries a **what changed** line, and that line is the point.
 * An interview with no decision attached to it is a conversation, not
 * integrated human practices, so the field is required by the type rather than
 * left optional and quietly skipped.
 */

export interface Stakeholder {
  name: string
  /** Position and institution. */
  role: string
  /** Which bed they are planted in. Must match a key in GROUPS. */
  group: string
  /** Why the team went to them. */
  why?: string
  /** The substance of their advice. */
  said: string
  /** What the team actually changed because of it. */
  changed: string
}

/** One flower per bed, so the groups are told apart by shape, not only by label. */
const GROUPS: { key: string; label: string; flower: Sprite }[] = [
  { key: 'signalling researcher', label: 'Signalling researchers', flower: LILAC },
  { key: 'ciliary biologist', label: 'Ciliary biologists', flower: BLUEBELL },
  { key: 'modelling expert', label: 'Modelling experts', flower: DAISY },
  { key: 'bioethics', label: 'Ethics and medicine', flower: WHITE_FLOWER },
  { key: 'startup or industry', label: 'Founders and industry', flower: PINK_BELL },
  { key: 'commercialisation', label: 'Getting it out of the lab', flower: BIG_FLOWER },
]

interface Props {
  heading?: string
  intro?: string
  people: Stakeholder[]
  /** Names contacted but not yet interviewed. Named as such, never as interviews. */
  pending?: string[]
  source?: string
}

export default function StakeholderGarden({ heading, intro, people, pending, source }: Props) {
  const [openName, setOpenName] = useState<string | null>(null)
  const open = people.find((p) => p.name === openName)

  const beds = GROUPS.map((g) => ({ ...g, members: people.filter((p) => p.group === g.key) })).filter(
    (g) => g.members.length > 0,
  )

  return (
    <section className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
      {heading && <h2 className="text-xl sm:text-2xl">{heading}</h2>}
      {intro && <p className="mt-1 max-w-2xl text-body leading-relaxed">{inline(intro)}</p>}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {beds.map((bed) => (
          <div key={bed.key} className="panel-flat px-4 py-3">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-base">{bed.label}</h3>
              <span className="badge">{bed.members.length}</span>
            </div>

            <ul className="mt-3 flex flex-wrap gap-2">
              {bed.members.map((p) => {
                const isOpen = p.name === openName
                return (
                  <li key={p.name}>
                    <button
                      type="button"
                      aria-pressed={isOpen}
                      onClick={() => setOpenName(isOpen ? null : p.name)}
                      className={
                        'flex w-[7.5rem] flex-col items-center gap-1 rounded-sm border-[3px] px-1.5 py-2 text-center transition-colors ' +
                        (isOpen
                          ? 'border-leaf-800 bg-leaf-200 shadow-[3px_3px_0_var(--p-shadow)]'
                          : 'border-leaf-300 bg-leaf-50 hover:bg-leaf-100')
                      }
                    >
                      <PixelSprite sprite={bed.flower} scale={2} />
                      <span className="text-[0.72rem] leading-tight">{p.name}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* The detail. One panel for all of them, below the beds, so opening a
          second person does not push the first one's bed around the page. */}
      <div className="panel-flat mt-4 px-5 py-4" aria-live="polite">
        {open ? (
          <>
            <h3 className="text-lg sm:text-xl">{open.name}</h3>
            <p className="mt-1 text-note text-leaf-800">{open.role}</p>
            {open.why && (
              <p className="mt-3 text-body-sm leading-relaxed">
                <span className="kicker mr-1.5 normal-case">why we asked</span>
                {inline(open.why)}
              </p>
            )}
            <p className="mt-2 text-body-sm leading-relaxed">
              <span className="kicker mr-1.5 normal-case">what they said</span>
              {inline(open.said)}
            </p>
            <p className="mt-3 border-l-[3px] border-petal-daisy pl-3 text-body-sm leading-relaxed">
              <span className="kicker mr-1.5 normal-case">what we changed</span>
              {inline(open.changed)}
            </p>
          </>
        ) : (
          <p className="text-center text-body-sm leading-relaxed">
            Pick a bloom to read what that person told us, and what we changed because of it.
          </p>
        )}
      </div>

      {pending && pending.length > 0 && (
        <div className="mt-4 flex flex-col items-start gap-2">
          <PixelSign posts={false}>
            <p className="pixel text-tag">not yet planted</p>
          </PixelSign>
          <p className="text-body-sm leading-relaxed">
            We have written to {pending.join(' and ')} but have not spoken to them yet, so there is
            nothing here from them. They go in the ground when the conversation happens, not before.
          </p>
        </div>
      )}

      {source && (
        <p className="mt-4 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{source}</p>
      )}
    </section>
  )
}
