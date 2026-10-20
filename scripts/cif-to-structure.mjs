#!/usr/bin/env node
/**
 * Turns a model's mmCIF file into the packed strings `StructureView` draws:
 * one chain as `ca` and `ss`, and optionally a second chain as `partner.ca`.
 *
 *   node scripts/cif-to-structure.mjs model.cif --main B --partner A
 *   node scripts/cif-to-structure.mjs model.cif --main B --partner A --align first.cif
 *
 * Prints the fields as TypeScript, ready to paste into a `Structure` in
 * src/site/content/. Nothing is written to disk.
 *
 * What it does, in order:
 *   1. Reads the alpha carbon of every residue from the `_atom_site` loop.
 *   2. Assigns helix (H), strand (E) or coil (C) to the main chain from the
 *      alpha-carbon geometry alone, with the distance rules of P-SEA (Labesse
 *      et al., CABIOS 1997): a helix has its i to i+3 and i to i+4 neighbours
 *      close, a strand runs straight and lies beside another straight run.
 *      Design models have no secondary structure records, so this is the only
 *      source, and it is meant for colouring a picture, not for analysis.
 *   3. Centres on the main chain and turns it so its longest axis runs up the
 *      screen, which suits the viewer's tall frame. With `--align`, the main
 *      chain is first fitted onto that file's main chain (Kabsch, matching
 *      residue numbers) and the reference's own frame is used instead: every
 *      complex against one target then shows the target in the same pose, so
 *      the only thing that moves between views is where the binder sits.
 *   4. Rounds to one decimal place and cuts each string into fixed-width
 *      chunks. The chunks must stay fixed width: a wrapper that breaks on
 *      spaces would change the numbers.
 */
import { readFileSync } from 'node:fs'

const args = process.argv.slice(2)
const file = args.find((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'))
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : fallback
}
if (!file) {
  console.error('usage: node scripts/cif-to-structure.mjs model.cif [--main B] [--partner A] [--align ref.cif]')
  process.exit(1)
}
const MAIN = opt('main', 'B')
const PARTNER = opt('partner', null)
const ALIGN = opt('align', null)
const WIDTH = 94

/* ----------------------------------------------------------- read the file */

/** Every chain's alpha carbons, by `label_asym_id`. */
function readChains(path) {
  const cols = []
  const chains = new Map()
  let inLoop = false
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    if (line.startsWith('_atom_site.')) {
      cols.push(line.trim().slice('_atom_site.'.length))
      inLoop = true
      continue
    }
    if (!inLoop || cols.length === 0) continue
    if (line.startsWith('#') || line.startsWith('loop_') || line.startsWith('_')) {
      if (chains.size) break
      continue
    }
    const f = line.match(/'[^']*'|"[^"]*"|\S+/g)
    if (!f || f.length < cols.length) continue
    const get = (k) => f[cols.indexOf(k)]
    if (get('label_atom_id') !== 'CA') continue
    const chain = get('label_asym_id')
    if (!chains.has(chain)) chains.set(chain, [])
    chains.get(chain).push({
      seq: Number(get('label_seq_id')),
      v: [Number(get('Cartn_x')), Number(get('Cartn_y')), Number(get('Cartn_z'))],
    })
  }
  return chains
}

const chains = readChains(file)
for (const [id, res] of chains) console.error(`chain ${id}: ${res.length} residues`)
const main = chains.get(MAIN)
const partner = PARTNER ? chains.get(PARTNER) : null
if (!main) {
  console.error(`No chain ${MAIN} in ${file}`)
  process.exit(1)
}
if (PARTNER && !partner) {
  console.error(`No chain ${PARTNER} in ${file}`)
  process.exit(1)
}

/* --------------------------------------------------- small vector helpers */

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dist = (a, b) => Math.hypot(...sub(a, b))
const centroid = (pts) => [0, 1, 2].map((k) => pts.reduce((s, p) => s + p.v[k], 0) / pts.length)
const apply = (m, v) => m.map((row) => dot(row, v))

/* ------------------------------------------------- secondary structure */

const near = (v, centre, tol) => Math.abs(v - centre) <= tol

