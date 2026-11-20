import { Html } from '@react-three/drei'
import type { ReactNode } from 'react'
import { useProgressStore } from '../systems/progress'

type WorldSignProps = {
  position: [number, number, number]
  children: ReactNode
  width?: number
  interactive?: boolean
  tone?: 'default' | 'success' | 'muted' | 'accent'
}

/** Screen-facing label card — always readable, never sideways in world space. */
export function WorldSign({
  position,
  children,
  width = 210,
  interactive = false,
  tone = 'default',
}: WorldSignProps) {
  const phase = useProgressStore((s) => s.phase)

  // Never let world Html labels sit on top of quiz / badge overlays
  if (phase === 'quiz' || phase === 'badge') return null

  return (
    <Html
      position={position}
      center
      distanceFactor={12}
      zIndexRange={[10, 0]}
      style={{
        width,
        pointerEvents: interactive ? 'auto' : 'none',
        userSelect: 'none',
      }}
    >
      <div className={`world-sign world-sign--${tone}`}>{children}</div>
    </Html>
  )
}
