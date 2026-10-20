import { useId } from 'react'
import { SITE_PALETTE } from '../theme'
import { ink, type PaletteKey } from './chartKit'
import { inline } from './RichText'

/**
 * A wiring diagram: named species in boxes and the reactions between them as
 * arrows, the way a modelling paper draws its network.
 *
 * Positions are given by hand rather than laid out automatically. There are
 * only a handful of nodes, and the arrangement carries meaning (inputs on the
 * left, the readout in the middle, what is lost on the right), which a layout
 * engine would not keep. A diagram can carry a second arrangement for phones,
 * stacked taller and narrower, so its words stay readable instead of shrinking
 * with the whole picture.
 *
 * Drawn as SVG, so every word is real text in the site's font.
 */

export interface DiagramNode {
  id: string
  /** Lines of the label, top to bottom. */
  lines: string[]
  /** Centre, in diagram units. */
  x: number
  y: number
  /** Centre on a phone, when the diagram has a narrow arrangement. */
  nx?: number
  ny?: number
  /** Box width; worked out from the longest line when left out. */
  w?: number
  shape?: 'box' | 'circle' | 'text'
  /** `strong` is the one the reader should look at first (the model's readout); `filled` is shaded. */
  tone?: 'plain' | 'filled' | 'strong'
}

export interface DiagramEdge {
  from: string
  to: string
  label?: string
  /** A shorter wording for the phone arrangement, where the long one would not fit. */
  nLabel?: string
  dashed?: boolean
  colour?: PaletteKey
  /** Bow the arrow sideways by this many units; positive bows to the left of its direction. */
  bend?: number
  /** Bend on a phone, if different. */
  nBend?: number
  /** Which side of the arrow the label sits, looking along it. */
  labelSide?: 'left' | 'right'
  nLabelSide?: 'left' | 'right'
  /** Where along the arrow the label sits, from 0 at the start to 1 at the end. Default is the middle. */
  labelAt?: number
}

interface Props {
  heading?: string
  intro?: string
  nodes: DiagramNode[]
  edges: DiagramEdge[]
  width: number
  height: number
  /** The phone arrangement's size. Nodes without `nx`/`ny` keep their wide position. */
  narrow?: { width: number; height: number }
  /** Read out in place of the picture. */
  alt: string
  caption?: string
  source?: string
}

const FONT = 12.5
const LINE = 15
const EDGE_FONT = 11

type Pt = [number, number]

function boxSize(n: DiagramNode): [number, number] {
  if (n.shape === 'circle') return [30, 30]
  const longest = Math.max(...n.lines.map((l) => l.length))
  const w = n.w ?? Math.max(64, longest * 7.4 + (n.shape === 'text' ? 4 : 24))
  return [w, n.lines.length * LINE + (n.shape === 'text' ? 4 : 16)]
}

/** Where a ray from the node's centre towards `toward` leaves its outline. */
function exitPoint(c: Pt, size: Pt, shape: DiagramNode['shape'], toward: Pt, gap = 3): Pt {
  const dx = toward[0] - c[0]
  const dy = toward[1] - c[1]
  const len = Math.hypot(dx, dy) || 1
  if (shape === 'circle') {
    const r = size[0] / 2 + gap
    return [c[0] + (dx / len) * r, c[1] + (dy / len) * r]
  }
  const hw = size[0] / 2 + gap
  const hh = size[1] / 2 + gap
  const t = Math.min(dx === 0 ? Infinity : hw / Math.abs(dx), dy === 0 ? Infinity : hh / Math.abs(dy))
  return [c[0] + dx * t, c[1] + dy * t]
}

