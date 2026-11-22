/**
 * Ground-mounted solar units with clear human-scale proportions:
 * - lowest panel edge ~0.55m above ground
 * - short front posts + taller rear posts that meet the rail
 * - 3×3 farm facing the module plaza
 */
const TILT = 0.52 // radians (~30°)
const PANEL_W = 1.9
const PANEL_H = 1.15
const CLEARANCE = 0.55 // lowest glass edge above ground
const COL_SPACING = 2.25
const ROW_SPACING = 2.35

/** Height of panel centre after tilt so the low edge clears the ground. */
const PANEL_CENTER_Y = CLEARANCE + (PANEL_H / 2) * Math.cos(TILT)
const FRONT_POST_H = CLEARANCE + 0.08
const REAR_POST_H = CLEARANCE + PANEL_H * Math.sin(TILT) + 0.08

function SolarPanelUnit({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Foot pads */}
      {(
        [
          [-0.65, 0.35],
          [0.65, 0.35],
          [-0.65, -0.55],
          [0.65, -0.55],
        ] as Array<[number, number]>
      ).map(([fx, fz]) => (
        <mesh key={`foot-${fx}-${fz}`} position={[fx, 0.04, fz]} raycast={() => null}>
          <boxGeometry args={[0.28, 0.08, 0.28]} />
          <meshStandardMaterial color="#6f787f" roughness={0.9} />
        </mesh>
      ))}

      {/* Front posts (lower edge of panel) */}
      {([-0.65, 0.65] as const).map((x) => (
        <mesh key={`front-${x}`} position={[x, FRONT_POST_H / 2, 0.38]} raycast={() => null}>
          <cylinderGeometry args={[0.04, 0.05, FRONT_POST_H, 8]} />
          <meshStandardMaterial color="#5c6670" metalness={0.55} roughness={0.35} />
        </mesh>
      ))}

      {/* Rear posts (higher edge) */}
      {([-0.65, 0.65] as const).map((x) => (
        <mesh key={`rear-${x}`} position={[x, REAR_POST_H / 2, -0.55]} raycast={() => null}>
          <cylinderGeometry args={[0.04, 0.05, REAR_POST_H, 8]} />
          <meshStandardMaterial color="#5c6670" metalness={0.55} roughness={0.35} />
        </mesh>
      ))}

      {/* Side rails linking front→rear post tops */}
      {([-0.65, 0.65] as const).map((x) => (
        <mesh
          key={`rail-${x}`}
          position={[x, (FRONT_POST_H + REAR_POST_H) / 2, -0.08]}
          rotation={[Math.atan2(REAR_POST_H - FRONT_POST_H, 0.93), 0, 0]}
          raycast={() => null}
        >
          <boxGeometry args={[0.06, 0.06, 1.15]} />
          <meshStandardMaterial color="#4a5560" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}

      {/* Cross bar under panel */}
      <mesh position={[0, PANEL_CENTER_Y - 0.12, -0.05]} raycast={() => null}>
        <boxGeometry args={[1.4, 0.05, 0.05]} />
        <meshStandardMaterial color="#4a5560" metalness={0.5} roughness={0.4} />
      </mesh>

      {/*
        Panel faces the plaza (+X). Local layout: width along X, height along Y,
        then tilt around X so the +Z local edge drops (front) and -Z rises (rear).
        Parent yaw aims the panel normal toward +X.
      */}
      <group position={[0, PANEL_CENTER_Y, -0.05]} rotation={[0, Math.PI / 2, 0]}>
        <group rotation={[-TILT, 0, 0]}>
          <mesh position={[0, 0, -0.03]} raycast={() => null}>
            <boxGeometry args={[PANEL_W + 0.06, PANEL_H + 0.06, 0.06]} />
            <meshStandardMaterial color="#2f3842" metalness={0.45} roughness={0.4} />
          </mesh>
          <mesh raycast={() => null}>
            <boxGeometry args={[PANEL_W, PANEL_H, 0.04]} />
            <meshStandardMaterial color="#163a6b" metalness={0.8} roughness={0.16} />
          </mesh>
          {[-0.5, 0, 0.5].map((gx) => (
            <mesh key={`g-${gx}`} position={[gx, 0, 0.025]} raycast={() => null}>
              <boxGeometry args={[0.02, PANEL_H - 0.12, 0.01]} />
              <meshStandardMaterial color="#0c203c" />
            </mesh>
          ))}
          {[-0.28, 0.28].map((gy) => (
            <mesh key={`h-${gy}`} position={[0, gy, 0.025]} raycast={() => null}>
              <boxGeometry args={[PANEL_W - 0.12, 0.02, 0.01]} />
              <meshStandardMaterial color="#0c203c" />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  )
}

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

  const padW = COL_SPACING * 2 + 2.4
  const padD = ROW_SPACING * 2 + 2.4

  return (
    <group position={position}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[COL_SPACING, 0.025, ROW_SPACING]}
        receiveShadow
        raycast={() => null}
      >
        <planeGeometry args={[padW, padD]} />
        <meshStandardMaterial color="#8b9198" roughness={0.95} />
      </mesh>

      {panels.map(([col, row]) => (
        <SolarPanelUnit
          key={`panel-${row}-${col}`}
          position={[col * COL_SPACING, 0, row * ROW_SPACING]}
        />
      ))}
    </group>
  )
}
