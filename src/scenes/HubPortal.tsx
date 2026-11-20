import type { CatalogModule } from '../content/types'
import { WorldSign } from '../components/WorldSign'

type HubPortalProps = {
  module: CatalogModule
  index: number
  position: [number, number, number]
  unlocked: boolean
  earned: boolean
  onEnter: () => void
}

export function HubPortal({
  module,
  index,
  position,
  unlocked,
  earned,
  onEnter,
}: HubPortalProps) {
  const numberLabel = String(index + 1).padStart(2, '0')
  const status = !unlocked ? 'Locked' : earned ? 'Completed · Replay' : 'Open'
  const accent = unlocked ? '#1f9d55' : '#8aa0b3'
  const tone = !unlocked ? 'muted' : earned ? 'success' : 'accent'

  return (
    <group position={position}>
      <mesh
        position={[0, 1.05, 0]}
        onClick={() => {
          if (unlocked) onEnter()
        }}
        onPointerOver={(event) => {
          if (unlocked) {
            event.stopPropagation()
            document.body.style.cursor = 'pointer'
          }
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default'
        }}
      >
        <cylinderGeometry args={[0.9, 0.9, 1.9, 24]} />
        <meshStandardMaterial
          color={accent}
          transparent
          opacity={unlocked ? 0.55 : 0.3}
          emissive={unlocked ? '#0d6b3a' : '#000000'}
          emissiveIntensity={unlocked ? 0.25 : 0}
        />
      </mesh>

      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <ringGeometry args={[0.95, 1.15, 32]} />
        <meshStandardMaterial color={unlocked ? '#dff7e8' : '#d5dde5'} />
      </mesh>

      {/* Number badge on the column itself */}
      <WorldSign position={[0, 1.05, 0.95]} width={56} tone={tone}>
        <div className="world-sign__badge">{numberLabel}</div>
      </WorldSign>

      {/* Readable module card above the column */}
      <WorldSign
        position={[0, 2.55, 0]}
        width={200}
        tone={tone}
        interactive={unlocked}
      >
        <button
          type="button"
          className="world-sign__button"
          disabled={!unlocked}
          onClick={() => {
            if (unlocked) onEnter()
          }}
        >
          <span className="world-sign__eyebrow">{`Module ${numberLabel}`}</span>
          <strong className="world-sign__title">{module.title}</strong>
          <span className="world-sign__status">{status}</span>
        </button>
      </WorldSign>
    </group>
  )
}
