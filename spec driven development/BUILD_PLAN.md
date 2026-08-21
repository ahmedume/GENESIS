# ===== FILE: BUILD_PLAN.md =====
# Build Plan: GENESIS.EXE

## Strategy

Divide and conquer — one phase at a time, never all at once. Each phase ends with something
runnable and verifiable, so errors are caught where they're born (debug-friendly). Do not start
a phase before the previous deliverable is verified in the browser. After each phase: report to
the user and capture screenshots into `imgs/` per QA-SECURITY.md.

---

## Phase 1 — Scaffold & Spine
**Goal:** Repo boots; scroll moves a camera through empty space with damping.
**Depends on:** Nothing.

**Tasks:**
1. `pnpm create vite frontend --template react-ts`; strict TS; Tailwind v4 entry; tokens CSS from DESIGN-SYSTEM.md.
2. Install stack per TECH_STACK.md; pin versions; commit lockfile.
3. Folder skeleton per SDS.md §2 (empty files with header comments) + `.gitignore` (R4) + root `dev-frontend.bat` launcher (R2).
4. Lenis + useScrollProgress + useDampedProgress wired; spacer 1600vh.
5. Canvas + CameraRig sampling a placeholder straight path; fog VOID color.
6. `.env.example` (empty placeholders only). *(Dockerfile optional, deferred to Phase 7 — R6.)*

**Deliverable:** double-clicking `dev-frontend.bat` → smooth damped flythrough on scroll at localhost:5173.
**Bug-check gate (R7):** tsc clean + browser-verified before reporting.
**Out of scope:** Any epoch content, HUD, postprocessing.

---

## Phase 2 — Hero & Ignition
**Goal:** The opening lands: boot screen → singularity hero → IGNITION flash on first scroll.
**Depends on:** Phase 1.

**Tasks:**
1. BootScreen (CRT lines, useProgress %, ENTER ANYWAY stall path, power-off exit).
2. Singularity scene: pulsing point + breathing bloom halo.
3. IGNITION sequence per FR-03 (exposure envelope, shockwave ring, plays once).
4. Effects.tsx base stack (Bloom + Vignette) at tier defaults.
5. Title lockup + scroll cue DOM overlay with chromatic-aberration styling.

**Deliverable:** Full opening beat playable end-to-end; screenshots captured.
**Out of scope:** Epochs beyond singularity, clock, cards, audio.

---

## Phase 3 — Epochs 1–5 (Inflation → Cosmic Dawn)
**Goal:** First half of the journey built and graded.
**Depends on:** Phase 2.

**Tasks:**
1. EpochDirector grading-blend system (fog/bloom tables from epochs.ts).
2. SpacetimeGrid shader (streak mode for Inflation; warp hooks for later).
3. QuarkSoup instanced particle swarm + collision flashes.
4. FirstLight CMB shell interior pass-through.
5. CosmicDawn sequential star ignition beats [SIG].
6. Camera path control points for these epochs (lateral weave prep).

**Deliverable:** Scroll 0–48% = five distinct graded scenes; fast-scroll palette rule passes.
**Out of scope:** Fact cards/interactivity, HUD instruments.

---

## Phase 4 — Epochs 6–9 (Galaxy Era → You Are Here)
**Goal:** Second half complete; journey end-to-end.
**Depends on:** Phase 3.

**Tasks:**
1. GalaxyEra vinyl-disc spirals (instanced arms + center glow), weave camera.
2. StellarForge supernova ring through-camera beat [SIG] + gold nebula seeding.
3. EventHorizon black hole silhouette + grid warp + arc camera.
4. SolSystem disc collapse → planet snap-in beats → Earth → crane reveal.
5. FinalePlaque DOM overlay + REWIND TIME behavior (FR-11).

**Deliverable:** Full 0→100→0 journey smooth; finale plaque correct copy.
**Out of scope:** Interactivity polish, audio, accessibility modes.

---

## Phase 5 — HUD & Interactivity
**Goal:** Instruments and touch-points that make it feel alive.
**Depends on:** Phase 4.

**Tasks:**
1. CosmicClock (logTime mapping, formatter, tick ruler) per FR-02.
2. EpochLabel cross-fades + intro-line reveals (gsap, text only).
3. Interactive wrapper + raycast registry; fact cards for all 7 objects (FR-05).
4. Gravity-well pointer effect in Particles shader (FR-07).
5. AudioToggle WebAudio graph + epoch-mapped lowpass (FR-08).
6. Idle-hint pulse (I-11); cursor ring states.

**Deliverable:** Every INTERACTIONS.md row demonstrably working.
**Out of scope:** Performance tuning, reduced-motion, deploy.

---

## Phase 6 — Hardening: Perf · A11y · QA · Deploy
**Goal:** Production grade within budgets; reachable by everyone; deployed publicly.
**Depends on:** Phase 5.

**Tasks:**
1. Quality tiers + FPS watchdog downgrade (FR-10); apply PERFORMANCE-BUDGET.md numbers.
2. Scene mount-window optimization (neighbors only); bundle manualChunks audit.
3. Reduced-motion poster mode + JumpNav (FR-09); WebGL-absent poster (FR-12).
4. Context-loss recovery card (FR-12); boot-stall verification on Slow 3G throttle.
5. QA-SECURITY.md checklist execution (audit, secret scan, CSP sanity, contrast).
6. Deploy decision executed (DEPLOYMENT.md); OG/meta tags verified; Docker image rebuilt.

**Deliverable:** Public URL live; Lighthouse ≥70 perf desktop; all SRS validation rows green.
**Out of scope:** New features — fixes only.

---

## Phase 7 — Submission Package
**Goal:** Devpost submission ready with buffer day to spare.
**Depends on:** Phase 6.

**Tasks:**
1. Dockerize: Dockerfile (multi-stage per DEPLOYMENT.md §3) + `.dockerignore` + `docker build` verification.
2. Capture final screenshot set into `imgs/` (SUBMISSION-CHECKLIST shot list).
3. Record demo video (script in checklist, 60–90s).
4. Write project description + tech/tools list from this package.
5. Public repo cleanup: README run instructions, no dead code, no secrets (final scan).
6. Submit on Devpost Aug 30 evening; Aug 31 = buffer for fixes.

**Deliverable:** Docker image builds + submitted entry URL + green SUBMISSION-CHECKLIST.md.
