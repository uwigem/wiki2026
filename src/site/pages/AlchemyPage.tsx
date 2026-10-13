import { LEVELS, reachable } from '../content/alchemy'
import ElementIcon from '../components/alchemy/ElementIcon'
import Workbench from '../components/alchemy/Workbench'
import { useAlchemy, type Alchemy } from '../components/alchemy/useAlchemy'
import GardenSection from '../components/GardenSection'
import PixelSign from '../components/PixelSign'

/**
 * iGEM Alchemy, the Education subteam's combination game. A page like the
 * others, with the story of the four levels across the top and the bench
 * underneath. The game itself is in `content/alchemy.ts`.
 */
export default function AlchemyPage() {
  const game = useAlchemy()

  return (
    <article>
      {/* Everything above the bench is kept short, so the whole game is on
          screen when the page opens: the sign, the four levels, the bench.
          The hedgehog on the bench says what the game is about. */}
      <GardenSection className="pb-10 pt-4 sm:pt-5">
        <div className="mx-auto flex max-w-5xl flex-col gap-3">
          <div className="flex justify-center">
            <PixelSign posts={false}>
              <p className="pixel text-tag tracking-[0.2em]">washington igem · hedgehogsense</p>
              <h1 className="mt-1 text-2xl sm:text-3xl">iGEM Alchemy</h1>
            </PixelSign>
          </div>
          <Story game={game} />
          <Workbench game={game} />
        </div>
      </GardenSection>
    </article>
  )
}

/** The four levels, left to right. Any of them can be opened. */
function Story({ game }: { game: Alchemy }) {
  return (
    <nav aria-label="Levels">
      <ol className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {LEVELS.map((l, i) => {
          const current = l.id === game.level.id
          const finished = game.doneLevels.has(l.id)
          const own = reachable(l)
          const n = game.foundIn(l.id).filter((id) => own.includes(id)).length
          return (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => game.setLevel(l.id)}
                aria-current={current ? 'step' : undefined}
                className="alc-level flex h-full w-full items-start gap-2 px-2.5 py-1.5 text-left"
              >
                <ElementIcon id={l.goals[0]} className={finished || current ? 'mt-0.5' : 'mt-0.5 opacity-60'} />
                <span className="min-w-0">
                  <span className="pixel flex items-center gap-1 text-xs text-leaf-800">
                    level {i + 1}
                    {finished ? (
                      <span className="rounded-sm bg-leaf-700 px-1 text-[11px] text-leaf-50">✓ done</span>
                    ) : n > 0 ? (
                      ` · ${n} found`
                    ) : (
                      ''
                    )}
                  </span>
                  <span className="block text-sm font-semibold leading-tight">{l.name}</span>
                  <span className="mt-0.5 hidden text-xs leading-snug text-leaf-800 lg:block">{l.tagline}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
