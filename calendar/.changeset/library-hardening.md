---
"@nicola9779/nicalendar-custom": minor
---

Harden the calendar library for safer public npm distribution.

- add runtime safety for invalid/undefined `events`
- sanitize user-provided text before rendering
- improve build output (`.mjs` + `.cjs`) and style export from `dist/styles.css`
- add `prepublishOnly` checks
- add test setup with Vitest + React Testing Library
- add Changesets-based release workflow
