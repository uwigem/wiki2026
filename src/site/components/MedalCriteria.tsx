import { MEDAL_H, MEDAL_ROWS, MEDAL_TONES, MEDAL_W, type MedalTier } from '../content/medals'
import { inline } from './RichText'

/**
 * One medal tier, and the criteria claimed under it.
 *
 * A judge arrives wanting two things: what iGEM asked for, and where on this
 * wiki to see it. So each row is exactly that pair, and every claim carries a
 * link to the page that evidences it rather than asking anyone to go looking.
 *
 * The medal is drawn rather than written, in the same pixel idiom as the rest
 * of the site, so the three tiers are told apart at a glance before any of the
 * text is read.
 */
export interface MedalCriterion {
  /** The criterion's name, as iGEM writes it. */
  title: string
  /** What iGEM asks for. */
  asks: string
  /** How we met it. Inline links work, and are the point. */
  met: string
}

const cache = new Map<MedalTier, string>()

function medalURL(tier: MedalTier): string {
  const hit = cache.get(tier)
  if (hit) return hit
  const tones = MEDAL_TONES[tier]
  const canvas = document.createElement('canvas')
  canvas.width = MEDAL_W
  canvas.height = MEDAL_H
  const ctx = canvas.getContext('2d')!
  MEDAL_ROWS.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const tone = tones[row[x]]
      if (!tone) continue
      ctx.fillStyle = tone
      ctx.fillRect(x, y, 1, 1)
    }
  })
  const url = canvas.toDataURL()
  cache.set(tier, url)
  return url
}

export default function MedalCriteria({
  tier,
  intro,
  items,
}: {
  tier: MedalTier
  intro?: string
  items: MedalCriterion[]
}) {
  return (
    <section className="min-w-0">
      <div className="flex items-center gap-4">
        <img
          src={medalURL(tier)}
          alt=""
          aria-hidden
          width={MEDAL_W * 4}
          height={MEDAL_H * 4}
          draggable={false}
          className="pixelated select-none shrink-0"
        />
        <div className="min-w-0">
          <p className="kicker">{tier} medal</p>
          <p className="text-body-sm leading-relaxed text-leaf-800">
            {items.length} {items.length === 1 ? 'criterion' : 'criteria'}
          </p>
        </div>
      </div>

      {intro && <p className="mt-3 text-body leading-relaxed">{inline(intro)}</p>}

      <ol className="mt-4 flex flex-col gap-3">
        {items.map((it, i) => (
          <li key={it.title} className="rounded-sm border-[3px] border-leaf-300 bg-leaf-50 px-4 py-3">
            <div className="flex items-baseline gap-2">
              <span className="badge shrink-0">{i + 1}</span>
              <h3 className="text-base font-semibold leading-snug">{it.title}</h3>
            </div>
            <p className="mt-1.5 text-body-sm leading-relaxed text-leaf-800">{inline(it.asks)}</p>
            <p className="mt-2 border-l-[3px] border-petal-daisy pl-3 text-body-sm leading-relaxed">
              {inline(it.met)}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
