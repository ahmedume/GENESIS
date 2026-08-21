# ===== FILE: PROMPTS.md =====
# Execution Prompts: GENESIS.EXE

Ready-to-use prompts per task. Paste into your AI coding tool **after** it has read the spec package.
Use one at a time, in order. Each maps to a BUILD_PLAN.md phase.

---

## SETUP PROMPT (Run This First)

```
Read all .md files in "spec driven development/": ENHANCED-PROMPT.md, SPEC.md, PRD.md, SRS.md,
SDS.md, TECH_STACK.md, BUILD_PLAN.md, STORYBOARD.md, DESIGN-SYSTEM.md, INTERACTIONS.md, ASSETS.md,
PERFORMANCE-BUDGET.md, ACCESSIBILITY.md, DEPLOYMENT.md, SUBMISSION-CHECKLIST.md, RISKS.md,
QA-SECURITY.md, SKILL.md.

Confirm you have read them by summarizing:
1. What GENESIS.EXE is (2 sentences)
2. The 9 epochs in scroll order with their time labels
3. The tech stack and folder layout root
4. The 5 most important SKILL.md rules
Do not write any code until I say "proceed".
```

---

## PHASE 1 — Scaffold & Spine

```
Execute BUILD_PLAN.md Phase 1 exactly.
- Scaffold Vite+React+TS app in frontend/ via pnpm; strict TS; Tailwind v4 entry with DESIGN-SYSTEM.md tokens as CSS variables.
- Create the full SDS.md §2 folder skeleton — empty files with one-line purpose comments.
- Wire Lenis → useScrollProgress → zustand; 1600vh spacer; hidden native scrollbar.
- CameraRig sampling a straight placeholder path with damped progress (maath).
- Write .env.example (empty placeholders only) at repo root. Dockerfile is DEFERRED to Phase 7 — do not create it now.
Deliverable check: pnpm dev = damped flythrough on scroll. Report bundle sizes vs PERFORMANCE-BUDGET.md §1. Stop after reporting — do not start Phase 2.
```

## PHASE 2 — Hero & Ignition

```
Execute BUILD_PLAN.md Phase 2 exactly.
Implement BootScreen (FR-06: CRT lines, useProgress %, 900ms minimum, ENTER ANYWAY after 8s stall,
power-off exit), Singularity scene, IGNITION sequence per FR-03 (plays once), Effects.tsx base stack
(Bloom+Vignette), hero title lockup + scroll cue per DESIGN-SYSTEM.md typography and STORYBOARD copy verbatim.
Respect anti-slop rules §6. Verify against SRS rows FR-03/FR-06 and capture screenshots to imgs/phases/02-hero/.
Stop after reporting.
```

## PHASE 3 — Epochs 1–5

```
Execute BUILD_PLAN.md Phase 3 exactly.
Build EpochDirector grading blend (epochs.ts tables), SpacetimeGrid shader (streak mode; warp hooks),
QuarkSoup instanced swarm, FirstLight CMB shell pass-through, CosmicDawn sequential star ignitions [SIG].
Camera control points for these epochs. Every epoch file ≤120 lines composing shared primitives.
Verify: SRS FR-01/02/04 rows for these ranges + fast-scroll palette rule + perf budgets §3.
Screenshots → imgs/phases/03/. Stop after reporting.
```

## PHASE 4 — Epochs 6–9 + Finale

```
Execute BUILD_PLAN.md Phase 4 exactly.
GalaxyEra vinyl-disc spirals (instanced), StellarForge supernova through-camera beat [SIG] + gold nebula
seeding, EventHorizon silhouette + grid warp + arc camera, SolSystem disc collapse → planet snap-ins →
Earth → crane reveal, FinalePlaque DOM overlay with REWIND TIME (FR-11, interruptible).
Copy from STORYBOARD.md verbatim. Full journey must play 0→100→0 smoothly.
Verify SRS FR-11 + budgets; screenshots → imgs/phases/04/. Stop after reporting.
```

## PHASE 5 — HUD & Interactivity

```
Execute BUILD_PLAN.md Phase 5 exactly.
CosmicClock (lib/timeScale.ts logTime anchors + formatter + tick ruler, FR-02), EpochLabel flicker swaps,
Interactive wrapper + raycast registry + all 7 fact cards (FR-05, data verbatim from STORYBOARD),
gravity-well shader effect (FR-07, GPU-only), AudioToggle WebAudio graph with epoch-mapped lowpass (FR-08),
idle-hint pulse (I-11), cursor ring states.
Demonstrate every row of INTERACTIONS.md on desktop AND touch emulation.
Screenshots → imgs/phases/05/. Stop after reporting.
```

## PHASE 6 — Hardening & Deploy

```
Execute BUILD_PLAN.md Phase 6 exactly.
Quality tiers + FPS watchdog (FR-10) applying PERFORMANCE-BUDGET.md tier table; mount-window scene
unloading; manualChunks audit; reduced-motion poster mode + JumpNav (FR-09); WebGL-absent poster +
context-loss recovery (FR-12); Slow-3G boot-stall verification.
Run QA-SECURITY.md §1 gates + §3 security checklist + ACCESSIBILITY.md §7 walkthrough.
Then execute DEPLOYMENT.md runbook for the chosen host (decision: <state choice>) with security headers;
verify §6 checklist; save Lighthouse report to imgs/perf/.
Report results gate-by-gate. Stop after reporting.
```

## PHASE 7 — Submission Package

```
Execute BUILD_PLAN.md Phase 7 exactly.
Dockerize last: Dockerfile (multi-stage per DEPLOYMENT.md §3) + .dockerignore; verify docker build serves the bundle.
Capture SUBMISSION-CHECKLIST §B shot list into imgs/submission/ (+ mobile shots), record demo video per §C
script, draft Devpost description per §D outline, assemble tech list from TECH_STACK.md, clean repo
(README run instructions, dead-code sweep, final secret scan per QA-SECURITY.md §1).
Present everything for my review before I submit on Devpost.
```

---

## Utility Prompts

### DEBUG / FIX
```
The following is not working as specified:
[describe]

Expected per SRS FR-XX: [what should happen]
Actual: [what happens]
Repro: [steps]

Find the root cause first, explain it in ≤3 sentences, then fix minimally without changing any other
behavior. If you're stuck or must choose between approaches, stop and present options with your recommendation.
```

### SPEC COMPLIANCE AUDIT (run before Phase 7)
```
Audit the implementation against SPEC.md + SRS.md + INTERACTIONS.md.
List: (1) missing features, (2) behaviors that deviate from spec, (3) anything implemented that is out of scope.
Do not fix anything yet — just report with file:line references.
```

### COMPACTION PASS (run at each phase exit)
```
Review the code written this phase against SKILL.md's Maximum Code Compaction rule.
Identify: duplicate logic to merge, speculative flexibility to delete, components that could be functions,
files over their line targets. Apply safe shrinkage; re-run tsc + build; report lines saved per file.
```
