import { useState } from 'react'
import { Link } from '../router'
import { inline } from './RichText'

/**
 * A yes/no decision tree a reader walks through one question at a time.
 *
 * The Human Practices team drew this as a flowchart ("is our platform right
 * for your project?"). The drawing stays on the page as the overview; this is
 * the same chart as something a visitor can actually answer, with the pink
 * boxes from the drawing as real buttons. Each answer is kept as a crumb so
 * the path taken is visible and any step can be undone.
 */
export interface TreeNode {
  id: string
  text: string
  /** The answers from this node, in display order. A node with none is an outcome. */
  answers?: { label: string; to: string }[]
  /** For an outcome: the button the team wants under it. */
  action?: { label: string; to: string }
  /** An outcome that says another tool is the better fit. */
  stop?: boolean
}

export default function DecisionTree({
  heading,
  intro,
  start,
  nodes,
  source,
}: {
  heading?: string
  intro?: string
  start: string
  nodes: TreeNode[]
  source?: string
}) {
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const [path, setPath] = useState<{ node: string; answer: string }[]>([])
  const currentId = path.length ? path[path.length - 1].answer : start
  const current = byId.get(currentId) ?? byId.get(start)!

  const choose = (label: string, to: string) => setPath((p) => [...p, { node: current.id, answer: to }].map((c) => ({ ...c, label })))
  const back = (i: number) => setPath((p) => p.slice(0, i))

  return (
    <section className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
      {heading && <h2 className="text-xl">{heading}</h2>}
      {intro && <p className="mt-1 max-w-2xl text-body leading-relaxed">{inline(intro)}</p>}

      {path.length > 0 && (
        <ol className="mt-4 flex flex-wrap items-center gap-1.5 text-xs" aria-label="Your answers so far">
          {path.map((crumb, i) => {
            const q = byId.get(crumb.node)
            const a = q?.answers?.find((x) => x.to === crumb.answer)
            return (
              <li key={i} className="flex items-center gap-1.5">
                <button type="button" onClick={() => back(i)} className="pixel-btn py-0.5 text-[0.7rem]" title="Go back to this question">
                  {a?.label ?? '…'}
                </button>
                <span aria-hidden className="text-leaf-800">
                  →
                </span>
              </li>
            )
          })}
        </ol>
      )}

      <div className="panel-flat mt-4 px-5 py-4" aria-live="polite">
        {current.answers ? (
          <>
            <p className="kicker">question {path.length + 1}</p>
            <p className="mt-1 text-lg leading-snug">{inline(current.text)}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {current.answers.map((a) => (
                <button key={a.to} type="button" onClick={() => choose(a.label, a.to)} className="pixel-btn">
                  {a.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="kicker">{current.stop ? 'probably not for you' : 'where to go'}</p>
            <p className="mt-1 text-lg leading-snug">{inline(current.text)}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {current.action && (
                <Link to={current.action.to} className="pixel-btn pixel-btn-primary">
                  {current.action.label}
                </Link>
              )}
              <button type="button" onClick={() => setPath([])} className="pixel-btn">
                Start again
              </button>
            </div>
          </>
        )}
      </div>

      {source && (
        <p className="mt-4 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{source}</p>
      )}
    </section>
  )
}
