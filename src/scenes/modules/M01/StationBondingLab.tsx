import { Text } from '@react-three/drei'
import { useState } from 'react'
import type { StationDefinition } from '../../../content/types'
import { InfoPanel } from '../../../components/InfoPanel'
import { useProgressStore } from '../../../systems/progress'

type AtomSlot = 'h1' | 'h2' | null

export function StationBondingLab({
  station,
  moduleId,
}: {
  station: StationDefinition
  moduleId: string
}) {
  const completeStation = useProgressStore((s) => s.completeStation)
  const isComplete = useProgressStore((s) => s.isStationComplete(moduleId, station.id))
  const [bonds, setBonds] = useState<AtomSlot[]>([null, null])
  const [selected, setSelected] = useState<'h1' | 'h2' | null>(null)

  const bondCount = bonds.filter(Boolean).length

  const placeBond = (slotIndex: number) => {
    if (isComplete || !selected) return
    if (bonds[slotIndex]) return
    if (bonds.includes(selected)) return

    const next = [...bonds] as AtomSlot[]
    next[slotIndex] = selected
    setBonds(next)
    setSelected(null)

    if (next.filter(Boolean).length >= 2) {
      completeStation(moduleId, station.id)
    }
  }

  return (
    <group position={station.position as [number, number, number]}>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.2, 32]} />
        <meshStandardMaterial color={isComplete ? '#c8f0d8' : '#ffe8d6'} />
      </mesh>

      <Text position={[0, 2.8, 0]} fontSize={0.28} color="#0f2438" anchorX="center">
        {station.title}
      </Text>

      {/* Oxygen */}
      <mesh position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshStandardMaterial color="#e4572e" />
      </mesh>
      <Text position={[0, 1.3, 0.5]} fontSize={0.18} color="#fff" anchorX="center">
        O
      </Text>

      {/* Bond slots */}
      {([-0.75, 0.75] as const).map((x, index) => (
        <mesh
          key={`slot-${index}`}
          position={[x, 1.3, 0]}
          onClick={() => placeBond(index)}
        >
          <sphereGeometry args={[0.28, 20, 20]} />
          <meshStandardMaterial
            color={bonds[index] ? '#5eb3ff' : '#9bb4c7'}
            transparent
            opacity={bonds[index] ? 1 : 0.45}
          />
        </mesh>
      ))}

      {/* Hydrogen supply */}
      {(['h1', 'h2'] as const).map((id, index) => {
        const used = bonds.includes(id)
        return (
          <mesh
            key={id}
            position={[-1.2 + index * 2.4, 0.7, 1.4]}
            onClick={() => {
              if (!used && !isComplete) setSelected(id)
            }}
          >
            <sphereGeometry args={[0.26, 20, 20]} />
            <meshStandardMaterial
              color={used ? '#9bb4c7' : selected === id ? '#7fd0ff' : '#5eb3ff'}
              emissive={selected === id ? '#2a7fbf' : '#000'}
              emissiveIntensity={selected === id ? 0.4 : 0}
            />
          </mesh>
        )
      })}

      <InfoPanel
        position={[0, 0.5, 2.3]}
        title={isComplete ? 'H₂O assembled' : `Bonds ${bondCount}/2`}
        body={
          isComplete
            ? 'Hydrogen usually joins with other elements — in water, two H atoms bond to one O.'
            : 'Select a blue H atom, then click an empty bond slot on oxygen.'
        }
        tone={isComplete ? 'success' : 'default'}
      />
    </group>
  )
}
