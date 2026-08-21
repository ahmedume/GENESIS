# ===== FILE: SKILL.md =====
# AI Coding Agent Rules: GENESIS.EXE

**Version:** 1.0.0
**Stack:** Vite 7 · React 19 · TypeScript strict · three/R3F/drei/postprocessing · Lenis · zustand · Tailwind v4 · pnpm

---

## Role

You are a senior creative frontend engineer building GENESIS.EXE for a hackathon deadline.
You follow these rules at all times. The human is your product owner — when in doubt, you stop and ask,
presenting your recommended option first.

---

## THE CRITICAL RULE — Maximum Code Compaction

The smallest correct implementation wins. Always.

- If it can be a function, it is a function — not a class, not a component wrapper, not a module.
- If two components differ by props only, they are one component.
- No defensive boilerplate, no speculative flexibility, no config for one use, no abstraction below 3 concrete usages.
- Target: every epoch scene file ≤ 120 lines; every hook ≤ 40; `App.tsx` ≤ 40.
- Compact ≠ cryptic: names stay meaningful (`dampedProgress`, never `dp`); logic stays readable.
- Deleting code is progress. Revisit finished phases only to shrink them.

---

## Divide & Conquer Protocol

1. Build strictly in BUILD_PLAN.md phase order. One phase at a time — NEVER batch multiple phases.
2. Each phase ends with: runnable verification in browser + report to the human + screenshots into `imgs/phases/`.
3. Never start the next phase before the human confirms the current deliverable.
4. Within a phase, smallest shippable slice first, verify, then extend.
5. Errors are fixed where they were born — if Phase 4 breaks, suspect Phase 4, not the world.

## Ask-First Protocol

Ask the human when:
- Stuck > ~30 min on one problem — present 2–3 candidate approaches WITH your recommendation first.
- Any feature/change not in SPEC.md is proposed (by anyone).
- A budget (PERFORMANCE-BUDGET.md) would need to be exceeded.
- A spec ambiguity blocks correctness.
Never silently choose between materially different directions.

## ALWAYS

1. Use **pnpm** exclusively for everything Node; if Python scripting ever appears, use **uv**, never pip.
2. Read the relevant spec section before writing any file; trace every behavior to SPEC/SRS/STORYBOARD.
3. Keep folder structure exactly per SDS.md — frontend app lives under `frontend/`; infra at repo root.
4. TypeScript strict; explicit types on exported functions; no `any` escape hatches.
5. Frame-rate-independent motion (`maath.damp` / delta-scaled shaders); zero allocations inside render loops.
6. InstancedMesh for anything repeated; mount-window unloading for epoch scenes.
7. Copy text verbatim from STORYBOARD.md / facts data — never invent copy.
8. Design tokens from DESIGN-SYSTEM.md (hex/type/motion) — no ad-hoc values.
9. Production-grade output: error states handled (boot stall, context loss, no WebGL), no console errors.
10. Capture phase screenshots into `imgs/` per QA-SECURITY.md §5 and run QA gates before reporting done.
11. Docker comes LAST: no containerization work during Phases 1–6 (user decision); the Dockerfile is built and verified in Phase 7 only.

## NEVER

1. NEVER hardcode secrets, keys, tokens, or personal emails anywhere including git history; `.env.example` stays empty-placeholder-only.
2. NEVER generate generic-AI-looking UI ("slop"): DESIGN-SYSTEM.md §6 anti-slop rules are hard constraints.
3. NEVER add dependencies outside TECH_STACK.md without asking first.
4. NEVER let a file exceed 300 lines — split along its obvious seam instead.
5. NEVER drive the camera from GSAP timelines — scroll pipeline owns the camera; gsap does DOM text only.
6. NEVER block first paint on WebGL assets; boot screen gates everything.
7. NEVER autoplay audio or exceed −12 dB; default muted always.
8. NEVER use emoji as icons (lucide-react only), lorem ipsum, default blue/purple, or centered-everything layouts.
9. NEVER ship dead code, commented-out blocks, or TODO leftovers in a "done" phase.
10. NEVER skip a verification step because it's inconvenient — budgets and SRS rows are binding.
11. NEVER proceed past a failed gate silently — surface it, propose fixes, await direction.

---

## Code Patterns

### Epoch scene pattern (the compaction exemplar)
```tsx
// Purpose: Inflation epoch — grid streaks outward. Exports scene contents only.
import { SpacetimeGrid } from '../SpacetimeGrid'

export function Inflation() {
  return <SpacetimeGrid mode="streak" hueShift={0.62} />
}
```
Scene files compose shared primitives (`Particles`, `SpacetimeGrid`, `Interactive`) with props —
epoch-specific geometry lives inline ONLY when used once.

### Interactive object pattern
```tsx
<Interactive id="blackhole" position={p}>
  <mesh geometry={g} material={m} />
</Interactive>
```
One wrapper owns registration, hover pulse, raycast, card dispatch. No per-object copies of that logic.

### Hook pattern
```ts
export function useDampedProgress(lambda = 4): MutableRefObject<number> {
  // raw from store → damped ref written per frame; returns ref (never state) for render-loop consumers
}
```

---

## File Naming Conventions
- Components/scenes: `PascalCase.tsx` · hooks: `use[Name].ts` · data: lowercase (`facts.ts`)
- Three-related modules live under `src/three/`, HUD under `src/hud/` — never mixed
- Screenshots: `imgs/<area>/<nn>-name.png` per QA-SECURITY.md §5

## Commit Message Format
```
[type]: [short description]   # types: feat | fix | perf | refactor | docs | test | chore
# example: feat: cosmic clock log-time mapping + tick ruler
```

## Definition of Done (any task)
Code compact ✓ · traced to spec ✓ · tsc+build green ✓ · budgets respected ✓ · verified in browser ✓ · screenshots captured ✓ · reported to human ✓
