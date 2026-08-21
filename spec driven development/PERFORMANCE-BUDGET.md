# ===== FILE: PERFORMANCE-BUDGET.md =====
# Performance Budget: GENESIS.EXE (BINDING)

The look lives on bloom and motion. Both die instantly if FPS tanks. These numbers are hard
limits — a feature that exceeds its budget gets optimized or tier-gated before moving on.

---

## 1. Load Budgets

| Metric | Budget | Notes |
|--------|--------|-------|
| Initial JS (gzipped) | ≤ 550 KB | three+fiber+drei+postprocessing dominate; enforce `manualChunks` split |
| Initial CSS | ≤ 60 KB | Tailwind purge keeps this tiny |
| Total transfer (full journey) | ≤ 5 MB | Audio (~1–2 MB) lazy-loaded on first toggle-on ONLY |
| Fonts | ≤ 300 KB | 3 families, latin subset, `font-display: swap`, preconnect |
| Images | ~0 | Procedural everything; favicon + OG image only |
| FCP (desktop) | < 1.5 s | Boot screen is DOM-only — paints before WebGL ready |
| Boot→interactive worst case | < 12 s then ENTER ANYWAY | FR-06 escape hatch |

## 2. Frame Budgets by Tier

| Setting | HIGH (desktop dGPU/discrete heuristics) | MEDIUM (laptops) | LOW (mobile/weak) |
|---------|------|------|-----|
| Target FPS | 60 | 60 | 30 |
| DPR clamp | 1.75 | 1.5 | 1.0 |
| Starfield particles | 24,000 | 12,000 | 6,000 |
| Quark-soup particles | 8,000 | 4,000 | 2,000 |
| Galaxy instances | 7 discs × full arm detail | 5 discs | 3 discs, simplified arms |
| Postprocessing | Bloom+CAb+Vignette+Noise | Bloom+Vig (+CAb envelopes) | Bloom only; CSS grain/vignette overlays instead |
| Shadows | off (design uses none) | off | off |
| Gravity well | on | on | off |

## 3. Scene Budgets (any frame, any epoch)

| Metric | Limit | Enforcement |
|--------|-------|-------------|
| Draw calls visible | ≤ 120 typical · 200 absolute peak | r3f-perf dev overlay review each epoch |
| Triangles visible | ≤ 350k | Instanced geometry audit |
| Live epoch scenes mounted | ≤ 2 neighbors | Mount-window ±0.12 progress |
| Simultaneous DOM animations | ≤ 6 | gsap timeline review |
| Per-frame allocations | 0 in render loop (reuse vectors/quats) | code review rule |

## 4. Watchdogs & Fallbacks

- Rolling-FPS monitor: avg < 24 over 4 s → downgrade one tier (one-way, max twice) per FR-10.
- Context-loss recovery card per FR-12.
- Bloom is the most expensive pass — on LOW it renders at half resolution (EffectComposer setting).

## 5. Verification Protocol (run each phase gate)

1. `pnpm build && pnpm preview` — record bundle sizes in phase notes.
2. Chrome DevTools Performance capture, 20 s scroll journey, both directions.
3. CPU 6× throttle + GPU tier emulate low — confirm LOW-tier budgets hold ≥30 FPS.
4. Lighthouse (desktop) — Performance ≥ 70, save report to `imgs/perf/`.
5. Real phone spot-check (iOS Safari + Android Chrome) before Phase 6 exit.
