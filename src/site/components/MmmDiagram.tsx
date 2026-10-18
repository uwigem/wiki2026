import { useState } from 'react'
import { SITE_PALETTE as P } from '../theme'
import { useReducedMotion } from '../hooks'

/**
 * The MMM complex, and the two things our device does to it.
 *
 * Drawn rather than photographed, because the point is the arrangement: which
 * protein touches which, and what moves when we interfere. Three states, one
 * per thing a reader needs to hold:
 *
 * - resting: MEGF8 and MOSMO hold MGRN1 against the membrane, MGRN1 tags SMO,
 *   SMO leaves the cilium.
 * - linker: an inducible linker drags the whole complex onto a receptor we
 *   choose, so that receptor gets tagged instead. This is the down arm.
 * - breaker: a designed minibinder wedges into the MEGF8 and MOSMO interface,
 *   the complex comes apart, nothing gets tagged, SMO stays. This is the up arm.
 *
 * The two interfering states are the two arms on this page, so the diagram and
 * the cards under it are saying the same thing twice, once as a picture.
 *
 * Everything is positioned in one coordinate space and moved with transforms,
 * so a state change animates by itself. With reduced motion the same states
 * still work; they simply cut rather than slide.
 */

type Mode = 'resting' | 'linker' | 'breaker'

const VW = 440
const VH = 252

/** The membrane band. Everything is placed against these two numbers. */
const MEM_TOP = 96
const MEM_BOT = 132

const MODES: { id: Mode; label: string; caption: string }[] = [
  {
    id: 'resting',
    label: 'Resting complex',
    caption:
      'MEGF8 and MOSMO hold MGRN1 at the membrane. MGRN1 tags SMO with ubiquitin, so SMO is cleared out of the cilium and Hedgehog signalling stays low.',
  },
  {
    id: 'linker',
    label: 'Recruit linker',
    caption:
      'The down arm. An inducible linker forces the whole complex onto a receptor we choose, so that receptor is tagged and cleared instead of SMO.',
  },
  {
    id: 'breaker',
    label: 'Recruit breaker',
    caption:
      'The up arm. A designed minibinder wedges into the MEGF8 and MOSMO interface. The complex comes apart, nothing is tagged, and SMO stays in the cilium.',
  },
]

/** One transmembrane helix. */
function Helix({ x, fill }: { x: number; fill: string }) {
  return (
    <rect
      x={x}
      y={MEM_TOP - 6}
      width={11}
      height={MEM_BOT - MEM_TOP + 12}
      rx={5}
      fill={fill}
      stroke={P.bushDark}
      strokeWidth={1.6}
    />
  )
}

