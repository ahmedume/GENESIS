# GENESIS.EXE Production Frontend Optimization Brief

## Objective
Audit and harden the existing Vite + React 19 + React Three Fiber experience for a production demo. Fix functional bugs, improve runtime smoothness, preserve the cinematic-realism direction, and make targeted visual refinements that do not violate the existing specifications.

## Audience and product
Visitors exploring an interactive scroll-driven cosmic timeline. The experience must remain usable on desktop and mobile, degrade gracefully on weak GPUs, support reduced motion, and never strand the user on a blank canvas or blocked boot state.

## Existing direction
Follow `spec driven development/DESIGN-SYSTEM.md`, `PERFORMANCE-BUDGET.md`, `QA-SECURITY.md`, `ACCESSIBILITY.md`, `STORYBOARD.md`, and `INTERACTIONS.md`. Keep true-black space, physically motivated colors, precise HUD UI, cinematic camera motion, and restrained overlays. Do not introduce neon geometry, extra glass panels, external image services, emoji icons, or unrelated copy.

## Required work
- Inspect the entire `frontend/src` tree and existing configuration before editing.
- Fix TypeScript, React lifecycle, event-listener, scroll synchronization, context-loss, quality-tier, and WebGL/runtime bugs found during the audit.
- Ensure per-frame code does not allocate unnecessarily and that epoch visibility/fading behaves correctly across the full journey.
- Validate responsive layout, keyboard/focus behavior, reduced-motion behavior, and touch/scroll interactions.
- Improve visual quality only where it supports the existing cinematic realism: texture filtering/color space, material setup, subtle grading, HUD hierarchy, loading/error states, or motion polish.
- Keep performance within the stated budgets; prefer tier-aware reductions and lazy work over broad visual additions.

## Verification
Run `pnpm exec tsc --noEmit`, `pnpm build`, and `pnpm lint` from `frontend`. Inspect the production bundle and report any remaining non-blocking risks. Do not overwrite unrelated user changes.
