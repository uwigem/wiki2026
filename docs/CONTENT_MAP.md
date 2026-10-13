# What goes where

A page-by-page map of the wiki: what is on each page now, what is still missing,
and which building block to use when you add it.

## The spine

The wiki argues one thing, in this order. Every page should be recognisable as a
step in it:

1. **Location matters.** Some receptors only work while they sit in the primary
   cilium.
2. **The amount matters too.** It is not on or off. Cells read how much is there.
3. **Nothing can do both.** Tools are either specific to one protein or specific
   to the cilium, never both, and none of them is tunable.
4. **The cell already owns the machine.** The MMM complex clears one receptor out
   of the cilium. We redirect it.
5. **Here is the proof.** Smoothened, where the ground truth is known, then a
   receptor the complex has no natural relationship with.

The homepage carries 1 to 4 in about two screens. The project pages carry 5.

> **Say the amount, not just the direction.** The thing that makes this project
> different from a knockout is that it is graded. Wherever you write "reduces" or
> "increases", check whether you can say by how much, or say plainly that we do
> not know yet.

## Blocks you can use

All page content is data in `src/site/content/pages.ts`. Each item in a page's
`blocks` array has a `kind`. You do not need to touch any component to use these.

| `kind` | What it renders | Reach for it when |
| --- | --- | --- |
| `prose` | Paragraphs in a cream panel | The default. Most writing. |
| `narration` | The hedgehog, with a speech bubble | A paragraph above needs a plain-language version beside it |
| `cards` | A grid of flower-bed cards | Three to six parallel things |
| `steps` | Numbered stepping stones | An ordered pipeline |
| `cycles` | The design/build/test/learn wheel, tabbed | Engineering cycles |
| `stats` | A row of big figures | A few numbers that carry an argument |
| `matrix` | A capability comparison table | Showing that nothing existing does the job |
| `toolshed` | Expandable tool cards | Surveying existing methods |
| `structure` | A rotatable 3D protein | You have coordinates worth looking at |
| `figure` | An image, or a marked empty slot | Any diagram, including ones not drawn yet |
| `logo` | The animated balance, with a caption | The "set it, do not switch it" idea |
| `tornado` | Diverging bars from a centre line | Showing which inputs actually move a result |
| `dose` | A response curve, with the limit it must stay under | Dose against effect, or anything that saturates |
| `funnel` | Stacked tapering bars with survival rates | How many candidates make it through each filter |
| `stakeholders` | Flower beds of people, grouped by expertise | Interviews, each with what it changed |
| `pillars` | Activities grouped under a stated principle | Outreach, or anything designed to a set of values |
| `facts` | Compact key and value pairs | Reference details |
| `quote` | A pulled-out quote on a sign | One sentence worth stopping on |
| `todo` | A visible "still to come" panel | Drafting only. No page ships one. |

**Link between pages.** Any block can take an `id`, and any body text can then
point at it: `[the pipeline](/project/engineering#pipeline)` opens the
Engineering page scrolled to that exact section and flashes it. Use this instead
of writing "see the Engineering page". `npm run dev` warns in the console if a
link points at a page or a section that does not exist. Link targets must start with `/` or `https://`; anything else
renders as plain text.

**Use `figure` while drafting a diagram that does not exist yet.** Give it a
`caption` saying what the picture should show and an `owner`, and leave `src`
out. It renders a sized, dashed placeholder, so the gap is visible while you
work on the page. Placeholders do not ship: add `src` and `alt` before the page
is merged, or take the block out and list the figure under "Still needed" here.

## Page by page

### Home

**Now:** the live garden hero; the interactive cilium, where Block and Recruit
move the receptor count; a panel on why existing tools cannot do this; the
hedgehog explaining the MMM trick; six story stops; team and playground cards.

**Still needed:** nothing blocking. Once Creative delivers the project name and
logo, change `PROJECT_TITLE` in `content/site.ts` and it updates everywhere.

### The Idea (`/project/description`)

**Now:** the two arms, the dial-not-switch framing, and the shift from therapy
to platform including Dr. Zheng's LockTAC correction.

**Still needed:** the pathway schematic and the MMM complex figure (Creative).
The IHP sketches already specify these, including a clickable version where each
protein in the complex opens its own description. Primary citations for the
mechanism claims.

### A Problem in the Garden (`/project/background`)

**Now:** the balance logo as the opening image, why the amount matters, the
limits of vismodegib and sonidegib, and what the Kong lab structure gives us.

**Still needed:** epidemiology numbers with real sources. The medulloblastoma and
basal cell carcinoma figures currently trace to slides, not papers.

### The design pipeline (part of `/project/engineering`)

This was a Design page of its own until the site moved to the team's final
architecture, which has no Design page. It is now the first half of Engineering,
as `designBlocks` in `pages.ts`.

**Now:** the target, the five-step pipeline, the hedgehog explaining what the
three programs do, the 5,700 to 255 to 25 funnel, and the Smoothened structure
with its cholesterol.

**Still needed:** the scored interface table for the 2026 MOSMO binders; backbone
renders; the MEGF8 binders. When a binder is validated, add it to
`content/structures.ts` in the same shape as `SMO_5L7D` and it gets the same
viewer. A hotspot map and the minPAE against RMSD scatter plot would both work as
`figure` blocks once the images exist.

### Build, Test, Learn (`/project/engineering`), a medal page

**Now:** the design pipeline above, then four cycles. Choosing the target, generating binders, learning to throw
designs away (the membrane-binding discovery), and rescuing near misses.

