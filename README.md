# HedgehogSense, the Washington iGEM 2026 wiki

The team wiki, built as a pixel garden. The homepage opens with a live canvas
garden; every other page is flat grass, cream reading panels, and a hedgehog
that walks down the margin as you scroll.

The theme is the team's own, from the 16 July wiki-theme brainstorm, and it is a
pun with a point: the project is about **Hedgehog signalling**, so the guide is a
hedgehog and the site is a garden being tended.

> **The project is called HedgehogSense.** It replaced the brainstorm
> placeholder "Tending the Hedge". The name lives in one place,
> `PROJECT_TITLE` in `src/site/content/site.ts`, and changing it there updates
> the nav, the footer, the homepage sign and every tab title.

> **The homepage** (`#/`) is the team's scroll-driven script, planned in
> `docs/HOME3_PLAN.md`. The two homepages it was compared with are archived in
> `src/site/pages/archive/`: the code is kept, nothing routes to it, and the
> addresses they used (`#/home-alt`, `#/home-3`) are dead.

> **The site structure is the team's final architecture** (agreed 2026-10-08):
> Home, Project, Wetlab, Drylab, Human Practices, and Team and Resources, plus
> the Playground. It lives in `src/site/content/nav.ts`, and every page in
> `src/site/content/pages.ts` has to appear in it. Running `npm run dev` warns
> in the browser console about a page missing from the nav, a nav link with no
> page, or a link in the copy pointing at an address that moved.

> **Medal pages need extra attention.** The homepage, Engineering, Model,
> Integrated Human Practices, Education and Contribution are the evidence for
> medal criteria, so they have to be finished and specific. Those pages carry
> `medal: true` in `pages.ts`, and the dev check warns while one of them still
> has a `todo` block on it.

## See it live

**<https://uwigem.github.io/wiki2026/>** always shows what is on `main`.

It updates by itself. Every merge to `main` rebuilds the site and publishes it,
usually within a minute or two, and a check every 10 minutes republishes if a
deploy was ever missed. Nobody has to remember to do anything. The workflow is
`.github/workflows/deploy.yml`; the Actions tab shows each publish, and its
"Run workflow" button publishes on demand.

