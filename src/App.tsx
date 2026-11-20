import { Canvas } from '@react-three/fiber'
import { XR } from '@react-three/xr'
import { Suspense, useEffect, useMemo } from 'react'
import { loadModulePack } from './content/loader'
import { HubScene } from './scenes/HubScene'
import { Module1Scene } from './scenes/modules/M01/Module1Scene'
import { parseEmbedParams } from './systems/lms'
import { useProgressStore } from './systems/progress'
import { BadgeCeremony } from './ui/BadgeCeremony'
import { Hud } from './ui/Hud'
import { QuizOverlay } from './ui/QuizOverlay'
import { CameraSpawnApplier } from './xr/CameraSpawnApplier'
import { DesktopControls } from './xr/DesktopControls'
import { xrStore } from './xr/store'

function Experience() {
  const phase = useProgressStore((s) => s.phase)
  const activeModuleId = useProgressStore((s) => s.activeModuleId)
  const resetNonce = useProgressStore((s) => s.resetNonce)
  const pack = useMemo(
    () => (activeModuleId ? loadModulePack(activeModuleId) : null),
    [activeModuleId],
  )

  return (
    <>
      <CameraSpawnApplier />
      <DesktopControls enabled={phase !== 'quiz' && phase !== 'badge'} />
      {phase === 'hub' && <HubScene />}
      {/* Keep module scene only while exploring — hide during quiz/badge so Html signs can't cover overlays */}
      {phase === 'module' && pack?.module.id === 'm01' && (
        <Module1Scene key={`m01-${resetNonce}`} pack={pack} />
      )}
      {phase === 'module' && pack && pack.module.id !== 'm01' && <HubScene />}
    </>
  )
}

export default function App() {
  const phase = useProgressStore((s) => s.phase)
  const activeModuleId = useProgressStore((s) => s.activeModuleId)
  const setEmbedContext = useProgressStore((s) => s.setEmbedContext)
  const startModule = useProgressStore((s) => s.startModule)

  const pack = useMemo(
    () => (activeModuleId ? loadModulePack(activeModuleId) : null),
    [activeModuleId],
  )

  useEffect(() => {
    const params = parseEmbedParams()
    setEmbedContext({
      courseId: params.courseId,
      learnerId: params.learnerId,
      embedMode: params.embed,
    })
    if (params.moduleId && loadModulePack(params.moduleId)) {
      startModule(params.moduleId)
    }
  }, [setEmbedContext, startModule])

  return (
    <div className="app-shell" data-testid="app-shell">
      <Hud />

      <Canvas
        shadows
        camera={{ position: [0, 1.6, 13.2], fov: 55, near: 0.1, far: 120 }}
        gl={{ antialias: true }}
      >
        <XR store={xrStore}>
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </XR>
      </Canvas>

      {phase === 'quiz' && pack && <QuizOverlay pack={pack} />}
      {phase === 'badge' && pack && <BadgeCeremony pack={pack} />}

      <div className="desktop-help">
        Home = campus signpost · WASD move · Walk into a green cylinder to enter · Shift+drag look
      </div>
    </div>
  )
}
