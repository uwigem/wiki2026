import { inline } from './RichText'

/**
 * A funnel: how many candidates survive each filter.
 *
 * Bars are centred and stacked, so the taper reads as a funnel without drawing
 * one. Each stage also states what share of the PREVIOUS stage got through,
 * which is the number that actually says how harsh a filter was. A stage that
 * keeps one design in forty is doing something very different from one that
 * keeps nine in ten, and the absolute counts alone hide that.
 *
 * **Widths are square-rooted, and the caption says so.** The first stage is
 * over two hundred times the last. On a linear scale the last bar is under
 * half a pixel and the reader sees nothing; on a logarithmic one it comes out
 * at well over a third of the width, which flatters the result by making a
 * brutal filter look gentle. A square root sits between the two: still
 * compressed, but the drop is unmistakable. Any compressed axis is a claim
 * about shape, so it is labelled rather than left for the reader to assume.
 */

export interface FunnelStage {
  label: string
  count: number
  /** What this stage filtered on. */
  note?: string
}

interface Props {
  heading?: string
  intro?: string
  stages: FunnelStage[]
  /** A target to mark alongside the outcome, for example how many we want to order. */
  goal?: { label: string; count: number }
  footnote?: string
  source?: string
}

const fmt = (n: number) => n.toLocaleString('en-GB')

export default function FunnelChart({ heading, intro, stages, goal, footnote, source }: Props) {
  const top = Math.max(...stages.map((s) => s.count), 1)
  const width = (n: number) => Math.max(8, (Math.sqrt(n) / Math.sqrt(top)) * 100)

  return (
    <section className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
      {heading && <h2 className="text-xl">{heading}</h2>}
      {intro && <p className="mt-1 max-w-2xl text-body leading-relaxed">{inline(intro)}</p>}

      <ol className="mt-5 flex flex-col items-center gap-1">
        {stages.map((s, i) => {
          const prev = i > 0 ? stages[i - 1].count : null
          const share = prev ? (s.count / prev) * 100 : null
          return (
            <li key={s.label} className="flex w-full flex-col items-center">
              {share !== null && (
                <p className="numeral py-1 text-note opacity-75">
                  {share < 1 ? share.toFixed(1) : Math.round(share)}% of these got through
                </p>
              )}
              <div
                className="flex min-h-[2.6rem] items-center justify-center border-[3px] border-leaf-800 bg-petal-lilac px-3 shadow-[3px_3px_0_var(--p-shadow)]"
                style={{ width: `${width(s.count)}%` }}
              >
                <span className="numeral text-lg leading-none sm:text-xl">{fmt(s.count)}</span>
              </div>
              <p className="mt-1.5 max-w-md text-center text-body-sm leading-snug">
                {s.label}
                {s.note && <span className="block text-note opacity-75">{s.note}</span>}
              </p>
            </li>
          )
        })}
      </ol>

      {goal && (
        <div className="mt-4 flex flex-col items-center">
          <div
            className="flex min-h-[2.6rem] items-center justify-center border-[3px] border-dashed border-petal-daisy bg-leaf-50 px-3"
            style={{ width: `${width(goal.count)}%` }}
          >
            <span className="numeral text-lg leading-none">{fmt(goal.count)}</span>
          </div>
          <p className="mt-1.5 text-center text-body-sm leading-snug">{goal.label}</p>
        </div>
      )}

      <p className="mt-4 text-note">
        Bar widths are square-rooted, not linear, or the last stage would be too thin to see.
      </p>

      {footnote && <p className="mt-3 max-w-2xl text-body-sm leading-relaxed">{inline(footnote)}</p>}
      {source && (
        <p className="mt-4 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{source}</p>
      )}
    </section>
  )
}
