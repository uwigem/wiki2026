import { SITE_PALETTE as P } from '../theme'

/**
 * How another team adapts the constructs.
 *
 * The whole claim of the wet lab's contribution is that the receptor is the
 * only part that has to change, so the drawing says exactly that: the same
 * recruitment machinery twice, under two different receptors. Our design on
 * top, somebody else's on the bottom.
 *
 * Drawn rather than photographed, and drawn the same way the MMM diagram on
 * the description page is, so a reader meets one way of drawing a membrane
 * and one way of drawing MGRN1 across the whole wiki.
 */

const VW = 440
const VH = 400

/** One transmembrane helix, as the MMM diagram draws them. */
function Helix({ x, y, fill }: { x: number; y: number; fill: string }) {
  return (
    <rect x={x} y={y - 24} width={10} height={48} rx={5} fill={fill} stroke={P.bushDark} strokeWidth={1.5} />
  )
}

/** The tag, the nanobody that binds it, and the ligase they carry over. */
function Recruitment({ y }: { y: number }) {
  return (
    <g>
      {/* the tag, hanging off the receptor on the inside of the cell */}
      <line x1={120} y1={y + 24} x2={120} y2={y + 44} stroke={P.quillDark} strokeWidth={3} strokeLinecap="round" />
      <circle cx={120} cy={y + 52} r={11} fill={P.daisyCore} stroke={P.quillDark} strokeWidth={1.6} />
      <text x={120} y={y + 55} fontSize={7} fontWeight={700} fill={P.shadow} textAnchor="middle">
        ALFA
      </text>

      {/* the nanobody reading it */}
      <path
        d={`M 133 ${y + 52} L 217 ${y + 52}`}
        stroke={P.bushDark}
        strokeWidth={2}
        strokeDasharray="4 3"
        fill="none"
      />
      <circle cx={232} cy={y + 52} r={13} fill={P.waterLight} stroke={P.bushDark} strokeWidth={1.6} />
      <text x={232} y={y + 55} fontSize={7.5} fontWeight={700} fill={P.shadow} textAnchor="middle">
        Nb
      </text>

      {/* the ligase it carries over */}
      <line x1={245} y1={y + 52} x2={268} y2={y + 52} stroke={P.bushDark} strokeWidth={3} strokeLinecap="round" />
      <ellipse cx={310} cy={y + 52} rx={42} ry={18} fill={P.daisyCore} stroke={P.quillDark} strokeWidth={1.8} />
      <text x={310} y={y + 50} fontSize={11.5} fontWeight={700} fill={P.shadow} textAnchor="middle">
        MGRN1
      </text>
      <text x={310} y={y + 62} fontSize={8.5} fill={P.shadow} textAnchor="middle">
        E3 ligase
      </text>
    </g>
  )
}

/** The membrane band, and the words for which side is which. */
function Membrane({ y }: { y: number }) {
  return (
    <g>
      <rect x={0} y={y - 18} width={VW} height={36} fill={P.bushLight} />
      <rect x={0} y={y - 18} width={VW} height={2} fill={P.grass4} />
      <rect x={0} y={y + 16} width={VW} height={2} fill={P.grass4} />
    </g>
  )
}

export default function AdaptDiagram() {
  const topY = 100
  const botY = 320

  return (
    <section className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
      <h2 className="text-xl">How to adapt our constructs</h2>
      <p className="measure mt-1 text-body leading-relaxed">
        The receptor is the only part that changes. Everything to the right of the tag is the same in both rows.
      </p>

      <div className="mt-4 overflow-hidden rounded-sm border-[3px] border-leaf-700 bg-leaf-50">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          className="block h-auto w-full"
          role="img"
          aria-label="Two rows showing the same recruitment machinery under two different receptors. On top, our design: a seven-pass receptor labelled SMO or GPR161 in the membrane, carrying an ALFA tag on the cytoplasmic side, read by a nanobody that brings MGRN1 across. Below, your receptor: a single-pass receptor such as a receptor tyrosine kinase, carrying the same ALFA tag, read by the same nanobody, bringing the same MGRN1 across."
        >
          {/* our design */}
          <text x={10} y={topY - 74} fontSize={11} fontWeight={700} fill={P.shadow}>
            OUR DESIGN
          </text>
          <Membrane y={topY} />
          <text x={120} y={topY - 52} fontSize={12} fontWeight={700} fill={P.shadow} textAnchor="middle">
            SMO / GPR161
          </text>
          <text x={120} y={topY - 40} fontSize={8.5} fill={P.shadow} textAnchor="middle">
            seven-pass receptor
          </text>
          {[90, 100, 110, 120, 130, 140, 150].map((x) => (
            <Helix key={x} x={x - 5} y={topY} fill={P.waterLight} />
          ))}
          <Recruitment y={topY} />

          {/* what changes */}
          <line x1={120} y1={topY + 80} x2={120} y2={botY - 86} stroke={P.bushDark} strokeWidth={2} markerEnd="url(#adapt-arrow)" />
          <text x={136} y={(topY + 80 + botY - 86) / 2 + 4} fontSize={10.5} fontWeight={700} fill={P.bushDark}>
            swap only this
          </text>

          {/* your receptor */}
          <text x={10} y={botY - 74} fontSize={11} fontWeight={700} fill={P.shadow}>
            YOUR RECEPTOR
          </text>
          <Membrane y={botY} />
          <text x={120} y={botY - 58} fontSize={12} fontWeight={700} fill={P.shadow} textAnchor="middle">
            Any membrane receptor
          </text>
          <text x={120} y={botY - 47} fontSize={8.5} fill={P.shadow} textAnchor="middle">
            a receptor tyrosine kinase, say
          </text>
          <ellipse cx={120} cy={botY - 31} rx={22} ry={9} fill={P.pinkBud} stroke={P.bushDark} strokeWidth={1.6} />
          <Helix x={109} y={botY} fill={P.pinkBud} />
          <Helix x={125} y={botY} fill={P.pinkBud} />
          <Recruitment y={botY} />

          <defs>
            <marker id="adapt-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={P.bushDark} />
            </marker>
          </defs>
        </svg>
      </div>

      <p className="measure mt-3 text-body-sm leading-relaxed text-leaf-800">
        The constructs are designed and ordered. None of them has been tested in cells yet, so a different receptor may
        need its fusion orientation, its tag placement or its localisation changed.
      </p>
    </section>
  )
}
