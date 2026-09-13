# Contributing to the wiki

This guide assumes you have never touched a React project and do not intend to
start. Almost every change to this wiki is editing a list of text in one file.

If you get stuck at any point, ask on the Web Dev channel. Nobody here expects
you to debug a build error on your own.

## Contents

- [Get the repo, once](#get-the-repo-once)
- [Set up, once](#set-up-once)
- [Making a change](#making-a-change)
- [Add or edit a wiki page](#add-or-edit-a-wiki-page)
- [Add yourself or a teammate to the team page](#add-yourself-or-a-teammate-to-the-team-page)
- [Add an entry to the notebook timeline](#add-an-entry-to-the-notebook-timeline)
- [Change the project title, tagline or footer links](#change-the-project-title-tagline-or-footer-links)
- [Which files you may edit](#which-files-you-may-edit)
- [When something goes wrong](#when-something-goes-wrong)

## Get the repo, once

Everything below is typed into a terminal: **Terminal** on a Mac, **Git Bash**
on Windows (it comes with Git). You will need two things installed first.

- [Git](https://git-scm.com/downloads). Check it worked with `git --version`.
- [Node](https://nodejs.org), version 20 or newer. Check with `node -v`.

The repository is private, so ask Web Dev to add you to the `uwigem` GitHub
organisation first. Then copy it onto your machine:

```bash
git clone https://github.com/uwigem/wiki2026.git
```

```bash
cd wiki2026
```

Every command in the rest of this guide is run from inside that folder.

## Set up, once

```bash
npm install
```

Then, every time you work on the site:

```bash
npm run dev
```

That prints a `http://localhost:5173` address. Open it. Leave this running: the
page reloads itself every time you save a file.

## Making a change

1. Start a branch off `main`. Name it after what you are doing.

   ```bash
   git checkout main && git pull && git checkout -b results-page-figures
   ```

2. Edit the file. See the sections below for which file.

3. Look at it in the browser. The dev server reloads on save.

4. Run the checks before you push.

   ```bash
   npm run check
   ```

   This is the important step. `npm run dev` does **not** check your work: it
   will happily keep serving a page while the file has an error in it that
   breaks the real build. `npm run check` catches that plus the two house rules
   (see [the style guide](docs/STYLE_GUIDE.md)). If it prints `Conventions: OK`
   and nothing else, you are fine.

5. Commit and push. Check what you are about to commit first: `git status`
   should list only files you meant to change.

   ```bash
   git add -A && git commit -m "Add binding-assay figures to Results" && git push -u origin HEAD
   ```

6. Open a pull request. The `git push` above prints a link; open it, fill in the
   short template, and post it on the Web Dev channel so someone knows to look.
   A Web Dev lead reviews it and merges. Automated checks run on the pull
   request and have to pass before it can go in; if one fails, the failure
   message names the file and the line.

Write commit messages in plain English, in the imperative: "Add the MEGF8 binder
table", not "added stuff". Say why in the body if the why is not obvious.

## Add or edit a wiki page

**All ten wiki pages live in one file: [`src/site/content/pages.ts`](src/site/content/pages.ts).**
You do not need to open any other file to change words on those pages.

Find your page by its title, change the text, save. That is the whole job for an
edit.

### The shape of a page

A page is one object. Full field-by-field reference is in
[the style guide](docs/STYLE_GUIDE.md#the-page-object); the short version:

```ts
const contribution: Page = {
  slug: '/project/contribution',        // the address, after the # in the URL
  title: 'What We Left Behind',         // the big heading on the wooden sign
  kicker: 'chapter 11 · contribution',  // the small label above it
  storyBeat: 'A gardener leaves the beds better than they found them.',
  intro: 'One or two sentences saying what this page is about.',
  gardener: 'Your Name · Your Subteam',
  blocks: [
    { kind: 'prose', heading: 'Heading', body: ['A paragraph with **bold** in it.'] },
    { kind: 'cards', heading: 'Three things', items: [{ title: 'A card', body: 'Its body.' }] },
    { kind: 'todo', body: ['TODO(wetlab): the assay figures.'] },
  ],
}
```

There are six kinds of block. Each one is documented with an example in
[the style guide](docs/STYLE_GUIDE.md#the-six-block-kinds).

### Adding a brand new page

Four steps, and **all four are required**. Miss one and the page will not work,
usually without any error message.

1. Write the page object in `pages.ts`, next to the others in its family.

2. Add its variable name to the `PAGES` array at the bottom of `pages.ts`. A
   page missing from this array is unreachable: the URL gives a "This bed is
   empty" page. **The order of this array is the reading order** of the site: it
   is what the previous and next buttons at the bottom of each page follow.

3. Add it to a group in [`src/site/content/nav.ts`](src/site/content/nav.ts), so
   it appears in the navigation. The `to` here must be character-for-character
   identical to the `slug` in `pages.ts`, leading slash and all. This is also
   what puts the page in the footer sitemap, which does **not** come from
   `PAGES`.

4. If you changed the reading order, fix the `chapter NN` numbers in the
   `kicker` of every page after yours. Nothing does this for you, and nothing
   will warn you that they are out of step.

Slugs: start with `/`, lower case, hyphens between words, no trailing slash, and
unique across the whole site.

## Add yourself or a teammate to the team page

Everything on the team page comes from
[`src/site/content/team.ts`](src/site/content/team.ts).

### To add a person

Find your subteam in `SUBTEAMS` and add a line to its `members` list. Only
`name` is required:

```ts
{ name: 'Your Name' },
{ name: 'Your Name', role: 'Subteam lead', avatar: 'short' },
```

- `role` (optional) shows under your name in your profile card.
- `bio` (optional) is one sentence about you, shown in the same card. Without
  one, the card shows a note asking you to write one.
- `photo` (optional) is a path to your headshot, for example `/team/you.jpg`,
  with the file in a `public/team/` folder. That folder does not exist yet; Ops
  is collecting headshots. **Leaving `photo` out is the opt-out** if you would
  rather not have a photo on a public site, and nothing is missing from the page
  when you do: your pixel character stands in.
- `avatar` (optional) is `'long'` or `'short'`, for your pixel character's hair.
  Set it to whatever you prefer. If you leave it out, the template is guessed
  from your first name, and that guess is wrong for some people. Correcting it
  is this one word on your own line, and you do not need anyone's permission to
  change your own.

Your character's colours (hair, skin, top, trousers) are picked from your name,
so they are the same every time the page loads. If you want specific ones, ask
Web Dev to pin them in `LOOK_OVERRIDES` in
[`src/site/components/PixelPerson.tsx`](src/site/components/PixelPerson.tsx).

### To add a subteam

Add a whole object to `SUBTEAMS`:

```ts
{
  id: 'hardware',                         // unique, lower case, hyphens
  name: 'Hardware',
  flower: 'fern',                         // see the list at team.ts line 12
  tagline: 'builds the things that hold the things',
  blurb: 'One or two sentences on what this subteam does.',
  members: [{ name: 'Someone' }],
}
```

`flower` is the emblem shown beside the subteam's name. The nine allowed values
are listed on line 12 of `team.ts` itself, and anything else is a build error
that names the type. Eight are taken; `fern` is currently free. `tree` is a much
bigger sprite, so it is drawn at 2x where the others are 3x, and it is used for
Leadership. The plot colours behind each member come from the `id`, so changing
`id` reshuffles that bed's colours.

## Add an entry to the notebook timeline

The notebook is **not** in `pages.ts`. Its entries are in
[`src/site/content/timeline.ts`](src/site/content/timeline.ts):

```ts
{
  date: '14 Jul 2026',
  title: 'First binder expressed',
  body: 'One or two sentences on what happened.',
  team: 'Wet Lab',       // optional, shown as a small label
  milestone: true,       // optional, adds a thick blue rule down the side
},
```

Entries appear **in the order you write them in the array**, not sorted by date,
so add yours in the right place. `date` is free text and is not checked; keep
the house format (`22 Nov 2025`, or `20-28 Jan 2026` for a range).

This is the project timeline, not a lab notebook. Wet-lab protocol records live
in Benchling and should be summarised and linked here rather than retyped.

## Change the project title, tagline or footer links

Those are in [`src/site/content/site.ts`](src/site/content/site.ts), one
constant each. `PROJECT_TITLE` is the one to change when Creative delivers the
real project name: it is used in the hero, the nav, the footer and every browser
tab title, and changing it here changes all of them.

## Which files you may edit

**Yours, edit freely.** These are text files. The worst you can do is a typo
that `npm run check` catches.

- `src/site/content/pages.ts`, `nav.ts`, `team.ts`, `timeline.ts`, `site.ts`
- `docs/`, `README.md`, this file

**Ask Web Dev first.** A mistake here breaks every page at once rather than one
page.

- `src/App.tsx`, the routing and page shell
- `src/index.css`, the colours and shared styles
- anything in `src/site/components/` or `src/site/pages/`

**Never, without talking to Web Dev leads.** This is the team's own game engine.
It draws the garden, the pond, the plants and the hedgehog, and it supplies
every colour on the site. Changing one number here can re-colour every panel on
every page, or stop the garden drawing at all.

- everything in `src/engine/`
- `src/components/PixelCanvas.tsx`
- `src/hooks/useAmbientAudio.ts`

The automated checks on your pull request fail if you touched one of these, so
you will find out either way. To check before you push:

```bash
git fetch origin && git diff --stat origin/main -- src/engine src/components/PixelCanvas.tsx src/hooks/useAmbientAudio.ts
```

If it prints anything, you edited a frozen file. Say so on the Web Dev channel
rather than pushing it quietly.

### The four routes that are not in `pages.ts`

If you are looking for text and cannot find it in `pages.ts`, it is on one of
these, and changing it is a Web Dev job:

| Route | Where its content lives |
| --- | --- |
| `/` (home) | Hero strings in `content/site.ts`; the three lower panels are written into `src/site/pages/Home.tsx` |
| `/team` | Roster in `content/team.ts`; the header text in `src/site/pages/TeamPage.tsx` |
| `/project/notebook` | Entries in `content/timeline.ts`; the header text in `src/site/pages/NotebookPage.tsx` |
| `/playground` | No text content. The full-screen garden toy |

The notebook is also skipped by the previous and next buttons, because those
follow the `PAGES` array and it is not in it.

## When something goes wrong

**The page is blank, or the browser console is full of red.** Undo your last
edit and save. If the page comes back, the problem is in that edit. The usual
cause is a missing comma between two items in a list, or a missing `'` around a
piece of text.

**`npm run check` prints a wall of text.** Read the first error only; the rest
are usually knock-on effects. It names a file and a line number.

**An apostrophe breaks the file.** Text is wrapped in single quotes, so
`'We didn't'` ends the text early. Write `"We didn't"` with double quotes
instead, or escape it: `'We didn\'t'`.

**Your text shows up with literal `**` around it.** Inline formatting only works
in a block's `body`, not in headings, intros, sources or todo lines. See
[the style guide](docs/STYLE_GUIDE.md#where-inline-formatting-works).

**The page is there but the nav link goes to "This bed is empty".** The `slug`
in `pages.ts` and the `to` in `nav.ts` do not match exactly.

**Everything is broken and you do not know why.** Put your changes aside and
start from a clean copy. This keeps the work rather than deleting it: `git stash
pop` brings it back if you change your mind.

```bash
git stash -u
```

If even that does not help, go back to `main` and start the branch again.
Anything you have already pushed is safe.

```bash
git checkout main && git pull
```
