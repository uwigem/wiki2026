# Archived homepages

Two homepage candidates the team compared with the scroll-driven one and set
aside on 2026-10-08. **Nothing routes to these.** They are not reachable at any
address, they are not in the nav or the footer sitemap, and the addresses they
used to live at (`#/`, `#/home-alt`, `#/home-3`) now either show the homepage or
fall through to the "This bed is empty" page.

| File | What it was | Was at |
|---|---|---|
| `Home.tsx` | The original garden homepage: the full-screen intro sequence, the live garden hero, the walking hedgehog | `#/` |
| `HomeAlt.tsx` | The minimal one, told one sentence at a time, modelled on the Duke, Barcelona-UB and McGill wikis | `#/home-alt` |

The homepage that won is `../Home3.tsx`, at `#/`. It is planned in
`docs/HOME3_PLAN.md`.

## If you want one of these back

Import it in `src/App.tsx` and give it a route in `RouteView`. `Home.tsx` also
needs the intro: pass it `at`, `stage`, `playing` and `onSkip` from `useIntro()`
in `src/site/hooks.ts`, hide the nav until `intro.at('done')`, and pass
`intro.replay` to `FooterGarden`. Both pages want `PageGarden` and
`HedgehogGuide` turned off for their route, the way the homepage does now.

## Why they are kept

They are a record of what the team tried, and pieces of them are still in use
elsewhere: the explainer (`SignalDial`), the story pictures (`StoryArt`) and the
logo (`BalanceLogo`) all live in `src/site/components/` and are shared.

These files are still type-checked and still follow the house rules, so a
rename or a palette change will not quietly rot them. They do link to page
slugs that moved when the site was restructured, which is harmless while
nothing renders them: `pageBySlug` returns nothing and those links are skipped.
Fix them if you bring a page back.
