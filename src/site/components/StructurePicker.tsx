import { useState } from 'react'
import type { Structure } from '../content/structures'
import StructureView from './StructureView'

/**
 * Several structures in one viewer, with a button per structure. One canvas
 * rather than one per structure: six spinning views on a page would be six
 * animation loops, and a reader compares them better in the same frame.
 */
export default function StructurePicker({ structures, label }: { structures: Structure[]; label: string }) {
  const [i, setI] = useState(0)
  const picker = (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {structures.map((s, k) => (
        <button
          key={s.id}
          type="button"
          className="pixel-btn"
          aria-pressed={k === i}
          onClick={() => setI(k)}
        >
          {s.id}
        </button>
      ))}
    </div>
  )
  return <StructureView structure={structures[i]} picker={picker} />
}
