# ===== FILE: SRS.md =====
# Software Requirements Specification: GENESIS.EXE

**Version:** 1.0.0
**Standard:** IEEE 830 (adapted for a client-only interactive experience)
**Status:** Draft

---

## 1. Introduction

### 1.1 Purpose
Specifies exact, testable behavior for GENESIS.EXE. Audience: the AI coding agent building the app, and the human verifying each requirement.

### 1.2 Scope
A single-page static web application rendering a scroll-driven 3D journey through cosmic history. No backend, no persistence beyond localStorage preferences.

### 1.3 Definitions & Acronyms
| Term | Definition |
|------|------------|
| Scroll progress | Normalized document scroll position, 0.0–1.0 |
| Epoch | One of nine named cosmological scenes mapped to a scroll range |
| Cosmic Clock | HUD instrument displaying log-scale time since Big Bang |
| Gravity well | Cursor-driven attraction effect applied to particle systems in-shader |
| Quality tier | Auto-detected rendering preset: `high` \| `medium` \| `low` |
| Boot | CRT-styled initial loading state before hero reveal |

---

## 2. Overall Description

### 2.1 Product Perspective
Standalone creative experience; no external system context.

### 2.2 User Characteristics
Non-technical majority; must require zero instructions. Power users may inspect repo.

### 2.3 Assumptions & Dependencies
- Modern browser with WebGL2 (fallback poster otherwise)
- Lenis + R3F + drei + postprocessing pinned versions per TECH_STACK.md
- Google Fonts reachable at runtime (system-font fallback stack defined)

---

## 3. Functional Requirements

### FR-01: Scroll-Driven Time Journey
- **Input:** Wheel/touch/keyboard scroll events via Lenis; derived progress `p ∈ [0,1]`.
- **Processing:** Damp displayed progress toward raw progress (`damp(current, target, 4, delta)`); evaluate camera position/orientation on Catmull-Rom path sampled by damped progress; set fog/exposure/bloom uniforms from epoch tables.
- **Output:** Continuous camera motion; zero visible snapping when reversing direction.
- **Validation Rules:**
  - Path sampling uses damped value only — raw scroll never moves camera directly.
  - Total page height = spacer div of 1600vh ± 10%.
- **Error Cases:**
  - If scroll events fire before boot completes: ignore input until `booted === true`.
  - If WebGL context lost: show recovery card (see FR-12).

### FR-02: Cosmic Clock HUD
- **Input:** Damped progress.
- **Processing:** Map via log-time function `logTime(p)` (SDS §6) returning seconds-since-Big-Bang; format with unit auto-switching (<60 s → seconds with exponent notation e.g. `10⁻³² s`; <3600 → minutes; <380000 yr equivalents → kyr/Myr/Gyr).
- **Output:** Readout text (VT323), epoch label cross-fade on boundary crossing, tick-ruler transform.
- **Validation Rules:** Labels at epoch boundaries match STORYBOARD.md exactly; readout updates every frame but DOM text writes throttled to animation frame (no layout thrash).
- **Error Cases:** If progress out of [0,1] (overscroll bounce): clamp.

### FR-03: Big Bang Ignition
- **Input:** First crossing of p > 0.02 after boot.
- **Processing:** Trigger one-shot sequence: white point flash (exposure spike ≤ 250ms), expanding shockwave ring mesh scale 0→50 over 1.2s, bloom intensity envelope.
- **Output:** Cinematic ignition; plays exactly once per page load.
- **Validation Rules:** Re-scrolling above p=0.02 then below does not replay full flash (idle pulse state instead); reduced-motion mode skips flash entirely.

### FR-04: Epoch Visual Grading
- **Input:** Damped progress.
- **Processing:** For each epoch table entry {fogColor, fogDensity, accentLight, bloomStrength}: blend values across transition band = 6% of total progress centered on boundary.
- **Output:** Smooth continuous grading; no hard cuts between epochs.
- **Validation Rules:** Fast scroll (full page in <5s) still renders every epoch's palette visibly ≥ 300ms.

### FR-05: Interactive Objects & Fact Cards
- **Input:** Pointer raycast against registered interactive meshes (≥ 7 objects).
- **Processing:** Hover sets emissiveIntensity lerp target + custom cursor ring scale; click sets `activeFactId` in store; card component reads `facts.ts`.
- **Output:** FactCard with name/era/timeLabel/fact; close via X, ESC, or outside click.
- **Validation Rules:** Exactly one card open at any time; hover states do not trigger on touch (tap opens directly); card content ≤ 140 chars fact body.
- **Error Cases:** If raycast hits nothing: clear hover state; if store id missing from data file: log dev-warning, render generic card shell (never blank screen).

### FR-06: CRT Boot Loader
- **Input:** drei useProgress + minimum-timer.
- **Processing:** Stream fake boot lines on interval while progress < 100; display real %; complete when (progress===100 AND elapsed≥900ms) OR user clicks ENTER ANYWAY (available after stall > 8s).
- **Output:** Exit animation (fade-through-black 400ms) then `booted=true`, hero reveal.
- **Validation Rules:** Loader never exceeds 12s total before ENTER ANYWAY appears; keyboard: Tab reaches skip button, Enter activates.

