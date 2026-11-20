# Northstar LMS Integration

## Embed URL
Host this app on HTTPS (required for WebXR), then launch from Northstar:

```
https://<ghe-host>/embed?module=m01&courseId=<courseId>&learnerId=<learnerId>
```

Equivalent query form:

```
https://<ghe-host>/?module=m01&courseId=<courseId>&learnerId=<learnerId>&embed=1
```

### Query params
| Param | Required | Purpose |
|-------|----------|---------|
| `module` | recommended | Auto-start module (`m01`) |
| `courseId` | optional | Echoed in completion payload |
| `learnerId` | optional | Echoed in completion payload |
| `embed` | optional | Marks LMS embed mode in HUD |

## Completion event
When the learner claims the Module 1 badge, the experience posts:

```json
{
  "type": "ghe:moduleComplete",
  "moduleId": "m01",
  "badge": "Hydrogen Explorer",
  "score": 1,
  "courseId": "…",
  "learnerId": "…"
}
```

### Parent listener (Northstar)
```js
window.addEventListener('message', (event) => {
  const data = event.data
  if (!data || data.type !== 'ghe:moduleComplete') return
  // mark lesson complete for data.moduleId / data.learnerId
})
```

Also dispatched in-page as `CustomEvent('ghe:moduleComplete')` for local tooling.

## Suggested Northstar lesson
- Title: `M1 · Hydrogen Explorer (Metaverse)`
- Type: external / iframe embed pointing at the URL above
- Completion: listen for `ghe:moduleComplete`

## Later enhancement
Add `lessonType: "metaverse"` to Northstar course seeds so staff can pick modules without raw URLs.
