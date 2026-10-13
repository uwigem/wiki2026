import { useCallback, useEffect, useMemo, useState } from 'react'
import { LEVELS, reachable, recipeBook, recipeKey, type Level } from '../../content/alchemy'

/**
 * What a game of iGEM Alchemy knows that is not on the board: which level,
 * what has been found in each, and how. Progress is kept in localStorage so
 * a visitor who leaves and comes back carries on. Nothing is sent anywhere.
 */

const KEY = 'igem-alchemy'

interface Save {
  level: string
  /** Per level: what has been found, in the order it was found. */
  found: Record<string, string[]>
  /** Per element: the ingredients it was first made from. For the field guide. */
  how: Record<string, string[]>
}

const EMPTY: Save = { level: LEVELS[0].id, found: {}, how: {} }

function load(): Save {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return EMPTY
    const s = JSON.parse(raw) as Partial<Save>
    return {
      level: LEVELS.some((l) => l.id === s.level) ? (s.level as string) : LEVELS[0].id,
      found: s.found ?? {},
      how: s.how ?? {},
    }
  } catch {
    return EMPTY
  }
}

function store(s: Save) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    // Private mode or storage blocked: the game still works, it just forgets.
  }
}

export interface Made {
  id: string
  /** First time this has been made in this level. */
  fresh: boolean
}

export function useAlchemy() {
  const [save, setSave] = useState<Save>(load)
  useEffect(() => store(save), [save])

  const level: Level = LEVELS.find((l) => l.id === save.level) ?? LEVELS[0]
  const book = useMemo(() => recipeBook(level), [level])
  const toFind = useMemo(() => reachable(level), [level])
  const found = useMemo(() => save.found[level.id] ?? [], [save.found, level.id])
  /**
   * What counts towards this level: things made here that the level is about.
   * An earlier level's recipe can still be used, but what it makes is not
   * part of this level's count.
   */
  const counted = useMemo(() => found.filter((id) => toFind.includes(id)), [found, toFind])
  /** Everything in the sidebar: what the level starts with, then what has been found. */
  const known = useMemo(() => [...level.starters, ...found], [level.starters, found])
  const done = level.goals.every((g) => found.includes(g))

  /** Try a set of ingredients. Records a first discovery. */
  const combine = useCallback(
    (inputs: string[]): Made | null => {
      const makes = book.byInputs.get(recipeKey(inputs))
      if (!makes) return null
      const fresh = !known.includes(makes)
      if (fresh) {
        setSave((s) => ({
          ...s,
          found: { ...s.found, [level.id]: [...(s.found[level.id] ?? []), makes] },
          how: { ...s.how, [makes]: inputs },
        }))
      }
      return { id: makes, fresh }
    },
    [book, known, level.id],
  )

  /** The ingredient that would complete a three-way recipe with these two, if there is one. */
  const thirdFor = useCallback(
    (a: string, b: string): string | null => {
      for (const t of book.triples) {
        const rest = [...t.inputs]
        const ia = rest.indexOf(a)
        if (ia < 0) continue
        rest.splice(ia, 1)
        const ib = rest.indexOf(b)
        if (ib < 0) continue
        rest.splice(ib, 1)
        return rest[0]
      }
      return null
    },
    [book],
  )

  /**
   * Something the player can make right now and has not: the first one a
   * walkthrough would make. The game shows one ingredient, then all of them.
   */
  const nextHint = useCallback((): string[] | null => {
    const next = level.recipes.find((r) => !known.includes(r.makes) && r.inputs.every((i) => known.includes(i)))
    return next ? next.inputs : null
  }, [level.recipes, known])

  const setLevel = useCallback((id: string) => setSave((s) => ({ ...s, level: id })), [])
  const reset = useCallback(() => setSave(EMPTY), [])

  const doneLevels = useMemo(
    () => new Set(LEVELS.filter((l) => l.goals.every((g) => (save.found[l.id] ?? []).includes(g))).map((l) => l.id)),
    [save.found],
  )

  return {
    level,
    known,
    found,
    counted,
    toFind,
    done,
    doneLevels,
    how: save.how,
    foundIn: (id: string) => save.found[id] ?? [],
    combine,
    thirdFor,
    nextHint,
    setLevel,
    reset,
  }
}

export type Alchemy = ReturnType<typeof useAlchemy>