**Still needed:** the rescue rate for cycle 4. Wet lab cycles for expression,
purification, binding validation and the cell assay, as data arrives.

**Keep the failures in.** The judges asked for this explicitly after 2025, and
cycle 3 is currently the strongest thing on the wiki because it describes
something that went wrong.

### What Grew (`/wetlab/experiments`)

**Now:** the four planned experiments, what we test in, and an honest note that
there is no SPR access.

**Still needed:** everything. This page is a frame waiting for data. Write the
interpretation against what the Model and the design pipeline predicted, so a
reader can see which predictions held.

### The Model (`/drylab/model`), a medal page

**Now:** what the model is for, the wild-type against PTCH1-knockout test, where
the parameters come from, Dr. Sauro's model-selection guidance, the sensitivity
analysis as a tornado plot, and the MC4R off-target result as a dose curve with
the twenty percent limit shown beside it.

**Still needed:** confirm the Michaelis-Menten error against the linear model.
The equations, the wiring diagram and the full parameter table.

### Who the Garden Is For (`/human-practices/integrated`), a medal page

The most complete page, and the longest. **Now:** the guiding question, why
location and amount matter, the seven-tool shed, the capability matrix, the four
requirements, the market figures, the founder's theory, and all thirteen
interviews as a garden of flower beds grouped by expertise, each with the line
saying what the team changed where the draft records one.

**Still needed:**

- Dr. Thomas Matula's entry says no change is written up yet, because the draft
  does not state one. Replace it with the real line when there is one.
- The researcher personas, and the closed-to-open slider.
- The auditory cilia responsible-use case study.

**This page will need splitting.** It is already long and the stakeholder
write-ups will double it. The natural cut is the community need and the market
model into their own pages under Impact.

### Sharing the Garden (`/human-practices/education`), a medal page

**Now:** all nine activities, grouped under the team's own principles, each
leading with who it was for and the gap it fills.

**Still needed:** attendance figures and photos. Three activities have unfilled
placeholders in the draft and so carry no numbers here: the video series has no
reach figure, the speaker series has no speaker names or poll results, and the
Scientists You Might Not Know profiles name no scientists. Fill those in the
draft first.

### Tending Safely (`/team/safety`)

**Now:** what can honestly be stated, and an admission that no biosafety document
exists yet.

**Still needed:** the official iGEM Safety and Security form, mirrored here. A
real dual-use paragraph. This is a tool that changes a developmental pathway, so
boilerplate will not do.

### Notebook (`/wetlab/notebook`)

**Now:** the season as a timeline, built from `content/timeline.ts`.

**Still needed:** the dates still marked missing in `timeline.ts` (the page lists
them while you run it locally), wet-lab protocol summaries linked to Benchling,
and a complete or in-progress mark on each entry.

### Attributions

**Now:** advisors, sponsors and software.

**Still needed:** per-part and per-page attribution in iGEM's required format,
and a clear line between student work and advisor work.

### Team (`/team`)

**Now:** every student, grouped as Leadership and then by subteam, each with
their own pixel character. Opening a profile shows their headshot, titles, bio,
and email, LinkedIn and website buttons, from the profile form (October 2026).
The principal investigator is one line in the header.

**Still needed:** the last few bios and photos. See CONTRIBUTING.md.

### iGEM Alchemy (`/alchemy`)

**Now:** the Education subteam's combination game, playable, as they designed
it: four levels (protein, DNA and RNA, animal cell, GFP plasmid), 47 things,
their descriptions word for word. It plays like Little Alchemy, in a box on
its own page with the four levels as a row of cards above it: drag elements
from the sidebar onto the bench, drop one on another to combine, tap works on
a phone, hints, an encyclopedia, progress saved in the browser. Two fixes so it can be finished: level 3 starts with
Water and Enzyme (the outline only made them in level 4), and "any two
organelles" is spelled out as every pair. The Education page links to it.

Recipes carry over: one learned in a level keeps working in the levels after it.

**Still needed:** Creative's eye on the icons, which are 24-pixel art drawn in
code to match the garden, and a science check of the recipes by Human
Practices.

## Things in the drafts that are not on the wiki yet

Worth knowing about, because they are written and just need placing:

- The full market model working, step by step, with its stated limitations. The
  limitations are a strength: showing the working is what makes the estimate
  credible.
- The entrepreneurship section on patents, licensing and customer discovery.
- The ciliary membrane landscape figure, which the sketches specify in detail.
- The responsible-use statement the team signs.
- The adoption guide for researchers, planned as a printable PDF.

## Two standing rules

**Do not describe a conversation that has not happened.** Several stakeholders
are contacted but not confirmed. Until the meeting happens, they do not appear as
an interview.

**No scaffolding on the live page.** `todo` blocks and empty `figure` slots are
drafting aids, and none of them ships. What is still missing is tracked in this
document instead, which is where someone looking for work to do should come.
What that does NOT license is quietly turning a gap into a claim: if a number is
not known, the page says so in its own words, or says nothing.

### Pages the architecture asks for that are not written yet

Four pages exist with an address, a nav entry and a `todo` block saying what
belongs on them, so the structure is right from the first day:

| Page | Address | Note |
| --- | --- | --- |
| Out of the Greenhouse | `/project/implementation` | proposed implementation |
| Seeds We Logged | `/wetlab/parts` | parts and registry |
| What We Leave Behind | `/team/contribution` | **medal page** |
| The Checklist | `/team/judging` | where each criterion is evidenced |
