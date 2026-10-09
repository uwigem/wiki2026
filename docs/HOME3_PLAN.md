# Home 3: the scroll-driven homepage

The plan and the build notes for Home 3, the homepage (`#/`), built from the team's
script *"HedgehogSense Main Page (scroll-driven animation)"*. This is the
second draft, reworked from the team's feedback on the first.

## What it is

One picture pinned under the nav while the page scrolls past it, telling the
script in ten scenes.

- **One scroll, one scene.** Each scene is one screen of scroll with a snap
  point at its start. One notch of the mouse wheel, one swipe, or one press of
  the down arrow or space bar moves exactly one scene, never half of one. A
  trackpad flick counts once however long its momentum runs, but a second
  swipe made during that momentum counts too, and so does a mouse wheel turned
  steadily: an event counts when the push is holding or gaining speed, and
  momentum only ever slows.
- **Scenes play themselves.** Arriving at a scene starts its animation, which
  runs over a few seconds and then holds on its last frame. A small "scroll"
  prompt appears in the corner once it has finished.
- **The same in both directions, and nothing ever cuts.** Every scene starts
  on exactly the frame the one before it ended on. Scrolling down, the scene on
  screen fast-forwards to its last frame and the next one takes over from that
  frame. Scrolling up, the scene on screen rewinds to its first frame and the
  previous one takes over at its last frame, which is the same picture.
  Rewinding is in two speeds: quickly through the body of the scene, then its
  entry (the garden parting, the lens opening) backwards at a readable pace,
  so going up mirrors coming down. Each scene's entry window is `ENTRY_ENDS`
  in `components/story/scenes.ts`.
- **Words change once per step,** at the start of it, to the words of the
  scene the page is heading for, rather than flickering through every beat the
  picture passes on its way.
- **Long jumps go straight there.** A square more than one scene away, the
  End key, or a Home link while already home jumps rather than racing through
  every scene in between.
- **Where am I.** A row of squares at the foot of the stage shows the current
  scene, and each square jumps to its scene. It sits on the stage rather than
  in the text band, because the band is hidden on the title and the closing,
  which are the stops where a reader most wants to know where they are.
- **The footer is not a scene.** Past the last scene the page scrolls normally,
  with no snapping and no stepping. The closing screen's words and cards fade
  as it scrolls up and away, so the bottom of the page is the garden sitting
  on the footer, not a sliver of cut-off cards.

Layout:

- **Wide screens:** words in a column on the left (40%), picture on the right.
- **Phones:** picture on top (58%), words underneath.
- **Hero and closing:** the garden fills the whole stage and the title sits in
  its sky.

It keeps Home 2's minimal rules: a flat cream background, no panels, no signs,
no garden margins, and no walking hedgehog. The only decoration is the story.

## Scene by scene

| # | Scene | Script copy shown | What is drawn | Plays for | Interaction |
|---|---|---|---|---|---|
| 1 | `garden` | A living world depends on balance / Welcome to HedgehogSense / Engineering control over cellular signaling. | The pond garden: the hedgehog by a pond with lily pads and cattails, a tree, a floating bush, heart plants and a rock, with the playground's flowers scattered naturally around them | (still) | none |
| 2 | `diseases` | Different diseases. Different parts of the body. / But what do they all have in common? | The garden parts like curtains to reveal a figure. Brain, skin, heart and muscle light up one at a time: the newest deep pink with a ring pulsing out of it, earlier ones soft pink | 7.5 s | Magnifying-glass buttons open a short explanation in the text band |
| 3 | `cilium` | The connection is smaller than you think. / Meet the primary cilium. A tiny hair on our cells... | The camera zooms toward the chest while a lens opens on a cell inside it. The lens grows to fill the picture, the camera travels up the cell to its cilium, which glows | 6 s | none |
| 4 | `smo` | Cells don't just receive signals... / Meet Smoothened, a key regulator... | The hedgehog readout slides in. SMO arrive one by one, then step up: low (2), intermediate (5), high (8). The hedgehog's sound arcs and the outlined meter follow | 7.5 s | none |
| 5 | `water` | Every garden needs balance. Too little water... / What if we could bring that same level of control...? | A pot plant and a watering can that tips further the more it pours, showering out of its rose. Too little: a dribble, and it wilts. Right: it blooms. Too much: it droops in a puddle | 8.5 s | A watering slider. It moves itself through all three states; grab it and it is yours until you leave the scene |
| 6 | `parts` | What if we could control which proteins remain in the primary cilium? | Back to the cilium. MEGF8, MOSMO and MGRN1 appear one at a time, labelled | 4.5 s | none |
| 7 | `mmm` | Most cells have complex machinery... Meet the MMM complex. / The MMM system helps control how much Smoothened... | The three parts dock at the base of the cilium inside one outline, the MMM complex. It then tags the lowest SMO, which leaves, and the rest settle as a new one arrives | 7 s | none |
| 8 | `recruit` | Our project aims to build tools to recruit these machines... / We're engineering ways to recruit MMM... | One step at a time: a green target protein appears and pings; the engineered linker reaches it, drags it down and throws it out; a second target appears and the linker takes hold of it. Two SMO stay put, to show the linker is selective | 8 s | none |
| 9 | `release` | Just like a garden, cellular signaling needs careful regulation. / Alongside recruiting the MMM complex... | A lightning bolt strikes the linker. It breaks, the complex drifts away, and two more targets come back one at a time | 8 s | none |
| 10 | `closing` | HedgehogSense / Engineering control over cellular signaling. / Explore the garden | One screen: the lens closes on the cilium, leaving the same pond garden in bloom (more flowers) with the healthy pot plant from scene 5 in it, and in the sky above it the logo, the name, the line and the five gates to the rest of the site | 3.5 s | Five cards, one per section |