### FR-07: Cursor Gravity Well
- **Input:** Pointer NDC each pointermove.
- **Processing:** Write pointer uniform; vertex shader displaces particles within radius toward pointer with smooth falloff; strength eased in/out on enter/leave.
- **Output:** Localized swirl effect on star/particle systems.
- **Validation Rules:** Effect is GPU-only — no per-particle CPU iteration; disabled when reduced-motion or tier `low`.

### FR-08: Opt-In Ambience
- **Input:** Toggle click / Enter key on toggle button.
- **Processing:** WebAudio graph: source → lowpass (cutoff mapped to epoch: hot epochs brighter) → gain fade 1s.
- **Output:** Looping ambience ≤ −12 dB; toggle icon state syncs.
- **Validation Rules:** Default OFF every load unless persisted true; autoplay attempt never occurs before first user gesture; visibilitychange pauses audio.

### FR-09: Reduced-Motion Mode
- **Input:** `prefers-reduced-motion: reduce` media query.
- **Processing:** Render static poster composition (hero gradient + key art frame + typography); replace scroll journey with epoch jump buttons (9 buttons + finale).
- **Output:** Full informational access without animation.
- **Validation Rules:** No camera animation, no particle drift beyond static frame, no flash effects; jump buttons keyboard-operable.

### FR-10: Auto Quality Tiers
- **Input:** Device heuristics at mount (deviceMemory, hardwareConcurrency, pointer coarse, viewport width).
- **Processing:** Select tier; apply budgets from PERFORMANCE-BUDGET.md (DPR clamp, particle counts, postprocessing passes).
- **Output:** Consistent experience across devices.
- **Validation Rules:** Downgrade triggers automatically if rolling FPS < 24 for 4s (one-way, hysteresis prevents oscillation); never upgrades mid-session.

### FR-11: Finale Plaque & Rewind
- **Input:** Progress ≥ 0.97.
- **Processing:** Fade-in plaque overlay; REWIND TIME button calls Lenis scrollTo(0) with long-duration easing.
- **Output:** Return-to-top journey plays as reverse cinematic.
- **Validation Rules:** Button focusable, Enter-activatable; rewind interruptible by user scroll.

### FR-12: Failure States
- **Context loss:** Show "SIGNAL LOST" CRT error card; auto `webglcontextrestored` re-init once; manual RELOAD button always present.
- **No WebGL:** Render poster fallback (FR-09 visuals) with explanatory line.
- **Font load failure:** Fallback stack applies silently (DESIGN-SYSTEM.md stacks).

---

## 4. External Interface Requirements

### 4.1 User Interface
- All overlay text meets contrast ratios in ACCESSIBILITY.md.
- Touch targets ≥ 44×44 px.
- Custom cursor ring does not block native cursor interactions on UI elements.

### 4.2 API Interface
None (static site). Network requests limited to fonts and audio assets.

### 4.3 Storage Interface
- localStorage keys: `genesis.audio` ("0"/"1"). Reads wrapped in try/catch; corrupt value treated as default.

---

## 5. System Attributes

### 5.1 Security
- No secrets in repo — `.env.example` contains empty placeholders only (QA-SECURITY.md enforces scan).
- Strict CSP-compatible build output (no inline eval); dependencies audited (`pnpm audit`) clean of high/critical.
- No third-party trackers/analytics scripts.

### 5.2 Performance
Binding numbers in PERFORMANCE-BUDGET.md; SRS-level rule: no regression past budget without explicit user approval.

### 5.3 Reliability
All async asset loads have failure paths that never blank-screen; boot escape hatch guarantees reachability of content within 12s worst case.

### 5.4 Maintainability
Maximum code compaction policy: smallest correct implementation; files < 300 lines; folder structure per SDS.md; no dead code shipped.

---

## 6. Validation & Testing Criteria

| Requirement | Test Case | Expected Result |
|-------------|-----------|-----------------|
| FR-01 | Scroll top→bottom→top continuously | Camera follows smoothly both directions, no snap |
| FR-01 | Scroll during boot | Input ignored until reveal |
| FR-02 | Check clock at each epoch midpoint | Label+time matches STORYBOARD.md table |
| FR-03 | First scroll crosses 2% once | Flash plays once; re-crossing doesn't replay |
| FR-05 | Click each of 7 objects | Correct card content, single open card |
| FR-05 | Click empty space with card open | Card closes |
| FR-06 | Throttle network to Slow 3G | ENTER ANYWAY appears ≤ 12s; site usable |
| FR-08 | Fresh load, no interaction | Zero audio output |
| FR-09 | Emulate reduce-motion | Poster mode + working jump nav; no animations |
| FR-10 | Simulate low-end device | Tier drops; FPS recovers ≥ 30 |
| FR-11 | Press REWIND at finale | Smooth reverse journey to hero; interruptible |
| FR-12 | Kill GPU process (chrome://gpu crash sim) | Recovery card shows; reload restores |
