/** 3×3 solar farm beside the plant building, slanted to face the module plaza. */
export function SolarArray({
  position = [0, 0, 0] as [number, number, number],
}: {
  position?: [number, number, number]
}) {
  const panels: Array<[number, number]> = []
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      panels.push([col, row])
    }
  }

  return (
    <group position={position}>
      {/* Gravel pad */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.6, 0.02, 1.6]} raycast={() => null}>
        <planeGeometry args={[7.2, 7.2]} />
        <meshStandardMaterial color="#8b9198" roughness={0.95} />
      </mesh>

      {panels.map(([col, row]) => {
        const x = col * 2.15
        const z = row * 2.15
        return (
          <group key={`panel-${row}-${col}`} position={[x, 0, z]}>
            {/* Support posts */}
            <mesh position={[-0.7, 0.35, 0.35]} raycast={() => null}>
              <cylinderGeometry args={[0.04, 0.05, 0.7, 8]} />
              <meshStandardMaterial color="#6b7480" metalness={0.6} roughness={0.35} />
            </mesh>
            <mesh position={[0.7, 0.35, 0.35]} raycast={() => null}>
              <cylinderGeometry args={[0.04, 0.05, 0.7, 8]} />
              <meshStandardMaterial color="#6b7480" metalness={0.6} roughness={0.35} />
            </mesh>
            <mesh position={[-0.7, 0.55, -0.35]} raycast={() => null}>
              <cylinderGeometry args={[0.04, 0.05, 1.1, 8]} />
              <meshStandardMaterial color="#6b7480" metalness={0.6} roughness={0.35} />
            </mesh>
            <mesh position={[0.7, 0.55, -0.35]} raycast={() => null}>
              <cylinderGeometry args={[0.04, 0.05, 1.1, 8]} />
              <meshStandardMaterial color="#6b7480" metalness={0.6} roughness={0.35} />
            </mesh>

            {/* Rack + panel facing plaza (+X) with sun tilt */}
            <group position={[0, 0.85, 0]} rotation={[0, Math.PI / 2, 0]}>
              <group rotation={[-0.55, 0, 0]}>
                <mesh position={[0, 0, -0.04]} raycast={() => null}>
                  <boxGeometry args={[1.9, 1.15, 0.06]} />
                  <meshStandardMaterial color="#2a323c" metalness={0.4} roughness={0.45} />
                </mesh>
                <mesh raycast={() => null}>
                  <boxGeometry args={[1.78, 1.04, 0.04]} />
                  <meshStandardMaterial
                    color="#163a6b"
                    metalness={0.75}
                    roughness={0.18}
                    envMapIntensity={1.2}
                  />
                </mesh>
                {/* Cell grid lines */}
                {[-0.45, 0, 0.45].map((gx) => (
                  <mesh key={`vx-${gx}`} position={[gx, 0, 0.025]} raycast={() => null}>
                    <boxGeometry args={[0.02, 1.0, 0.01]} />
                    <meshStandardMaterial color="#0d2240" />
                  </mesh>
                ))}
                {[-0.25, 0.25].map((gy) => (
                  <mesh key={`hz-${gy}`} position={[0, gy, 0.025]} raycast={() => null}>
                    <boxGeometry args={[1.7, 0.02, 0.01]} />
                    <meshStandardMaterial color="#0d2240" />
                  </mesh>
                ))}
                {/* Silver frame */}
                <mesh position={[0, 0, 0.01]} raycast={() => null}>
                  <boxGeometry args={[1.82, 1.08, 0.02]} />
                  <meshStandardMaterial
                    color="#c5ced6"
                    metalness={0.7}
                    roughness={0.25}
                    transparent
                    opacity={0.35}
                  />
                </mesh>
              </group>
            </group>
          </group>
        )
      })}
    </group>
  )
}
