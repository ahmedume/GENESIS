# ===== FILE: RISKS.md =====
# Risk Register: GENESIS.EXE

Ranked by severity × likelihood. Review at every phase gate. A risk that fires becomes a task — never a surprise.

| # | Risk | L | I | Mitigation | Trigger / Early Signal |
|---|------|---|---|------------|------------------------|
| 1 | **Scope creep** — "just one more epoch effect" until deadline dies | High | High | SPEC.md §9 out-of-scope list is law; V2 list absorbs ideas; phase gates refuse new features after Phase 5 | Any feature proposal not in SPEC |
| 2 | **Perf collapse on judge hardware** (school laptops, old phones) | Med | High | PERFORMANCE-BUDGET.md binding; tier system + FPS watchdog; Phase-6 CPU/GPU throttle verification; real-phone checks from Phase 1 onward | r3f-perf draw calls > budget in any epoch review |
| 3 | **Shader time sink** (grid warp / gravity well debugging) | Med | High | Shaders stay tiny (<40 lines each); fallback plain materials behind a flag so scene never blocks on shader polish | >90 min stuck on one shader → simplify or flag-off |
| 4 | **iOS Safari quirks** (Lenis touch, WebGL2 postprocessing, 100vh address-bar jump) | Med | High | Real-device test in Phase 1 (not Phase 6!); use `dvh` units; progressive postprocessing tiers already planned | Any jank/scroll desync on iPhone spot-check |
| 5 | **Deploy decision pending too long** | Med | Med | Dockerfile mandatory regardless; DEPLOYMENT.md runbooks pre-written; decision forced by start of Phase 6 | Phase 5 exit without host choice |
| 6 | **Single-developer crunch** (illness, school, life) | Med | High | Phases sized ≤1 day each; Aug 30 submit target leaves Aug 31 buffer; every phase gate = submittable-ish build | Milestone slip > half day → cut scope per §1, not sleep |
| 7 | **Asset license contamination** (audio/font/model) | Low | High | Whitelist-only sourcing (ASSETS.md): CC0/OFL/self-made; license note recorded next to every asset file | Any asset without a recorded license line |
| 8 | **Bloom overuse tanks FPS or looks mushy** | Med | Med | Bloom strength table per epoch; half-res bloom on LOW; grading reviews against DESIGN-SYSTEM.md values, not vibes | Mushy highlights or <45 FPS in Galaxy Era |
| 9 | **Generic AI look ("slop")** — the site reads as template output | Low | High | DESIGN-SYSTEM.md anti-slop rules are hard constraints; committed identity (CRT motifs, vinyl galaxies, asymmetric HUD); every visual choice traces to a spec line | Any element that could appear in a thousand other sites |
| 10 | **Audio autoplay blocked / annoying judges** | High | Low | Opt-in only by design (FR-08); default muted; volume ≤ −12 dB; nothing breaks if audio never plays | n/a — design already neutralizes |
| 11 | **Browser inconsistency** (Firefox postfx banding, Chrome DPR scaling) | Med | Med | Test matrix in QA-SECURITY.md §4 run at Phases 3, 6; avoid exotic extensions/shader features; banding = add dithering noise pass | Visual diff between browsers in phase screenshots |
| 12 | **Log-time mapping feels wrong in playtest** (clock lies perceptually vs visuals) | Low | Med | Anchor table lives in one file (`lib/timeScale.ts`); playtest with 3 people; labels not numbers carry the science load | Playtester confusion about "when" they are |

## Standing Rule
If two risks collide (e.g., #1 wants more scope while #6 says time's short), scope loses. Always.
