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
| `pipeline` | Stage cards read downwards, each naming what goes in and what comes out | A chain someone else is meant to run: every stage visible at once |
| `cycles` | A loop emblem, then all four design/build/test/learn stages as cards. Several cycles become tabs | Engineering cycles |
| `trail` | The run of numbered parts, with the one you are in marked | A page told in parts, at the top of each one |
| `recipe` | One iGEM Alchemy combination, drawn with the game's own pictures | Showing what the game is, rather than describing it |
| `resultsSoon` | The hedgehog daydreaming an experiment in a thought bubble | A page that has no data yet and should say so without looking broken |
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
| `callout` | A boxed statement with a daisy border | One paragraph the page's argument lands on: our system, the founder's theory |
| `table` | A table of text; rows stack into cards on a phone | Anything with columns. Cells take links and bold |
| `references` | A numbered reference list with resolving links | After a section whose text carries `[n]` markers |
| `rail` | A strategy in stages with a rail beside it and a "we are here" line | A plan that is partly done and partly ahead |
| `flowchart` | A yes/no decision tree a reader answers one question at a time | "Is this right for your project" |
| `landscape` | The ciliary membrane with clickable proteins | Proteins that share a compartment, one card each |
| `workflow` | A row of stages, one open at a time | A short procedure at a high level |
| `details` | A closed section with its heading and one line showing; holds other blocks | References, the working behind a number, background a reader may know |
| `diagram` | One of the site's own drawings, still and captioned (`ScienceFigure`) | A mechanism the text spends several paragraphs on |
| `borrow` | Things that already exist, an arrow, and the one thing added | Positioning a new approach against established ones |
| `video` | YouTube videos as stills with a play button; the player loads only on click | Recorded talks, tutorial episodes |
| `gallery` | Two to four photographs side by side, lazy-loaded | An event as it looked |
| `links` | Cards that each end in one button: a file under `public/` downloads, an https:// address opens in a new tab | Handbooks, posts, documents to take home |
| `people` | One card of people as pixel characters; a tile opens what that person did, from `content/attributions.ts` | Crediting people |
| `credits` | One card of organisations and software in labelled sets, as pixel-art logos; a tile opens what each gave us | Crediting sponsors and tools |
| `todo` | A visible "still to come" panel | Drafting only. No page ships one. |

**Link between pages.** Any block can take an `id`, and any body text can then
point at it: `[the pipeline](/engineering#pipeline)` opens the
Engineering page scrolled to that exact section and flashes it. Use this instead
of writing "see the Engineering page". `npm run dev` warns in the console if a
link points at a page or a section that does not exist. Link targets must start with `/` or `https://`; anything else
renders as plain text.

**Name a stakeholder.** On a page with a `stakeholders` block, `[Dr. Zheng](stakeholder:zheng)`
opens that person's card from anywhere in the text. The id is the person's `id` field, or
their surname in lower case. `npm run dev` warns if the id matches nobody on the page.

**Sections.** Give a block `section: "Market"` (and an `id`) and it starts a named section;
every block after it belongs to that section until the next one. A page with three or more
sections switches to the long-page layout: each section is a wooden signboard over one card
(the blocks inside drop their own frames and are divided by a dashed rule), and a flat list of
the sections sits in the left margin on wide screens, or behind a corner button on a phone.
Long pages also open with a "How to read this page" bar, and their margin hedgehog walks on
the right. Links into a closed `details` section open it.

**Citations.** A `references` block with `for: "Community need"` answers the `[n]` markers in
that section: each marker links to its entry, opening the collapsed references on the way.
Markers in a section with no list stay plain text.

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

### The Idea (`/description`)

**Now:** the two arms, the dial-not-switch framing, and the shift from therapy
to platform including Dr. Zheng's LockTAC correction.

**Still needed:** the pathway schematic and the MMM complex figure (Creative).
The IHP sketches already specify these, including a clickable version where each
protein in the complex opens its own description. Primary citations for the
mechanism claims.

### A Problem in the Garden (`/background`)

**Now:** the balance logo as the opening image, why the amount matters, the
limits of vismodegib and sonidegib, and what the Kong lab structure gives us.

**Still needed:** epidemiology numbers with real sources. The medulloblastoma and
basal cell carcinoma figures currently trace to slides, not papers.

### The design pipeline (part of `/engineering`)

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

### Build, Test, Learn (`/engineering`), a medal page

**Now:** three parts, one per subteam, in the order they happened. An opening
card grid, then the whole-team cycle that chose the project, then Part 1 kinetics
modelling, Part 2 protein modelling (the design pipeline above, then three
cycles: generating binders, learning to throw designs away, rescuing near
misses), and Part 3 wet lab.

**Still needed:** the wet lab cycle itself, which is four empty headings in the
planning doc. The rescue rate for the third protein design cycle. Part 3 opens
with the construct decisions, which is real but is not a cycle.

**Keep the failures in.** The judges asked for this explicitly after 2025, and
cycle 3 is currently the strongest thing on the wiki because it describes
something that went wrong.

### What Grew (`/experiments`)

**Now:** the four planned experiments, what we test in, and an honest note that
there is no SPR access.

**Still needed:** everything. This page is a frame waiting for data. Write the
interpretation against what the Model and the design pipeline predicted, so a
reader can see which predictions held.

### The Model (`/model`), a medal page

**Now:** four sections. Kinetic modelling (what the model is for, the homeostasis
model and the six quantities it tracks, the wild-type against PTCH1-knockout
test, where the parameters come from, the parameter table and the assumptions as
drop-downs, Dr. Sauro's guidance, and the equations); the GPCR system (cholesterol
as SMO's own ligand, the two formulations we could not choose between, the five
objectives, and what the two models did); sensitivity analysis (the tornado plot
and how it was run); and the melanocortin safety result as a dose curve.

