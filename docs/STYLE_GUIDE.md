# Style guide

The reference for how this wiki is written and how it is built. If you are here
to add content, [CONTRIBUTING.md](../CONTRIBUTING.md) is the shorter, more
practical document; come here for the details it points at.

## Contents

- [Writing](#writing)
- [The page object](#the-page-object)
- [The six block kinds](#the-six-block-kinds)
- [Where inline formatting works](#where-inline-formatting-works)
- [Colour](#colour)
- [Type](#type)
- [Classes you can use](#classes-you-can-use)
- [Design rules](#design-rules)
- [Accessibility rules](#accessibility-rules)
- [House rules the checker enforces](#house-rules-the-checker-enforces)

## Writing

There are two voices on this site and they are kept apart.

**Visitor-facing copy** (page titles, kickers, story beats, prose) can be warm
and garden-themed. The hedgehog and the garden are the team's own idea from the
16 July wiki-theme brainstorm, and the theme is a pun with a point: the project
is about Hedgehog signalling. Lean into it in a `storyBeat`. Everywhere else,
write like a scientist explaining their work to another scientist.

**Comments, commit messages and these docs** are notes from one team member to
the rest of the team. Direct and short. No character voice, no jokes about the
garden, nothing that sounds like an outside agency wrote it.

- Do: `// pending real roster and photos from the Ops headshot form`
- Do: `// TODO(wetlab): add assay results once the two-hybrid screen runs`
- Not: anything a mascot would say.

More specifically:

- **No em dashes**, anywhere. Use a period, a comma, a colon, or brackets. The
  checker enforces this.
- **Do not narrate what the code used to be.** A comment saying "an earlier
  version did X, and it was removed because Y" is a note to a reader who does
  not exist. Say what the code does now. Git remembers the rest.
- **Do not write a comment that restates the line below it.** Comment the why,
  not the what: a browser quirk, a measured value, a constraint, a reason the
  obvious approach does not work.
- **Do not use Unicode look-alikes.** Straight quotes in code, real hyphens in
  prose. Curly quotes are fine in visitor-facing copy.

### Marking things that are not finished

Unfinished content is tracked in [CONTENT_MAP.md](CONTENT_MAP.md), page by
page, not shown on the live site. While you draft, a `todo` block renders as a
dashed "still to come" panel so the gap is easy to see; take it out before the
page is merged. If a reader needs to know something is missing, the page says
so in plain words.

In code and in content, the one marker is:

```
TODO(owner): what is missing
```

`owner` is a subteam or a person: `TODO(wetlab)`, `TODO(creative)`,
`TODO(ops)`, `TODO(protein design)`, `TODO(pre-publish)`. An unowned TODO is
nobody's job. Grep for `TODO(` to see everything outstanding.

Placeholder text a visitor might read stays plain and factual: "Results
pending", not a joke about empty flower beds.

## The page object

Every wiki page is one object in `src/site/content/pages.ts`, with these fields.

| Field | Required | What it is |
| --- | --- | --- |
| `slug` | yes | The address of the page, everything after the `#` in the URL. Starts with `/`, unique, no trailing slash. This exact string also goes in `nav.ts`. |
| `title` | yes | The large heading on the wooden sign at the top. Also the browser tab title, as `Title · Tending the Hedge · Washington iGEM`. |
| `kicker` | yes | The small spaced label above the title. House style is lower case with a middle dot: `chapter 04 · engineering`. |
| `storyBeat` | yes | One or two sentences in the hedgehog's voice, in a flat panel under the title. The one place the garden voice belongs. Plain text. |
| `intro` | no | A lede paragraph in larger type. One or two sentences on what the page is about, in normal scientific English. Omit it and nothing renders in its place. Plain text. |
| `blocks` | yes | The body of the page, a list of blocks. An empty list gives you a header and nothing under it, which is a fine way to start a page. |

## The six block kinds

Everything in a page's `blocks` list is one of these. There are no others; if you
need a seventh, that is a Web Dev change to `src/site/pages/WikiPage.tsx`, and
the compiler will refuse to build until the new kind is handled there.

### `prose`

Paragraphs in a cream panel. The default, and what most of the wiki is.

```ts
{
  kind: 'prose',
  heading: 'The short version',          // optional
  body: ['First paragraph.', 'Second paragraph.'],
  source: 'Where this came from.',       // optional, small line under a rule
}
```

Each string in `body` becomes its own paragraph. **Bold, italic and code work
here.**

### `cards`

A two-column grid of cards. Good for a small set of parallel things.

```ts
{
  kind: 'cards',
  heading: 'Two arms, opposite directions',  // optional
  intro: 'A line introducing the set.',      // optional, plain text
  items: [
    { title: 'Up arm', body: 'What it does.', note: 'A smaller aside.' },
  ],
  source: 'Where this came from.',           // optional
}
```

`note` on an item is optional and renders smaller under the body. **Bold, italic
and code work in `body`**, but not in `title` or `note`.

### `steps`

The same cards, numbered, in a numbered list. For pipelines and cycles. Same
fields as `cards`. The numbers come from the order of `items`, so do not type
them into the titles: each card gets a small numbered badge before its title.

### `facts`

Compact key and value pairs, in two columns.

```ts
{
  kind: 'facts',
  heading: 'At a glance',      // optional
  items: [{ title: 'Target', body: 'MEGF8 and MOSMO interface' }],
}
```

No `source` field. Plain text only.

### `quote`

A pulled-out quote on a wooden sign, with an attribution under it.

```ts
{
  kind: 'quote',
  body: ['One line worth stopping on.'],
  source: 'Dr. Ning Zheng, UW Pharmacology',   // optional
}
```

Each string in `body` is its own paragraph, and bold, italic and code work in
them. Curly quote marks are added for you; do not type them.

### `todo`

A dashed "still to come" panel, for drafting only. Take it out before the page
is merged and list the gap in [CONTENT_MAP.md](CONTENT_MAP.md) instead.

```ts
{
  kind: 'todo',
  body: [
    'TODO(wetlab): all data. Figures, replicates, statistics, and the negative results too.',
  ],
}
```

Plain text only. Use the `TODO(owner):` form.

## Where inline formatting works

`**bold**`, `*italic*` and `` `code` `` work in exactly **four** places, all of
them called `body`:

1. a `prose` block's `body`
2. a `cards` item's `body`
3. a `steps` item's `body`
4. a `quote` block's `body`

Everywhere else the characters are published literally, asterisks and all. That
includes: `intro` (both the page's and a block's), `storyBeat`, `title`, `kicker`,
`source`, every `facts` field, `todo` lines, card `note`s, subteam
`blurb`, and member `titles` and `bio`.

Nothing else is supported. Markdown links, headings, lists, `_underscores_` for
italic, and a bold phrase that itself contains an asterisk all come out as raw
characters, with no warning and no build error. There is no markdown library
here on purpose: the formatter is one regular expression in
`src/site/components/RichText.tsx`, and it cannot inject markup into the page.
If you need a link in body copy, ask Web Dev.

Bold gets a pale yellow highlight behind it. Use it for the two or three terms a
reader should come away with, not for emphasis in general.

## Colour

**Do not write a colour value in the site's code.** The checker will fail the
build. `src/engine/` is exempt because it is where colour comes from.

Every colour on this site comes from the engine's palette in
`src/engine/palette.ts`. At startup, `src/site/palette-vars.ts` publishes each
palette key as a CSS variable (`--p-grass1`, `--p-bushHi`, and so on), and
`src/index.css` points every Tailwind token at one of those. Re-theming the
garden re-themes the site, and the site can never drift from the world behind it.

Use these tokens:

| Token | Use |
| --- | --- |
| `leaf-50` to `leaf-200` | Surfaces: panel fills, footer, hover states |
| `leaf-300` to `leaf-600` | Borders and rules |
| `leaf-700` | **Borders only.** Too light for text: 3.4:1 on a cream panel |
| `leaf-800` to `leaf-950` | Text |
| `pool-100`, `pool-200`, `pool-400`, `pool-600` | Water blues, and the primary button |
| `petal-lilac`, `petal-pink`, `petal-daisy`, `petal-cream`, `petal-blue` | Flower accents |
| `wood`, `wood-line` | Signboards |
| `stone`, `stone-dark` | Stone |

Body text is the `--ink` variable by default, inherited from `body`. You rarely
need to set a text colour at all.

There are exactly two derived colours on the site, both defined at the top of
`src/index.css` with their measured contrast ratios in the comment: `--ink` and
`--sign-ink`. Both exist because the palette's darkest tones were mixed for
pixel art on grass, not for small text on a panel. If you re-theme the palette,
re-check both against a contrast checker.

The one place raw colour values are allowed is pixel-art data:
`src/site/refSprites.ts` and the skin, hair and clothing arrays in
`src/site/components/PixelPerson.tsx`. Those are artwork, not theme.

## Type

Two families, and the rule between them matters:

- **Pixelify Sans** (`font-pixel`, and every `h1` to `h6` automatically) for
  headings, labels and buttons.
- **Nunito** (`font-body`) for everything a person reads in sentences.

**Body copy is never in the pixel font.** It is a display face and a paragraph
of it is genuinely hard to read.

Use the size scale rather than an arbitrary value. `text-[0.94rem]` and
`text-[0.95rem]` next to each other is how a page ends up with five sizes that
are all trying to be the same size.

| Class | Size | Use |
| --- | --- | --- |
| `text-body` | 0.98rem | Paragraphs inside a panel |
| `text-body-sm` | 0.9rem | Supporting copy, card bodies, bios |
| `text-note` | 0.78rem | Sources, captions, taglines |
| `text-tag` | 0.68rem | Pixel eyebrow labels and small tags |

**Meaningful digits use `.numeral` or `.badge`.** Pixelify Sans renders 0/8 and
2/8 close enough to be misread at small sizes, and "22 Nov 2025" reading as
"88 Nov 8085" is an error, not a style. Both classes switch to the body font
with tabular figures.

## Classes you can use

Defined in `src/index.css`. Most are in `@layer components`; `.pixel` and
`.pixelated` are in `@layer base`.

| Class | What it is |
| --- | --- |
| `.panel` | The reading panel. Cream, hard border, hard offset shadow |
| `.panel-flat` | The same without the shadow, for secondary panels |
| `.sign` | A wooden signboard, in the hedgehog's quill tones |
| `.pixel-btn` | A button or a link styled as a button |
| `.pixel-btn-primary` | The same in water blue, for the one main action |
| `.nav-link`, `.nav-group` | Navigation items. Used only by `TopNav` |
| `.prose-garden` | Paragraph spacing and measure inside a panel |
| `.quote-sign` | Adds the curly quote marks to a quote block |
| `.kicker` | The small spaced pixel label above a heading |
| `.numeral` | Body font with tabular figures, for digits |
| `.badge` | A small numeric badge: step numbers, dates |
| `.todo-note` | One dashed "not written yet" line |
| `.skip-link` | The keyboard jump past the nav. Used once, in `App.tsx` |
| `.sr-only` | Visually hidden, still read aloud by a screen reader |
| `.reveal` | Fades in once when scrolled into view |
| `.pixel` | Puts the pixel font on something that is not a heading |
| `.pixelated` | Keeps an upscaled image's pixels square |
| `.pond-range` | The playground's slider. Used once, and nowhere else |

A class that is not on this list and not a Tailwind utility does nothing. There
is no warning when you misspell one: the element simply renders unstyled.

Custom CSS goes in `@layer components`. Unlayered CSS beats every Tailwind
utility, so an unlayered `.pixel-btn` would make `lg:hidden` stop working on a
button.

## Design rules

1. **The garden is never imitated.** No CSS gardens, no sprites scattered as
   decoration, no invented plants or creatures. If something garden-shaped needs
   to move, the engine moves it. The sprites look right because of the baked
   terrain, shorelines, shadows and depth sorting behind them; lifted out and put
   on a CSS background they read as floating stickers.
2. **No ambient CSS animation.** The only keyframe in `index.css` is `fade-up`,
   used by `.reveal`. Everything alive on this site is the canvas.
3. **No gradients.** There is not one `linear-gradient` or `radial-gradient`
   anywhere in `src/`. Flat palette colours, hard 3px borders, hard offset
   shadows.
4. **Text lives on clean panels.** The grass shows around them, which is what
   makes a page read as a garden without anything being printed over grass.
5. **The reading column is 896px** (`max-w-4xl` on `GardenSection`), with the
   garden's plants in the margins either side. The three canvas layers measure in
   pixels to line up with it, and those numbers live in `src/site/layout.ts`. If
   you change the width or padding classes on `GardenSection`, change
   `layout.ts` in the same commit.
6. **Layering.** Garden canvas `z-0`, scroll hedgehog `z-[5]`, page content
   `z-10`, sticky nav `z-40`, dropdowns and dialogs `z-50`, the skip link `z-60`.
   Two things to know before you change any of them. A `position: fixed` element
   with a *negative* z-index gets composited behind the body background once the
   document scrolls, which blanks the whole garden, so never do that. And the
   content wrapper's `z-10` creates a stacking context, so a dialog inside it at
   `z-50` still loses to any root-level sibling above `z-10`. That is why the
   hedgehog sits at `z-[5]` rather than somewhere higher.
7. **Reduced motion stops the game loop after one still frame.** You still get
   the real garden, it just does not move. Anything you add that moves must
   honour the same setting.

## Accessibility rules

This site is judged, and it is read by people using screen readers and
keyboards. These are not optional polish.

- **One `h1` per page**, and headings do not skip a level. On a wiki page the
  `h1` is the page title, block headings are `h2`, and cards are `h3`. This is
  handled for you if you use the block kinds.
- **Text contrast is at least 4.5:1**, or 3:1 for large text and UI borders.
  This is why `leaf-700` is borders only. When in doubt, check a real
  contrast checker with the two hex values, not by eye.
- **Every interactive thing is a `<button>` or an `<a>`.** Never a `<div>` with
  an `onClick`: it cannot be reached or activated from a keyboard.
- **Decorative canvases and images get `aria-hidden`** or `alt=""`. The garden
  is decoration. A figure that carries information is not.
- **Never remove a focus outline.** The ring is defined once in `index.css` and
  is measured to clear 3:1 on both a cream panel and bare grass.
- **Anything that opens gets `aria-expanded`**, and the current page gets
  `aria-current`. The `Link` component takes a `current` prop for this.

## House rules the checker enforces

`npm run check` runs the TypeScript compiler and then
`scripts/check-conventions.mjs`, which enforces two rules a compiler cannot:

1. No em dashes in any `.ts`, `.tsx`, `.css`, `.html`, `.md` or `.mjs` file
   under `src/`, `docs/` or `scripts/`, or anywhere at the repo root.
2. No hex colour (3, 6 or 8 digit) in any `.ts`, `.tsx` or `.css` file under
   `src/`, except `src/engine/` (which is the palette) and the two pixel-art
   files. A `color-mix` line is allowed, and a line ending in `colour-ok` is an
   explicit, documented opt-out.

It reads files from disk rather than from git, so a file you have not committed
yet is still checked.

These checks are required to merge. A pull request that fails them cannot go
into `main`, which is protected for everyone, admins included.

There is deliberately no ESLint or Prettier here. Adding them would mean a few
hundred more packages and a config to argue about, for a team where most people
are here to do biology. If a third rule earns its place, add it to that script
rather than reaching for a linter.