This is the team's working preview, not the competition wiki. It is hidden from
search engines, so a search for the project finds igem.wiki rather than this.
The official wiki is uploaded separately, see
[Deploying to igem.wiki](#deploying-to-igemwiki).

This repository is public. Everything in it, including its history, can be read
by anyone, so it holds the website and nothing else.

## Start here

- **Just changing some words?** [EDITING.md](EDITING.md). Five minutes, in your
  browser, nothing to install. This is the right door for most of the team.
- **Adding a page, or running the site on your laptop?**
  [CONTRIBUTING.md](CONTRIBUTING.md).
- **Writing or styling something new?** [docs/STYLE_GUIDE.md](docs/STYLE_GUIDE.md).
- **Checking a claim against the team's own documents?**
  [docs/PROJECT_CONTENT.md](docs/PROJECT_CONTENT.md) maps what is on the wiki
  back to the Drive file it came from, and lists what must not be published.
- **Wondering where your section belongs?** [docs/CONTENT_MAP.md](docs/CONTENT_MAP.md)
  goes page by page: what is written, what is still missing, who owns it, and
  which kind of block to use for it.

## Run it

Node 20 or newer.

```bash
npm install
```

```bash
npm run dev
```

Serves on <http://localhost:5173> and reloads on save.

```bash
npm run check
```

Type-checks the whole project and enforces the two house rules. **Run this
before you push.** `npm run dev` does not type-check, so it will keep serving a
page whose file would fail the real build.

```bash
npm run build
```

Type-checks, then bundles into `dist/`.

## Stack

Vite, React 19, TypeScript, Tailwind v4. **No runtime dependencies beyond React
itself**, and two deliberate omissions:

- **No router library.** Routing is one small file, `src/site/router.tsx`. iGEM
  serves each wiki as static files from a subpath, and hash routes
  (`#/drylab/model`) survive that with no server rewrite rules.
- **No markdown library.** Body copy supports `**bold**`, `*italic*` and
  `` `code` `` through one regular expression in
  `src/site/components/RichText.tsx`, which cannot inject markup into the page.

There is no ESLint or Prettier either. `npm run check` covers what they would
have caught here. See the [style guide](docs/STYLE_GUIDE.md#house-rules-the-checker-enforces)
for the reasoning.

## Repo map

```
.github/             pull request template, CODEOWNERS, and the CI checks
src/
  engine/            the pixel game engine. FROZEN, see below
  components/        PixelCanvas, the engine's canvas mount. FROZEN
  hooks/             useAmbientAudio. FROZEN
  site/
    content/         ALL wiki copy lives here, as data
    components/      the site's own React components
    pages/           the four routes that are not data-driven
    router.tsx       the hash router
    layout.ts        page geometry shared between the DOM and the canvases
    theme.ts         which palette the site paints with
    rng.ts           seeded randomness
    hooks.ts         reduced motion, the intro sequence, scroll reveals
    palette-vars.ts  publishes the engine palette as CSS variables
    favicon.ts       the browser-tab icon, drawn from the team logo
  index.css          theme tokens and shared classes
  App.tsx            the app shell: routing, nav, footer, skip link
docs/                the style guide and the content sourcing reference
scripts/             the house-rule checker
```

Every pull request runs `npm run check` and `npm run build`, and fails if it
touches a frozen engine file. Every merge to `main` publishes the live preview.
`.github/CODEOWNERS` requests a review from Web Dev on every pull request.

**`main` is protected**, and the rules apply to admins too:

- Changes go in only through a pull request. Nobody can push to `main`
  directly, force-push it, or delete it.
- A pull request can be merged only once its `check` job has passed. That job
  is `npm run check`, the build, and the frozen-engine guard.
- No approval is required. A review is requested automatically, but making it
  mandatory would hold the whole team's work on one person.
- A branch does not have to be up to date with `main` first, which would mean
  constant rebasing for people editing in the browser.

To change any of this: Settings > Branches > `main`, or
`gh api repos/uwigem/wiki2026/branches/main/protection`.

### Where the content lives

**All copy is data.** You almost never need to open a component to edit the
wiki.

| File | What is in it |
| --- | --- |
| `src/site/content/pages.ts` | The ten wiki pages, as data |
| `src/site/content/nav.ts` | Navigation groups, and the footer sitemap |
| `src/site/content/team.ts` | Subteams and members |
| `src/site/content/timeline.ts` | The notebook page's season timeline |
| `src/site/content/site.ts` | Project title, tagline, CTAs, footer links |

Four routes are not built from `pages.ts`: the home, team, notebook and
playground pages. [CONTRIBUTING.md](CONTRIBUTING.md#the-four-routes-that-are-not-in-pagests)
says where each of their strings lives.

## The garden, and the site on top of it

The garden is a hand-written canvas engine. Nothing on this site is a CSS
imitation of it, and no sprite is pasted on as an image: where the site needs a
piece of the garden, it runs the engine.

**The homepage hero** (`HeroGarden.tsx`) runs `src/engine/game.ts` unmodified:
baked terrain, animated waterfall, ripples, depth-sorted plants, sparkles.

**Every other page** gets `PageGarden.tsx`, which bakes a background from the
engine's own recipes: `terrain.ts`'s grass, `world.ts`'s pond edges, and the
engine's real flower, tree and rock sprites. Plants are scattered into the left
and right margins from a fixed seed; the middle stays clean grass so the reading
panels sit on a consistent green. It is baked once to the full document height
and a moving window is blitted to the viewport, so it scrolls with the page.

**The hedgehog in the margin** (`HedgehogGuide.tsx`) is the engine's own
`Player`, running headless. Its vertical target is a straight linear function of
scroll and the drawn position chases that target with frame-rate-scaled damping,
so it settles rather than snapping. Walking direction comes from actual
movement, which is why a still page shows the idle breathe rather than a walk
cycle. It is hidden below `lg`, where there is no margin to stand in, and the
loop stops there rather than burning battery drawing something nobody can see.

**Colour** comes from the same place. `site/palette-vars.ts` publishes every key
of the engine's palette as a `--p-*` CSS variable before the first paint, and
every token in `index.css` points at one. Editing `BASE` in
`src/engine/palette.ts` re-themes the panels, buttons, signs and borders along
with the world.

### Frozen files

`src/engine/`, `src/components/PixelCanvas.tsx` and
`src/hooks/useAmbientAudio.ts` are the engine. Do not edit them for a content or
styling change. One number in `palette.ts` re-colours every panel on every page.
If you think you need to change something in there, raise it with Web Dev first.

```bash
git fetch origin && git diff --stat origin/main -- src/engine src/components/PixelCanvas.tsx src/hooks/useAmbientAudio.ts
```

The same check runs automatically on every pull request, so it does not depend
on anyone remembering to type it.

## Deploying to igem.wiki

The live preview above publishes itself. The competition wiki does not: it is a
separate, deliberate step, done when the team is ready.

`npm run build` writes `dist/`. Upload its contents to the team's wiki space, so
that `dist/index.html` is served at `https://2026.igem.wiki/washington/`.

Two things make that work, and both are easy to undo by accident:

- **`base: './'` in `vite.config.ts`.** iGEM serves each wiki from a subpath.
  Vite's default emits root-absolute asset URLs (`/assets/...`), which 404 there
  and render a blank page with no obvious cause. Relative URLs work from any
  subpath.
- **Hash routing.** Every route is `#/something`, so the server only ever has to
  serve one file and needs no rewrite rules.

The same two things are why the live preview works at
`uwigem.github.io/wiki2026/`, which is also a subpath.

To check a build locally the way it will actually be served:

```bash
npm run build && npx vite preview
```

## Before the wiki freeze

Content gaps are tracked page by page in
[docs/CONTENT_MAP.md](docs/CONTENT_MAP.md), and `grep -rn "TODO(" src` lists the
ones marked in code. The items that are not content:

- **Self-host the two fonts** under `public/fonts/`. The site currently loads
  Pixelify Sans and Nunito from `fonts.googleapis.com` at page load, which is a
  third-party dependency the wiki should not have. See the TODO at the top of
  `src/index.css`.
- **Add a licence.** There is no `LICENSE` file and no `license` field in
  `package.json`. iGEM's rules have historically required wiki content under
  CC BY 4.0; confirm the 2026 wording against the competition rules before
  choosing, then add the required attribution line to the footer. There is a
  `TODO(pre-publish)` marking the spot in `FooterGarden.tsx`.
- **Confirm the required-pages list.** `nav.ts` is a best guess. Contribution,
  Collaborations and the judging-form pages may need to be added.
- **Get the wiki freeze and Jamboree dates** off the official iGEM calendar.
  Neither appears anywhere in the team's own notes.
- **Project name and logo** from Creative.
- **The last profiles.** Three members have not sent a bio, photo or avatar, and
  three more have no photo. The list is in `docs/CONTENT_MAP.md` under Team.
