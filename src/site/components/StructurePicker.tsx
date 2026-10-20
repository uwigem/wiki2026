import { useState } from 'react'
import type { Structure } from '../content/structures'
import StructureView from './StructureView'

/**
 * One pale tint per group of structures. Subtle on purpose: the pixel face is
 * hard to read at this size, and a reader should be able to tell which target
 * a button belongs to without reading it. The chosen button still goes pink,
 * so the tint never competes with which one is showing.
 */
const GROUP_TINT = ['var(--p-bushLight)', 'var(--p-waterLight)', 'var(--p-lilacHi)']

/** Structures in the order given, gathered under the target they were designed against. */
function byGroup(structures: Structure[]) {
  const out: { key: string; items: { s: Structure; at: number }[] }[] = []
  structures.forEach((s, at) => {
    // "MEGF8 1" and "MEGF8 2" belong together. A structure can name its own
    // group when its id does not start with the thing it should sit beside.
    const key = s.group ?? s.id.split(' ')[0]
    const row = out.find((g) => g.key === key)
    if (row) row.items.push({ s, at })
    else out.push({ key, items: [{ s, at }] })
  })
  return out
}

/**
 * Several structures in one viewer, with a button per structure. One canvas
 * rather than one per structure: six spinning views on a page would be six
 * animation loops, and a reader compares them better in the same frame.
 *
 * The buttons sit one row per target rather than in a single wrapping run,
 * so which three go together does not depend on how wide the column happens
 * to be.
 */
export default function StructurePicker({ structures, label }: { structures: Structure[]; label: string }) {
  const [i, setI] = useState(0)
  const groups = byGroup(structures)
  const picker = (
    <div role="group" aria-label={label} className="flex flex-col gap-2">
      {groups.map((g, gi) => (
        <div key={g.key} className="flex flex-wrap gap-2">
          {g.items.map(({ s, at }) => (
            <button
              key={s.id}
              type="button"
              className="pixel-btn"
              aria-pressed={at === i}
              // Only the unchosen ones carry the tint; the chosen one keeps
              // the pink the stylesheet gives it.
              style={at === i ? undefined : { background: GROUP_TINT[gi % GROUP_TINT.length] }}
              onClick={() => setI(at)}
            >
              {s.id}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
  return <StructureView structure={structures[i]} picker={picker} />
}
