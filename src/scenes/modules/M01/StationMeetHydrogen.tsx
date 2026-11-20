import { Text } from '@react-three/drei'
import type { StationDefinition } from '../../../content/types'
import { H2Molecule } from '../../../components/H2Molecule'
import { StationStatusLabel } from '../../../components/StationStatusLabel'
import { EMPTY_FLAGS } from '../../../systems/emptyFlags'
import { useProgressStore } from '../../../systems/progress'

export function StationMeetHydrogen({
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

  const facts = station.facts ?? []
  const factFlags = facts.map((_, index) => Boolean(flags[`fact-${index}`]))

  const tryComplete = (nextFlags: Record<string, boolean>) => {
    const molecule = nextFlags['inspect-molecule']
    const allFacts = facts.every((_, index) => nextFlags[`fact-${index}`])
    if (molecule && allFacts) {
      completeStation(moduleId, station.id)
    }
  }

  return (
    <group position={station.position as [number, number, number]}>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.2, 32]} />
        <meshStandardMaterial color={isComplete ? '#c8f0d8' : '#dceefc'} />
      </mesh>

      <Text position={[0, 2.8, 0]} fontSize={0.28} color="#0f2438" anchorX="center">
        {station.title}
      </Text>
      <StationStatusLabel
        complete={isComplete}
        hint={flags['inspect-molecule'] ? 'Click the fact cubes' : 'Click the H₂ molecule'}
      />

      <H2Molecule
        position={[0, 1.5, 0]}
        scale={1.45}
        onClick={() => {
          markInteraction(moduleId, station.id, 'inspect-molecule')
          tryComplete({ ...flags, 'inspect-molecule': true })
        }}
      />

      {facts.map((fact, index) => {
        const angle = (index / facts.length) * Math.PI * 2 - Math.PI / 2
        const x = Math.cos(angle) * 1.85
        const z = Math.sin(angle) * 1.85
        const done = factFlags[index]
        return (
          <mesh
            key={fact}
            position={[x, 0.95, z]}
            onClick={() => {
              markInteraction(moduleId, station.id, `fact-${index}`)
              tryComplete({
                ...flags,
                'inspect-molecule': Boolean(flags['inspect-molecule']),
                [`fact-${index}`]: true,
              })
            }}
            onPointerOver={() => {
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'default'
            }}
          >
            <boxGeometry args={[0.75, 0.75, 0.14]} />
            <meshStandardMaterial color={done ? '#1f9d55' : '#1a6fb5'} />
          </mesh>
        )
      })}
    </group>
  )
}
