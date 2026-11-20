# GHE Metaverse

WebXR campus experience for the ForgeX **Green Hydrogen Energy** course. Runs as a webpage, in Meta Quest Browser, and as an embeddable Northstar LMS lesson.

**Phase 1:** scaffolding + playable **Module 1 — Hydrogen Explorer**.

## Quick start

```bash
npm install
npm run dev
```

Open the printed local URL (use HTTPS or `localhost` for WebXR).

Useful deep links:
- Module 1: `http://localhost:5173/?module=m01`
- LMS embed: `http://localhost:5173/embed?module=m01&courseId=ghe&learnerId=demo`

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright smoke |
| `npm run lint` | Oxlint |
| `npm run typecheck` | TypeScript project build |

## Stack
Vite · React · TypeScript · React Three Fiber · Drei · `@react-three/xr` · Zustand

## Content
Structured packs live in `content/modules/`. Extracted Module 1 media is in `public/assets/m01/`.

Source PDFs/PPTX remain locally under `Learnining Material/` (gitignored).

## Docs
- [Experience design](docs/EXPERIENCE_DESIGN.md)
- [LMS integration](docs/LMS_INTEGRATION.md)
- [Quest test checklist](docs/QUEST_TEST_CHECKLIST.md)
- [Module playbook](docs/MODULE_PLAYBOOK.md)

## Deploy
Deploy the Vite `dist/` output to Vercel (or any static HTTPS host). `vercel.json` includes SPA rewrites for `/embed`.

## Repo
https://github.com/NatashaAnderson/GHE
