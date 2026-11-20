import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { getCatalog } from '../content/loader'
import { useProgressStore } from '../systems/progress'
import { MODULE_SPAWN, PORTAL_LAYOUT, PORTAL_TELEPORT_RADIUS } from './portalLayout'

/**
 * When the learner walks into an unlocked module cylinder, teleport into that module.
 */
export function PortalProximityTeleporter() {
  const { camera } = useThree()
  const startModule = useProgressStore((s) => s.startModule)
  const requestCameraSpawn = useProgressStore((s) => s.requestCameraSpawn)
  const phase = useProgressStore((s) => s.phase)
  const insideRef = useRef<string | null>(null)
  const catalog = getCatalog()

  useFrame(() => {
    if (phase !== 'hub') {
      insideRef.current = null
      return
    }

    let hitId: string | null = null

    for (let index = 0; index < catalog.modules.length; index += 1) {
      const module = catalog.modules[index]
      if (!module || module.locked) continue
      const [px, , pz] = PORTAL_LAYOUT[index] ?? [0, 0, 0]
      const dx = camera.position.x - px
      const dz = camera.position.z - pz
      if (Math.hypot(dx, dz) <= PORTAL_TELEPORT_RADIUS) {
        hitId = module.id
        break
      }
    }

    if (hitId && hitId !== insideRef.current) {
      insideRef.current = hitId
      startModule(hitId)
      requestCameraSpawn(MODULE_SPAWN, [0, 1.4, -2])
      return
    }

    if (!hitId) {
      insideRef.current = null
    }
  })

  return null
}
