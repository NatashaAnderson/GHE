import { Text } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import type { StationDefinition } from '../../../content/types'
import { StationStatusLabel } from '../../../components/StationStatusLabel'
import { EMPTY_FLAGS } from '../../../systems/emptyFlags'
import { useProgressStore } from '../../../systems/progress'

export function StationElectrolyzer({
  station,
  moduleId,
}: {
  station: StationDefinition
  moduleId: string
}) {
  const markInteraction = useProgressStore((s) => s.markInteraction)
  const completeStation = useProgressStore((s) => s.completeStation)
  const isComplete = useProgressStore((s) => s.isStationComplete(moduleId, station.id))
  const flags = useProgressStore(
    (s) => s.stationFlags[`${moduleId}:${station.id}`] ?? EMPTY_FLAGS,
  )
  const bubbleGroup = useRef<Group>(null)

  const powered = Boolean(flags['connect-power'])
  const running = Boolean(flags['start-electrolysis'])
  const observed = Boolean(flags['observe-bubbles'])

  useFrame((_, delta) => {
    if (running && bubbleGroup.current) {
      bubbleGroup.current.children.forEach((child, index) => {
        child.position.y += delta * (0.4 + index * 0.05)
        if (child.position.y > 2.2) child.position.y = 0.6
      })
    }
  })

  const bubbles = useMemo(
    () =>
      Array.from({ length: 10 }, (_, index) => ({
        id: index,
        x: index < 5 ? -0.45 : 0.45,
        y: 0.6 + (index % 5) * 0.25,
        color: index < 5 ? '#5eb3ff' : '#7fd98a',
      })),
    [],
  )

  const syncComplete = (next: Record<string, boolean>) => {
    if (next['connect-power'] && next['start-electrolysis'] && next['observe-bubbles']) {
      completeStation(moduleId, station.id)
    }
  }

  return (
    <group position={station.position as [number, number, number]}>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.4, 32]} />
        <meshStandardMaterial color={isComplete ? '#c8f0d8' : '#d9ecff'} />
      </mesh>

      <StationStatusLabel
        title={`3 · ${station.title}`}
        complete={isComplete}
        hint={
          !powered
            ? 'Step 1: Connect renewables'
            : !running
              ? 'Step 2: Start electrolysis'
              : !observed
                ? 'Step 3: Observe H₂ / O₂'
                : 'Working…'
        }
      />

      {/* Tank */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 1.6, 24]} />
        <meshStandardMaterial color="#9fd0ff" transparent opacity={0.45} />
      </mesh>

      {/* Electrodes */}
      <mesh position={[-0.45, 1.0, 0]}>
        <boxGeometry args={[0.12, 1.2, 0.12]} />
        <meshStandardMaterial color="#1a6fb5" />
      </mesh>
      <mesh position={[0.45, 1.0, 0]}>
        <boxGeometry args={[0.12, 1.2, 0.12]} />
        <meshStandardMaterial color="#1f9d55" />
      </mesh>

      <group ref={bubbleGroup}>
        {running &&
          bubbles.map((bubble) => (
            <mesh key={bubble.id} position={[bubble.x, bubble.y, 0]}>
              <sphereGeometry args={[0.08, 10, 10]} />
              <meshStandardMaterial color={bubble.color} />
            </mesh>
          ))}
      </group>

      {/* Power buttons */}
      <mesh
        position={[-1.5, 0.7, 1.2]}
        onClick={() => {
          markInteraction(moduleId, station.id, 'connect-power')
          syncComplete({ ...flags, 'connect-power': true })
        }}
      >
        <boxGeometry args={[0.8, 0.35, 0.2]} />
        <meshStandardMaterial color={powered ? '#1f9d55' : '#f0c24b'} />
      </mesh>
      <Text position={[-1.5, 1.05, 1.2]} fontSize={0.12} color="#0f2438" anchorX="center">
        Connect renewables
      </Text>

      <mesh
        position={[0, 0.7, 1.2]}
        onClick={() => {
          if (!powered) return
          markInteraction(moduleId, station.id, 'start-electrolysis')
          syncComplete({ ...flags, 'connect-power': true, 'start-electrolysis': true })
        }}
      >
        <boxGeometry args={[0.8, 0.35, 0.2]} />
        <meshStandardMaterial color={running ? '#1f9d55' : powered ? '#1a6fb5' : '#9bb4c7'} />
      </mesh>
      <Text position={[0, 1.05, 1.2]} fontSize={0.12} color="#0f2438" anchorX="center">
        Start electrolysis
      </Text>

      <mesh
        position={[1.5, 0.7, 1.2]}
        onClick={() => {
          if (!running) return
          markInteraction(moduleId, station.id, 'observe-bubbles')
          syncComplete({
            ...flags,
            'connect-power': true,
            'start-electrolysis': true,
            'observe-bubbles': true,
          })
        }}
      >
        <boxGeometry args={[0.8, 0.35, 0.2]} />
        <meshStandardMaterial color={observed ? '#1f9d55' : running ? '#5eb3ff' : '#9bb4c7'} />
      </mesh>
      <Text position={[1.5, 1.05, 1.2]} fontSize={0.12} color="#0f2438" anchorX="center">
        Observe H₂ / O₂
      </Text>
    </group>
  )
}
