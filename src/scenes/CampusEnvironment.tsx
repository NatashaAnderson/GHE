import { Sky, Cloud } from '@react-three/drei'

export function CampusEnvironment({ reduceMotion = false }: { reduceMotion?: boolean }) {
  return (
    <>
      <color attach="background" args={['#b9daf5']} />
      <fog attach="fog" args={['#c7e4f7', 28, 75]} />
      <hemisphereLight args={['#e8f5ff', '#7aa36a', 0.75]} />
      <directionalLight position={[12, 18, 8]} intensity={1.35} castShadow />
      <Sky sunPosition={[80, 40, 20]} turbidity={4} rayleigh={1.2} />
      {!reduceMotion && (
        <>
          <Cloud position={[-12, 10, -20]} opacity={0.35} speed={0.15} />
          <Cloud position={[14, 12, -18]} opacity={0.28} speed={0.1} />
        </>
      )}

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <circleGeometry args={[40, 48]} />
        <meshStandardMaterial color="#6fad5d" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <ringGeometry args={[8, 14, 48]} />
        <meshStandardMaterial color="#7fba6c" />
      </mesh>

      {/* Water */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 22]}>
        <planeGeometry args={[50, 20]} />
        <meshStandardMaterial color="#3f8fd6" transparent opacity={0.85} metalness={0.3} roughness={0.2} />
      </mesh>

      {/* Solar array */}
      {[-10, -7, -4].map((x, i) => (
        <group key={`solar-${i}`} position={[x, 0, 10]}>
          <mesh position={[0, 0.7, 0]} rotation={[-0.5, 0.2, 0]}>
            <boxGeometry args={[2.4, 0.08, 1.4]} />
            <meshStandardMaterial color="#1d4f8c" metalness={0.5} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.7, 8]} />
            <meshStandardMaterial color="#d9e2ea" />
          </mesh>
        </group>
      ))}

      {/* Wind turbines */}
      {[6, 10, 14].map((x, i) => (
        <group key={`turbine-${i}`} position={[x, 0, 12]}>
          <mesh position={[0, 2.5, 0]}>
            <cylinderGeometry args={[0.12, 0.18, 5, 12]} />
            <meshStandardMaterial color="#f2f6f9" />
          </mesh>
          <mesh position={[0, 5.1, 0]}>
            <sphereGeometry args={[0.25, 12, 12]} />
            <meshStandardMaterial color="#e8eef3" />
          </mesh>
          <mesh position={[0, 5.1, 0]} rotation={[0, i, Math.PI / 2]}>
            <boxGeometry args={[0.12, 2.2, 0.08]} />
            <meshStandardMaterial color="#d5dee6" />
          </mesh>
        </group>
      ))}

      {/* H2 storage tank */}
      <group position={[12, 0, 2]}>
        <mesh position={[0, 2.2, 0]}>
          <cylinderGeometry args={[1.4, 1.4, 4.2, 24]} />
          <meshStandardMaterial color="#f7fafc" metalness={0.2} roughness={0.4} />
        </mesh>
        <mesh position={[0, 4.4, 0]}>
          <sphereGeometry args={[1.4, 24, 12]} />
          <meshStandardMaterial color="#f7fafc" />
        </mesh>
        <mesh position={[0, 2.2, 1.41]}>
          <planeGeometry args={[1.6, 0.7]} />
          <meshStandardMaterial color="#1f9d55" />
        </mesh>
      </group>

      {/* Electrolyzer building */}
      <group position={[-12, 0, 2]}>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[5, 2.4, 3]} />
          <meshStandardMaterial color="#e8f1f7" />
        </mesh>
        <mesh position={[0, 2.55, 0]}>
          <boxGeometry args={[5.2, 0.3, 3.2]} />
          <meshStandardMaterial color="#1a6fb5" />
        </mesh>
      </group>
    </>
  )
}