function Arrangement({
  nodes,
  edges,
  width,
  height,
  narrow,
  alt,
  className,
}: Pick<Props, 'nodes' | 'edges' | 'width' | 'height' | 'alt'> & { narrow: boolean; className: string }) {
  const uid = useId().replace(/:/g, '')
  const at = (n: DiagramNode): Pt => (narrow ? [n.nx ?? n.x, n.ny ?? n.y] : [n.x, n.y])
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const colours = [...new Set(edges.map((e) => e.colour ?? 'stoneDark'))]
  const bg = SITE_PALETTE.bushHi

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} role="img" aria-label={alt}>
      <defs>
        {colours.map((c) => (
          <marker
            key={c}
            id={`${uid}-${c}`}
            viewBox="0 0 10 10"
            refX={9}
            refY={5}
            markerWidth={8}
            markerHeight={8}
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0 0 L10 5 L0 10 z" fill={ink(c)} />
          </marker>
        ))}
      </defs>

      {edges.map((e, i) => {
        const a = byId.get(e.from)
        const b = byId.get(e.to)
        if (!a || !b) return null
        const p0 = at(a)
        const p2 = at(b)
        const bend = (narrow ? e.nBend ?? e.bend : e.bend) ?? 0
        const mx = (p0[0] + p2[0]) / 2
        const my = (p0[1] + p2[1]) / 2
        const dx = p2[0] - p0[0]
        const dy = p2[1] - p0[1]
        const len = Math.hypot(dx, dy) || 1
        // The left normal, looking from start to end, in screen coordinates (y down).
        const nxv = dy / len
        const nyv = -dx / len
        const c: Pt = [mx + nxv * bend * 2, my + nyv * bend * 2]
        const s = exitPoint(p0, boxSize(a), a.shape, bend ? c : p2)
        const t = exitPoint(p2, boxSize(b), b.shape, bend ? c : p0)
        const colour = ink(e.colour ?? 'stoneDark')
        const d = bend ? `M${s[0]} ${s[1]} Q${c[0]} ${c[1]} ${t[0]} ${t[1]}` : `M${s[0]} ${s[1]} L${t[0]} ${t[1]}`

        const text = (narrow ? e.nLabel ?? e.label : e.label) ?? ''
        let label = null
        if (text) {
          const u = e.labelAt ?? 0.5
          const q = (k: 0 | 1) =>
            bend ? (1 - u) ** 2 * s[k] + 2 * (1 - u) * u * c[k] + u ** 2 * t[k] : s[k] + (t[k] - s[k]) * u
          const side = (narrow ? e.nLabelSide ?? e.labelSide : e.labelSide) ?? 'left'
          const off = side === 'left' ? 9 : -9
          const lx = q(0) + nxv * off
          const ly = q(1) + nyv * off
          // Anchor the label so it grows away from the line rather than across it.
          const anchor = Math.abs(nxv) < 0.35 ? 'middle' : nxv * (side === 'left' ? 1 : -1) > 0 ? 'start' : 'end'
          const base = nyv * (side === 'left' ? 1 : -1) > 0.35 ? EDGE_FONT * 0.8 : nyv * (side === 'left' ? 1 : -1) < -0.35 ? 0 : EDGE_FONT * 0.35
          label = (
            <text
              x={lx}
              y={ly + base}
              textAnchor={anchor}
              fontSize={EDGE_FONT}
              fill={e.colour ? colour : 'currentColor'}
              stroke={bg}
              strokeWidth={4}
              strokeLinejoin="round"
              paintOrder="stroke"
            >
              {text}
            </text>
          )
        }

        return (
          <g key={i}>
            <path
              d={d}
              fill="none"
              stroke={colour}
              strokeWidth={2}
              strokeDasharray={e.dashed ? '6 4' : undefined}
              markerEnd={`url(#${uid}-${e.colour ?? 'stoneDark'})`}
            />
            {label}
          </g>
        )
      })}

      {nodes.map((n) => {
        const [x, y] = at(n)
        const [w, h] = boxSize(n)
        const top = y - ((n.lines.length - 1) * LINE) / 2
        const words = n.lines.map((l, i) => (
          <text
            key={i}
            x={x}
            y={top + i * LINE + FONT * 0.35}
            textAnchor="middle"
            fontSize={FONT}
            fill="currentColor"
            fontWeight={i === 0 && n.shape !== 'text' ? 600 : 400}
          >
            {l}
          </text>
        ))
        if (n.shape === 'text') return <g key={n.id}>{words}</g>
        const fill = n.tone === 'filled' ? SITE_PALETTE.grass4 : n.tone === 'strong' ? SITE_PALETTE.foam : bg
        const stroke = n.tone === 'strong' ? SITE_PALETTE.pinkDark : SITE_PALETTE.shadow
        return (
          <g key={n.id}>
            {n.shape === 'circle' ? (
              <circle cx={x} cy={y} r={w / 2} fill={fill} stroke={stroke} strokeWidth={2} />
            ) : (
              <rect
                x={x - w / 2}
                y={y - h / 2}
                width={w}
                height={h}
                rx={6}
                fill={fill}
                stroke={stroke}
                strokeWidth={n.tone === 'strong' ? 3 : 2}
              />
            )}
            {words}
          </g>
        )
      })}
    </svg>
  )
}

export default function NodeDiagram({ heading, intro, nodes, edges, width, height, narrow, alt, caption, source }: Props) {
  return (
    <section className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
      {heading && <h2 className="text-xl">{heading}</h2>}
      {intro && <p className="mt-1 text-body leading-relaxed">{inline(intro)}</p>}

      <figure className="m-0 mt-4 min-w-0">
        {narrow ? (
          <>
            <Arrangement
              nodes={nodes}
              edges={edges}
              width={narrow.width}
              height={narrow.height}
              narrow
              alt={alt}
              className="h-auto w-full sm:hidden"
            />
            <Arrangement
              nodes={nodes}
              edges={edges}
              width={width}
              height={height}
              narrow={false}
              alt={alt}
              className="hidden h-auto w-full sm:block"
            />
          </>
        ) : (
          <div className="overflow-x-auto">
            <Arrangement
              nodes={nodes}
              edges={edges}
              width={width}
              height={height}
              narrow={false}
              alt={alt}
              className="h-auto w-full min-w-[34rem]"
            />
          </div>
        )}
        {caption && <figcaption className="mt-3 text-body-sm leading-relaxed text-leaf-800">{inline(caption)}</figcaption>}
      </figure>

      {source && <p className="mt-4 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{source}</p>}
    </section>
  )
}
