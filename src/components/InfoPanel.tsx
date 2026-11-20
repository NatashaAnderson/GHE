import { Html } from '@react-three/drei'

type InfoPanelProps = {
  position: [number, number, number]
  title: string
  body: string
  tone?: 'default' | 'success' | 'warn'
  width?: number
}

export function InfoPanel({
  position,
  title,
  body,
  tone = 'default',
  width = 320,
}: InfoPanelProps) {
  const border =
    tone === 'success' ? '#1f9d55' : tone === 'warn' ? '#c47b16' : '#1a6fb5'

  return (
    <Html position={position} transform occlude distanceFactor={8} style={{ pointerEvents: 'none' }}>
      <div
        style={{
          width,
          padding: '14px 16px',
          borderRadius: 12,
          background: 'rgba(248, 252, 255, 0.94)',
          border: `2px solid ${border}`,
          color: '#0f2438',
          fontFamily: '"Segoe UI", "Helvetica Neue", sans-serif',
          boxShadow: '0 10px 30px rgba(15, 36, 56, 0.18)',
        }}
      >
        <strong style={{ display: 'block', marginBottom: 6, fontSize: 16 }}>{title}</strong>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.45 }}>{body}</p>
      </div>
    </Html>
  )
}
