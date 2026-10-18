import { FERN } from '../../engine/sprites'
import type { Investigator } from '../content/team'
import PixelPerson, { looksFor } from './PixelPerson'
import PixelSprite from './PixelSprite'

/**
 * The principal investigators, at the top of the team page.
 *
 * Deliberately the same thing as a `TeamGroup`: the group's name on the left,
 * a tile per person on the right, and the tile opens their profile. The only
 * difference is that a tile carries their post under their name, because two
 * names with no context at the head of the page say nothing. The photograph
 * appears in the profile the tile opens, never on the tile itself.
 */
export default function InvestigatorCards({
  people,
  onPick,
}: {
  people: Investigator[]
  onPick: (person: Investigator) => void
}) {
  return (
    <section className="panel overflow-hidden" aria-label="Principal investigators">
      <div className="flex flex-col sm:flex-row">
        <div className="shrink-0 border-b-[3px] border-leaf-300 px-5 py-4 sm:w-64 sm:border-b-0 sm:border-r-[3px]">
          <div className="flex items-start gap-3">
            <span className="shrink-0">
              <PixelSprite sprite={FERN} scale={3} />
            </span>
            <h2 className="min-w-0 text-lg sm:text-xl">Principal Investigators</h2>
            <span className="badge ml-auto" aria-label={`${people.length} people`}>
              {people.length}
            </span>
          </div>
          <p className="mt-3 text-body-sm leading-relaxed">
            The faculty who advise the project and host the work.
          </p>
        </div>

        <div className="flex-1 p-4">
          <ul className="flex flex-wrap justify-center gap-3 sm:justify-start">
            {people.map((p) => (
              <li key={p.name}>
                <button
                  type="button"
                  onClick={() => onPick(p)}
                  className="flex h-full w-40 flex-col items-center gap-1 rounded-sm border-[3px] border-petal-daisy bg-petal-cream/60 px-2 pb-2 pt-2 shadow-[3px_3px_0_var(--p-shadow)] transition duration-150 hover:brightness-[1.06]"
                  aria-label={`Open profile: ${p.name}`}
                >
                  {/* The pixel character, always, exactly as on a student tile.
                      The photograph belongs inside the profile, not out here. */}
                  <span className="flex h-20 items-end justify-center">
                    <PixelPerson traits={looksFor(p)} scale={4} />
                  </span>
                  <span className="pixel text-center text-tag leading-tight text-leaf-950">{p.name}</span>
                  <span className="text-center text-note leading-tight text-leaf-800">{p.titles[0]}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
