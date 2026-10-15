import { createContext, useContext } from 'react'
import type { Stakeholder } from './StakeholderGarden'

/**
 * The stakeholders of the page being read, shared with every block on it.
 *
 * The Human Practices page mentions the people it interviewed all over: in the
 * protein cards, the market model, the persona cards. Each mention is written
 * `[Dr. Zheng](stakeholder:zheng)` and opens the same card the garden opens,
 * so a reader never has to scroll back up to find who someone is. `WikiPage`
 * provides this from the page's `stakeholders` block; `RichText` reads it.
 */
export interface StakeholderApi {
  people: Stakeholder[]
  open: (id: string) => void
}

export const StakeholderContext = createContext<StakeholderApi>({ people: [], open: () => {} })

export function useStakeholders(): StakeholderApi {
  return useContext(StakeholderContext)
}

/** The id a person is linked by: their `id` field, or the last word of their name in lower case. */
export function stakeholderId(p: Stakeholder): string {
  if (p.id) return p.id
  const words = p.name.replace(/[^\p{L}\p{N} ]/gu, '').trim().split(/\s+/)
  return words[words.length - 1].toLowerCase()
}

/** A mention of a stakeholder in running text. Opens their card; plain text if the page has no such person. */
export function StakeholderLink({ id, label }: { id: string; label: string }) {
  const { people, open } = useStakeholders()
  const person = people.find((p) => stakeholderId(p) === id)
  if (!person) return <>{label}</>
  return (
    <button type="button" className="cross-link" onClick={() => open(id)}>
      {label}
    </button>
  )
}
