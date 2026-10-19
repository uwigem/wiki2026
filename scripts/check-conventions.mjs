#!/usr/bin/env node
/**
 * House-rule checks, run by `npm run check` alongside the TypeScript compiler.
 *
 * These are the conventions in docs/STYLE_GUIDE.md that a compiler cannot
 * enforce: no em dashes, no hard-coded colours, and body text that fills its
 * column. There is no ESLint in this repo on purpose: it would add a few
 * hundred packages and a config to maintain. If a third rule ever earns its place,
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
 * it, so of course it is full of hex. The rest are pixel-art data.
 */
const COLOUR_EXEMPT = [
  'src/engine/',
  'src/site/refSprites.ts',
  'src/site/components/PixelPerson.tsx',
  'src/site/content/balanceLogo.ts',
  'src/site/content/teamLogo.ts',
  'src/site/content/creditLogos.ts',
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

/* ---------------------------------------------------------------------------
 * Body text fills its column (design rule 8 in docs/STYLE_GUIDE.md).
 *
 * Every time text stopped short of its card, the cause was a width cap: a
 * `max-w-*` on a paragraph or on the box around it, or a `max-width` in the
 * stylesheet that beats every utility. So this flags any width cap, on any
 * element, in markup and in CSS, and lets through only the boxes listed in
 * WIDTH_ALLOWLIST below, by file, token and exact count. A new cap anywhere,
 * or one more copy of an allowed one, fails the build.
 *
 * There is deliberately no comment that switches it off on a line: an
 * exception is an edit to this list, which shows up in review.
 * ------------------------------------------------------------------------- */

/** Unrouted old pages kept for reference; nothing there is published. */
const WIDTH_EXEMPT = ['src/site/pages/archive/']
const COMMENT_LINE = /^\s*(?:\/\/|\/\*|\*)/
const VARIANTS = String.raw`(?<![\w\-[/])(?:(?:[\w-]+|[\w-]*\[[^\]\s]+\]):)*`
const WIDTH_PATTERNS = {
  markup: [
    // max-w-<anything but full/none/0/min/max/fit>, its v4 var and arbitrary
    // forms, and the arbitrary property [max-width:...], with any variant.
    new RegExp(VARIANTS + String.raw`(?:max-w-(?!(?:full|none|0|min|max|fit)(?![\w-]))(?:\([^)\s]+\)|\[[^\]\s]+\]|[\w./-]+)|\[(?:max-width|max-inline-size):[^\]\s]+\])(?![\w-])`, 'g'),
    // Fractional and arbitrary widths cap text just as well: w-2/3, w-[60%].
    new RegExp(VARIANTS + String.raw`(?:w|basis)-(?:\d+\/\d+|\[[^\]\s]*(?:%|rem|ch|em|vw)[^\]\s]*\]|\([^)\s]+\))(?![\w-])`, 'g'),
    // A cap in a React style object.
    /\b(?:maxWidth|maxInlineSize)\b(?=\s*:(?!\s*['"]100%['"]))/g,
    // Balanced wrapping shortens lines with no width at all.
    new RegExp(VARIANTS + String.raw`text-(?:balance|pretty)(?![\w-])`, 'g'),
  ],
  css: [
    // A capping declaration. `@media (max-width: ...)` has a bracket before it
    // and is not matched.
    /(?:^|[{;])\s*(?:max-width|max-inline-size)\s*:(?!\s*(?:none\b|100%|unset\b|initial\b|inherit\b))[^;]*/g,
    // A width-scale token: redefining one shrinks every max-w-* at once.
    /^\s*--(?:measure[\w-]*|container-[\w-]+)\s*:[^;]*/g,
    /@apply\b[^;]*\bmax-w-[^;\s]*/g,
    /text-wrap\s*:\s*(?:balance|pretty)/g,
  ],
}

/**
 * The only width caps allowed, as { file: { token: count } }. Each one is a
 * box that is narrow by design and is not a run of body text: the page column
 * itself, the header, footer and explore cards, dialogs, graphics, game UI,
 * the 404 box, a figure placeholder, funnel stage labels, and tiles.
 */
const WIDTH_ALLOWLIST = {
  'src/index.css': { 'max-width: 56rem': 1 }, // .garden-column, the backdrop beside the reading column
  'src/App.tsx': { 'max-w-md': 1 }, // the 404 box
  'src/site/components/GardenSection.tsx': { 'max-w-4xl': 1 }, // the reading column itself
  'src/site/components/TopNav.tsx': { 'max-w-6xl': 1 },
  'src/site/components/FooterGarden.tsx': { 'max-w-5xl': 1 },
  'src/site/components/ExploreCards.tsx': { 'max-w-3xl': 1, 'max-w-6xl': 1, 'w-[calc((100%-1rem)/3)]': 1 },
  'src/site/components/SectionRail.tsx': { 'max-w-[11rem]': 1, 'sm:max-w-[15rem]': 1 }, // the outline button
  'src/site/components/MemberModal.tsx': { 'max-w-2xl': 1 }, // dialog
  'src/site/components/StakeholderModal.tsx': { 'max-w-xl': 1 }, // dialog
  'src/site/components/CreditModal.tsx': { 'max-w-2xl': 1 }, // dialog
  'src/site/components/alchemy/FieldGuide.tsx': { 'max-w-xl': 1 }, // dialog
  'src/site/components/alchemy/Workbench.tsx': { 'md:max-w-md': 1, 'max-w-sm': 1 }, // game bubble and dialog
  'src/site/pages/AlchemyPage.tsx': { 'max-w-5xl': 1 },
  'src/site/components/FigureFrame.tsx': { 'max-w-md': 1 }, // caption inside an empty figure placeholder
  'src/site/components/FunnelChart.tsx': { 'max-w-md': 1 }, // stage labels inside the funnel
  'src/site/components/PixelSign.tsx': { 'max-w-2xl': 1 }, // centred pull quote
  'src/site/components/VideoRow.tsx': { 'max-w-2xl': 1 }, // a lone video player, not text
  'src/site/components/ToolShed.tsx': { 'w-[7.25rem]': 1 }, // tool tiles
  'src/site/components/CycleWheel.tsx': { 'max-w-[16rem]': 1, 'w-[30%]': 1 }, // the ring graphic
  'src/site/components/StoryArt.tsx': { 'max-w-[320px]': 1 },
  'src/site/components/story/StoryStage.tsx': { 'w-[40%]': 1, 'w-[calc(40%-5rem)]': 1, 'xl:w-[calc(40%-7rem)]': 1 },
  'src/site/components/BalanceLogo.tsx': { maxWidth: 1 },
  'src/site/components/ResultsSoon.tsx': { maxWidth: 1 },
  'src/site/components/ScienceFigure.tsx': { maxWidth: 1 },
  'src/site/components/SignalDial.tsx': { maxWidth: 1 },
  // Only the unrouted archive home page uses this hero.
  'src/site/components/GardenHero.tsx': { 'max-w-3xl': 1, 'max-w-xl': 1, 'max-w-2xl': 1 },
}

/** Every width cap on one line of one file. */
function widthTokens(file, line) {
  const kind = file.endsWith('.css') ? 'css' : /\.(ts|tsx)$/.test(file) ? 'markup' : null
  if (!kind || COMMENT_LINE.test(line)) return []
  return WIDTH_PATTERNS[kind].flatMap((re) =>
    [...line.matchAll(re)].map((m) => m[0].replace(/^[{;]?\s*/, '').trim()),
  )
}

/**
 * Proves the patterns still catch what they must and leave alone what they
 * must, so nobody can quietly weaken them. Each case is a line and the tokens
 * it should produce.
 */
const WIDTH_SELF_TEST = [
  ['x.tsx', '<p className="mt-1 max-w-2xl text-body">', ['max-w-2xl']],
  ['x.tsx', '<div className="sm:max-w-[42rem] w-2/3 max-w-prose">', ['sm:max-w-[42rem]', 'max-w-prose', 'w-2/3']],
  ['x.tsx', '<p className="max-w-none w-full max-w-full">', []],
  ['x.tsx', 'style={{ maxWidth: 560 }}', ['maxWidth']],
  ['x.tsx', '<h2 className="text-balance">', ['text-balance']],
  ['x.css', '  max-width: var(--measure);', ['max-width: var(--measure)']],
  ['x.css', '  --measure: 35rem;', ['--measure: 35rem']],
  ['x.css', '  --container-2xl: 30rem;', ['--container-2xl: 30rem']],
  ['x.css', '@media (max-width: 639px) {', []],
  ['x.css', '  max-width: none;', []],
  ['x.css', '  text-wrap: balance;', ['text-wrap: balance']],
]
for (const [file, line, want] of WIDTH_SELF_TEST) {
  const got = widthTokens(file, line)
  if (got.slice().sort().join('|') !== want.slice().sort().join('|')) {
    console.error(`The width rule's self-test failed on: ${line}\n  wanted ${JSON.stringify(want)}, got ${JSON.stringify(got)}`)
    process.exit(1)
  }
}

const WIDTH_RULE = {
  name: 'no width caps on text',
  why:
    'Body text runs the full width of its panel, card or column on every page (design rule 8 in ' +
    'docs/STYLE_GUIDE.md). Remove the width. Do not add to WIDTH_ALLOWLIST to get text through: ' +
    'that list is only for boxes that are not body text, and Web Dev decides what goes on it.',
}
const STALE_RULE = {
  name: 'stale width allowlist entries',
  why: 'WIDTH_ALLOWLIST allows more caps than exist. Lower or remove the entry so the list stays exact.',
}

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

  if (!file.startsWith('src/') || WIDTH_EXEMPT.some((e) => file.startsWith(e))) continue
  const found = new Map() // token -> [line numbers]
  lines.forEach((line, i) => {
    for (const t of widthTokens(file, line)) found.set(t, [...(found.get(t) ?? []), i + 1])
  })
  const allowed = WIDTH_ALLOWLIST[file] ?? {}
  for (const [token, at] of found) {
    if (at.length <= (allowed[token] ?? 0)) continue
    for (const n of at)
      problems.push({ file, line: n, rule: WIDTH_RULE, text: `${token}  (allowed here: ${allowed[token] ?? 0}, found: ${at.length})` })
  }
  for (const [token, count] of Object.entries(allowed)) {
    const have = found.get(token)?.length ?? 0
    if (have < count) problems.push({ file, line: 0, rule: STALE_RULE, text: `${token}: allowed ${count}, found ${have}` })
  }
}
for (const file of Object.keys(WIDTH_ALLOWLIST)) {
  if (!files.includes(file)) problems.push({ file, line: 0, rule: STALE_RULE, text: 'file no longer exists' })
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
  `\n${problems.length} problem(s). Fix them. A genuine colour exception ends its line with ` +
    `// colour-ok and says why. Widths have no opt-out: see the rule's own note above.`,
)
process.exit(1)
