# ===== FILE: SDS.md =====
# Software Design Specification: GENESIS.EXE

**Version:** 1.0.0

---

## 1. System Architecture

### Architecture Pattern
Client-only SPA: React DOM layer (HUD) + one persistent R3F `<Canvas>` (world). A scroll
pipeline feeds a single zustand store; the 3D world reads progress per-frame via refs/selectors,
DOM HUD updates throttled to animation frames.

### High-Level Architecture
```
[Lenis smooth scroll] → [useScrollProgress] → [zustand: scrollProgress, booted, ...]
                                                    │
                     ┌──────────────────────────────┴──────────────────────────┐
                     ▼                                                         ▼
        [R3F Canvas — persistent]                                   [HUD DOM overlay]
         CameraRig (damped path)                                     BootScreen (gate)
         EpochDirector (grading blend)                               CosmicClock
           ├─ EpochScene ×9 (mount-on-near / unmount-far)            EpochLabel
           ├─ Nebulae (fbm-noise volumetric billboards)                FactCard ← facts.ts
           ├─ StarfieldParticles (gravity-well shader)               AudioToggle · RewindBtn
           └─ InteractiveRegistry (raycast)                          JumpNav (reduced-motion)
[Postprocessing: Bloom → ChromaticAberration → Vignette → Noise]
```

---

## 2. Folder Structure

Frontend/backend separation rule honored: everything user-facing lives in `frontend/`; no backend exists.
Repo root holds infra only (Dockerfile, specs).

```
repo-root/
├── frontend/                      # THE app (Vite root) — ALL app code lives here (R1)
│   ├── index.html                 # meta/OG tags, font preloads, #root
│   ├── vite.config.ts             # react plugin; manualChunks for three/postprocessing
│   ├── tsconfig.json              # strict true
│   ├── public/
│   │   ├── audio/ambience-loop.mp3    # CC0 deep-space bed (~1–2MB, lazy-loaded)
│   │   └── assets/
│   │       ├── textures/              # NASA / Solar System Scope planet maps (CC-BY/PD, ≤2K)
│   │       └── models/                # CC0 GLB set pieces only (asteroids etc., Draco)
│   │   └── favicon.svg
│   └── src/
│       ├── main.tsx               # createRoot + <App/>
│       ├── App.tsx                # LenisProvider + Canvas + HUD composition (~40 lines)
│       ├── styles/global.css      # Tailwind entry + tokens + scanlines/vignette overlays
│       ├── state/store.ts         # zustand: qualityTier, audioEnabled, activeFactId, scrollProgress, booted
│       ├── hooks/
│       │   ├── useScrollProgress.ts   # Lenis init + raw→store write
│       │   ├── useDampedProgress.ts   # damped value per frame (ref-based)
│       │   ├── useQualityTier.ts      # heuristic detection + FPS watchdog downgrade
│       │   └── usePointer.ts          # NDC pointer tracking
│       ├── three/
│       │   ├── Scene.tsx          # <Canvas> contents: rig + director + effects (~80 lines)
│       │   ├── CameraRig.tsx      # Catmull-Rom path sampling by damped progress
│       │   ├── EpochDirector.tsx  # epoch tables: fog/exposure/bloom blending
│       │   ├── SpacetimeWarp.tsx  # inflation streak field + lensing displacement hooks
│       │   ├── Particles.tsx      # instanced starfield/quark systems + gravity well shader
│       │   ├── Effects.tsx        # postprocessing stack per quality tier
│       │   ├── Interactive.tsx    # wrapper: register mesh → hover/click → card store (~60 lines)
│       │   └── epochs/            # ONE FILE PER EPOCH, each ≤120 lines
│       │       ├── Singularity.tsx    Inflation.tsx    QuarkSoup.tsx
│       │       ├── FirstLight.tsx     CosmicDawn.tsx   GalaxyEra.tsx
│       │       ├── StellarForge.tsx   EventHorizon.tsx SolSystem.tsx
│       ├── data/
│       │   ├── epochs.ts          # Epoch entities: ranges, labels, palettes (STORYBOARD table)
│       │   └── facts.ts           # CelestialFact entities (STORYBOARD copy verbatim)
│       ├── hud/
│       │   ├── Hud.tsx            # fixed overlay composition
│       │   ├── BootScreen.tsx     # CRT loader + boot lines + ENTER ANYWAY
│       │   ├── CosmicClock.tsx    # logTime readout + tick ruler
│       │   ├── EpochLabel.tsx     # cross-fading label + intro line
│       │   ├── FactCard.tsx       # glass card from store.activeFactId
│       │   ├── AudioToggle.tsx    # WebAudio graph owner
│       │   └── FinalePlaque.tsx   # plaque + REWIND button
│       └── lib/
│           ├── timeScale.ts       # logTime(p): p ↔ seconds-since-Big-Bang + formatter
│           ├── cameraPath.ts      # control points array + curve builder
│           └── format.ts          # tiny shared formatters
├── backend/                       # RESERVED — empty until/unless a backend ever exists (R1)
├── imgs/                          # screenshots for QA + Devpost submission
├── dev-frontend.bat               # R2: cd frontend && pnpm install (if needed) && pnpm dev
├── .gitignore                     # R4: node_modules/, dist/, .env*, logs, OS junk
├── Dockerfile                     # OPTIONAL — Phase 7 only (R6); multi-stage build → nginx serve
├── .dockerignore                  # created with Dockerfile in Phase 7
├── .env.example                   # EMPTY placeholders only — no secrets ever (R3)
└── README.md                      # run/build/deploy instructions + tech list
```

