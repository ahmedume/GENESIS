# ===== FILE: SPEC.md =====
# Project Specification: GENESIS.EXE

## 1. Overview

- **Project Name:** GENESIS.EXE — 13.8 Billion Years. One Scroll.
- **One-Line Description:** A neon-synthwave, scroll-driven 3D website where scrolling plays the entire history of the universe — from the Big Bang to "you are here."
- **Goal:** Win Best Overall at the Devpost 3D Websites Hackathon by maximizing visual impact, originality, and interactivity.
- **Target Users:** Hackathon judges (high-school students) and general web visitors on desktop and mobile.
- **Version:** 1.0.0 (MVP = submission version)

---

## 2. Problem Statement

Most hackathon 3D entries are either tech demos (spinning models) or decoration around normal content. GENESIS.EXE reinterprets scrolling as **time itself**: every pixel of scroll advances the cosmic clock across 13.8 billion years, rendered as one continuous cinematic journey. The concept needs zero explanation ("scroll = time"), carries genuine narrative awe grounded in real cosmology, and fuses it with a fully committed synthwave identity that no generic AI-built site will have. The emotional payoff — telling visitors their atoms were forged in the explosions they just scrolled past — is the memorable hook judges quote in deliberations.

---

## 3. Core Features (MVP — MUST HAVE)

### Feature 1: Scroll-Driven Time Journey
- **Description:** Camera travels a curved path through nine epoch scenes. Scroll progress (0–100%) maps logarithmically to cosmic time (T=0 → T+13.8 Gyr). Motion is damped for cinematic weight.
- **User Flow:** Boot screen → hero singularity → scroll ignites the Big Bang → continuous journey → finale plaque.
- **Inputs:** Wheel/touch scroll via Lenis; normalized progress 0..1.
- **Outputs:** Camera position/rotation along Catmull-Rom path; per-epoch fog color/density; bloom + aberration intensity shifts.
- **Business Rules:** Scroll-up rewinds smoothly (no snapping); frame-rate-independent damping (~2–4s settle); camera never clips scene geometry; first 2% of scroll triggers the ignition moment (blinding flash → shockwave).

### Feature 2: Nine Epoch Scenes With Distinct Art Direction
- **Description:** Each epoch has its own palette, lighting rig, particle population, and set piece (exact ranges/copy in STORYBOARD.md, palettes in DESIGN-SYSTEM.md).
- **User Flow:** Crossing epoch boundaries cross-fades background/fog over ~6% of scroll distance; new geometry fades/scales in.
- **Inputs:** Current scroll progress.
- **Outputs:** Epoch visuals — singularity point & flash, inflation grid-stretch, quark particle chaos, iridescent CMB field, sequential star ignitions, spinning vinyl-galaxy discs, supernova rings seeding nebulae, black-hole flyby with warped grid, solar-system assembly with Earth finale.
- **Business Rules:** Gradual cross-fades only; each epoch instantly recognizable even when fast-scrolling.

### Feature 3: Cosmic Clock HUD
- **Description:** Fixed left-edge vertical instrument: log-scale time ruler with tick marks, live time readout (`T+ 3 min`, `380 kyr`, `13.8 Gyr` — VT323 terminal font), current epoch name with fade transitions.
- **User Flow:** Appears after ignition (scroll > 1%); updates continuously.
- **Inputs:** Scroll progress → `logTime(progress)` mapping function (SDS §6).
- **Outputs:** Formatted time string, epoch label, animated tick ruler.
- **Business Rules:** Labels switch units automatically (s/min/kyr/Myr/Gyr); numbers animate without jitter; hidden until user scrolls.

### Feature 4: Interactive Celestial Objects & Fact Cards
- **Description:** ≥ 7 clickable objects (singularity remnant, CMB shell, blue-giant star, spiral galaxy, supernova remnant, black hole, Earth). Click opens a glass fact card with name, era, one striking verified fact.
- **User Flow:** Hover → emissive pulse + cursor ring expands → click → card slides in from right → close via X or outside click.
- **Inputs:** Pointer raycasts on registered interactive meshes.
- **Outputs:** FactCard UI populated from static data file (`frontend/src/data/facts.ts`).
- **Business Rules:** One card open at a time; experience continues behind card; tap = click on mobile; ESC closes.

