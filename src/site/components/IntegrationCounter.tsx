import type { Stat } from './StatRow'
import PixelSprite from './PixelSprite'
import { SPROUT } from './railArt'
import { ICON_GROUP, ICON_LIST, ICON_TALK, numeral } from './gardenArt'
import type { Palette } from '../../engine/palette'
import type { Sprite } from '../../engine/sprites'
import { SITE_PALETTE } from '../theme'

/**
 * The integration counter at the top of Human Practices. Each figure is a
 * pixel numeral with a small picture of what it counts; the emphasised figure
 * keeps the green box, with a sprout for each requirement.
 *
 * The numerals are sprites rather than the pixel typeface, whose 5 reads as
 * an S at this size.
 */

interface Props {
  heading?: string
  items: Stat[]
}

/** Pictures for the figures, in order. */
const ICONS: { sprite: Sprite; scale: number }[] = [
  { sprite: ICON_TALK, scale: 4 },
  { sprite: ICON_GROUP, scale: 3 },
  { sprite: ICON_LIST, scale: 4 },
]

/** The sprite alphabet's ink, `e`, drawn in the site's text colour. */
const INK: Palette = { ...SITE_PALETTE, eye: SITE_PALETTE.shadow }

const GREEN_BOX = 'border-[3px] border-leaf-700 bg-leaf-200 shadow-[3px_3px_0_var(--p-shadow)]'
const LABEL = 'pixel mt-3 block text-base leading-snug sm:text-lg'

const drawn = new Map<string, Sprite>()

function Figure({ value }: { value: string }) {
  if (!drawn.has(value)) drawn.set(value, numeral(value))
  return <PixelSprite sprite={drawn.get(value)!} scale={6} palette={INK} alt={value} className="block" />
}

function Sprouts({ n }: { n: number }) {
  return (
    <span aria-hidden className="-mx-5 mt-auto flex h-8 items-end gap-2 border-b-[3px] border-leaf-400 bg-leaf-300 px-5 pb-1">
      {Array.from({ length: n }, (_, i) => (
        <PixelSprite key={i} sprite={SPROUT} scale={3} className="shrink-0" />
      ))}
    </span>
  )
}

export default function IntegrationCounter({ heading, items }: Props) {
  return (
    <section className="panel px-5 py-5 sm:px-7 sm:py-6">
      {heading && <h2 className="text-xl">{heading}</h2>}
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((s, i) => {
          const icon = ICONS[i]
          return (
            <li key={s.label} className={'flex flex-col px-5 pt-4 ' + (s.emphasis ? GREEN_BOX : 'panel-flat pb-4')}>
              <span className="flex items-center justify-between gap-3">
                <Figure value={s.value} />
                {!s.emphasis && icon && (
                  <PixelSprite sprite={icon.sprite} scale={icon.scale} palette={INK} className="shrink-0" />
                )}
              </span>
              <span className={LABEL + (s.emphasis ? ' mb-4' : '')}>{s.label}</span>
              {s.emphasis && <Sprouts n={Number(s.value) || 0} />}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
