import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'

export function WindTurbine({
  position,
  scale = 1,
  spinning = true,
  speed = 1.2,
}: {
  position: [number, number, number]
  scale?: number
  spinning?: boolean
  speed?: number
}) {
  const blades = useRef<Group>(null)

  useFrame((_, delta) => {
    if (spinning && blades.current) {
      blades.current.rotation.z += delta * speed
    }
  })

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.08, 0]} raycast={() => null}>
        <cylinderGeometry args={[0.55, 0.65, 0.16, 16]} />
        <meshStandardMaterial color="#9aa7b5" roughness={0.7} />
      </mesh>

      <mesh position={[0, 4.2, 0]} raycast={() => null}>
        <cylinderGeometry args={[0.14, 0.38, 8.4, 16]} />
        <meshStandardMaterial color="#eef3f7" metalness={0.35} roughness={0.35} />
      </mesh>

      <mesh position={[0.35, 8.45, 0]} raycast={() => null}>
        <boxGeometry args={[1.4, 0.55, 0.55]} />
        <meshStandardMaterial color="#d9e2ea" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[-0.25, 8.45, 0]} raycast={() => null}>
        <sphereGeometry args={[0.28, 12, 12]} />
        <meshStandardMaterial color="#cfd8e0" metalness={0.35} roughness={0.35} />
      </mesh>

      <group ref={blades} position={[-0.55, 8.45, 0]}>
        {[0, 1, 2].map((i) => (
          <group key={i} rotation={[0, 0, (i * Math.PI * 2) / 3]}>
            <mesh position={[0, 1.75, 0]} raycast={() => null}>
              <boxGeometry args={[0.14, 3.5, 0.32]} />
              <meshStandardMaterial color="#f7fafc" metalness={0.2} roughness={0.4} />
            </mesh>
          </group>
        ))}
        <mesh raycast={() => null}>
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshStandardMaterial color="#b8c4d0" metalness={0.5} roughness={0.25} />
        </mesh>
      </group>
    </group>
  )
}
