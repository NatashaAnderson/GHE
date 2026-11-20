import { Text } from '@react-three/drei'
import { getCatalog } from '../content/loader'
import { useProgressStore } from '../systems/progress'
import { CampusEnvironment } from './CampusEnvironment'
import { HubPortal } from './HubPortal'

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

      <Text position={[0, 3.15, 5.4]} fontSize={0.42} color="#0f2438" anchorX="center">
        {catalog.courseTitle}
      </Text>
      <Text position={[0, 2.55, 5.4]} fontSize={0.22} color="#1a6fb5" anchorX="center">
        ForgeX Campus Hub
      </Text>

      {/* Row captions facing the learner */}
      <Text position={[0, 0.15, 4.0]} fontSize={0.16} color="#355068" anchorX="center">
        Front row · Modules 01–04
      </Text>
      <Text position={[0, 0.15, -1.0]} fontSize={0.16} color="#355068" anchorX="center">
        Back row · Modules 05–08
      </Text>

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
