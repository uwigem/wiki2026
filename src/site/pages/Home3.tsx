import StoryStage from '../components/story/StoryStage'

/**
 * The homepage: the team's scroll-driven script, start to finish.
 *
 * Built from the script "HedgehogSense Main Page (scroll-driven animation)":
 * a garden, the diseases that share a cause, the primary cilium, Smoothened,
 * the watering analogy, the MMM complex, the engineered linker, breaking it,
 * and back to the garden. The copy is in `content/homeStory.ts`, the drawing
 * in `components/story/scenes.ts`, and the plan in `docs/HOME3_PLAN.md`.
 *
 * The story ends on one button, which is the right ending for the story but a
 * dead end for anyone who wants a different part of the project. So the same
 * row of gates that every other page ends with sits underneath it, after the
 * story is over. It renders here rather than in `App.tsx` so that it sits on
 * the page's own cream, instead of on the green the rest of the site uses.
 *
 * The animated explainer that the archived homepages open with lives on the
 * Description page instead; this page tells the same story its own way.
 */
export default function Home3() {
  return (
    <div className="bg-leaf-50 text-leaf-950">
      <StoryStage />
    </div>
  )
}
