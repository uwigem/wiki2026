import { useState } from 'react'
import { SUBTEAMS, TEAM_PAGE_INTRO, UNPLACED_ROSTER, type Member, type Subteam } from '../content/team'
import GardenSection, { Reveal, SectionDivider } from '../components/GardenSection'
import MemberModal from '../components/MemberModal'
import PixelSign, { TodoPanel } from '../components/PixelSign'
import TeamFlowerPatch from '../components/TeamFlowerPatch'

/** The team page: one flower bed per subteam, every bloom a person. */
export default function TeamPage() {
  const [picked, setPicked] = useState<{ member: Member; subteam: Subteam } | null>(null)
  const total = SUBTEAMS.reduce((n, s) => n + s.members.length, 0)

  return (
    <article>
      <GardenSection className="pb-4 pt-10 sm:pt-14">
        <div className="flex flex-col items-center gap-4 text-center">
          <PixelSign>
            <p className="pixel text-tag tracking-[0.2em]">the people</p>
            <h1 className="mt-1 text-2xl sm:text-4xl">Who Cultivated This</h1>
          </PixelSign>
          <p className="panel-flat max-w-2xl px-4 py-3 text-body-sm leading-relaxed">{TEAM_PAGE_INTRO}</p>
          <p className="kicker normal-case">
            <span className="numeral">{SUBTEAMS.length}</span> beds ·{' '}
            <span className="numeral">{total}</span> blooms planted so far
          </p>
        </div>
      </GardenSection>

      <SectionDivider />

      <GardenSection>
        <div className="flex flex-col gap-5">
          {SUBTEAMS.map((s, i) => (
            <Reveal key={s.id} delay={Math.min(i * 0.04, 0.2)}>
              <TeamFlowerPatch subteam={s} onPick={(member, subteam) => setPicked({ member, subteam })} />
            </Reveal>
          ))}
        </div>

        {/* The unplaced panel only renders while someone is actually unplaced, so
            the page does not carry an empty panel once Ops has confirmed every
            roster slot. The grid drops to one column with it, so the remaining
            panel does not sit at half width. */}
        <div className={'mt-6 grid gap-5 ' + (UNPLACED_ROSTER.length > 0 ? 'lg:grid-cols-2' : '')}>
          {UNPLACED_ROSTER.length > 0 && (
            <div className="panel px-5 py-5">
              <h2 className="text-lg">Not placed yet</h2>
              <p className="mt-2 text-body-sm leading-relaxed">
                Team members whose subteam is still being confirmed. Placement pending.
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {UNPLACED_ROSTER.map((name) => (
                  <li
                    key={name}
                    className="pixel rounded-sm border-2 border-dashed border-leaf-400 bg-leaf-50 px-2 py-0.5 text-note"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <TodoPanel
            items={[
              'TODO(ops): confirm every subteam placement and role.',
              'TODO(ops): add headshots to /public/team/. The flower shows for anyone without a photo.',
              'TODO(ops): one-line bios, written by each member.',
            ]}
          />
        </div>
      </GardenSection>

      {picked && (
        <MemberModal member={picked.member} subteam={picked.subteam} onClose={() => setPicked(null)} />
      )}
    </article>
  )
}