**Still needed:** four figures, all marked on the page with their owner: the
upstream network, the GPCR schematic, the two SMO migration routes, and the
simulation panels. The Michaelis-Menten total error, which two versions of the
analysis disagree on and which the page therefore does not quote. The Sobol half
of the global sensitivity analysis. A consolidated reference list, which the
draft currently holds as about twenty loose URLs. The protein design half of the
page, which has a heading in the planning doc and no text.

The equations live on Overleaf and Drive. **That is a problem worth fixing before
the freeze**: the judging handbook says content on sites outside iGEM cannot be
judged, so anything we want credit for needs a copy hosted here.

### Who the Garden Is For (`/human-practices`), a medal page

The longest page, built from the Human Practices subteam's final draft (October 2026)
with their text kept as written apart from spelling and grammar. **Now:** the guiding
question; the project inspiration; all thirteen interviews as a garden, each opening a
card that any mention of the name elsewhere on the page also opens; the community need
(the membrane landscape with seven protein cards, location and amount, the seven-tool
shed, the recurring gap, the capability matrix, our system and the founder's theory);
the market model (biological opportunity, the four-step estimate and its limits, the
market table, the to-market strategy with its "we are here" rail); designing for adoption
(six personas, five shared needs, the design requirements table, the implementation
strategy, the final package, the integration counter); responsible platform development;
and the deliverables (technology evaluation flowchart, workflow, flyer, next steps), which
are shared with `/implementation`. Five numbered reference lists with DOI links.

**Still needed:**

- Workflow stage detail, troubleshooting and best practices from the Education and
  IHP leads: the four stages are on the page with one paragraph each.
- Creative's art: the seven protein sprites for the landscape, the shed doors and props,
  and a hedgehog per persona. The components render with placeholders until then.
- Four links in the design requirements table wait on Wet Lab writing up the ALFA-tag
  system, the cycloheximide chase, the western blot and photoconversion on `/experiments`.
- Dr. Thomas Matula's entry still says no change is written up yet.

### Sharing the Garden (`/education`), a medal page

**Now:** all nine activities, grouped under the team's own principles, each
leading with who it was for and the gap it fills.

**Still needed:** attendance figures and photos. Three activities have unfilled
placeholders in the draft and so carry no numbers here: the video series has no
reach figure, the speaker series has no speaker names or poll results, and the
Scientists You Might Not Know profiles name no scientists. Fill those in the
draft first.

### Notebook (`/notebook`)

**Now:** the season as a timeline, built from `content/timeline.ts`.

**Still needed:** the dates still marked missing in `timeline.ts` (the page lists
them while you run it locally), wet-lab protocol summaries linked to Benchling,
and a complete or in-progress mark on each entry.

### Attributions

**Now:** three cards. Advisors (the two principal investigators and the
mentor), then the whole team, each tile opening what that person did (from
the team's iGEM Attributions Form, in one style). Then sponsors, support,
software and the game that inspired the wiki's look, each with a pixel-art
logo and a link.

**Still needed:** per-part and per-page attribution, if the team wants it
beyond the form.

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

## There is no Safety page, on purpose

Removed on 19 Oct 2026 after checking the 2026 Judge Handbook. Safety is not a
medal criterion: Bronze is deliverables, attributions and contribution (p. 42),
Silver is engineering success and human practices (p. 43), Gold is three
Special Awards (p. 44). Safety is judged from the **Project Safety Form**,
submitted through the Deliverables Dashboard and published on the team page
(p. 24), not from the wiki.

`/safety-and-security` is a standard URL only for the Safety and Security
Special Award (p. 48). Our three declared awards are Model, Integrated Human
Practices and Education, so nothing on the ballot points at it.

The page that existed opened by saying it was unfinished, which worked against
the Best Wiki nomination for no medal gain. If the Judging Form ever changes to
include Safety and Security, put the path back in `STANDARD_PAGES` in
`content/nav.ts` and write the page properly: biosafety level per cell line,
hazards, training, approvals, a link to the public Safety Form, and a real
dual-use paragraph built on the melanocortin result.

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

### What We Leave Behind (`/contribution`), a medal page

**Now:** the de novo binder design pipeline as a contribution another team can
use. What they get, then Protein design (the summary, the seven-stage
`pipeline` block, and one linkable write-up per tool), then the scripts, the
four filter metrics as a `table` with `id: "metrics"`, and the repository with
its folder map. Five references.

The metrics table is the one definition of minPAE, RMSD, pLDDT and ddG on the
site. Engineering links into it rather than restating the cutoffs. Keep it that
way.

**Still needed:** wet lab's contribution, which has no text at all and so has no
section. The repository has no licence, which matters more than anything on this
page: without one, strictly nobody outside the team may reuse the scripts.

### Pages the architecture asks for that are not written yet

Three pages exist with an address, a nav entry and a `todo` block saying what
belongs on them, so the structure is right from the first day:

| Page | Address | Note |
| --- | --- | --- |
| Out of the Greenhouse | `/implementation` | proposed implementation: who it is for, plus the deliverables shared with Human Practices |
| Parts and Registry | `/parts` | parts and registry |
| Protocols | `/protocols` | the seven finalised wet-lab PDFs, four experiment sections, one `details` row each holding a `pdf` block. The files live in `public/protocols/`; add a protocol by dropping the PDF there and adding a row |
| Results | `/results` | **has no data yet on purpose.** The hedgehog says so; replace the `resultsSoon` block the moment there are numbers |
| The Checklist | `/judging` | where each criterion is evidenced |
