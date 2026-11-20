import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'

export function H2Molecule({
  position = [0, 1.2, 0] as [number, number, number],
  scale = 1,
  spinning = true,
  highlighted = false,
  onClick,
}: {
  position?: [number, number, number]
  scale?: number
  spinning?: boolean
  highlighted?: boolean
  onClick?: () => void
}) {
  const ref = useRef<Group>(null)

  useFrame((_, delta) => {
    if (spinning && ref.current) {
      ref.current.rotation.y += delta * (highlighted ? 0.35 : 0.6)
    }
  })

  return (
    <group
      ref={ref}
      position={position}
      scale={scale}
      onClick={onClick}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default'
      }}
    >
      <mesh visible={false}>
        <sphereGeometry args={[0.75, 16, 16]} />
        <meshBasicMaterial />
      </mesh>
      <mesh position={[-0.35, 0, 0]}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial
          color="#5eb3ff"
          roughness={0.35}
          metalness={0.1}
          emissive={highlighted ? '#1f9d55' : '#1a6fb5'}
          emissiveIntensity={highlighted ? 0.45 : 0.15}
        />
      </mesh>
      <mesh position={[0.35, 0, 0]}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial
          color="#5eb3ff"
          roughness={0.35}
          metalness={0.1}
          emissive={highlighted ? '#1f9d55' : '#1a6fb5'}
          emissiveIntensity={highlighted ? 0.45 : 0.15}
        />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.55, 12]} />
        <meshStandardMaterial color="#cfe8ff" />
      </mesh>
    </group>
  )
}