function assign(res) {
  const n = res.length
  const ss = Array(n).fill('C')
  const d = (i, k) => (i + k < n ? dist(res[i].v, res[i + k].v) : Infinity)

  // Helix: a residue starts a helical turn when its next few neighbours sit at
  // helical spacing. Mark the turn, then drop runs too short to be a helix.
  for (let i = 0; i + 4 < n; i++) {
    if (near(d(i, 2), 5.5, 0.5) && near(d(i, 3), 5.3, 0.5) && near(d(i, 4), 6.4, 0.6)) {
      for (let k = 0; k <= 4; k++) ss[i + k] = 'H'
    }
  }

  // Strand: a straight run of at least three residues with another straight
  // run of the chain lying alongside it.
  const straight = Array(n).fill(false)
  for (let i = 0; i + 3 < n; i++) {
    if (near(d(i, 2), 6.4, 0.7) && near(d(i, 3), 9.9, 1.0)) {
      for (let k = 0; k <= 3; k++) straight[i + k] = true
    }
  }
  for (let i = 0; i < n; i++) {
    if (!straight[i] || ss[i] === 'H') continue
    for (let j = 0; j < n; j++) {
      if (Math.abs(i - j) > 3 && straight[j] && dist(res[i].v, res[j].v) < 5.5) {
        ss[i] = 'E'
        break
      }
    }
  }

  // Remove fragments shorter than a helix turn or a three-residue strand.
  const clean = (code, min) => {
    for (let i = 0; i < n; ) {
      if (ss[i] !== code) {
        i++
        continue
      }
      let j = i
      while (j < n && ss[j] === code) j++
      if (j - i < min) for (let k = i; k < j; k++) ss[k] = 'C'
      i = j
    }
  }
  clean('H', 5)
  clean('E', 3)
  return ss.join('')
}

/* ------------------------------------------------- superpose and orient */

/** Principal axes of a set of centred points, largest first. */
function axes(pts) {
  const cov = [0, 1, 2].map((a) => [0, 1, 2].map((b) => pts.reduce((s, p) => s + p[a] * p[b], 0)))
  const top = (m) => {
    let v = [1, 0.5, 0.25]
    for (let it = 0; it < 200; it++) {
      const w = m.map((row) => dot(row, v))
      const len = Math.hypot(...w) || 1
      v = w.map((x) => x / len)
    }
    return { v, lambda: m.reduce((s, row, i) => s + v[i] * dot(row, v), 0) }
  }
  const a1 = top(cov)
  const a2 = top(cov.map((row, i) => row.map((x, j) => x - a1.lambda * a1.v[i] * a1.v[j])))
  // Screen y runs downward, so the longest axis is negated to stand the
  // molecule upright. Rows of the matrix are the screen x, y and z axes.
  return [a2.v, a1.v.map((x) => -x), cross(a2.v, a1.v)]
}

