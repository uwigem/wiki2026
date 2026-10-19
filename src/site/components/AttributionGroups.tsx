import { useState, type ReactNode } from 'react'
import { CONTRIBUTIONS, roleOf, type Credit } from '../content/attributions'
import type { FlowerKind, Profile } from '../content/team'
import CreditModal from './CreditModal'
import { LogoSet } from './CreditLogo'
import PixelPerson, { looksFor } from './PixelPerson'
import PixelSprite from './PixelSprite'
import { FLOWER_SPRITE, emblemScale, tileTints } from './TeamGroup'

/**
 * The sections of the attributions page. Each is one card: its heading and a
 * line on what it holds across the top, and a tile per person or organisation
 * below, using the whole width so a large group stays a few rows tall. A tile
 * opens what that person did, or what that organisation gave us.
 */

const TILE =
  'flex h-full flex-col items-center gap-1 rounded-sm border-[3px] px-1 pb-2 pt-2 shadow-[3px_3px_0_var(--p-shadow)] transition duration-150 hover:brightness-[1.06] '

function Section({
  heading,
  blurb,
  flower,
  count,
  children,
}: {
  heading: string
  blurb?: string
  flower: FlowerKind
  count: number
  children: ReactNode
}) {
  return (
    <section className="panel overflow-hidden" aria-label={heading}>
      <div className="border-b-[3px] border-leaf-300 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="shrink-0">
            <PixelSprite sprite={FLOWER_SPRITE[flower]} scale={emblemScale(flower)} />
          </span>
          <h2 className="min-w-0 text-lg sm:text-xl">{heading}</h2>
          <span className="badge ml-auto" aria-label={`${count} entries`}>
            {count}
          </span>
        </div>
        {blurb && <p className="mt-3 text-body-sm leading-relaxed">{blurb}</p>}
      </div>
      <div className="p-4">{children}</div>
    </section>
  )
}

interface PeopleProps {
  heading: string
  blurb?: string
  flower: FlowerKind
  people: Profile[]
  /** Only names on the tiles. The opened card still gives each person's post and role. */
  nameOnly?: boolean
}

export function PeopleCredits({ heading, blurb, flower, people, nameOnly }: PeopleProps) {
  const [picked, setPicked] = useState<Profile | null>(null)
  const tints = tileTints('credit:' + heading, people.length)

  return (
    <>
      <Section heading={heading} blurb={blurb} flower={flower} count={people.length}>
        <ul className="flex flex-wrap justify-center gap-3">
          {people.map((p, i) => {
            // A student's title, else their subteams.
            const under = nameOnly ? undefined : (p.titles?.[0] ?? roleOf(p))
            return (
              <li key={p.name}>
                <button
                  type="button"
                  onClick={() => setPicked(p)}
                  className={TILE + 'w-28 ' + tints[i]}
                  aria-label={`What they did: ${p.name}`}
                >
                  {/* A fixed slot, so a taller character (curly hair) does not push
                      their name below the rest of the row. */}
                  <span className="flex h-20 items-end justify-center">
                    <PixelPerson traits={looksFor(p)} scale={4} />
                  </span>
                  <span className="pixel text-center text-tag leading-tight text-leaf-950">{p.name}</span>
                  {under && <span className="text-center text-note leading-tight text-leaf-800">{under}</span>}
                </button>
              </li>
            )
          })}
        </ul>
      </Section>
      {picked && (
        <CreditModal
          subject={{
            kind: 'person',
            person: picked,
            kicker: roleOf(picked),
            contributions: CONTRIBUTIONS[picked.name] ?? [],
          }}
          onClose={() => setPicked(null)}
        />
      )}
    </>
  )
}

/** One labelled set of organisations or tools inside a credits section. */
export interface CreditSet {
  /** Shown over the set's tiles, and over a name in the opened card. */
  label: string
  items: Credit[]
}

interface CreditProps {
  heading: string
  blurb?: string
  flower: FlowerKind
  sets: CreditSet[]
}

/**
 * Organisations and software, as tiles holding their logos, the way a
 * person's tile holds their pixel character.
 */
export function CreditGroup({ heading, blurb, flower, sets }: CreditProps) {
  const [picked, setPicked] = useState<{ credit: Credit; label: string } | null>(null)
  const count = sets.reduce((n, s) => n + s.items.length, 0)

  return (
    <>
      <Section heading={heading} blurb={blurb} flower={flower} count={count}>
        <div className="flex flex-col gap-5">
          {sets.map((set) => {
            const tints = tileTints('credit:' + set.label, set.items.length)
            return (
              <div key={set.label}>
                <h3 className="kicker mb-3 text-center">{set.label}</h3>
                {/* Three across (two on a phone), sized to the tiles and centred,
                    so a set of six sits as two even rows. */}
                <ul className="grid grid-cols-[repeat(2,auto)] justify-center gap-3 sm:grid-cols-[repeat(3,auto)]">
                  {set.items.map((c, i) => (
                    <li key={c.name}>
                      <button
                        type="button"
                        onClick={() => setPicked({ credit: c, label: set.label })}
                        className={TILE + 'w-36 ' + tints[i]}
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
            )
          })}
        </div>
      </Section>
      {picked && (
        <CreditModal
          subject={{ kind: 'credit', credit: picked.credit, kicker: picked.label.toLowerCase() }}
          onClose={() => setPicked(null)}
        />
      )}
    </>
  )
}
