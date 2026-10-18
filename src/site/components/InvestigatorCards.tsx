import { FERN } from '../../engine/sprites'
import type { Investigator } from '../content/team'
import { asset } from '../router'
import PixelPerson, { looksFor } from './PixelPerson'
import PixelSprite from './PixelSprite'

/**
 * The principal investigators, at the top of the team page.
 *
 * Built like a `TeamGroup` so it sits in the same column of cards: the group's
 * name on the left, the people on the right. The difference is that there are
 * only two of them and their bios are the reason the section exists, so each
 * one is a card with the bio already open rather than a tile that has to be
 * clicked. Nothing here opens a modal.
 */
export default function InvestigatorCards({ people }: { people: Investigator[] }) {
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
          <ul className="flex flex-col gap-3">
            {people.map((p) => (
              <li
                key={p.name}
                className="flex flex-col items-center gap-4 rounded-sm border-[3px] border-leaf-300 bg-leaf-100/70 p-4 sm:flex-row sm:items-start"
              >
                <span className="flex h-24 w-24 shrink-0 items-end justify-center overflow-hidden rounded-sm border-[3px] border-leaf-400 bg-petal-cream/70">
                  {p.photo ? (
                    <img src={asset(p.photo)} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <PixelPerson traits={looksFor(p)} scale={5} />
                  )}
                </span>
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <h3 className="text-base text-leaf-950 sm:text-lg">{p.name}</h3>
                  <p className="kicker mt-1 normal-case">{p.title}</p>
                  <p className="mt-2.5 text-body-sm leading-relaxed">{p.bio}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
