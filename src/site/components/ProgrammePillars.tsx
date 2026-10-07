import { useState } from 'react'
import { BERRY_BUSH, BIG_FLOWER, HEART_PLANT, TUFT, type Sprite } from '../../engine/sprites'
import PixelSprite from './PixelSprite'
import { inline } from './RichText'

/**
 * The outreach programme, grouped under the team's own four principles.
 *
 * "SynBio should be engaging, accessible, fun for all ages, inspiring" is the
 * framing the Education subteam wrote for itself, so the page is built on it
 * rather than on a flat list of nine events. Grouping this way makes the gap
 * each activity was built to fill the headline, which is the part that shows
 * the programme was designed rather than assembled from whatever was going on.
 *
 * Every activity leads with **who it was for** and **what was missing without
 * it**. Those two together are the argument; the description of what happens
 * is detail, so it sits underneath.
 */

export interface Activity {
  name: string
  /** Who it was built for, in the draft's own words. */
  audience: string
  /** The gap it addresses. */
  why: string
  /** What actually happens in it. */
  what: string
  /** Any attendance, cost or reach figure. Stated verbatim or left out. */
  numbers?: string
}

export interface Pillar {
  /** For example "engaging". The component supplies the "SynBio should be". */
  word: string
  activities: Activity[]
}

interface Props {
  heading?: string
  intro?: string
  pillars: Pillar[]
  source?: string
}

/** One plant per principle, in rough order of how grown it looks. */
const PLANTS: Sprite[] = [TUFT, BIG_FLOWER, HEART_PLANT, BERRY_BUSH]

export default function ProgrammePillars({ heading, intro, pillars, source }: Props) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <section className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
      {heading && <h2 className="text-xl sm:text-2xl">{heading}</h2>}
      {intro && <p className="mt-1 max-w-2xl text-body leading-relaxed">{inline(intro)}</p>}

      <div className="mt-5 flex flex-col gap-5">
        {pillars.map((p, i) => (
          <div key={p.word}>
            {/* The principle, on a sign, because it is the team's own claim
                rather than a heading we invented for them. */}
            <div className="flex items-center gap-3">
              <PixelSprite sprite={PLANTS[i % PLANTS.length]} scale={2} />
              <h3 className="text-lg sm:text-xl">
                SynBio should be <span className="underline decoration-[3px] underline-offset-4">{p.word}</span>
              </h3>
            </div>

            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {p.activities.map((a) => {
                const isOpen = open === a.name
                return (
                  <li key={a.name} className="panel-flat flex flex-col px-4 py-3">
                    <h4 className="text-base leading-tight">{a.name}</h4>
                    <p className="kicker mt-1 normal-case">for {a.audience}</p>
                    <p className="mt-2 text-body-sm leading-relaxed">{inline(a.why)}</p>

                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : a.name)}
                      className="pixel-btn mt-3 self-start py-1 text-xs"
                    >
                      {isOpen ? 'Hide what we did' : 'What we did'}
                    </button>

                    {isOpen && (
                      <>
                        <p className="mt-2 text-body-sm leading-relaxed">{inline(a.what)}</p>
                        {a.numbers && (
                          <p className="mt-2 border-l-[3px] border-petal-daisy pl-3 text-note">
                            {inline(a.numbers)}
                          </p>
                        )}
                      </>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      {source && (
        <p className="mt-5 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{source}</p>
      )}
    </section>
  )
}
