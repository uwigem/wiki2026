import { ALL_ROUTES } from '../content/nav'
import { FOOTER_LINKS, PROJECT_TITLE, TEAM_LONG } from '../content/site'
import { Link } from '../router'
import BalanceLogo from './BalanceLogo'

/** The bottom of the page: opaque, quiet, and out of the garden's way. */
export default function FooterGarden({ onReplayIntro }: { onReplayIntro?: () => void }) {
  return (
    <footer className="mt-16 border-t-[3px] border-leaf-700 bg-leaf-200">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            {/* The project mark. A balance, because the claim is that the
                amount can be set rather than switched off. */}
            <BalanceLogo width={118} />
            <div>
              <p className="pixel text-base">{PROJECT_TITLE}</p>
              <p className="pixel text-tag tracking-[0.15em] text-leaf-800">{TEAM_LONG}</p>
            </div>
          </div>
          {onReplayIntro && (
            <button type="button" onClick={onReplayIntro} className="pixel-btn mt-4 text-xs">
              ↻ replay the intro
            </button>
          )}
        </div>

        <nav aria-label="All pages">
          <h2 className="kicker mb-2">the whole garden</h2>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
            {ALL_ROUTES.map((r) => (
              <li key={r.to}>
                <Link to={r.to} className="hover:underline">
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="kicker mb-2">elsewhere</h2>
          <ul className="space-y-1 text-sm">
            {FOOTER_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noreferrer noopener" className="hover:underline">
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* TODO(pre-publish): add iGEM's required competition attribution + CC licence line. */}
    </footer>
  )
}
