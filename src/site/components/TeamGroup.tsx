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
import type { FlowerKind, Member, SubteamId } from '../content/team'
import PixelPerson, { looksFor } from './PixelPerson'
import PixelSprite from './PixelSprite'

/**
 * One group on the team page, as a card: the group's name and description on the
 * left, and a tile per person on the right holding their pixel character. Click
 * a tile to open that person's profile.
 */

/** The group's emblem, shown once beside its name. */
const FLOWER_SPRITE: Record<FlowerKind, Sprite> = {
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

/** The tile colours a person can get. Shuffled per group by `tileTints`, so a
 *  row of tiles is not all one colour. */
const TILE_TINTS = [
  'bg-petal-lilac/40 border-petal-lilac',
  'bg-petal-pink/40 border-petal-pink',
  'bg-petal-blue/40 border-petal-blue',
  'bg-petal-daisy/45 border-petal-daisy',
  'bg-petal-cream/60 border-petal-daisy',
  'bg-pool-200/55 border-pool-400',
  'bg-leaf-200 border-leaf-600',
]

/** One tile colour per person, the palette shuffled per group so neighbouring
 *  tiles differ. */
function tileTints(id: string, count: number): string[] {
  const rng = mulberry32(hashStr('plot:' + id))
  const bag = [...TILE_TINTS]
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[bag[i], bag[j]] = [bag[j], bag[i]]
  }
  return Array.from({ length: count }, (_, i) => bag[i % bag.length])
}

interface Props {
  /** Seeds the tile colours. A subteam's id, or any fixed string. */
  id: string
  heading: string
  blurb?: string
  flower: FlowerKind
  people: Member[]
  /** Tag the people who lead this subteam. */
  subteam?: SubteamId
  onPick: (member: Member) => void
}

/**
 * The people are real <button>s labelled with the person's name, so the card is
 * an ordinary keyboard-navigable list of people.
 */
export default function TeamGroup({ id, heading, blurb, flower, people, subteam, onPick }: Props) {
  const tints = tileTints(id, people.length)

  return (
    <section className="panel overflow-hidden" aria-label={heading}>
      <div className="flex flex-col sm:flex-row">
        <div className="shrink-0 border-b-[3px] border-leaf-300 px-5 py-4 sm:w-64 sm:border-b-0 sm:border-r-[3px]">
          <div className="flex items-start gap-3">
            <span className="shrink-0">
              <PixelSprite sprite={FLOWER_SPRITE[flower]} scale={flower === 'tree' ? 2 : 3} />
            </span>
            <h2 className="min-w-0 text-lg sm:text-xl">{heading}</h2>
            <span className="badge ml-auto" aria-label={`${people.length} people`}>
              {people.length}
            </span>
          </div>
          {blurb && <p className="mt-3 text-body-sm leading-relaxed">{blurb}</p>}
        </div>

        <div className="flex-1 p-4">
          <ul className="flex flex-wrap justify-center gap-3 sm:justify-start">
            {people.map((m, i) => {
              const leadsHere = subteam !== undefined && (m.leads?.includes(subteam) ?? false)
              return (
                <li key={m.name}>
                  <button
                    type="button"
                    onClick={() => onPick(m)}
                    className={
                      'flex h-full w-28 flex-col items-center gap-1 rounded-sm border-[3px] px-1 pb-2 pt-2 shadow-[3px_3px_0_var(--p-shadow)] transition duration-150 hover:brightness-[1.06] ' +
                      tints[i]
                    }
                    aria-label={`Open profile: ${m.name}${leadsHere ? ', lead' : ''}`}
                  >
                    <PixelPerson traits={looksFor(m)} scale={4} />
                    <span className="pixel text-center text-tag leading-tight text-leaf-950">{m.name}</span>
                    {leadsHere && (
                      <span className="pixel rounded-sm bg-leaf-800 px-1.5 text-note tracking-wide text-leaf-50">
                        lead
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
