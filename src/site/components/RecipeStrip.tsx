import { Link } from '../router'
import ElementIcon from './alchemy/ElementIcon'
import { inline } from './RichText'

/**
 * A combination from iGEM Alchemy, shown the way the game shows it: two or
 * three things, a plus between them, and what they make.
 *
 * The game is the one piece of this page a reader can actually play, and a
 * paragraph about a game is the least persuasive thing you can write about
 * one. This borrows the game's own pictures so the idea arrives in a glance:
 * these go in, that comes out, and there is a button to go and try it.
 */
export interface RecipePart {
  /** An element id from `content/alchemy.ts`. */
  id: string
  label: string
}

function Tile({ part }: { part: RecipePart }) {
  return (
    <span className="flex w-20 flex-col items-center gap-1 text-center sm:w-24">
      <span className="rounded-sm border-[3px] border-leaf-700 bg-leaf-50 p-1.5 shadow-[3px_3px_0_var(--p-shadow)]">
        <ElementIcon id={part.id} scale={2} />
      </span>
      <span className="text-note leading-tight">{part.label}</span>
    </span>
  )
}

export default function RecipeStrip({
  heading,
  intro,
  inputs,
  makes,
  action,
  source,
}: {
  heading?: string
  intro?: string
  inputs: RecipePart[]
  makes: RecipePart
  /** The button under the strip, for example playing the game. */
  action?: { label: string; to: string }
  source?: string
}) {
  return (
    <section className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
      {heading && <h2 className="text-xl">{heading}</h2>}
      {intro && <p className="mt-1 text-body leading-relaxed">{inline(intro)}</p>}

      <div className="mt-4 flex flex-wrap items-start justify-center gap-x-3 gap-y-3 sm:gap-x-4">
        {inputs.map((part, i) => (
          <span key={part.id} className="flex items-start gap-3 sm:gap-4">
            {i > 0 && (
              <span aria-hidden className="pixel mt-5 text-xl leading-none text-leaf-700">
                +
              </span>
            )}
            <Tile part={part} />
          </span>
        ))}
        <span aria-hidden className="pixel mt-5 text-xl leading-none text-leaf-700">
          =
        </span>
        <Tile part={makes} />
      </div>

      {action && (
        <p className="mt-4 text-center">
          <Link to={action.to} className="pixel-btn pixel-btn-primary px-5 py-2.5">
            {action.label}
          </Link>
        </p>
      )}

      {source && (
        <p className="mt-4 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{inline(source)}</p>
      )}
    </section>
  )
}