Every scene starts on exactly the frame the previous one ended on, so there
are no jumps between scenes. The animation times are in
`src/site/content/homeStory.ts` (`seconds`).

The closing screen carries **the same gates every other page ends with**
(`ExploreCards`, in its compact form), so the homepage does not end on a single
button, and the name, the gates and the garden are one screen rather than two.

## What changed since the first draft

| Feedback | Change |
|---|---|
| Too much scrolling to get past the title; the animation did not start until the second scroll | One notch or swipe per scene. The title fades as the page moves to scene 2 |
| Scrolling fast flew past things; scrolling slowly felt choppy | Scenes play themselves on a clock; scroll only moves between scenes, and speeds up a scene that has not finished |
| Garden: flowers without heads, odd marks on the ground, flat grass; then "too conspicuous, not natural" | The team picked the pond garden from 15 layouts. Only playground pieces. The big things are placed by hand; the flowers are scattered by a fixed-seed random walk (same garden every visit), mixed kinds, thicker in places and bare in others. Grass in the playground's three tones in soft patches, with its baked shadows and a rolling horizon. Phones see it from the same low angle as laptops |
| Disease regions in yellow with a pale halo got lost on the white figure; colours changed oddly | One pink: deep pink and a pulsing ring for the newest, soft pink for the rest |
| "The connection is smaller" visual needed help; the dissolve into the cell was choppy | A lens opens on the body and grows into the cell view; the camera starts exactly where scene 2 left it |
| The hedgehog readout just appeared; the meter was hard to see; its lines ran off the edge; the top SMO touched the tip | The readout slides in. Meter steps are outlined, in green, orange and pink. Sound arcs stay inside the picture. Eight SMO at most, with room to spare under the tip |
| Watering can, drops and flower could be better; the stem crossed the pot; a stray line on the pot | A proper can that tips as it pours, teardrop drops with a splash, an outlined flower, the stem growing out of the soil, and the stray shading line removed |
| The MMM visuals were confusing; the target approaching was disorienting | The complex sits in one outline. The linker does one thing at a time, each target announced with a ping before anything happens to it |
| The cell was cut off at the side | The cell is now a dome whose sides curve down out of the bottom of the picture (on a phone it fades out above the words) |
| The end of "targets return" was not smooth; the cilium vanished in a dissolve | Scene 9 ends on the recovered cilium; the closing scene closes a lens on it to reveal the garden |
| The watering can and its water were ugly | The can has a proper rose on the end of its spout. The water is a shower: every droplet has its own lane across the fan, its own speed and its own place in the fall, taken from a hash of its index, and falls under gravity. Before, every drop walked one path at one speed, which is why it read as a dotted line |
| The homepage ended on one button | The explore cards are on the closing screen itself, with the logo and the name, above the garden |
| The explore stop and the closing were two screens, with a cut into the cards and a stray transition back out of them | Merged into one closing screen. "Targets return" now leads straight into the lens closing onto the garden, as it was designed to |
| Scrolling up was a mess | Measured frame by frame, every upward step cut straight to the previous scene's last frame the moment the page moved. Scrolling up now rewinds, so no step in either direction cuts (see above) |
| Scrolling back up from the very bottom was buggy | The footer is not a scene. Snapping is switched off and the wheel left alone once the reader is past the last scene, so down there the page scrolls normally; scrolling up far enough hands back to the story and lands on the closing scene. Scrolls the page asks for are made with the snapping off, so the browser cannot fight them halfway |

## Decisions made for this draft (please check)

