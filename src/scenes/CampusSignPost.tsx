import { getCatalog } from '../content/loader'
import { WorldSign } from '../components/WorldSign'
import { SIGNPOST_POSITION } from './portalLayout'

/** Physical campus welcome post at the learner start point — away from module cylinders. */
export function CampusSignPost() {
  const catalog = getCatalog()
  const [x, y, z] = SIGNPOST_POSITION

  return (
    <group position={[x, y, z]}>
      {/* Post */}
      <mesh position={[0, 1.35, 0]} raycast={() => null}>
        <cylinderGeometry args={[0.08, 0.1, 2.7, 12]} />
        <meshStandardMaterial color="#5c4033" roughness={0.85} />
      </mesh>

      {/* Base plaque */}
      <mesh position={[0, 0.08, 0]} raycast={() => null}>
        <cylinderGeometry args={[0.35, 0.42, 0.16, 16]} />
        <meshStandardMaterial color="#3d2b22" roughness={0.9} />
      </mesh>

      {/* Sign board facing the spawn (+Z) */}
      <mesh position={[0, 2.35, 0.12]} raycast={() => null}>
        <boxGeometry args={[2.6, 1.55, 0.1]} />
        <meshStandardMaterial color="#f4f8fc" roughness={0.55} />
      </mesh>
      <mesh position={[0, 2.95, 0.12]} raycast={() => null}>
        <boxGeometry args={[2.6, 0.28, 0.12]} />
        <meshStandardMaterial color="#1a6fb5" />
      </mesh>
      {/* Side braces */}
      <mesh position={[-1.15, 2.35, 0.02]} raycast={() => null}>
        <boxGeometry args={[0.08, 1.55, 0.08]} />
        <meshStandardMaterial color="#5c4033" />
      </mesh>
      <mesh position={[1.15, 2.35, 0.02]} raycast={() => null}>
        <boxGeometry args={[0.08, 1.55, 0.08]} />
        <meshStandardMaterial color="#5c4033" />
      </mesh>

      <WorldSign position={[0, 2.35, 0.22]} width={240} tone="accent">
        <span className="world-sign__eyebrow">You are here · Home</span>
        <strong className="world-sign__title">{catalog.courseTitle}</strong>
        <span className="world-sign__status">ForgeX Campus Hub</span>
        <span className="world-sign__status">
          Walk forward into a green Module 01 cylinder to begin
        </span>
      </WorldSign>
    </group>
  )
}
