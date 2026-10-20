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
import PixelPerson, { looksFor } from './PixelPerson'
import CreditLogo from './CreditLogo'
import type { CreditLogoId } from '../content/creditLogos'
import { stakeholderId, useStakeholders } from './stakeholders'

/**
 * The people who shaped the project, as a filterable set of cards.
 *
 * Laid out the way McGill 2025 lays out its Human Practices journey: a row of
 * filter chips, one per kind of expertise, over cards that each give a name,
 * a role and a "More" that opens the full conversation as a dialog
 * (`StakeholderModal`). Any mention of the person's name elsewhere on the page
 * opens the same dialog. Each kind of expertise keeps its own flower, so the
 * groups are told apart by shape as well as by label.
 *
 * Every entry carries a **what changed** line, and that line is the point.
 * An interview with no decision attached to it is a conversation, not
 * integrated human practices, so the field is required by the type rather than
 * left optional and quietly skipped.
 */

export interface Stakeholder {
  /** How the text links to this person: `[Dr. Zheng](stakeholder:zheng)`. Defaults to the surname. */
  id?: string
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
  /**
   * Their photograph, a file in `public/`. Square, because the sources are a
   * mix of shapes and a square reads as a portrait at any size. Without one
   * the card falls back to the flower for their group.
   */
  photo?: string
  /**
   * This entry is an organisation rather than one person. Their logo stands in
   * for the pixel person, drawn from the same pixel-art set the attributions
   * page uses rather than dropped in as an image file.
   */
  logo?: CreditLogoId
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
  const { open } = useStakeholders()
  const [filter, setFilter] = useState<string>('all')

  const groups = GROUPS.map((g) => ({ ...g, count: people.filter((p) => p.group === g.key).length })).filter(
    (g) => g.count > 0,
  )
  const labelFor = (key: string) => GROUPS.find((g) => g.key === key)?.label ?? key
  const shown = filter === 'all' ? people : people.filter((p) => p.group === filter)

  const chip = (key: string, label: string, count: number, flower?: Sprite) => {
    const on = filter === key
    return (
      <li key={key}>
        <button
          type="button"
          onClick={() => setFilter(key)}
          aria-pressed={on}
          className={
            'flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-sm border-[3px] px-2.5 py-1 text-xs transition-colors ' +
            (on ? 'border-leaf-800 bg-leaf-200 font-semibold' : 'border-leaf-300 bg-leaf-50 hover:bg-leaf-100')
          }
        >
          {flower && <PixelSprite sprite={flower} scale={2} />}
          <span>{label}</span>
          <span className="text-leaf-800">{count}</span>
        </button>
      </li>
    )
  }

  return (
    <section className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
      {heading && <h2 className="text-xl sm:text-2xl">{heading}</h2>}
      {intro && <p className="mt-1 text-body leading-relaxed">{inline(intro)}</p>}

      {/* One swipeable row on a phone, wrapping from there up. */}
      <ul
        className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible"
        aria-label="Filter by kind of expertise"
      >
        {chip('all', 'All', people.length)}
        {groups.map((g) => chip(g.key, g.label, g.count, g.flower))}
      </ul>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        {shown.map((p) => (
          <li key={p.name} className="min-w-0">
            <button
              type="button"
              onClick={() => open(stakeholderId(p))}
              aria-haspopup="dialog"
              className="group flex h-full w-full items-start gap-3 rounded-sm border-[3px] border-leaf-300 bg-leaf-50 px-3 py-3 text-left transition-colors hover:border-leaf-700 hover:bg-leaf-100"
            >
              {/* The pixel person at full size and unframed, as on the team and
                  attributions pages: a fixed slot so a taller character does
                  not shift the name beside it. Their photograph belongs in the
                  profile, not on the tile, and an organisation shows its logo
                  instead of a person. */}
              <span aria-hidden className="flex h-20 w-16 shrink-0 items-end justify-center">
                {p.logo ? (
                  <CreditLogo id={p.logo} scale={2} />
                ) : (
                  <PixelPerson traits={looksFor(p)} scale={4} />
                )}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-sm font-semibold leading-snug">{p.name}</span>
                <span className="line-clamp-2 text-xs leading-snug text-leaf-800">{p.role}</span>
                <span className="mt-1.5 flex items-center justify-between gap-2">
                  <span className="truncate text-[0.7rem] text-leaf-800">{labelFor(p.group)}</span>
                  <span className="shrink-0 text-xs font-semibold underline-offset-2 group-hover:underline">More →</span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-body-sm leading-relaxed text-leaf-800">
        Open a card to read what that person told us, and what we changed because of it. Their names open the same card
        wherever they come up on this page.
      </p>

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
        <p className="mt-4 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{inline(source)}</p>
      )}
    </section>
  )
}