1. **Which lines are website copy.** The script marks copy in bold and the
   bold did not survive being pasted. Short statements are shown; sentences
   describing what the picture does ("The garden moves aside...", "A chain
   brings the MMM complex...") are treated as stage directions and are not
   shown. Every shown string is in `src/site/content/homeStory.ts`, verbatim
   from the script except for line breaks.
2. **Which diseases.** Only conditions the team has a source for: medulloblastoma
   (brain), basal cell carcinoma (skin), heart conditions in children (heart)
   and rhabdomyosarcoma (muscle), from the Background page and the interview
   with Dr. Stacey Ogden. Kidney and eye ciliopathies are the obvious
   additions once there is a source (Dan Doherty was contacted, not yet
   interviewed). The explanations are one sentence each and should be checked
   by Wet Lab or HP.
3. **The watering slider moves itself.** The script asks for an interactive
   slider, but a reader who only watches would otherwise see one state. So it
   demonstrates all three and then hands over the moment it is touched.
4. **Cards at the end.** The explore cards on the closing screen are not in
   the script. They are there so the homepage does not dead-end, and they
   replace the single "Explore the project" button the first drafts had.
5. **Label wording on the picture** ("primary cilium", "SMO (Smoothened)",
   "engineered linker", "target protein", "targets return") is mine. Change it
   in `components/story/scenes.ts`. On phones the longer ones shorten
   ("SMO", "target", "returned") so they do not cover the cilium.
6. **On phones the disease buttons show only the body part** ("Brain"), because
   the full names ran off both edges of the screen. Tapping one shows the name
   and the explanation underneath.
7. **The wheel is handled by the page.** Browsers snap a short wheel scroll
   back to where it started, so Home 3 turns each wheel gesture into one scene
   step itself. Touch and keyboard use the browser's own snapping.

## How it is built

| File | What it holds |
|---|---|
| `src/site/content/homeStory.ts` | Every word, the order of scenes, how long each plays, the conditions |
| `src/site/components/story/StoryStage.tsx` | The pinned stage: measuring, snap points and wheel steps, the scene clock, the draw loop, the text band, labels, slider, buttons, progress squares |
| `src/site/components/story/scenes.ts` | One drawing function per scene, each a pure function of its progress |
| `src/site/components/story/garden.ts` | The pond garden: the hand-placed pieces, the flower scatter, the ground and shadows |
| `src/site/components/story/painter.ts` | A small pixel rasteriser: shapes, polygons, sprites, a camera that zooms, a circular lens mask, and dithered fades |
| `src/site/pages/Home3.tsx` | The page |

- **Pixel art all the way.** Scenes are drawn into a low-resolution buffer and
  scaled up at a whole-number scale (3x on a laptop, 2x on a phone). Fades are
  ordered dithers, not blends, so dissolves stay crisp. The garden uses only
  the playground's own sprites and grass recipe, through the shared legend.
- **Words are HTML.** The text band, labels and buttons are real text over the
  canvas, never pixels in it.
- **Transitions live in the scene they lead into.** Each scene draws its own
  entry from the scene before, starting from that scene's last frame.
- **Snapping is local.** Scroll snapping is switched on for the page only while
  Home 3 is open, and switched off again when you leave it.
- **Accessibility.** The whole script is in the page for screen readers, in
  order. The canvas is hidden from them. The magnifier buttons, slider and
  progress squares are keyboard-reachable. Reduced motion shows every scene
  at its finished frame, and stops ambient motion and the lightning burst.

## The explainer moved

The animated explainer that opened Home 1 and Home 2 (now archived) also lives on the
Description page, after "Two arms, opposite directions", as a page block
(`{ kind: 'explainer' }`). Home 1 and Home 2 are unchanged, and are now archived
in `src/site/pages/archive/`, where nothing routes to them.

## Checked

- `npm run check` and `npm run build` pass.
- Walked every scene at 1280x720 and on a 390px phone.
- Every on-picture label was measured for overlaps with other labels, with the
  text band, and with the stage edges, at five points through each scene, on
  both sizes: no overlaps.
- Scrolling: one wheel notch, a burst of eight notches, the down arrow and the
  space bar each move exactly one scene; scrolling up shows the previous scene
  finished; the squares jump to any scene; the footer is reachable and you can
  scroll back up from it; snapping is off again on the other pages.

## Next, once the team has reacted

- Confirm the copy split and the condition explanations.
- Tune `seconds` in `homeStory.ts` if any scene feels rushed or slow.
- Decide whether scene 2 should add kidney and eye once sourced.
- Home 3 was picked and is the homepage at `#/`. Home 1 and Home 2 are archived
  in `src/site/pages/archive/`, off the site entirely. Delete that folder once
  the team is sure.
