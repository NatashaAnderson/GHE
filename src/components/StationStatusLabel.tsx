import { WorldSign } from './WorldSign'

/** Compact station header — screen-facing so it stays readable. */
export function StationStatusLabel({
  title,
  complete,
  hint,
}: {
  title: string
  complete: boolean
  hint: string
}) {
  return (
    <WorldSign position={[0, 2.7, 0]} width={240} tone={complete ? 'success' : 'accent'}>
      <span className="world-sign__eyebrow">{complete ? 'Station complete' : 'Station'}</span>
      <strong className="world-sign__title">{title}</strong>
      <span className="world-sign__status">{complete ? 'Complete' : hint}</span>
    </WorldSign>
  )
}
