import { NAV, activeGroup } from '../content/nav'
import { Link } from '../router'

/**
 * The row of gates at the foot of every page: one card per part of the site,
 * so a reader who has finished a page always has somewhere to go, and a judge
 * can reach any section from anywhere without using the nav.
 *
 * One simple pixel glyph each, drawn here rather than taken from the engine:
 * the engine's sprites are plants and creatures, and these have to say
 * "experiments" and "model". They are single colour on purpose. Each is a
 * grid of characters, turned into runs of rectangles, so they stay crisp at
 * any size and cost a handful of DOM nodes.
 */

interface Section {
  /** Matches a group's `to` in nav.ts, which is how the current one is found. */
  to: string
  label: string
  /** A few words, so the card says what is behind it. */
  blurb: string
  colour: string
  icon: string[]
}

/**
 * The balance from the team's own mark: the project's one idea, that the
 * amount of a protein can be set rather than switched off. A plant was the
 * obvious choice here and the wrong one, because everything else on this site
 * is already a plant, and at this size a pot and a flower read as a chess
 * piece.
 */
const BALANCE = [
  '.....##.....',
  '.##########.',
  '.#...##...#.',
  '.#...##...#.',
  '###..##..###',
  '.#...##...#.',
  '.....##.....',
  '.....##.....',
  '.....##.....',
  '....####....',
  '..########..',
  '............',
]

/** A flask with something in it: the bench. */
const FLASK = [
  '...######...',
  '....#..#....',
  '....#..#....',
  '....#..#....',
  '...#....#...',
  '..#......#..',
  '.#........#.',
  '.#.######.#.',
  '.#.######.#.',
  '.##########.',
  '..########..',
  '............',
]

/**
 * A protein helix: four turns of the coil, each one a step further to the
 * right, so it reads as a spiral going away from you. Drawn as whole turns
 * rather than a front strand with the back hidden, because at this size a
 * hidden back strand just looks like a ladder.
 */
const HELIX = [
  '.######.....',
  '##....##....',
  '.######.....',
  '..######....',
  '.##....##...',
  '..######....',
  '...######...',
  '..##....##..',
  '...######...',
  '....######..',
  '...##....##.',
  '....######..',
]

/** Two people facing each other: human practices. */
const PEOPLE = [
  '............',
  '..##....##..',
  '..##....##..',
  '............',
  '.####..####.',
  '#####..#####',
  '#####..#####',
  '.####..####.',
  '..##....##..',
  '..##....##..',
  '............',
  '............',
]

/** A signpost, like the ones on the pages: the team and the paperwork. */
const SIGNPOST = [
  '............',
  '.#########..',
  '.#########..',
  '.#########..',
  '.....##.....',
  '..#########.',
  '..#########.',
  '..#########.',
  '.....##.....',
  '.....##.....',
  '...######...',
  '............',
]

/**
 * The playground is deliberately not here. It is the team's own toy and is not
 * expected to ship, so it is not offered as a part of the project to explore.
 */
const SECTIONS: Section[] = [
  { to: '/project/description', label: 'Project', blurb: 'the idea and the build', colour: 'var(--p-stem)', icon: BALANCE },
  { to: '/wetlab/experiments', label: 'Wetlab', blurb: 'experiments and parts', colour: 'var(--p-waterDeep)', icon: FLASK },
  { to: '/drylab/model', label: 'Drylab', blurb: 'the model', colour: 'var(--p-lilacPetal)', icon: HELIX },
  { to: '/human-practices/integrated', label: 'Human Practices', blurb: 'who shaped it', colour: 'var(--p-pinkDark)', icon: PEOPLE },
  { to: '/team/contribution', label: 'Team and Resources', blurb: 'people and paperwork', colour: 'var(--p-spikeMid)', icon: SIGNPOST },
]

/** Horizontal runs of set pixels in a row, as [start, length]. */
function runs(row: string): [number, number][] {
  const out: [number, number][] = []
  let start = -1
  for (let x = 0; x <= row.length; x++) {
    const on = row[x] === '#'
    if (on && start < 0) start = x
    if (!on && start >= 0) {
      out.push([start, x - start])
      start = -1
    }
  }
  return out
}

function PixelIcon({ rows, small = false }: { rows: string[]; small?: boolean }) {
  const w = rows[0].length
  return (
    <svg
      viewBox={`0 0 ${w} ${rows.length}`}
      className={small ? 'h-8 w-8 shrink-0' : 'h-10 w-10 shrink-0'}
      shapeRendering="crispEdges"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {rows.flatMap((row, y) =>
        runs(row).map(([x, len]) => <rect key={`${y}-${x}`} x={x} y={y} width={len} height={1} />),
      )}
    </svg>
  )
}

/**
 * `compact` is the homepage's closing screen, where the cards share the sky
 * with the logo, the name and the line above the garden: icons and names only,
 * one row on a laptop, three and two on a phone.
 */
export default function ExploreCards({ path, compact = false }: { path: string; compact?: boolean }) {
  const here = activeGroup(path)
  // A group's own address, so the card for the section you are in lights up
  // whichever page of it you are on.
  const currentTo = here && NAV.some((g) => g.to === here.to) ? here.to : null

  if (compact)
    return (
      <nav aria-labelledby="explore-heading" className="mx-auto w-full max-w-3xl">
        <h2 id="explore-heading" className="kicker">
          Explore the garden
        </h2>
        <ul className="mt-2 flex flex-wrap justify-center gap-2 sm:gap-3">
          {SECTIONS.map((s) => (
            <li key={s.to} className="w-[calc((100%-1rem)/3)] sm:w-32">
              <Link to={s.to} className="explore-card flex h-full flex-col items-center gap-1.5 px-2 py-3 text-center">
                <span style={{ color: s.colour }}>
                  <PixelIcon rows={s.icon} small />
                </span>
                <span className="pixel text-xs leading-tight sm:text-sm">{s.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    )

  return (
    <section aria-labelledby="explore-heading" className="mx-auto w-full max-w-6xl px-4 pb-12 pt-4 sm:px-6">
      <div className="text-center">
        <p className="kicker">keep walking</p>
        <h2 id="explore-heading" className="mt-1 text-2xl sm:text-3xl">
          Explore the garden
        </h2>
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {SECTIONS.map((s) => {
          const current = s.to === currentTo
          return (
            <li key={s.to}>
              <Link
                to={s.to}
                current={current && 'section'}
                className="explore-card flex h-full flex-col items-center gap-2 px-3 py-4 text-center"
              >
                <span style={{ color: s.colour }}>
                  <PixelIcon rows={s.icon} />
                </span>
                <span className="pixel text-sm leading-tight">{s.label}</span>
                <span className="text-note leading-snug text-leaf-800">{s.blurb}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
