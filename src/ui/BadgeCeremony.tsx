import type { ModulePack } from '../content/types'
import { useProgressStore } from '../systems/progress'

export function BadgeCeremony({ pack }: { pack: ModulePack }) {
  const enterHub = useProgressStore((s) => s.enterHub)
  const score = useProgressStore((s) => s.quizScores[pack.module.id] ?? 1)

  return (
    <div className="overlay" data-testid="badge-overlay">
      <div className="overlay-card badge-card">
        <p className="eyebrow">Mission Complete</p>
        <h2>You are now officially a…</h2>
        <p className="badge-title">{pack.module.badge.toUpperCase()}</p>
        <p>
          Score {Math.round(score * 100)}%. Your completion event has been posted for Northstar LMS
          when running in embed mode.
        </p>

        {pack.module.assets.completionVideo && (
          <video
            className="badge-video"
            controls
            playsInline
            poster={pack.module.assets.badgePoster}
            src={pack.module.assets.completionVideo}
          />
        )}

        <div className="overlay-actions">
          <button type="button" data-testid="return-hub" onClick={enterHub}>
            Return to Campus Hub
          </button>
        </div>
      </div>
    </div>
  )
}
