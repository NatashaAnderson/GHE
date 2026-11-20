import { Text } from '@react-three/drei'
import { getCatalog } from '../content/loader'
import { useProgressStore } from '../systems/progress'
import { CampusEnvironment } from './CampusEnvironment'
import { InfoPanel } from '../components/InfoPanel'

const PORTAL_LAYOUT: Array<[number, number, number]> = [
  [-6, 0, -4],
  [-2, 0, -6],
  [2, 0, -6],
  [6, 0, -4],
  [-6, 0, 0],
  [-2, 0, 2],
  [2, 0, 2],
  [6, 0, 0],
]

export function HubScene() {
  const catalog = getCatalog()
  const startModule = useProgressStore((s) => s.startModule)
  const earnedBadges = useProgressStore((s) => s.earnedBadges)
  const reduceMotion = useProgressStore((s) => s.reduceMotion)

  return (
    <group>
      <CampusEnvironment reduceMotion={reduceMotion} />

      <Text position={[0, 3.2, -2]} fontSize={0.55} color="#0f2438" anchorX="center">
        {catalog.courseTitle}
      </Text>
      <Text position={[0, 2.5, -2]} fontSize={0.28} color="#1a6fb5" anchorX="center">
        ForgeX Campus Hub
      </Text>

      <InfoPanel
        position={[0, 1.6, 4]}
        title="Mission briefing"
        body="Enter Module 1: Hydrogen Explorer. Modules 2–8 unlock after later releases. Use WASD to move, Shift+drag to look, or Enter VR on a Quest headset."
      />

      {catalog.modules.map((module, index) => {
        const position = PORTAL_LAYOUT[index] ?? [0, 0, -4]
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
              <cylinderGeometry args={[1.1, 1.1, 2.2, 24]} />
              <meshStandardMaterial
                color={unlocked ? '#1f9d55' : '#8aa0b3'}
                transparent
                opacity={unlocked ? 0.55 : 0.35}
                emissive={unlocked ? '#0d6b3a' : '#000000'}
                emissiveIntensity={unlocked ? 0.25 : 0}
              />
            </mesh>
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.15, 1.35, 32]} />
              <meshStandardMaterial color={unlocked ? '#dff7e8' : '#d5dde5'} />
            </mesh>
            <Text position={[0, 2.6, 0]} fontSize={0.22} color="#0f2438" anchorX="center" maxWidth={3}>
              {`${module.id.toUpperCase()} · ${module.title}`}
            </Text>
            <Text position={[0, 2.25, 0]} fontSize={0.16} color={unlocked ? '#1f9d55' : '#5b6b7a'} anchorX="center">
              {unlocked ? (earned ? 'Replay mission' : 'Enter mission') : 'Coming soon'}
            </Text>
          </group>
        )
      })}
    </group>
  )
}