### Feature 5: Cursor-Reactive Universe (Gravity Well)
- **Description:** The cursor exerts gentle attraction on nearby star/particle systems (desktop), making the universe feel alive and responsive everywhere. The spacetime grid ripples under the cursor.
- **User Flow:** Move mouse → particles within radius drift toward pointer with damping; release/idle → relax back.
- **Inputs:** Pointer NDC coordinates.
- **Outputs:** Per-particle offset applied in vertex shader (uniform: pointer position + strength).
- **Business Rules:** GPU-side effect only (no per-frame CPU loops over particles); disabled in reduced-motion mode; touch devices use last-tap position with lower strength.

### Feature 6: CRT Boot-Screen Loader
- **Description:** Full-screen retro terminal: `GENESIS.EXE` ASCII-ish wordmark, fake boot lines streaming ("initializing fundamental forces… ok", "calibrating spacetime… ok"), real progress %, then "SCROLL TO BEGIN TIME" hero reveal over the pulsing singularity.
- **User Flow:** First visit → boot lines + progress → auto-reveal hero.
- **Inputs:** drei `useProgress`.
- **Outputs:** Terminal line list, percentage, exit animation (CRT power-off collapse).
- **Business Rules:** Minimum display 900ms; stall > 8s shows "ENTER ANYWAY"; skip button always reachable by keyboard.

### Feature 7: Synthwave Ambience (Opt-In)
- **Description:** One looping CC0 synthwave ambient pad, subtle low-pass filter mapped to epoch (warmer in early hot epochs, darker later). Speaker toggle bottom-right.
- **User Flow:** Click toggle → fade-in 1s; click again → fade-out.
- **Inputs:** Toggle state in zustand store.
- **Outputs:** WebAudio playback through BiquadFilterNode.
- **Business Rules:** Default OFF (autoplay policies + politeness); volume ≤ −12 dB; preference persists in localStorage (fail-safe if blocked).

---

## 4. End-to-End User Flow

