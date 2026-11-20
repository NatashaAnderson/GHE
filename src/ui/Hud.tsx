import { getCatalog, loadModulePack } from '../content/loader'
import { xrStore } from '../xr/store'
import { useProgressStore } from '../systems/progress'

export function Hud() {
  const catalog = getCatalog()
  const phase = useProgressStore((s) => s.phase)
  const activeModuleId = useProgressStore((s) => s.activeModuleId)
  const completedStations = useProgressStore((s) => s.completedStations)
  const enterHub = useProgressStore((s) => s.enterHub)
  const setPhase = useProgressStore((s) => s.setPhase)
  const reduceMotion = useProgressStore((s) => s.reduceMotion)
  const setReduceMotion = useProgressStore((s) => s.setReduceMotion)
  const embedMode = useProgressStore((s) => s.embedMode)

  const pack = activeModuleId ? loadModulePack(activeModuleId) : null
  const doneCount = activeModuleId
    ? (completedStations[activeModuleId] ?? []).length
    : 0
  const totalStations = pack?.stations.length ?? 0

  return (
    <div className="hud" data-testid="hud">
      <div className="hud-brand">
        <span className="hud-brand-mark">ForgeX</span>
        <div>
          <strong>{catalog.courseTitle}</strong>
          <p>{phase === 'hub' ? 'Campus Hub' : pack?.module.title ?? 'Mission'}</p>
        </div>
      </div>

      <div className="hud-actions">
        {phase === 'module' && pack && (
          <div className="hud-progress" data-testid="station-progress">
            Stations {doneCount}/{totalStations}
          </div>
        )}

        {phase === 'module' && doneCount === totalStations && totalStations > 0 && (
          <button type="button" onClick={() => setPhase('quiz')}>
            Knowledge Check
          </button>
        )}

        {phase !== 'hub' && (
          <button type="button" onClick={enterHub}>
            Hub
          </button>
        )}

        <button
          type="button"
          onClick={() => setReduceMotion(!reduceMotion)}
          aria-pressed={reduceMotion}
        >
          {reduceMotion ? 'Motion: Off' : 'Motion: On'}
        </button>

        <button
          type="button"
          data-testid="enter-vr"
          onClick={() => {
            void xrStore.enterVR()
          }}
        >
          Enter VR
        </button>

        {pack?.module.assets.fieldManual && (
          <a
            className="hud-link"
            href={pack.module.assets.fieldManual}
            target="_blank"
            rel="noreferrer"
          >
            Field Manual
          </a>
        )}

        {embedMode && <span className="hud-embed">LMS embed</span>}
      </div>
    </div>
  )
}
