import { getCatalog } from '../content/loader'
import { useProgressStore } from '../systems/progress'
import { CampusEnvironment } from './CampusEnvironment'
import { HubPortal } from './HubPortal'
import { WorldSign } from '../components/WorldSign'

/**
 * Portal positions as seen from spawn (looking toward -Z):
 * Front row (closest): M01 → M04 left to right
 * Back row: M05 → M08 left to right
 */
const PORTAL_LAYOUT: Array<[number, number, number]> = [
  [-4.5, 0, 2.5],
  [-1.5, 0, 2.5],
  [1.5, 0, 2.5],
  [4.5, 0, 2.5],
  [-4.5, 0, -2.5],
  [-1.5, 0, -2.5],
  [1.5, 0, -2.5],
  [4.5, 0, -2.5],
]

export function HubScene() {
  const catalog = getCatalog()
  const startModule = useProgressStore((s) => s.startModule)
  const earnedBadges = useProgressStore((s) => s.earnedBadges)
  const reduceMotion = useProgressStore((s) => s.reduceMotion)

  return (
    <group>
      <CampusEnvironment reduceMotion={reduceMotion} />

      <WorldSign position={[0, 3.1, 5.2]} width={320} tone="accent">
        <span className="world-sign__eyebrow">ForgeX Campus Hub</span>
        <strong className="world-sign__title">{catalog.courseTitle}</strong>
        <span className="world-sign__status">Front row = Modules 01–04 · Back row = 05–08</span>
      </WorldSign>

      {catalog.modules.map((module, index) => {
        const position = PORTAL_LAYOUT[index] ?? [0, 0, 2]
        const unlocked = !module.locked
        const earned = earnedBadges.some((badge) =>
          badge.toLowerCase().includes(module.title.split(' ')[0]?.toLowerCase() ?? ''),
        )

        return (
          <HubPortal
            key={module.id}
            module={module}
            index={index}
            position={position}
            unlocked={unlocked}
            earned={earned}
            onEnter={() => startModule(module.id)}
          />
        )
      })}
    </group>
  )
}
