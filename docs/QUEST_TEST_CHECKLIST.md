# Meta Quest Browser Checklist

Device: Quest 2 / 3 / Pro · Browser: Meta Quest Browser · Build: HTTPS deploy or `vite --host`

## Setup
- [ ] Headset on same network as dev machine (or open production URL)
- [ ] Open `https://<host>/` in Quest Browser
- [ ] Accept WebXR / immersive session prompts

## Smoke
- [ ] Campus hub loads with Module 1 portal unlocked
- [ ] Enter VR succeeds; controllers visible
- [ ] Teleport / move between stations without continuous artificial locomotion nausea
- [ ] Ray pointer clicks station controls
- [ ] Info panels readable at ~1–2 m

## Module 1 flow
- [ ] Meet Hydrogen: molecule + facts complete station
- [ ] Bonding Lab: assemble H₂O
- [ ] Electrolyzer: connect power → start → observe bubbles
- [ ] Energy Carrier: route to truck / ship / factory
- [ ] Knowledge Check usable (DOM overlay / 2D panel)
- [ ] Badge ceremony + video plays
- [ ] Hub return works

## Embed / LMS
- [ ] `/embed?module=m01&embed=1` auto-starts Module 1
- [ ] Completion postMessage fires (verify with temporary parent page or console bridge)

## Resilience
- [ ] Resume after headset sleep
- [ ] Reduce Motion toggle stops clouds / heavy animation
- [ ] Desktop fallback still works in Quest Browser 2D mode
