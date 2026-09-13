import {
  BERRY_BUSH,
  BLUEBELL,
  DAISY,
  FERN,
  HEART_PLANT,
  LILAC,
  PINK_BELL,
  TREE,
  WHITE_FLOWER,
  type Sprite,
} from '../../engine/sprites'
import { hashStr, mulberry32 } from '../rng'
import type { FlowerKind, Member, Subteam } from '../content/team'
import PixelPerson, { looksFor } from './PixelPerson'
import PixelSprite from './PixelSprite'

/**
 * A subteam, as one card: its name and description sit in the left corner, and
 * every member is a colour-plot on the right holding their pixel-art character.
 * Click a plot to open that person's profile, with their photo if we have one.
 */

/** The subteam's emblem, shown once beside its name. */
export const FLOWER_SPRITE: Record<FlowerKind, Sprite> = {
  lilac: LILAC,
  bluebell: BLUEBELL,
  white: WHITE_FLOWER,
  daisy: DAISY,
  pink: PINK_BELL,
  heart: HEART_PLANT,
  fern: FERN,
  berry: BERRY_BUSH,
  tree: TREE,
}

/** The plot colours a member can get. Shuffled per subteam by `plotTints`, so a
 *  bed reads as a planted row rather than a grid of one colour. */
const TILE_TINTS = [
  'bg-petal-lilac/40 border-petal-lilac',
  'bg-petal-pink/40 border-petal-pink',
  'bg-petal-blue/40 border-petal-blue',
  'bg-petal-daisy/45 border-petal-daisy',
  'bg-petal-cream/60 border-petal-daisy',
  'bg-pool-200/55 border-pool-400',
  'bg-leaf-200 border-leaf-600',
]

/** One plot colour per member, the palette shuffled per subteam so neighbouring
 *  plots differ and each card gets a varied spread. */
function plotTints(subteam: Subteam): string[] {
  const rng = mulberry32(hashStr('plot:' + subteam.id))
  const bag = [...TILE_TINTS]
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[bag[i], bag[j]] = [bag[j], bag[i]]
  }
  return subteam.members.map((_, i) => bag[i % bag.length])
}

/**
 * The people are real <button>s labelled with the member's name, so the card is
 * an ordinary keyboard-navigable list of people with the garden layered on top.
 */
export default function TeamFlowerPatch({
  subteam,
  onPick,
}: {
  subteam: Subteam
  onPick: (member: Member, subteam: Subteam) => void
}) {
  const emblem = FLOWER_SPRITE[subteam.flower]
  const tints = plotTints(subteam)

  return (
    <section className="panel overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* left corner: the subteam's name and description */}
        <div className="shrink-0 border-b-[3px] border-leaf-300 px-5 py-4 sm:w-64 sm:border-b-0 sm:border-r-[3px]">
          <div className="flex items-start gap-3">
            <span className="shrink-0">
              <PixelSprite sprite={emblem} scale={subteam.flower === 'tree' ? 2 : 3} />
            </span>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl">{subteam.name}</h2>
              <p className="pixel text-note tracking-wide text-leaf-800">{subteam.tagline}</p>
            </div>
            <span className="badge ml-auto" aria-label={`${subteam.members.length} members`}>
              {subteam.members.length}
            </span>
          </div>
          <p className="mt-3 text-body-sm leading-relaxed">{subteam.blurb}</p>
        </div>

        {/* the people: one colour-plot each, holding their pixel-art character */}
        <div className="flex-1 p-4">
          <ul className="flex flex-wrap justify-center gap-3 sm:justify-start">
            {subteam.members.map((m, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => onPick(m, subteam)}
                  className={
                    'flower-marker group flex w-28 flex-col items-center gap-1 rounded-sm border-[3px] px-1 pb-2 pt-2 shadow-[3px_3px_0_var(--p-shadow)] transition duration-150 hover:brightness-[1.06] ' +
                    tints[i]
                  }
                  aria-label={`Open profile: ${m.name}${m.role ? `, ${m.role}` : ''}`}
                >
                  <PixelPerson traits={looksFor(m)} scale={4} />
                  <span className="pixel text-center text-tag leading-tight text-leaf-950">{m.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