/** Rotation that best maps `from` onto `to`, both centred (Kabsch). */
function kabsch(from, to) {
  const h = [0, 1, 2].map((a) => [0, 1, 2].map((b) => from.reduce((s, p, i) => s + p[a] * to[i][b], 0)))
  // Jacobi eigendecomposition of HtH gives V; U follows as H V S^-1.
  const hth = [0, 1, 2].map((a) => [0, 1, 2].map((b) => [0, 1, 2].reduce((s, k) => s + h[k][a] * h[k][b], 0)))
  let v = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ]
  const a = hth.map((r) => r.slice())
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0
    for (let p = 0; p < 3; p++) for (let q = p + 1; q < 3; q++) off += a[p][q] ** 2
    if (off < 1e-18) break
    for (let p = 0; p < 3; p++) {
      for (let q = p + 1; q < 3; q++) {
        if (Math.abs(a[p][q]) < 1e-20) continue
        const theta = (a[q][q] - a[p][p]) / (2 * a[p][q])
        const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1))
        const c = 1 / Math.sqrt(t * t + 1)
        const s = t * c
        for (let k = 0; k < 3; k++) {
          const akp = a[k][p]
          const akq = a[k][q]
          a[k][p] = c * akp - s * akq
          a[k][q] = s * akp + c * akq
        }
        for (let k = 0; k < 3; k++) {
          const apk = a[p][k]
          const aqk = a[q][k]
          a[p][k] = c * apk - s * aqk
          a[q][k] = s * apk + c * aqk
        }
        for (let k = 0; k < 3; k++) {
          const vkp = v[k][p]
          const vkq = v[k][q]
          v[k][p] = c * vkp - s * vkq
          v[k][q] = s * vkp + c * vkq
        }
      }
    }
  }
  // Columns of V, with their singular values, largest first.
  const order = [0, 1, 2].sort((i, j) => a[j][j] - a[i][i])
  const V = order.map((i) => [0, 1, 2].map((k) => v[k][i]))
  const sigma = order.map((i) => Math.sqrt(Math.max(0, a[i][i])))
  // U columns: u_i = H v_i / sigma_i, with the smallest rebuilt as a cross
  // product so the result is a rotation even when that axis is degenerate.
  const U = V.map((vi, i) => {
    const hv = [0, 1, 2].map((r) => vi.reduce((s, x, k) => s + h[r][k] * x, 0))
    return sigma[i] > 1e-8 ? hv.map((x) => x / sigma[i]) : null
  })
  if (!U[2]) U[2] = cross(U[0], U[1])
  // R = U diag(1,1,d) V^T, with d fixing a reflection.
  const d = Math.sign(dot(cross(U[0], U[1]), U[2])) * Math.sign(dot(cross(V[0], V[1]), V[2])) || 1
  const Uc = [U[0], U[1], U[2].map((x) => x * d)]
  return [0, 1, 2].map((r) => [0, 1, 2].map((cIdx) => [0, 1, 2].reduce((s, k) => s + V[k][r] * Uc[k][cIdx], 0)))
}

let frameCentre
let frame
let fit = null
if (ALIGN) {
  const refMain = readChains(ALIGN).get(MAIN)
  if (!refMain) {
    console.error(`No chain ${MAIN} in ${ALIGN}`)
    process.exit(1)
  }
  const refCentre = centroid(refMain)
  frameCentre = refCentre
  frame = axes(refMain.map((r) => sub(r.v, refCentre)))
  if (ALIGN !== file) {
    // Residues present in both, matched by number.
    const byNum = new Map(refMain.map((r) => [r.seq, r.v]))
    const pairs = main.filter((r) => byNum.has(r.seq))
    const myCentre = centroid(pairs)
    const R = kabsch(
      pairs.map((r) => sub(r.v, myCentre)),
      pairs.map((r) => sub(byNum.get(r.seq), refCentre)),
    )
    const rmsd = Math.sqrt(
      pairs.reduce((s, r) => s + dist(apply(R, sub(r.v, myCentre)), sub(byNum.get(r.seq), refCentre)) ** 2, 0) /
        pairs.length,
    )
    console.error(`aligned on ${pairs.length} residues, RMSD ${rmsd.toFixed(2)} A`)
    fit = { R, myCentre, refCentre }
  }
} else {
  frameCentre = centroid(main)
  frame = axes(main.map((r) => sub(r.v, frameCentre)))
}

/** A raw coordinate into the view's frame. */
const place = (v) => {
  const centred = fit ? apply(fit.R, sub(v, fit.myCentre)) : sub(v, frameCentre)
  return apply(frame, centred)
}

/* ------------------------------------------------------------- output */

const pack = (res) =>
  res
    .map((r) => {
      const [x, y, z] = place(r.v).map((n) => (Math.round(n * 10) / 10).toFixed(1).replace(/^-0\.0$/, '0.0'))
      return `${r.seq} ${x} ${y} ${z}`
    })
    .join(';')
const chunks = (s) => {
  const out = []
  for (let i = 0; i < s.length; i += WIDTH) out.push(`'${s.slice(i, i + WIDTH)}'`)
  return out.join(' +\n    ')
}

const ss = assign(main)
console.error(
  `main chain: ${[...ss].filter((x) => x === 'H').length} helix, ${[...ss].filter((x) => x === 'E').length} strand`,
)
console.log(`  ss:\n    ${chunks(ss)},`)
console.log(`  ca:\n    ${chunks(pack(main))},`)
if (partner) console.log(`  partnerCa:\n    ${chunks(pack(partner))},`)
