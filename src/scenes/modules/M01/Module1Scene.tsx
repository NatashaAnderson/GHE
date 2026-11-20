import { Text } from '@react-three/drei'
import type { ModulePack } from '../../../content/types'
import { CampusEnvironment } from '../../CampusEnvironment'
import { StationFocusTracker } from '../../StationFocusTracker'
import { useProgressStore } from '../../../systems/progress'
import { StationMeetHydrogen } from './StationMeetHydrogen'
import { StationBondingLab } from './StationBondingLab'
import { StationElectrolyzer } from './StationElectrolyzer'
import { StationEnergyCarrier } from './StationEnergyCarrier'

export function Module1Scene({ pack }: { pack: ModulePack }) {
  const reduceMotion = useProgressStore((s) => s.reduceMotion)
  const allStationsComplete = useProgressStore((s) => s.allStationsComplete)
  const setPhase = useProgressStore((s) => s.setPhase)
  const readyForQuiz = allStationsComplete(
    pack.module.id,
    pack.stations.map((station) => station.id),
  )

  const stationById = Object.fromEntries(pack.stations.map((station) => [station.id, station]))

  return (
    <group>
      <CampusEnvironment reduceMotion={reduceMotion} />
      <StationFocusTracker stations={pack.stations} />

      <Text position={[0, 3.4, 6]} fontSize={0.4} color="#0f2438" anchorX="center">
        {pack.module.title}
      </Text>
      <Text position={[0, 2.9, 6]} fontSize={0.2} color="#1a6fb5" anchorX="center" maxWidth={10}>
        {pack.module.tagline}
      </Text>

      {stationById['meet-hydrogen'] && (
        <StationMeetHydrogen station={stationById['meet-hydrogen']} moduleId={pack.module.id} />
      )}
      {stationById['bonding-lab'] && (
        <StationBondingLab station={stationById['bonding-lab']} moduleId={pack.module.id} />
      )}
      {stationById['green-electrolyzer'] && (
        <StationElectrolyzer
          station={stationById['green-electrolyzer']}
          moduleId={pack.module.id}
        />
      )}
      {stationById['energy-carrier'] && (
        <StationEnergyCarrier
          station={stationById['energy-carrier']}
          moduleId={pack.module.id}
        />
      )}

      {readyForQuiz && (
        <group position={[0, 0, 4]}>
          <mesh
            position={[0, 1.2, 0]}
            onClick={() => setPhase('quiz')}
            onPointerOver={() => {
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'default'
            }}
          >
            <boxGeometry args={[2.8, 1, 0.3]} />
            <meshStandardMaterial color="#1f9d55" emissive="#0d6b3a" emissiveIntensity={0.35} />
          </mesh>
          <Text position={[0, 1.2, 0.2]} fontSize={0.22} color="#fff" anchorX="center">
            Start Knowledge Check
          </Text>
        </group>
      )}
    </group>
  )
}