**Rule:** any file trending >300 lines gets split along its obvious seam. Any component expressible as one function stays one function.

---

## 3. Key Algorithms & Business Logic

### logTime(p) — scroll ↔ cosmic time
```pseudocode
FUNCTION logTime(p):
  // 9 anchor points (p, secondsSinceBigBang) from STORYBOARD:
  // (0,0)(0.08,1e-32)(0.16,1e-6)(0.26,1.2e13≈380kyr)(0.36,6.3e15≈200Myr)
  // (0.48,6.3e16≈2Gyr)(0.62,1.26e17≈4Gyr)(0.74,2.8e17≈9Gyr)(0.84,2.9e17)(1,4.35e17≈13.8Gyr)
  SEGMENT = find segment containing p
  t = exp(lerp(log(tA), log(tB), localT))   // geometric interpolation in log-space
  RETURN t

FUNCTION formatTime(seconds):
  CASE seconds < 1e-24 → "10^" + round(log10(s)) + " s"
  CASE seconds < 60    → exponential seconds
  CASE seconds < 3600  → minutes
  CASE years < 1e3     → years · <1e6 → "kyr" · <1e9 → "Myr" · else "Gyr"
```

### Camera path
```pseudocode
curve = CatmullRomCurve3(CONTROL_POINTS, tension=0.5)   // ~14 points, one cluster per epoch
per frame: cam.position = curve.getPointAt(damp(p)); lookAt = curve.getPointAt(damp(p)+LOOKAHEAD=0.004)
parallax: apply ±2° offset quaternion from pointer, lerped 6/s
```

### Epoch grading blend
```pseudocode
FOR each boundary b with band w=0.06:
  k = smoothstep(b−w/2, b+w/2, p)         // blend factor between epoch i and i+1
  fogColor = lerp(fog_i, fog_{i+1}, k); bloomStrength = lerp(bs_i, bs_{i+1}, k) ...
```

### Quality tier selection
```pseudocode
IF deviceMemory ≤ 2 OR hardwareConcurrency ≤ 4 OR coarsePointer AND width<900 → LOW
ELSE IF deviceMemory ≤ 4 OR width < 1100 → MEDIUM ELSE HIGH
watchdog: rolling avg FPS < 24 over 4s → downgrade one tier (one-way, max twice)
```

### Gravity well (vertex shader concept)
```glsl
vec3 dir = uPointer3D - position;
float fall = smoothstep(uRadius, 0.0, length(dir));
transformed += normalize(dir) * fall * uStrength * AMPLITUDE;
```

---

## 4. API Routes
None. Static assets only: `/` (app), `/audio/ambient-loop.mp3`, fonts CDN, `/favicon.svg`.

---

## 5. State Store Schema (zustand)
```ts
{ qualityTier:'low'|'medium'|'high', audioEnabled:boolean, activeFactId:string|null,
  scrollProgress:number, booted:boolean }
```
Per-frame writes (`scrollProgress`) go through a separate vanilla ref channel — React components subscribe selectively so HUD text updates don't re-render the canvas tree.

---

## 6. Environment Variables

```env
# .env.example — placeholders ONLY, no real values, no secrets exist in this project
NODE_ENV=development
```
No API keys, no tokens, no emails anywhere in repo (QA-SECURITY.md scans enforce this).

---

## 7. Performance Design

- Instancing mandatory for all repeated geometry (particles, stars, planet rings).
- Per-epoch scenes unmount when |epochCenter − progress| > 0.12 — only neighbors alive.
- DPR clamp: high 1.75 · medium 1.5 · low 1.0. Postprocessing passes drop progressively (low = Bloom only, CSS grain instead of Noise pass).
- All continuous math frame-rate independent (`maath.damp`, delta-scaled shaders).
- Textures: procedural canvas gradients only (≤1024px); zero image downloads besides audio.
