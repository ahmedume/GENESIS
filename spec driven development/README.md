# Spec Package — GENESIS.EXE (3D Websites Hackathon Entry)

> **Status:** SPECS ONLY — nothing has been built yet.
> **Concept locked (by user):** Birth of the Universe × **neon synthwave** art direction.
> **Codename:** GENESIS.EXE — a 13.8-billion-year scroll. Renameable until scaffold day.
> **Deadline:** Aug 31, 2026 @ 5:00pm CDT. Today: Aug 22, 2026. ~9 days remaining.
> **Locked decisions:** Concept = Birth of the Universe · Style = Neon synthwave · Package mgr = pnpm · Deploy target = TBD (Vercel recommended default)

---

## Reading Order

Read in this order. Each doc has a single job:

| # | File | Job | Status |
|---|------|-----|--------|
| 0 | ENHANCED-PROMPT.md | Master brief — paste into any AI agent first | Draft |
| 1 | SPEC.md | WHAT we are building (blueprint) | Draft |
| 2 | PRD.md | WHO it's for and what success looks like | Draft |
| 3 | SRS.md | Testable behavioral contract (IEEE 830 style) | Draft |
| 4 | SDS.md | HOW it's built — architecture + folder structure | Draft |
| 5 | TECH_STACK.md | Every technology, version, rationale | Draft |
| 6 | BUILD_PLAN.md | Phase-by-phase build order (7 phases) | Draft |
| 7 | STORYBOARD.md | Scene-by-scene scroll narrative with final copy | Draft |
| 8 | DESIGN-SYSTEM.md | Art direction: synthwave palette, type, motion | Draft |
| 9 | INTERACTIONS.md | Every interaction the user can perform | Draft |
| 10 | ASSETS.md | Asset sourcing plan + licenses | Draft |
| 11 | PERFORMANCE-BUDGET.md | Hard FPS/load/draw-call budgets | Draft |
| 12 | ACCESSIBILITY.md | Reduced-motion, mobile, all-audiences compliance | Draft |
| 13 | DEPLOYMENT.md | Deploy options (pending decision) + Dockerfile spec | Draft |
| 14 | SUBMISSION-CHECKLIST.md | Devpost requirements → status mapping | Draft |
| 15 | RISKS.md | Risk register + mitigations | Draft |
| 16 | QA-SECURITY.md | Test plan, security checklist, screenshot capture | Draft |
| 17 | SKILL.md | Rules the AI coding agent MUST follow when building | Draft |
| 18 | PROMPTS.md | Copy-paste execution prompts per task | Draft |

## How To Use This Package

1. Read `SPEC.md` and `STORYBOARD.md` yourself so you know the vision.
2. When ready to build, feed the package to your coding agent starting with `ENHANCED-PROMPT.md`.
3. Build strictly in `BUILD_PLAN.md` phase order using prompts from `PROMPTS.md` — one phase at a time, never all at once.
4. Capture screenshots into `imgs/` as features land (QA-SECURITY.md workflow).
5. Check off `SUBMISSION-CHECKLIST.md`. Submit Aug 30 evening — keep Aug 31 as buffer.

## Hackathon Judging → Design Decisions Traceability

| Judge Criterion | How GENESIS.EXE Wins It |
|---|---|
| Visual Design | Neon synthwave identity done properly: bloom-drenched gradients, CRT overlays, chromatic-aberration title, one coherent palette from Big Bang white-hot to deep-space violet |
| Creativity & Originality | Scroll = flow of time itself. A cosmic clock HUD replaces the scrollbar. The retro grid IS spacetime — it ripples with gravitational waves. Ends by telling the judge they are made of what they just scrolled past |
| UX & Interactivity | Zero-instruction mechanic (scroll), clickable cosmology fact cards, cursor-reactive particles, epoch jump nav, sound toggle, instant rewind button |
