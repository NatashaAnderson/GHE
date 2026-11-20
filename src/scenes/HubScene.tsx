import { Text } from '@react-three/drei'
import { getCatalog } from '../content/loader'
import { useProgressStore } from '../systems/progress'
import { CampusEnvironment } from './CampusEnvironment'

/**
 * Portal positions as seen from spawn (looking toward -Z):
 * Front row (closest): M01 → M04 left to right
 * Back row: M05 → M08 left to right
 */
const PORTAL_LAYOUT: Array<[number, number, number]> = [
  [-4.5, 0, 2.5], // M01 — front-left (nearest)
  [-1.5, 0, 2.5], // M02
  [1.5, 0, 2.5], // M03
  [4.5, 0, 2.5], // M04
  [-4.5, 0, -2.5], // M05 — back row
  [-1.5, 0, -2.5], // M06
  [1.5, 0, -2.5], // M07
  [4.5, 0, -2.5], // M08
]

export function HubScene() {
  const catalog = getCatalog()
  const startModule = useProgressStore((s) => s.startModule)
  const earnedBadges = useProgressStore((s) => s.earnedBadges)
  const reduceMotion = useProgressStore((s) => s.reduceMotion)

  return (
    <group>
      <CampusEnvironment reduceMotion={reduceMotion} />

      <Text position={[0, 3.2, 5.2]} fontSize={0.45} color="#0f2438" anchorX="center">
        {catalog.courseTitle}
      </Text>
      <Text position={[0, 2.6, 5.2]} fontSize={0.24} color="#1a6fb5" anchorX="center">
        ForgeX Campus Hub
      </Text>
      <Text position={[0, 2.15, 5.2]} fontSize={0.15} color="#355068" anchorX="center" maxWidth={8}>
        Start at M01 on the front row (left)
      </Text>

      {catalog.modules.map((module, index) => {
        const position = PORTAL_LAYOUT[index] ?? [0, 0, 2]
        const unlocked = !module.locked
        const earned = earnedBadges.some((badge) =>
          badge.toLowerCase().includes(module.title.split(' ')[0]?.toLowerCase() ?? ''),
        )

        return (
          <group key={module.id} position={position}>
            <mesh
              position={[0, 1.2, 0]}
              onClick={() => {
                if (unlocked) startModule(module.id)
              }}
              onPointerOver={(event) => {
                if (unlocked) {
                  event.stopPropagation()
                  document.body.style.cursor = 'pointer'
                }
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'default'
              }}
            >
              <cylinderGeometry args={[1.05, 1.05, 2.2, 24]} />
              <meshStandardMaterial
                color={unlocked ? '#1f9d55' : '#8aa0b3'}
                transparent
                opacity={unlocked ? 0.55 : 0.35}
                emissive={unlocked ? '#0d6b3a' : '#000000'}
                emissiveIntensity={unlocked ? 0.25 : 0}
              />
            </mesh>
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.1, 1.3, 32]} />
              <meshStandardMaterial color={unlocked ? '#dff7e8' : '#d5dde5'} />
            </mesh>
            <Text position={[0, 2.55, 0]} fontSize={0.2} color="#0f2438" anchorX="center" maxWidth={2.6}>
              {`${index + 1}. ${module.id.toUpperCase()}`}
            </Text>
            <Text position={[0, 2.2, 0]} fontSize={0.14} color="#0f2438" anchorX="center" maxWidth={2.6}>
              {module.title}
            </Text>
            <Text
              position={[0, 1.9, 0]}
              fontSize={0.13}
              color={unlocked ? '#1f9d55' : '#5b6b7a'}
              anchorX="center"
            >
              {unlocked ? (earned ? 'Replay' : 'Enter') : 'Locked'}
            </Text>
          </group>
        )
      })}
    </group>
  )
}
