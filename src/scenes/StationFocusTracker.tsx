import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import type { StationDefinition } from '../content/types'
import { useProgressStore } from '../systems/progress'

const FOCUS_RADIUS = 5.5

/** Updates HUD focus from camera proximity so only one station tip is active. */
export function StationFocusTracker({ stations }: { stations: StationDefinition[] }) {
  const setFocusedStationId = useProgressStore((s) => s.setFocusedStationId)
  const { camera } = useThree()
  const lastId = useRef<string | null>(null)

  useFrame(() => {
    let nearestId: string | null = null
    let nearestDist = FOCUS_RADIUS

    for (const station of stations) {
      const [x, , z] = station.position
      const dx = camera.position.x - x
      const dz = camera.position.z - z
      const dist = Math.hypot(dx, dz)
      if (dist < nearestDist) {
        nearestDist = dist
        nearestId = station.id
      }
    }

    if (nearestId !== lastId.current) {
      lastId.current = nearestId
      setFocusedStationId(nearestId)
    }
  })

  return null
}
