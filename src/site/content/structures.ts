/**
 * Smoothened (SMO), the receptor this project is built around.
 *
 * This is a PUBLISHED REFERENCE STRUCTURE, not one of our designs: PDB 5L7D,
 * human SMO solved at 3.2 Angstrom with a cholesterol molecule bound
 * (Byrne et al., Nature 2016, doi:10.1038/nature18934). We show it because the
 * cilium is where SMO has to sit to be active, and because cholesterol binding
 * is the step our kinetic model argues about.
 *
 * Only chain A is kept. The deposited construct replaces part of an
 * intracellular loop with a soluble cytochrome b562 fusion, a crystallisation
 * aid rather than part of SMO, and those residues are numbered above 1000 and
 * have been dropped here. Side chains are dropped too: this is an alpha-carbon
 * trace, which is all the viewer draws.
 *
 * Coordinates are rotated so the membrane normal runs up the screen, then
 * centred on the protein, and rounded to one decimal place. Generated once from
 * the deposited file, by hand: scripts/cif-to-structure.mjs came later and
 * stands a chain on its longest axis rather than on the membrane normal, so it
 * would not reproduce this pose. Our own binder designs are in
 * `binderStructures.ts`, in the same shape.
 */

export interface Structure {
  /** PDB identifier, shown as a credit in the viewer, or our own name for a design. */
  id: string
  /**
   * Which set this belongs to, when several are shown in one viewer. Defaults
   * to the first word of `id`, which is the target for our binders.
   */
  group?: string
  name: string
  caption: string
  /** "resnum x y z" per residue, semicolon separated. */
  ca: string
  /** One letter per residue, aligned to `ca`. H helix, E strand, C coil. */
  ss: string
  /** Heavy atoms of the bound ligand, "x y z" per atom. */
  ligand?: string
  ligandName?: string
  /**
   * A second chain bound to the first, drawn in one colour so it reads as a
   * separate thing: one of our binders on its target. Same packed format as
   * `ca`, in the same frame.
   */
  partner?: { name: string; ca: string }
  /**
   * Replaces the "published structure" credit, for a structure that is not a
   * deposited one (a design model). Takes inline formatting.
   */
  credit?: string
}

export interface ParsedStructure {
  /** Flat alpha-carbon coordinates, three numbers per residue. */
  xyz: Float32Array
  resnum: Int16Array
  ss: string
  ligand: Float32Array
  /** The second chain's alpha carbons, empty when there is none. */
  partner: Float32Array
  /** Largest distance of any atom from the centre, for depth shading. */
  radius: number
  /**
   * Extents across and along the membrane normal, kept apart so a tall narrow
   * receptor can be framed to fill the view instead of being sized by whichever
   * of the two happens to be larger.
   */
  spanAcross: number
  spanUp: number
}

/** Expands the packed strings above into typed arrays, once per structure. */
export function parseStructure(s: Structure): ParsedStructure {
  const rows = s.ca.split(';')
  const xyz = new Float32Array(rows.length * 3)
  const resnum = new Int16Array(rows.length)
  rows.forEach((row, i) => {
    const p = row.split(' ')
    resnum[i] = Number(p[0])
    xyz[i * 3] = Number(p[1])
    xyz[i * 3 + 1] = Number(p[2])
    xyz[i * 3 + 2] = Number(p[3])
  })
  /** "x y z" rows, or "resnum x y z" rows when `numbered`, into a flat array. */
  const points = (packed: string | undefined, numbered: boolean) => {
    const list = packed ? packed.split(';') : []
    const out = new Float32Array(list.length * 3)
    list.forEach((row, i) => {
      const p = row.split(' ').slice(numbered ? 1 : 0)
      out[i * 3] = Number(p[0])
      out[i * 3 + 1] = Number(p[1])
      out[i * 3 + 2] = Number(p[2])
    })
    return out
  }
  const ligand = points(s.ligand, false)
  const partner = points(s.partner?.ca, true)
  // Skip non-finite values and say so. One bad coordinate would otherwise
  // poison `radius` through Math.max, scale every atom to NaN, and leave the
  // viewer showing an empty box with no error anywhere.
  let radius = 1
  let spanAcross = 1
  let spanUp = 1
  let broken = 0
  for (const arr of [xyz, partner]) {
    for (let i = 0; i < arr.length; i += 3) {
      const r = Math.hypot(arr[i], arr[i + 1], arr[i + 2])
      if (Number.isFinite(r)) {
        radius = Math.max(radius, r)
        // The view spins about the vertical axis, so x and z trade places as it
        // turns. The across-extent has to cover the worst case of both.
        spanAcross = Math.max(spanAcross, Math.hypot(arr[i], arr[i + 2]))
        spanUp = Math.max(spanUp, Math.abs(arr[i + 1]))
      } else broken++
    }
  }
  if (broken > 0) {
    console.error(
      `Structure ${s.id}: ${broken} residue(s) have unreadable coordinates. ` +
        'The packed strings are fixed-width character chunks; a text wrapper that ' +
        'breaks on spaces will corrupt them.',
    )
  }
  return { xyz, resnum, ss: s.ss, ligand, partner, radius, spanAcross, spanUp }
}
