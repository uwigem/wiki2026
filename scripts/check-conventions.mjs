#!/usr/bin/env node
/**
 * House-rule checks, run by `npm run check` alongside the TypeScript compiler.
 *
 * These are the two conventions in docs/STYLE_GUIDE.md that a compiler cannot
 * enforce. There is no ESLint in this repo on purpose: it would add a few
 * hundred packages and a config to argue about, for a team where most people
 * are here to write biology, not tooling. If a third rule ever earns its place,
 * add it here.
 *
 * Run it yourself any time:  node scripts/check-conventions.mjs
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))

/**
 * Where to look. Walked from disk, so a brand new file is checked before it is
 * committed. Every file at the repo root is included as well, rather than a
 * hand-kept list: a list missed EDITING.md when it was added, which let an em
 * dash through in the guide most teammates read.
 */
const ROOTS = ['src', 'docs', 'scripts']
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '.vite'])

/**
 * Files whose colour literals are the point.
 *
 * `src/engine/` is the palette itself: every colour on the site is derived from
 * it, so of course it is full of hex. The other two are pixel-art data.
 */
const COLOUR_EXEMPT = [
  'src/engine/',
  'src/site/refSprites.ts',
  'src/site/components/PixelPerson.tsx',
]

/** The character itself, by code point, so this file does not trip its own rule. */
const EM_DASH = String.fromCharCode(0x2014)

const RULES = [
  {
    name: 'no em dashes',
    why: 'The team writes with periods, commas, colons and brackets. See docs/STYLE_GUIDE.md.',
    files: (f) => /\.(ts|tsx|css|html|md|mjs|js)$/.test(f),
    test: (line) => line.includes(EM_DASH),
  },
  {
    name: 'no hard-coded colours',
    why: 'Colour comes from the engine palette. Use a Tailwind token or a --p-* variable. See docs/STYLE_GUIDE.md.',
    files: (f) => /\.(ts|tsx|css)$/.test(f) && f.startsWith('src/') && !COLOUR_EXEMPT.some((e) => f.startsWith(e)),
    // 3-, 6- and 8-digit hex. color-mix lines are the two documented derived
    // inks in index.css; a line ending in `colour-ok` is an explicit opt-out.
    test: (line) =>
      /#[0-9a-fA-F]{3}\b|#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{8}\b/.test(line) &&
      !line.includes('color-mix') &&
      !line.includes('colour-ok'),
  },
]

function walk(dir, out = []) {
  let entries
  try {
    entries = readdirSync(dir, { withFileTypes: true })
  } catch {
    return out // the directory does not exist in this checkout; nothing to check
  }
  for (const e of entries) {
    if (SKIP_DIRS.has(e.name) || e.name.startsWith('.')) continue
    const full = join(dir, e.name)
    if (e.isDirectory()) walk(full, out)
    else if (e.isFile()) out.push(relative(ROOT, full).split(sep).join('/'))
  }
  return out
}

const files = [...ROOTS.flatMap((r) => walk(join(ROOT, r)))]
for (const e of readdirSync(ROOT, { withFileTypes: true })) {
  if (e.isFile() && !e.name.startsWith('.')) files.push(e.name)
}

const problems = []
for (const file of files) {
  let lines
  try {
    lines = readFileSync(join(ROOT, file), 'utf8').split('\n')
  } catch {
    continue // binary or unreadable
  }
  for (const rule of RULES) {
    if (!rule.files(file)) continue
    lines.forEach((line, i) => {
      if (rule.test(line)) problems.push({ file, line: i + 1, rule, text: line.trim().slice(0, 100) })
    })
  }
}

if (problems.length === 0) {
  console.log(`Conventions: OK (${files.length} files)`)
  process.exit(0)
}

const byRule = new Map()
for (const p of problems) {
  if (!byRule.has(p.rule.name)) byRule.set(p.rule.name, { why: p.rule.why, hits: [] })
  byRule.get(p.rule.name).hits.push(p)
}

for (const [name, { why, hits }] of byRule) {
  console.error(`\n${name} (${hits.length})\n  ${why}`)
  for (const h of hits) console.error(`  ${h.file}:${h.line}  ${h.text}`)
}
console.error(
  `\n${problems.length} problem(s). Fix them. If one is a genuine exception, end the line with ` +
    `// colour-ok and say why, or raise it with Web Dev before changing the rule itself.`,
)
process.exit(1)
