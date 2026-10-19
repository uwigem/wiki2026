import { useState } from 'react'
import { CONTRIBUTIONS, type Credit } from '../content/attributions'
import { SUBTEAM_NAME, type FlowerKind, type Investigator, type Profile, type SubteamId } from '../content/team'
import CreditModal, { type CreditSubject } from './CreditModal'
import { LogoSet } from './CreditLogo'
import InvestigatorCards from './InvestigatorCards'
import PixelSprite from './PixelSprite'
import TeamGroup, { FLOWER_SPRITE, emblemScale, tileTints } from './TeamGroup'

/**
 * The groups on the attributions page. They are the team page's own cards, so
 * the two pages look alike, but a card here opens what that person or
 * organisation did rather than their profile.
 */

interface PeopleProps {
  heading: string
  blurb?: string
  flower: FlowerKind
  people: Profile[]
  /** Tag the people who lead this subteam. */
  subteam?: SubteamId
  /** Wider cards with each person's post under their name, as for the investigators. */
  titled?: boolean
  /** The small label over a name in the dialog. Without one, the person's subteams. */
  kicker?: string
}

export function PeopleCredits({ heading, blurb, flower, people, subteam, titled, kicker }: PeopleProps) {
  const [picked, setPicked] = useState<Profile | null>(null)
  const subject: CreditSubject | null = picked && {
    kind: 'person',
    person: picked,
    kicker: kicker ?? (picked.subteams ?? []).map((id) => SUBTEAM_NAME[id]).join(' · '),
    contributions: CONTRIBUTIONS[picked.name] ?? [],
  }

  return (
    <>
      {titled ? (
        <InvestigatorCards
          heading={heading}
          blurb={blurb}
          flower={flower}
          // A titled card prints a post under the name and opens with a bio,
          // so a person missing either still gets an empty one, not a crash.
          people={people.map((p): Investigator => ({ ...p, titles: p.titles ?? [], bio: p.bio ?? '' }))}
          onPick={setPicked}
          openLabel="What they did"
        />
      ) : (
        <TeamGroup
          id={'credit:' + heading}
          heading={heading}
          blurb={blurb}
          flower={flower}
          people={people}
          subteam={subteam}
          onPick={setPicked}
          openLabel="What they did"
        />
      )}
      {subject && <CreditModal subject={subject} onClose={() => setPicked(null)} />}
    </>
  )
}

interface CreditProps {
  heading: string
  blurb?: string
  flower: FlowerKind
  items: Credit[]
  /** The small label over a name in the dialog. */
  kicker: string
}

/**
 * Organisations or software, as a group card: a tile per item holding its
 * logo, the way a person's tile holds their pixel character.
 */
export function CreditGroup({ heading, blurb, flower, items, kicker }: CreditProps) {
  const [picked, setPicked] = useState<Credit | null>(null)
  const tints = tileTints('credit:' + heading, items.length)

  return (
    <>
      <section className="panel overflow-hidden" aria-label={heading}>
        <div className="flex flex-col sm:flex-row">
          <div className="shrink-0 border-b-[3px] border-leaf-300 px-5 py-4 sm:w-64 sm:border-b-0 sm:border-r-[3px]">
            <div className="flex items-start gap-3">
              <span className="shrink-0">
                <PixelSprite sprite={FLOWER_SPRITE[flower]} scale={emblemScale(flower)} />
              </span>
              <h2 className="min-w-0 text-lg sm:text-xl">{heading}</h2>
              <span className="badge ml-auto" aria-label={`${items.length} entries`}>
                {items.length}
              </span>
            </div>
            {blurb && <p className="mt-3 text-body-sm leading-relaxed">{blurb}</p>}
          </div>

          <div className="flex-1 p-4">
            <ul className="flex flex-wrap justify-center gap-3 sm:justify-start">
              {items.map((c, i) => (
                <li key={c.name}>
                  <button
                    type="button"
                    onClick={() => setPicked(c)}
                    className={
                      'flex h-full w-36 flex-col items-center gap-2 rounded-sm border-[3px] px-1 pb-2 pt-2 shadow-[3px_3px_0_var(--p-shadow)] transition duration-150 hover:brightness-[1.06] ' +
                      tints[i]
                    }
                    aria-label={`What it gave us: ${c.name}`}
                  >
                    {/* A fixed slot, so a wide logo and a tall one leave their
                        names on the same line. */}
                    <span className="flex h-[7.5rem] items-center justify-center">
                      <LogoSet ids={c.logos} width={128} height={120} max={3} />
                    </span>
                    <span className="pixel text-center text-tag leading-tight text-leaf-950">{c.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      {picked && <CreditModal subject={{ kind: 'credit', credit: picked, kicker }} onClose={() => setPicked(null)} />}
    </>
  )
}
