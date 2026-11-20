/** More detailed electrolyzer / plant building for the campus left side. */
export function PlantBuilding({
  position = [0, 0, 0] as [number, number, number],
}: {
  position?: [number, number, number]
}) {
  return (
    <group position={position}>
      {/* Main volume */}
      <mesh position={[0, 1.55, 0]} castShadow receiveShadow raycast={() => null}>
        <boxGeometry args={[5.4, 3.1, 3.4]} />
        <meshStandardMaterial color="#e7eef4" roughness={0.55} metalness={0.08} />
      </mesh>

      {/* Roof overhang */}
      <mesh position={[0, 3.2, 0]} raycast={() => null}>
        <boxGeometry args={[5.8, 0.22, 3.8]} />
        <meshStandardMaterial color="#1a6fb5" roughness={0.45} metalness={0.15} />
      </mesh>
      <mesh position={[0, 3.42, 0]} raycast={() => null}>
        <boxGeometry args={[5.5, 0.18, 3.5]} />
        <meshStandardMaterial color="#155a94" roughness={0.5} />
      </mesh>

      {/* Accent stripe */}
      <mesh position={[0, 2.55, 1.71]} raycast={() => null}>
        <boxGeometry args={[5.42, 0.18, 0.04]} />
        <meshStandardMaterial color="#1f9d55" />
      </mesh>

      {/* Door */}
      <mesh position={[0, 0.95, 1.72]} raycast={() => null}>
        <boxGeometry args={[1.1, 1.9, 0.06]} />
        <meshStandardMaterial color="#3d4d5c" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[0.38, 0.95, 1.76]} raycast={() => null}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Windows */}
      {[
        [-1.7, 2.1],
        [1.7, 2.1],
        [-1.7, 1.2],
        [1.7, 1.2],
      ].map(([wx, wy], i) => (
        <group key={`win-${i}`}>
          <mesh position={[wx, wy, 1.72]} raycast={() => null}>
            <boxGeometry args={[1.0, 0.7, 0.05]} />
            <meshStandardMaterial color="#7ec8e8" metalness={0.6} roughness={0.15} transparent opacity={0.85} />
          </mesh>
          <mesh position={[wx, wy, 1.75]} raycast={() => null}>
            <boxGeometry args={[1.08, 0.78, 0.03]} />
            <meshStandardMaterial color="#d5dee6" metalness={0.4} roughness={0.35} />
          </mesh>
        </group>
      ))}

      {/* Side vents / pipes */}
      <mesh position={[2.85, 1.4, 0]} rotation={[0, 0, Math.PI / 2]} raycast={() => null}>
        <cylinderGeometry args={[0.12, 0.12, 1.4, 10]} />
        <meshStandardMaterial color="#9aa7b5" metalness={0.55} roughness={0.3} />
      </mesh>
      <mesh position={[2.85, 2.1, 0.5]} rotation={[0, 0, Math.PI / 2]} raycast={() => null}>
        <cylinderGeometry args={[0.1, 0.1, 1.2, 10]} />
        <meshStandardMaterial color="#8b969f" metalness={0.55} roughness={0.3} />
      </mesh>

      {/* Loading bay bump-out */}
      <mesh position={[-1.4, 0.85, -2.1]} raycast={() => null}>
        <boxGeometry args={[2.2, 1.7, 1.0]} />
        <meshStandardMaterial color="#d9e3ec" roughness={0.55} />
      </mesh>

      {/* Roof HVAC unit */}
      <mesh position={[1.2, 3.7, -0.4]} raycast={() => null}>
        <boxGeometry args={[1.4, 0.7, 1.1]} />
        <meshStandardMaterial color="#b7c2cc" metalness={0.35} roughness={0.4} />
      </mesh>
    </group>
  )
}
