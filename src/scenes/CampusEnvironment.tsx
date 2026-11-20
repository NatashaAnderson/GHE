import { Sky, Cloud } from '@react-three/drei'
import { PlantBuilding } from './PlantBuilding'
import { SolarArray } from './SolarArray'
import { WindTurbine } from './WindTurbine'

/** Scenic campus backdrop around the hub plaza. */
export function CampusEnvironment({ reduceMotion = false }: { reduceMotion?: boolean }) {
  return (
    <>
      <color attach="background" args={['#b9daf5']} />
      <fog attach="fog" args={['#c7e4f7', 40, 95]} />
      <hemisphereLight args={['#e8f5ff', '#7aa36a', 0.8]} />
      <directionalLight position={[18, 22, 10]} intensity={1.45} castShadow />
      <Sky sunPosition={[100, 45, 30]} turbidity={3.5} rayleigh={1.1} />
      {!reduceMotion && (
        <>
          <Cloud position={[-20, 14, -30]} opacity={0.28} speed={0.1} />
          <Cloud position={[22, 15, -28]} opacity={0.22} speed={0.08} />
        </>
      )}

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]} raycast={() => null}>
        <circleGeometry args={[50, 56]} />
        <meshStandardMaterial color="#6fad5d" />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
        receiveShadow
        raycast={() => null}
      >
        <ringGeometry args={[9, 16, 48]} />
        <meshStandardMaterial color="#7fba6c" />
      </mesh>

      {/* Plaza paving under modules */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} raycast={() => null}>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color="#d5dde5" roughness={0.85} />
      </mesh>

      {/* Water — far south behind start view */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 30]} raycast={() => null}>
        <planeGeometry args={[70, 16]} />
        <meshStandardMaterial
          color="#3f8fd6"
          transparent
          opacity={0.82}
          metalness={0.35}
          roughness={0.18}
        />
      </mesh>

      {/* Plant building (left) + solar farm on the outer/front side, facing the modules */}
      <PlantBuilding position={[-14.5, 0, 1]} />
      <SolarArray position={[-19.8, 0, 3.2]} />

      {/* H2 storage tank — right side balance */}
      <group position={[14.5, 0, 1]}>
        <mesh position={[0, 0.12, 0]} raycast={() => null}>
          <cylinderGeometry args={[1.7, 1.85, 0.24, 24]} />
          <meshStandardMaterial color="#9aa7b5" roughness={0.7} />
        </mesh>
        <mesh position={[0, 2.5, 0]} raycast={() => null}>
          <cylinderGeometry args={[1.45, 1.45, 4.8, 28]} />
          <meshStandardMaterial color="#f4f8fb" metalness={0.25} roughness={0.35} />
        </mesh>
        <mesh position={[0, 5.0, 0]} raycast={() => null}>
          <sphereGeometry args={[1.45, 28, 16]} />
          <meshStandardMaterial color="#f4f8fb" metalness={0.25} roughness={0.35} />
        </mesh>
        <mesh position={[0, 2.5, 1.47]} raycast={() => null}>
          <planeGeometry args={[1.7, 0.65]} />
          <meshStandardMaterial color="#1f9d55" />
        </mesh>
      </group>

      {/* Wind turbines behind the modules (more negative Z) */}
      <WindTurbine
        position={[-8, 0, -14]}
        scale={1.05}
        spinning={!reduceMotion}
        speed={1.35}
      />
      <WindTurbine
        position={[0, 0, -16]}
        scale={1.2}
        spinning={!reduceMotion}
        speed={1.1}
      />
      <WindTurbine
        position={[8, 0, -14]}
        scale={1.05}
        spinning={!reduceMotion}
        speed={1.45}
      />
    </>
  )
}