export default function MmmDiagram() {
  const [mode, setMode] = useState<Mode>('resting')
  const reduced = useReducedMotion()
  const current = MODES.find((m) => m.id === mode) ?? MODES[0]

  const broken = mode === 'breaker'
  const linked = mode === 'linker'

  // What moves, per state. The complex only comes apart in the breaker state.
  const ease = reduced ? 'none' : 'transform 420ms ease, opacity 420ms ease'
  // MEGF8 only edges left: any further and it sits on the Extracellular label.
  // MOSMO carries most of the separation instead, which reads the same.
  const megf8Shift = broken ? 'translate(-12px, -6px)' : 'translate(0,0)'
  const mosmoShift = broken ? 'translate(46px, 0)' : 'translate(0,0)'
  const mgrn1Shift = broken
    ? 'translate(-14px, 40px)'
    : linked
      ? 'translate(34px, 0)'
      : 'translate(0,0)'

  /*
   * The tagging arrow. MGRN1 slides right when the linker is on, so the arrow
   * has to start from wherever its edge now is rather than from a fixed point,
   * or it begins inside the ligase. It stops short of the ubiquitin for the
   * same reason: ending on the cluster buries the head under the tags.
   */
  const ubX = linked ? 318 : 352
  const armFrom = linked ? 206 : 172
  const armTo = ubX - 16

  // The receptor on the right is SMO at rest, and whatever the lab picked once
  // the linker is on, so it is renamed as well as recoloured.
  const targetFill = linked ? P.pinkBud : P.waterLight
  const targetName = linked ? 'Target receptor' : 'SMO'

  return (
    <section className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
      <h2 className="text-xl">What the complex does, and what we do to it</h2>
      <p className="measure mt-1 text-body leading-relaxed">
        Pick one of the two arms to see what changes. The resting state is what a cell does on its own.
      </p>

      <div className="mt-4 overflow-hidden rounded-sm border-[3px] border-leaf-700 bg-leaf-50">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          className="block h-auto w-full"
          role="img"
          aria-label={current.caption}
        >
          {/* membrane */}
          <rect x={0} y={MEM_TOP} width={VW} height={MEM_BOT - MEM_TOP} fill={P.bushLight} />
          <rect x={0} y={MEM_TOP} width={VW} height={2} fill={P.grass4} />
          <rect x={0} y={MEM_BOT - 2} width={VW} height={2} fill={P.grass4} />
          <text x={10} y={MEM_TOP - 10} fontSize={11} fill={P.bushDark} fontWeight={700}>
            Extracellular
          </text>
          <text x={10} y={MEM_BOT + 20} fontSize={11} fill={P.bushDark} fontWeight={700}>
            Cytoplasm
          </text>

          {/* MEGF8: one pass, two lobes above, a tail down to MGRN1 */}
          <g style={{ transform: megf8Shift, transition: ease }}>
            <circle cx={100} cy={74} r={11} fill={P.lilacPetal} stroke={P.bushDark} strokeWidth={1.6} />
            <circle cx={116} cy={70} r={11} fill={P.lilacPetal} stroke={P.bushDark} strokeWidth={1.6} />
            <Helix x={102} fill={P.lilacPetal} />
            <path
              d={`M 107 ${MEM_BOT + 4} Q 109 158 122 168`}
              fill="none"
              stroke={P.lilacPetal}
              strokeWidth={4}
              strokeLinecap="round"
            />
            <text x={88} y={52} fontSize={12} fontWeight={700} fill={P.shadow}>
              MEGF8
            </text>
          </g>

          {/* MOSMO: four passes */}
          <g style={{ transform: mosmoShift, transition: ease }}>
            {[142, 156, 170, 184].map((x) => (
              <Helix key={x} x={x} fill={P.leaf} />
            ))}
            <text x={138} y={MEM_TOP - 16} fontSize={12} fontWeight={700} fill={P.shadow}>
              MOSMO
            </text>
          </g>

          {/*
            The breaker, only once it is in. A de novo minibinder is a small
            helical bundle, so it is drawn as three helices like every other
            protein here rather than as an abstract shape, and it sits
            symmetrically in the gap it has opened.
          */}
          <g style={{ opacity: broken ? 1 : 0, transition: ease }} aria-hidden>
            {[
              [130, 94, 38],
              [140, 87, 52],
              [150, 94, 38],
            ].map(([x, y, h]) => (
              <rect
                key={x}
                x={x}
                y={y}
                width={8}
                height={h}
                rx={4}
                fill={P.pinkBud}
                stroke={P.pinkDark}
                strokeWidth={1.6}
              />
            ))}
            <text x={144} y={152} fontSize={11} fontWeight={700} fill={P.pinkDark} textAnchor="middle">
              minibinder
            </text>
          </g>

          {/* MGRN1 */}
          <g style={{ transform: mgrn1Shift, opacity: broken ? 0.5 : 1, transition: ease }}>
            <ellipse cx={130} cy={180} rx={37} ry={18} fill={P.daisyCore} stroke={P.quillDark} strokeWidth={1.8} />
            <text x={130} y={178} fontSize={11.5} fontWeight={700} fill={P.shadow} textAnchor="middle">
              MGRN1
            </text>
            <text x={130} y={190} fontSize={9} fill={P.shadow} textAnchor="middle">
              E3 ligase
            </text>
          </g>

          {/* the receptor on the right: SMO, or whatever the linker picked */}
          <g>
            <ellipse cx={332} cy={74} rx={30} ry={15} fill={targetFill} stroke={P.bushDark} strokeWidth={1.8} style={{ transition: ease }} />
            {[290, 304, 318, 332, 346, 360, 374].map((x) => (
              <Helix key={x} x={x} fill={targetFill} />
            ))}
            <text x={332} y={48} fontSize={12} fontWeight={700} fill={P.shadow} textAnchor="middle">
              {targetName}
            </text>
          </g>

          {/* the linker, only once it is on */}
          <g style={{ opacity: linked ? 1 : 0, transition: ease }} aria-hidden>
            <path
              d="M 122 58 q 14 -8 28 0 q 14 8 28 0 q 14 -8 28 0 q 14 8 28 0 q 14 -8 28 0 q 14 8 28 0 q 14 -8 28 0"
              fill="none"
              stroke={P.shadow}
              strokeWidth={3}
              strokeLinecap="round"
            />
            <text x={222} y={36} fontSize={11} fontWeight={700} fill={P.shadow} textAnchor="middle">
              inducible linker
            </text>
          </g>

          {/* ubiquitin, and the arrow that puts it there. Neither survives the breaker. */}
          <g style={{ opacity: broken ? 0 : 1, transition: ease }}>
            <path
              d={`M ${armFrom} 182 Q ${(armFrom + armTo) / 2} 196 ${armTo} 166`}
              fill="none"
              stroke={P.bushDark}
              strokeWidth={2}
              markerEnd="url(#mmm-arrow)"
              style={{ transition: ease }}
            />
            {[
              [ubX, 152],
              [ubX + 16, 160],
              [ubX, 170],
            ].map(([cx, cy], i) => (
              <g key={i} style={{ transition: ease }}>
                <circle cx={cx} cy={cy} r={9} fill={P.pinkBud} stroke={P.pinkDark} strokeWidth={1.4} />
                <text x={cx} y={cy + 3.5} fontSize={8} fontWeight={700} fill={P.shadow} textAnchor="middle">
                  Ub
                </text>
              </g>
            ))}
          </g>

          <defs>
            <marker id="mmm-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={P.bushDark} />
            </marker>
          </defs>

          {/* the readout */}
          <g>
            <rect x={246} y={210} width={84} height={26} rx={5} fill={P.bushHi} stroke={P.grass4} strokeWidth={1.6} />
            <text x={288} y={227} fontSize={10.5} fontWeight={700} fill={P.shadow} textAnchor="middle">
              {broken ? 'Ciliary SMO ↑' : linked ? 'Target down' : 'Ciliary SMO ↓'}
            </text>
            <rect x={344} y={210} width={88} height={26} rx={5} fill={P.bushHi} stroke={P.grass4} strokeWidth={1.6} />
            <text x={388} y={227} fontSize={10.5} fontWeight={700} fill={P.shadow} textAnchor="middle">
              {broken ? 'HH signal ↑' : 'HH signal ↓'}
            </text>
          </g>
        </svg>
      </div>

      <ul className="mt-3 flex flex-wrap gap-2">
        {MODES.map((m) => (
          <li key={m.id}>
            <button
              type="button"
              onClick={() => setMode(m.id)}
              aria-pressed={mode === m.id}
              className={
                'min-h-9 rounded-sm border-[3px] px-3 py-1.5 text-left text-sm font-semibold transition-colors ' +
                (mode === m.id
                  ? 'border-leaf-800 bg-leaf-200 shadow-[3px_3px_0_var(--p-shadow)]'
                  : 'border-leaf-300 bg-leaf-50 hover:bg-leaf-100')
              }
            >
              {m.label}
            </button>
          </li>
        ))}
      </ul>

      <p className="measure mt-3 text-body-sm leading-relaxed" aria-live="polite">
        {current.caption}
      </p>
    </section>
  )
}
