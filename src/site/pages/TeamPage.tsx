import { useState } from 'react'
import {
  LEADERSHIP,
  PRINCIPAL_INVESTIGATOR,
  SUBTEAMS,
  TEAM_PAGE_INTRO,
  membersOf,
  type Member,
} from '../content/team'
import GardenSection, { Reveal, SectionDivider } from '../components/GardenSection'
import MemberModal from '../components/MemberModal'
import PixelSign from '../components/PixelSign'
import TeamGroup from '../components/TeamGroup'

/** The team page: the student leaders, then each subteam. Every tile opens a profile. */
export default function TeamPage() {
  const [picked, setPicked] = useState<Member | null>(null)

  return (
    <article>
      <GardenSection className="pb-4 pt-10 sm:pt-14">
        <div className="flex flex-col items-center gap-4 text-center">
          <PixelSign>
            <p className="pixel text-tag tracking-[0.2em]">washington igem 2026</p>
            <h1 className="mt-1 text-2xl sm:text-4xl">Meet the Team</h1>
          </PixelSign>
          <p className="panel-flat max-w-2xl px-4 py-3 text-body-sm leading-relaxed">{TEAM_PAGE_INTRO}</p>
          <p className="kicker normal-case">Principal investigator: {PRINCIPAL_INVESTIGATOR}</p>
        </div>
      </GardenSection>

      <SectionDivider />

      <GardenSection>
        <div className="flex flex-col gap-5">
          <Reveal>
            <TeamGroup
              id="leads"
              heading="Leadership"
              blurb="The co-presidents and the student leads."
              flower="tree"
              people={LEADERSHIP}
              onPick={setPicked}
            />
          </Reveal>
          {SUBTEAMS.map((s, i) => (
            <Reveal key={s.id} delay={Math.min((i + 1) * 0.04, 0.2)}>
              <TeamGroup
                id={s.id}
                heading={s.name}
                blurb={s.blurb}
                flower={s.flower}
                people={membersOf(s.id)}
                subteam={s.id}
                onPick={setPicked}
              />
            </Reveal>
          ))}
        </div>
      </GardenSection>

      {picked && <MemberModal member={picked} onClose={() => setPicked(null)} />}
    </article>
  )
}
