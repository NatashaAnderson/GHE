# Module Playbook — Adding Modules 2–8

Reuse the Module 1 pattern. Do not fork a new engine.

## 1. Content pack
Copy `content/modules/_template/` to `content/modules/m0N/`:

```
m0N/
  module.json
  quiz.json
  assets.manifest.json
  stations/*.json
```

Update:
- `id`, `title`, `badge`, `outcomes`, `stationOrder`, `portalPosition`
- station JSON with `successCriteria` and coach copy from Learner Manual / ForgeX deck
- quiz JSON from Knowledge Check + Answer Manual

Unlock the module in `content/catalog.json` (`locked: false`) when ready.

## 2. Assets
Extract useful media from `Learnining Material/ForgeX 2/Green Hydrogen Module N.pptx` into `public/assets/m0N/`.
Reference paths from `module.json` / `assets.manifest.json`.

## 3. Scene code
Add `src/scenes/modules/M0N/` with one component per station mechanic, plus `ModuleNScene.tsx`.

Register in:
- `src/content/loader.ts` (import JSON + station map)
- `src/App.tsx` Experience switch for the module id

## 4. Mechanics guidance (from ForgeX badges)
| Module | Badge | Likely mechanic |
|--------|-------|-----------------|
| 2 | Storage Strategist | Choose / place storage options |
| 3 | Production Detective | Diagnose production pathway |
| 4 | Fuel Cell Engineer | Assemble / power fuel cell |
| 5 | Safety Champion | Hazard identification checklist |
| 6 | Hybrid Energy Architect | Combine energy sources |
| 7 | Nuclear Hydrogen Innovator | Scenario trade-offs |
| 8 | Future Hydrogen Engineer | Capstone route / fusion facts |

## 5. Verification
1. Unit tests for quiz scoring + loader pack
2. Playwright: deep-link `?module=m0N`, complete stub path, claim badge
3. Quest checklist for locomotion and panel readability
4. Confirm `ghe:moduleComplete` payload uses the new `moduleId` / badge

## 6. LMS
Point Northstar lesson URL at `?module=m0N` (or `/embed?module=m0N`).
