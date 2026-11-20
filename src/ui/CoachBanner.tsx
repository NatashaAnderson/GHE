import { loadModulePack } from '../content/loader'
import { useProgressStore } from '../systems/progress'

export function CoachBanner() {
  const phase = useProgressStore((s) => s.phase)
  const activeModuleId = useProgressStore((s) => s.activeModuleId)
  const focusedStationId = useProgressStore((s) => s.focusedStationId)
  const completedStations = useProgressStore((s) => s.completedStations)
  const stationFlags = useProgressStore((s) => s.stationFlags)

  if (phase === 'hub') {
    return (
      <aside className="coach-banner" data-testid="coach-banner">
        <p className="coach-eyebrow">Mission briefing</p>
        <strong>Enter Module 1: Hydrogen Explorer</strong>
        <p>
          Click the green M01 portal. Move with WASD, look with Shift+drag, or use Enter VR on
          Quest.
        </p>
      </aside>
    )
  }

  if (phase !== 'module' || !activeModuleId) return null

  const pack = loadModulePack(activeModuleId)
  if (!pack) return null

  const done = new Set(completedStations[activeModuleId] ?? [])
  const allDone = pack.stations.every((station) => done.has(station.id))

  if (allDone) {
    return (
      <aside className="coach-banner success" data-testid="coach-banner">
        <p className="coach-eyebrow">Stations complete</p>
        <strong>Ready for the Knowledge Check</strong>
        <p>Use the green pad in the centre of campus, or the Knowledge Check button above.</p>
      </aside>
    )
  }

  const focused =
    pack.stations.find((station) => station.id === focusedStationId) ??
    pack.stations.find((station) => !done.has(station.id)) ??
    pack.stations[0]

  if (!focused) return null

  const complete = done.has(focused.id)
  const flags = stationFlags[`${activeModuleId}:${focused.id}`] ?? {}
  const detail = stationDetail(focused.id, flags, complete)

  return (
    <aside
      className={`coach-banner${complete ? ' success' : ''}`}
      data-testid="coach-banner"
    >
      <p className="coach-eyebrow">{complete ? 'Station complete' : 'Current station'}</p>
      <strong>{focused.title}</strong>
      <p>{detail || focused.coachPrompt}</p>
    </aside>
  )
}

function stationDetail(
  stationId: string,
  flags: Record<string, boolean>,
  complete: boolean,
): string {
  if (complete) {
    if (stationId === 'meet-hydrogen') {
      return 'Hydrogen is the lightest chemical element — abundant in the universe, rarely free on Earth.'
    }
    if (stationId === 'bonding-lab') {
      return 'Hydrogen usually joins with other elements — in water, two H atoms bond to one O.'
    }
    if (stationId === 'green-electrolyzer') {
      return 'Renewable electricity splits water into hydrogen and oxygen — that is why this hydrogen is called green.'
    }
    if (stationId === 'energy-carrier') {
      return 'Hydrogen carries renewable energy to trucks, ships, and industry.'
    }
    return 'Station complete. Walk to the next glowing pad.'
  }

  if (stationId === 'meet-hydrogen') {
    const molecule = flags['inspect-molecule'] ? '✓' : '○'
    const facts = [0, 1, 2, 3].filter((i) => flags[`fact-${i}`]).length
    return `${molecule} Click the blue H₂ molecule, then click each blue fact cube (${facts}/4).`
  }

  if (stationId === 'bonding-lab') {
    return 'Select a blue H atom below, then click an empty bond slot on the red oxygen.'
  }

  if (stationId === 'green-electrolyzer') {
    const power = flags['connect-power'] ? '✓' : '1'
    const start = flags['start-electrolysis'] ? '✓' : '2'
    const observe = flags['observe-bubbles'] ? '✓' : '3'
    return `Steps: ${power} Connect renewables → ${start} Start electrolysis → ${observe} Observe H₂ / O₂.`
  }

  if (stationId === 'energy-carrier') {
    return 'Tap Hydrogen to finish Sun → Electricity → Hydrogen, then deliver to Transport, Maritime, and Industry.'
  }

  return ''
}
