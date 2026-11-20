import { Text } from '@react-three/drei'
import { useState } from 'react'
import type { StationDefinition } from '../../../content/types'
import { StationStatusLabel } from '../../../components/StationStatusLabel'
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
        {`2 · ${station.title}`}
      </Text>
      <StationStatusLabel
        complete={isComplete}
        hint={selected ? `Bonds ${bondCount}/2 — click an O slot` : `Bonds ${bondCount}/2 — select H`}
      />

      <mesh position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshStandardMaterial color="#e4572e" />
      </mesh>
      <Text position={[0, 1.3, 0.5]} fontSize={0.18} color="#fff" anchorX="center">
        O
      </Text>

      {([-0.75, 0.75] as const).map((x, index) => (
        <mesh
          key={`slot-${index}`}
          position={[x, 1.3, 0]}
          onClick={() => placeBond(index)}
          onPointerOver={() => {
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'default'
          }}
        >
          <sphereGeometry args={[0.32, 20, 20]} />
          <meshStandardMaterial
            color={bonds[index] ? '#5eb3ff' : '#9bb4c7'}
            transparent
            opacity={bonds[index] ? 1 : 0.45}
          />
        </mesh>
      ))}

      {(['h1', 'h2'] as const).map((id, index) => {
        const used = bonds.includes(id)
        return (
          <mesh
            key={id}
            position={[-1.2 + index * 2.4, 0.7, 1.6]}
            onClick={() => {
              if (!used && !isComplete) setSelected(id)
            }}
            onPointerOver={() => {
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'default'
            }}
          >
            <sphereGeometry args={[0.3, 20, 20]} />
            <meshStandardMaterial
              color={used ? '#9bb4c7' : selected === id ? '#7fd0ff' : '#5eb3ff'}
              emissive={selected === id ? '#2a7fbf' : '#000'}
              emissiveIntensity={selected === id ? 0.4 : 0}
            />
          </mesh>
        )
      })}
    </group>
  )
}
