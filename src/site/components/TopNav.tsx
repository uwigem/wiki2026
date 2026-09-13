import { useEffect, useId, useRef, useState } from 'react'
import { PROJECT_TITLE, TEAM_NAME, TEAM_YEAR } from '../content/site'
import { NAV, activeGroup, type NavGroup } from '../content/nav'
import { BLOB_DOWN } from '../../engine/sprites'
import { Link, useRoute } from '../router'
import { useEscape } from '../hooks'
import PixelSprite from './PixelSprite'

/**
 * Top navigation, styled as little wooden garden signs.
 *
 * Desktop: a sticky bar whose groups open on hover or focus. Mobile: one menu
 * button opening a full-width accordion. The current page is marked both
 * visually (the `is-active` highlight) and for screen readers (`aria-current`).
 */
export default function TopNav({ visible = true }: { visible?: boolean }) {
  const path = useRoute()
  const [menuOpen, setMenuOpen] = useState(false)
  // Two separate pieces of state on purpose. The desktop dropdown and the
  // mobile accordion look similar but are different controls, and sharing one
  // value meant an accordion left open on a phone came back as a desktop
  // dropdown on resize, stuck open with nothing able to dismiss it.
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  const current = activeGroup(path)

  // Close everything whenever the route changes.
  useEffect(() => {
    setMenuOpen(false)
    setOpenDropdown(null)
    setOpenAccordion(null)
  }, [path])
  useEscape(menuOpen, () => setMenuOpen(false))
  useEscape(openDropdown !== null, () => setOpenDropdown(null))

  return (
    <header
      // While the homepage intro plays the bar is faded out. `inert` keeps it
      // out of the tab order too, so the first Tab press does not land on an
      // invisible link.
      inert={!visible || undefined}
      aria-hidden={!visible || undefined}
      className={
        'sticky top-0 z-40 border-b-[3px] border-leaf-700 bg-leaf-100 transition-[opacity,transform] duration-500 ease-out ' +
        (visible ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0')
      }
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 py-2 sm:px-5">
        <Link to="/" className="group flex shrink-0 items-center gap-2" title={PROJECT_TITLE}>
          <PixelSprite sprite={BLOB_DOWN} scale={2} alt="" />
          <span className="leading-none">
            <span className="pixel block text-sm text-leaf-950 sm:text-base">{TEAM_NAME}</span>
            {/* Body font, not pixel: Pixelify Sans's 6 and 8 are hard to tell
                apart at this size, and a misread year is a real error. */}
            <span className="block text-xs font-semibold tracking-[0.28em] text-leaf-800">{TEAM_YEAR}</span>
          </span>
        </Link>

        <span aria-hidden className="ml-1 hidden h-7 w-[3px] bg-leaf-300 lg:block" />

        <nav aria-label="Main" className="ml-auto hidden items-center gap-1 lg:flex">
          {NAV.map((group) => (
            <NavSign
              key={group.label}
              group={group}
              path={path}
              isActive={current?.label === group.label}
              open={openDropdown === group.label}
              onOpen={() => setOpenDropdown(group.label)}
              onClose={() => setOpenDropdown((g) => (g === group.label ? null : g))}
            />
          ))}
        </nav>

        <button
          type="button"
          className="pixel-btn ml-auto lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="garden-menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? '✕ close' : '☰ menu'}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="garden-menu"
          aria-label="Main"
          className="reveal max-h-[70vh] overflow-y-auto border-t-[3px] border-leaf-300 bg-leaf-50 px-4 pb-5 pt-3 lg:hidden"
        >
          {NAV.map((group) => (
            <MobileGroup
              key={group.label}
              group={group}
              path={path}
              open={openAccordion === group.label}
              onToggle={() => setOpenAccordion((g) => (g === group.label ? null : group.label))}
            />
          ))}
        </nav>
      )}
    </header>
  )
}

/**
 * One desktop nav sign.
 *
 * A group with sub-pages gets a real `<button>` for the dropdown, separate from
 * the link to the group's own landing page, so the menu can carry
 * `aria-expanded` and can be opened from the keyboard. Hover still opens it,
 * with a short close delay so moving the pointer down into the menu does not
 * dismiss it.
 */
function NavSign({
  group,
  path,
  isActive,
  open,
  onOpen,
  onClose,
}: {
  group: NavGroup
  path: string
  isActive: boolean
  open: boolean
  onOpen: () => void
  onClose: () => void
}) {
  const menuId = useId()
  const wrapRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number | undefined>(undefined)

  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    onOpen()
  }
  const closeSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => {
      // Never pull the menu out from under a keyboard user: if focus is still
      // inside this group, a stray mouse movement must not unmount it.
      if (wrapRef.current?.contains(document.activeElement)) return
      onClose()
    }, 180)
  }
  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current) }, [])

  if (!group.items) {
    return (
      <Link
        to={group.to}
        current={path === group.to ? 'page' : false}
        className={'nav-link text-sm ' + (isActive ? 'is-active' : '')}
      >
        {group.label}
      </Link>
    )
  }

  return (
    <div
      ref={wrapRef}
      className={'nav-group relative text-sm ' + (isActive ? 'is-active' : '')}
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onFocus={openNow}
      onBlur={closeSoon}
    >
      <Link
        // A group whose landing page is not the current page still marks itself
        // as the section you are in, so the highlight is not the only signal.
        to={group.to}
        current={path === group.to ? 'page' : isActive ? 'section' : false}
      >
        {group.label}
      </Link>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${group.label} pages`}
        className="text-[0.6rem] text-leaf-800"
        onClick={() => (open ? onClose() : onOpen())}
      >
        ▾
      </button>

      {open && (
        <ul
          id={menuId}
          // top-full with no gap, so moving from the trigger into the menu never
          // crosses a dead zone that would close it.
          className="panel reveal absolute right-0 top-full z-50 min-w-52 space-y-0.5 p-2"
        >
          {group.items.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                current={path === item.to ? 'page' : false}
                className={'nav-link block text-sm ' + (path === item.to ? 'is-active' : '')}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** One group in the mobile accordion. Groups without sub-pages are plain links. */
function MobileGroup({
  group,
  path,
  open,
  onToggle,
}: {
  group: NavGroup
  path: string
  open: boolean
  onToggle: () => void
}) {
  const listId = useId()

  return (
    <div className="border-b-2 border-dashed border-leaf-200 py-2 last:border-0">
      {group.items ? (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          className="pixel flex w-full items-center gap-2 py-1 text-left text-base text-leaf-950"
          onClick={onToggle}
        >
          {group.label}
          <span aria-hidden className="ml-auto text-leaf-800">
            {open ? '−' : '+'}
          </span>
        </button>
      ) : (
        <Link
          to={group.to}
          current={path === group.to ? 'page' : false}
          className="pixel block w-full py-1 text-base text-leaf-950"
        >
          {group.label}
        </Link>
      )}

      {group.items && open && (
        <ul id={listId} className="mt-1 space-y-1 pl-4">
          {group.items.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                current={path === item.to ? 'page' : false}
                className={'nav-link block text-sm ' + (path === item.to ? 'is-active' : '')}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