1. Visitor opens URL → CRT boot screen streams lines + real percentage.
2. Reveal → black void, single white-hot point pulsing, title lockup with chromatic aberration, "scroll to begin time" cue.
3. First scroll → **ignition**: blinding flash, shockwave ring, inflation begins (signature moment #1).
4. Inflation → neon spacetime grid streaks outward; hue magenta→violet.
5. Quark Soup → dense glowing particle swarm sparks collisions around camera.
6. First Light → iridescent CMB static field envelops camera; "the universe becomes transparent" beat.
7. Cosmic Dawn → near-black; stars ignite sequentially with laser bursts (signature moment #2).
8. Galaxy Era → vinyl-record spiral galaxies spin past; weave between them.
9. Stellar Forge → supernova ring expands, gold glitter seeds nebula clouds.
10. Black Hole Flyby → accretion-ring silhouette; grid warps around it.
11. Solar System → protoplanetary disc collapses into orbiting planets; Earth glows cyan-blue.
12. Finale plaque: `T+13,800,000,000 YEARS — YOU ARE HERE` + stardust line + credits + REWIND TIME button (smooth-scroll to top).
13. Judge rewinds (fast reverse works) or screenshots key moments.

---

## 5. System Behavior (Logic Rules)

- Rule 1: Scroll progress is the single source of truth for all scene animation; everything else derives from it plus time-based idle motion — no independent timelines that can desync.
- Rule 2: All continuous motions use frame-rate-independent damping (`maath` damp).
- Rule 3: Quality tier auto-selects on mount — `high` / `medium` / `low` — controlling DPR clamp, particle counts, postprocessing passes (PERFORMANCE-BUDGET.md).
- Rule 4: WebGL context loss → full-screen CRT error card "SIGNAL LOST — reload simulation" with retry; one automatic restore attempt.
- Rule 5: Page height fixed ~1600vh via spacer div; all DOM overlays `position: fixed`; no native scrollbar styling surprises (hidden, HUD replaces it).

**Edge Cases:**
- WebGL unsupported → static poster fallback (gradient + epoch facts list + typography).
- `prefers-reduced-motion` → poster mode + epoch jump buttons (ACCESSIBILITY.md).
- Scrolling during boot → input ignored until reveal completes.
- Background tab → R3F auto-pauses; audio pauses too via visibilitychange.
- localStorage unavailable → preferences simply not persisted; zero errors thrown.

---

## 6. Data Model (Entities)

No backend/database — static site. Client-side shapes:

### Entity: CelestialFact
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | string (slug) | Yes | e.g. `"black-hole"` |
| name | string | Yes | Display name |
| era | string | Yes | e.g. `"Galaxy Era"` |
| timeLabel | string | Yes | e.g. `"~13 Gyr"` |
| fact | string | Yes | ≤ 140 chars, punchy, verified |
| epochId | enum EpochId | Yes | Links to epoch |
| interactive | boolean | Yes | Raycast target? |

### Entity: Epoch
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | enum (`singularity`\|`inflation`\|`quarksoup`\|`firstlight`\|`cosmicdawn`\|`galaxyera`\|`stellarforge`\|`blackhole`\|`solsystem`) | Yes | |
| index | number | Yes | Order 0–8 |
| label | string | Yes | e.g. `"THE GALAXY ERA"` |
| timeLabel | string | Yes | Clock readout at epoch start |
| scrollStart | number (0–1) | Yes | Where epoch begins |
| paletteKey | string | Yes | DESIGN-SYSTEM.md palette ref |

### Entity: AppState (zustand)
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| qualityTier | 'low'\|'medium'\|'high' | Yes | Set on mount |
| audioEnabled | boolean | Yes | Persisted |
| activeFactId | string \| null | Yes | Open fact card |
| scrollProgress | number | Yes | Lenis callback |
| booted | boolean | Yes | Gates hero reveal |

---

## 7. UI Screens

Single-page experience; "screens" are scroll states:

### Screen 1: CRT Boot Loader
- **Route:** `/` (initial state)
- **Purpose:** Brand impression + hide shader compilation + establish .EXE fiction
- **Key Components:** Wordmark, boot-line stream, progress %, skip affordance
- **States:** loading / stalled (>8s → ENTER ANYWAY) / complete (CRT power-off exit)

### Screen 2: Hero (Singularity)
- **Purpose:** Instant wow + teach scroll=time mechanic
- **Key Components:** Title lockup (chromatic aberration), subtitle, scroll cue, sound toggle
- **States:** pristine / fading out (scroll > 2%)

### Screen 3: The Journey (Epochs 1–8)
- **Purpose:** Core experience
- **Key Components:** Cosmic Clock, epoch label, fact cards, gravity-well cursor
- **States:** per-epoch grading; card open/closed

### Screen 4: Finale (Solar System)
- **Purpose:** Emotional payoff + credits + rewind prompt
- **Key Components:** Time plaque, stardust copy, REWIND TIME button, credits line, tech-list link
- **States:** entering (slow-in), idle (gentle Earth glow pulse)

---

## 8. Constraints

- Tech constraints: Static SPA, single route, no backend; deploy target TBD (Vercel recommended)
- Performance limits: PERFORMANCE-BUDGET.md is binding (60 FPS desktop target, <4MB transfer)
- Security rules: No user input collected; localStorage preference only; CSP-safe build (no inline eval)
- Content rules: All-audience safe (hackathon rule); cosmology facts verified against 2+ reputable sources
- Libraries NOT allowed: jQuery, Bootstrap, A-Frame, Babylon.js (stack already chosen — do not mix), paid APIs
- Code rules: Maximum compaction — smallest correct implementation; files < 300 lines; no dead code

---

## 9. Out of Scope (this version)

- Multi-language support (English only)
- Accounts/comments/sharing backends (share = copy URL)
- VR/XR modes
- Procedural audio synthesis (one loop + filters instead)
- CMS-editable content (facts hardcoded in data file)

---

## 10. Future Improvements (V2)

- Gravitational-wave audio thump synced to black-hole pass
- Scroll-velocity-reactive particle streaks (warp speed feel)
- WebGPU compute particle path behind feature flag
- "Cosmic passport" — QR-shareable fastest-journey stat
- Optional narration mode (text-to-speech epoch intros)
