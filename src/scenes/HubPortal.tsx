import { Text } from '@react-three/drei'
import type { CatalogModule } from '../content/types'

type HubPortalProps = {
  module: CatalogModule
  index: number
  position: [number, number, number]
  unlocked: boolean
  earned: boolean
  onEnter: () => void
}

export function HubPortal({
  module,
  index,
  position,
  unlocked,
  earned,
  onEnter,
}: HubPortalProps) {
  const numberLabel = String(index + 1).padStart(2, '0')
  const status = !unlocked ? 'Locked' : earned ? 'Completed · Replay' : 'Open · Start here'
  const statusColor = !unlocked ? '#5b6b7a' : earned ? '#0d6b3a' : '#1f9d55'
  const plateColor = unlocked ? '#f4fbf7' : '#eef2f5'
  const accent = unlocked ? '#1f9d55' : '#8aa0b3'

  return (
    <group position={position}>
      {/* Portal column */}
      <mesh
        position={[0, 1.15, 0]}
        onClick={() => {
          if (unlocked) onEnter()
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
        <cylinderGeometry args={[0.95, 0.95, 2.1, 24]} />
        <meshStandardMaterial
          color={accent}
          transparent
          opacity={unlocked ? 0.5 : 0.32}
          emissive={unlocked ? '#0d6b3a' : '#000000'}
          emissiveIntensity={unlocked ? 0.22 : 0}
        />
      </mesh>

      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <ringGeometry args={[1.0, 1.2, 32]} />
        <meshStandardMaterial color={unlocked ? '#dff7e8' : '#d5dde5'} />
      </mesh>

      {/* Sign facing spawn (+Z) */}
      <group position={[0, 2.45, 1.05]}>
        <mesh position={[0, 0, -0.02]} raycast={() => null}>
          <planeGeometry args={[2.35, 1.25]} />
          <meshStandardMaterial color={plateColor} roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.52, 0]} raycast={() => null}>
          <planeGeometry args={[2.35, 0.22]} />
          <meshStandardMaterial color={accent} />
        </mesh>

        <Text
          position={[-0.85, 0.18, 0.03]}
          fontSize={0.42}
          color={accent}
          anchorX="center"
          anchorY="middle"
          fontWeight={700}
        >
          {numberLabel}
        </Text>

        <Text
          position={[0.25, 0.28, 0.03]}
          fontSize={0.13}
          color="#5b6b7a"
          anchorX="left"
          anchorY="middle"
        >
          {`MODULE ${numberLabel}`}
        </Text>

        <Text
          position={[0.25, 0.05, 0.03]}
          fontSize={0.17}
          color="#0f2438"
          anchorX="left"
          anchorY="middle"
          maxWidth={1.55}
        >
          {module.title}
        </Text>

        <Text
          position={[0, -0.32, 0.03]}
          fontSize={0.13}
          color={statusColor}
          anchorX="center"
          anchorY="middle"
          maxWidth={2.1}
        >
          {status}
        </Text>

        {/* Invisible click target on the sign */}
        <mesh
          position={[0, 0, 0.04]}
          onClick={() => {
            if (unlocked) onEnter()
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
          <planeGeometry args={[2.35, 1.25]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>
    </group>
  )
}
