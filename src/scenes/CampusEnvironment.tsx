import { Sky, Cloud } from '@react-three/drei'

/** Scenic backdrop only — kept outside the station/hub play plaza. */
export function CampusEnvironment({ reduceMotion = false }: { reduceMotion?: boolean }) {
  return (
    <>
      <color attach="background" args={['#b9daf5']} />
      <fog attach="fog" args={['#c7e4f7', 32, 85]} />
      <hemisphereLight args={['#e8f5ff', '#7aa36a', 0.75]} />
      <directionalLight position={[12, 18, 8]} intensity={1.35} castShadow />
      <Sky sunPosition={[80, 40, 20]} turbidity={4} rayleigh={1.2} />
      {!reduceMotion && (
        <>
          <Cloud position={[-18, 12, -28]} opacity={0.3} speed={0.12} />
          <Cloud position={[20, 14, -26]} opacity={0.24} speed={0.08} />
        </>
      )}

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]} raycast={() => null}>
        <circleGeometry args={[45, 48]} />
        <meshStandardMaterial color="#6fad5d" />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
        receiveShadow
        raycast={() => null}
      >
        <ringGeometry args={[9, 15, 48]} />
        <meshStandardMaterial color="#7fba6c" />
      </mesh>

      {/* Water shoreline — far +Z, behind spawn view */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 28]} raycast={() => null}>
        <planeGeometry args={[60, 18]} />
        <meshStandardMaterial
          color="#3f8fd6"
          transparent
          opacity={0.85}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>

      {/* Distant renewable park — far from stations (stations sit roughly |x|<10, z -6..0) */}
      <group position={[0, 0, 20]} raycast={() => null}>
        {[-8, -4, 0, 4, 8].map((x, i) => (
          <group key={`solar-${i}`} position={[x, 0, 0]}>
            <mesh position={[0, 0.55, 0]} rotation={[-0.55, 0, 0]} raycast={() => null}>
              <boxGeometry args={[2.1, 0.06, 1.2]} />
              <meshStandardMaterial color="#1d4f8c" metalness={0.5} roughness={0.25} />
            </mesh>
            <mesh position={[0, 0.28, 0]} raycast={() => null}>
              <cylinderGeometry args={[0.04, 0.04, 0.55, 8]} />
              <meshStandardMaterial color="#d9e2ea" />
            </mesh>
          </group>
        ))}
      </group>

      {[ -14, -10, 10, 14 ].map((x, i) => (
        <group key={`turbine-${i}`} position={[x, 0, 22]}>
          <mesh position={[0, 3.2, 0]} raycast={() => null}>
            <cylinderGeometry args={[0.1, 0.16, 6.4, 12]} />
            <meshStandardMaterial color="#f2f6f9" />
          </mesh>
          <mesh position={[0, 6.5, 0]} raycast={() => null}>
            <sphereGeometry args={[0.22, 12, 12]} />
            <meshStandardMaterial color="#e8eef3" />
          </mesh>
          <mesh position={[0, 6.5, 0]} rotation={[0, i * 0.7, Math.PI / 2]} raycast={() => null}>
            <boxGeometry args={[0.1, 2.4, 0.07]} />
            <meshStandardMaterial color="#d5dee6" />
          </mesh>
        </group>
      ))}

      {/* Plant silhouette — far corners, not beside Meet Hydrogen / Energy Carrier */}
      <group position={[18, 0, -14]}>
        <mesh position={[0, 2.4, 0]} raycast={() => null}>
          <cylinderGeometry args={[1.2, 1.2, 4.6, 24]} />
          <meshStandardMaterial color="#f7fafc" metalness={0.2} roughness={0.4} />
        </mesh>
        <mesh position={[0, 4.8, 0]} raycast={() => null}>
          <sphereGeometry args={[1.2, 24, 12]} />
          <meshStandardMaterial color="#f7fafc" />
        </mesh>
        <mesh position={[0, 2.4, 1.21]} raycast={() => null}>
          <planeGeometry args={[1.4, 0.55]} />
          <meshStandardMaterial color="#1f9d55" />
        </mesh>
      </group>

      <group position={[-18, 0, -14]}>
        <mesh position={[0, 1.1, 0]} raycast={() => null}>
          <boxGeometry args={[4.2, 2.2, 2.6]} />
          <meshStandardMaterial color="#e8f1f7" />
        </mesh>
        <mesh position={[0, 2.35, 0]} raycast={() => null}>
          <boxGeometry args={[4.4, 0.28, 2.8]} />
          <meshStandardMaterial color="#1a6fb5" />
        </mesh>
      </group>
    </>
  )
}
