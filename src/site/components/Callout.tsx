import RichText, { inline } from './RichText'

/**
 * A boxed statement: the team's own system in one paragraph, or the founder's
 * theory. The daisy border is what sets it apart from the cream reading
 * panels around it, so a reader skimming the page sees where the argument
 * lands.
 */
export default function Callout({
  heading,
  label,
  body,
  source,
}: {
  heading?: string
  /** Small pixel label above the heading, for example "our system". */
  label?: string
  body: string[]
  source?: string
}) {
  return (
    <section className="keep-frame panel border-petal-daisy px-5 py-5 sm:px-7 sm:py-6">
      {label && <p className="kicker">{label}</p>}
      {heading && <h2 className="mt-1 text-xl">{heading}</h2>}
      <div className="prose-garden mt-3 text-body">
        <RichText paragraphs={body} />
      </div>
      {source && (
        <p className="mt-4 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{inline(source)}</p>
      )}
    </section>
  )
}
