import { TEAM_LOGO, logoPath } from '../content/teamLogo'

/**
 * The team logo, drawn as an inline SVG from its pixel data.
 *
 * One path, built once, scaled by the browser. At the small sizes the logo is
 * mostly shown at (the nav, the tab icon) it is drawn antialiased, which blends
 * neighbouring pixels the way an eye does from a distance. `crisp` switches to
 * hard pixel edges, which only looks right when each logo pixel lands on a
 * whole number of screen pixels.
 */

const PATH = logoPath()
const FILL = '#' + TEAM_LOGO.ink

interface Props {
  /** Rendered height in CSS pixels. Width follows the logo's proportions. */
  height: number
  /** Describes the logo. Leave out where it sits beside the team name and is decoration. */
  title?: string
  /** Hard pixel edges. Use only at whole-number multiples of the logo's size. */
  crisp?: boolean
  className?: string
}

export default function TeamLogo({ height, title, crisp = false, className }: Props) {
  const width = (height * TEAM_LOGO.width) / TEAM_LOGO.height
  return (
    <svg
      viewBox={`0 0 ${TEAM_LOGO.width} ${TEAM_LOGO.height}`}
      width={width}
      height={height}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      shapeRendering={crisp ? 'crispEdges' : 'geometricPrecision'}
      className={'block shrink-0 ' + (className ?? '')}
    >
      <path fill={FILL} d={PATH} />
    </svg>
  )
}
