import { inline } from './RichText'

/**
 * A content card, used by the `cards` and `steps` blocks.
 *
 * Unadorned on purpose: the garden showing between the cards is the decoration,
 * so the cards themselves stay quiet.
 */
export default function FlowerBedCard({
  title,
  body,
  note,
  step,
}: {
  title: string
  body: string
  note?: string
  /** Renders a numbered marker before the title. Used by the `steps` block. */
  step?: number
}) {
  return (
    <article className="panel flex h-full flex-col gap-2 px-5 py-5">
      <div className="flex items-baseline gap-2">
        {step !== undefined && <span className="badge">{step}</span>}
        <h3 className="text-lg">{title}</h3>
      </div>
      <p className="text-body leading-relaxed">{inline(body)}</p>
      {note && <p className="mt-1 text-note text-leaf-800">{note}</p>}
    </article>
  )
}
