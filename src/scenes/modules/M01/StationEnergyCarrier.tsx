import { Text } from '@react-three/drei'
import type { StationDefinition } from '../../../content/types'
import { StationStatusLabel } from '../../../components/StationStatusLabel'
import { EMPTY_FLAGS } from '../../../systems/emptyFlags'
import { useProgressStore } from '../../../systems/progress'

export function StationEnergyCarrier({
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

  const destinations = station.destinations ?? []
  const flow = station.flow ?? ['Sun', 'Electricity', 'Hydrogen']

  const syncComplete = (next: Record<string, boolean>) => {
    const allDelivered = destinations.every((destination) => next[`dest-${destination.id}`])
    if (next['flow-complete'] && allDelivered) {
      completeStation(moduleId, station.id)
    }
  }

  return (
    <group position={station.position as [number, number, number]}>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.5, 32]} />
        <meshStandardMaterial color={isComplete ? '#c8f0d8' : '#e7f5ff'} />
      </mesh>

      <StationStatusLabel
        title={`4 · ${station.title}`}
        complete={isComplete}
        hint={
          flags['flow-complete']
            ? 'Deliver to Transport, Maritime, Industry'
            : 'Tap the Hydrogen step'
        }
      />

      {flow.map((step, index) => (
        <group key={step} position={[-1.6 + index * 1.6, 1.5, 0]}>
          <mesh
            onClick={() => {
              if (index < flow.length - 1) return
              markInteraction(moduleId, station.id, 'flow-complete')
              syncComplete({ ...flags, 'flow-complete': true })
            }}
          >
            <boxGeometry args={[1.2, 0.55, 0.2]} />
            <meshStandardMaterial
              color={flags['flow-complete'] || index < 2 ? '#1a6fb5' : '#7eb6e8'}
            />
          </mesh>
          <Text position={[0, 0, 0.15]} fontSize={0.14} color="#fff" anchorX="center">
            {step}
          </Text>
          {index < flow.length - 1 && (
            <Text position={[0.75, 0, 0]} fontSize={0.2} color="#0f2438" anchorX="center">
              →
            </Text>
          )}
        </group>
      ))}

      {destinations.map((destination, index) => {
        const done = Boolean(flags[`dest-${destination.id}`])
        const x = -1.6 + index * 1.6
        return (
          <group key={destination.id} position={[x, 0.7, 1.5]}>
            <mesh
              onClick={() => {
                if (!flags['flow-complete']) return
                markInteraction(moduleId, station.id, `dest-${destination.id}`)
                syncComplete({
                  ...flags,
                  'flow-complete': true,
                  [`dest-${destination.id}`]: true,
                })
              }}
            >
              <boxGeometry args={[1.2, 0.7, 0.25]} />
              <meshStandardMaterial color={done ? '#1f9d55' : '#c47b16'} />
            </mesh>
            <Text position={[0, 0, 0.2]} fontSize={0.14} color="#fff" anchorX="center">
              {destination.label}
            </Text>
          </group>
        )
      })}
    </group>
  )
}
