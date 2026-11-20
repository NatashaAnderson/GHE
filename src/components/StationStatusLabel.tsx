import { Text } from '@react-three/drei'

/** Compact 3D status under the station title — no DOM overlay. */
export function StationStatusLabel({
  complete,
  hint,
}: {
  complete: boolean
  hint: string
}) {
  return (
    <Text
      position={[0, 2.35, 0]}
      fontSize={0.14}
      color={complete ? '#1f9d55' : '#355068'}
      anchorX="center"
      maxWidth={4}
      textAlign="center"
    >
      {complete ? 'Complete' : hint}
    </Text>
  )
}
