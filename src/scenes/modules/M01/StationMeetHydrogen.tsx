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
  const setLastInsight = useProgressStore((s) => s.setLastInsight)
  const isComplete = useProgressStore((s) => s.isStationComplete(moduleId, station.id))
  const flags = useProgressStore(
    (s) => s.stationFlags[`${moduleId}:${station.id}`] ?? EMPTY_FLAGS,
  )

  const facts = station.facts ?? []
  const factFlags = facts.map((_, index) => Boolean(flags[`fact-${index}`]))
  const moleculeDone = Boolean(flags['inspect-molecule'])
  const factsDone = factFlags.filter(Boolean).length

  const tryComplete = (nextFlags: Record<string, boolean>) => {
    const molecule = nextFlags['inspect-molecule']
    const allFacts = facts.every((_, index) => nextFlags[`fact-${index}`])
    if (molecule && allFacts) {
      setLastInsight(
        'Station complete! Hydrogen is tiny, everywhere in the universe, and usually bonded on Earth.',
      )
      completeStation(moduleId, station.id)
    }
  }

  return (
    <group position={station.position as [number, number, number]}>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.4, 32]} />
        <meshStandardMaterial color={isComplete ? '#c8f0d8' : '#dceefc'} />
      </mesh>

      <Text position={[0, 2.85, 0]} fontSize={0.28} color="#0f2438" anchorX="center">
        {station.title}
      </Text>
      <StationStatusLabel
        complete={isComplete}
        hint={
          !moleculeDone
            ? '1/2 Click the spinning H₂ molecule'
            : factsDone < facts.length
              ? `2/2 Click fact cards (${factsDone}/${facts.length})`
              : 'Finishing…'
        }
      />

      <H2Molecule
        position={[0, 1.55, 0]}
        scale={1.45}
        highlighted={moleculeDone}
        onClick={() => {
          markInteraction(moduleId, station.id, 'inspect-molecule')
          setLastInsight(
            'H₂ inspected: Hydrogen is the smallest and lightest chemical element — and the most abundant in the universe.',
          )
          tryComplete({ ...flags, 'inspect-molecule': true })
        }}
      />
      <Text
        position={[0, 0.95, 0]}
        fontSize={0.12}
        color={moleculeDone ? '#1f9d55' : '#1a6fb5'}
        anchorX="center"
      >
        {moleculeDone ? 'H₂ inspected ✓' : 'Click me · H₂'}
      </Text>

      {facts.map((fact, index) => {
        const angle = (index / facts.length) * Math.PI * 2 - Math.PI / 2
        const x = Math.cos(angle) * 2.05
        const z = Math.sin(angle) * 2.05
        const done = factFlags[index]
        return (
          <group key={fact} position={[x, 0.9, z]}>
            <mesh
              onClick={() => {
                markInteraction(moduleId, station.id, `fact-${index}`)
                setLastInsight(`Fact ${index + 1}: ${fact}`)
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
              <boxGeometry args={[0.95, 0.7, 0.14]} />
              <meshStandardMaterial
                color={done ? '#1f9d55' : '#1a6fb5'}
                emissive={done ? '#0d6b3a' : '#0a3d66'}
                emissiveIntensity={done ? 0.2 : 0.08}
              />
            </mesh>
            <Text
              position={[0, 0, 0.1]}
              fontSize={0.095}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              maxWidth={0.85}
              textAlign="center"
            >
              {`${index + 1}. ${fact}`}
            </Text>
            {done && (
              <Text position={[0, 0.48, 0]} fontSize={0.11} color="#1f9d55" anchorX="center">
                Learned ✓
              </Text>
            )}
          </group>
        )
      })}
    </group>
  )
}
