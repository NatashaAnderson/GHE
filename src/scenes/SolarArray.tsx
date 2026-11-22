const TILT = -0.55
const PANEL_W = 1.85
const PANEL_H = 1.1
/** Half-height along the tilted panel face — used to seat posts under the rail. */
const HALF_H = PANEL_H / 2

function SolarPanelUnit({ position }: { position: [number, number, number] }) {
  // Front (lower) and rear (higher) post lengths so tops meet the tilted rail
  const frontPostLen = 0.55
  const rearPostLen = frontPostLen + Math.sin(Math.abs(TILT)) * PANEL_H

  return (
    <group position={position}>
      {/* Face the plaza (+X), then tilt toward the sun */}
      <group rotation={[0, Math.PI / 2, 0]}>
        <group rotation={[TILT, 0, 0]}>
          {/* Mounting rail under the panel */}
          <mesh position={[0, 0, -0.08]} raycast={() => null}>
            <boxGeometry args={[PANEL_W + 0.08, PANEL_H + 0.08, 0.08]} />
            <meshStandardMaterial color="#4a5560" metalness={0.55} roughness={0.35} />
          </mesh>

          {/* Panel body */}
          <mesh position={[0, 0, -0.02]} raycast={() => null}>
            <boxGeometry args={[PANEL_W, PANEL_H, 0.05]} />
            <meshStandardMaterial color="#2a323c" metalness={0.4} roughness={0.45} />
          </mesh>
          <mesh position={[0, 0, 0.01]} raycast={() => null}>
            <boxGeometry args={[PANEL_W - 0.1, PANEL_H - 0.1, 0.04]} />
            <meshStandardMaterial color="#163a6b" metalness={0.75} roughness={0.18} />
          </mesh>

          {/* Cell grid */}
          {[-0.5, 0, 0.5].map((gx) => (
            <mesh key={`vx-${gx}`} position={[gx, 0, 0.035]} raycast={() => null}>
              <boxGeometry args={[0.02, PANEL_H - 0.14, 0.01]} />
              <meshStandardMaterial color="#0d2240" />
            </mesh>
          ))}
          {[-0.28, 0.28].map((gy) => (
            <mesh key={`hz-${gy}`} position={[0, gy, 0.035]} raycast={() => null}>
              <boxGeometry args={[PANEL_W - 0.14, 0.02, 0.01]} />
              <meshStandardMaterial color="#0d2240" />
            </mesh>
          ))}

          {/* Cross-brace connecting posts into the rail (local panel space) */}
          <mesh position={[0, -HALF_H + 0.05, -0.14]} raycast={() => null}>
            <boxGeometry args={[PANEL_W - 0.2, 0.06, 0.06]} />
            <meshStandardMaterial color="#5b6570" metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh position={[0, HALF_H - 0.05, -0.14]} raycast={() => null}>
            <boxGeometry args={[PANEL_W - 0.2, 0.06, 0.06]} />
            <meshStandardMaterial color="#5b6570" metalness={0.5} roughness={0.4} />
          </mesh>
        </group>

        {/*
          Posts live in the yawed (plaza-facing) frame but NOT the tilt frame,
          then reach up to the rail underside. Front edge of tilted panel is lower.
        */}
        {([-0.7, 0.7] as const).map((px) => (
          <group key={`posts-${px}`}>
            {/* Front / lower posts */}
            <mesh
              position={[px, frontPostLen / 2, Math.sin(Math.abs(TILT)) * HALF_H * 0.15]}
              raycast={() => null}
            >
              <cylinderGeometry args={[0.045, 0.055, frontPostLen, 8]} />
              <meshStandardMaterial color="#6b7480" metalness={0.6} roughness={0.35} />
            </mesh>
            {/* Strut from post top into tilted rail (front) */}
            <mesh
              position={[
                px,
                frontPostLen + 0.08,
                -Math.sin(Math.abs(TILT)) * (HALF_H * 0.35),
              ]}
              rotation={[TILT, 0, 0]}
              raycast={() => null}
            >
              <boxGeometry args={[0.05, 0.28, 0.05]} />
              <meshStandardMaterial color="#5b6570" metalness={0.55} roughness={0.35} />
            </mesh>

            {/* Rear / taller posts */}
            <mesh
              position={[px, rearPostLen / 2, -Math.sin(Math.abs(TILT)) * PANEL_H * 0.55]}
              raycast={() => null}
            >
              <cylinderGeometry args={[0.045, 0.055, rearPostLen, 8]} />
              <meshStandardMaterial color="#6b7480" metalness={0.6} roughness={0.35} />
            </mesh>
            <mesh
              position={[
                px,
                rearPostLen + 0.06,
                -Math.sin(Math.abs(TILT)) * (HALF_H * 0.85),
              ]}
              rotation={[TILT, 0, 0]}
              raycast={() => null}
            >
              <boxGeometry args={[0.05, 0.32, 0.05]} />
              <meshStandardMaterial color="#5b6570" metalness={0.55} roughness={0.35} />
            </mesh>
          </group>
        ))}

        {/* Footings */}
        {([-0.7, 0.7] as const).map((px) =>
          (
            [
              [px, 0.04, 0.25],
              [px, 0.04, -0.55],
            ] as Array<[number, number, number]>
          ).map((pos) => (
            <mesh key={`foot-${pos.join('-')}`} position={pos} raycast={() => null}>
              <cylinderGeometry args={[0.1, 0.12, 0.08, 10]} />
              <meshStandardMaterial color="#7a828a" roughness={0.85} />
            </mesh>
          )),
        )}
      </group>
    </group>
  )
}

/** 3×3 solar farm — posts connected into the rack, pad at building front-left. */
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
      {/* Foundation pad — starts at the building front, extends left */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.1, 0.02, 2.1]} raycast={() => null}>
        <planeGeometry args={[7.4, 7.4]} />
        <meshStandardMaterial color="#8b9198" roughness={0.95} />
      </mesh>

      {panels.map(([col, row]) => (
        <SolarPanelUnit
          key={`panel-${row}-${col}`}
          position={[col * 2.1, 0, row * 2.1]}
        />
      ))}
    </group>
  )
}
