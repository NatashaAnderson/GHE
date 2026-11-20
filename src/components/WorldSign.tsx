import { Html } from '@react-three/drei'
import type { ReactNode } from 'react'

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
  return (
    <Html
      position={position}
      center
      distanceFactor={12}
      zIndexRange={[80, 0]}
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
