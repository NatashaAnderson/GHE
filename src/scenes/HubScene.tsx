import { useEffect } from 'react'
import { getCatalog } from '../content/loader'
import { useProgressStore } from '../systems/progress'
import { CampusEnvironment } from './CampusEnvironment'
import { CampusSignPost } from './CampusSignPost'
import { HubPortal } from './HubPortal'
import { PortalProximityTeleporter } from './PortalProximityTeleporter'
import { HUB_LOOK_AT, HUB_SPAWN, MODULE_SPAWN, PORTAL_LAYOUT } from './portalLayout'

export function HubScene() {
  const catalog = getCatalog()
  const startModule = useProgressStore((s) => s.startModule)
  const requestCameraSpawn = useProgressStore((s) => s.requestCameraSpawn)
  const earnedBadges = useProgressStore((s) => s.earnedBadges)
  const reduceMotion = useProgressStore((s) => s.reduceMotion)

  useEffect(() => {
    requestCameraSpawn(HUB_SPAWN, HUB_LOOK_AT)
  }, [requestCameraSpawn])

  const enterModule = (moduleId: string) => {
    startModule(moduleId)
    requestCameraSpawn(MODULE_SPAWN, [0, 1.4, -2])
  }

  return (
    <group>
      <CampusEnvironment reduceMotion={reduceMotion} />
      <PortalProximityTeleporter />
      <CampusSignPost />

      {catalog.modules.map((module, index) => {
        const position = PORTAL_LAYOUT[index] ?? [0, 0, 2]
        const unlocked = !module.locked
        const earned = earnedBadges.some((badge) =>
          badge.toLowerCase().includes(module.title.split(' ')[0]?.toLowerCase() ?? ''),
        )

        return (
          <HubPortal
            key={module.id}
            module={module}
            index={index}
            position={position}
            unlocked={unlocked}
            earned={earned}
            onEnter={() => enterModule(module.id)}
          />
        )
      })}
    </group>
  )
}
