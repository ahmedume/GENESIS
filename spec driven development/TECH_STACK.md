# ===== FILE: TECH_STACK.md =====
# Technology Stack: GENESIS.EXE

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 22 LTS | Runtime / toolchain |
| **pnpm** | 9+ | Package manager (user-locked; strict, fast, clean lockfile) |
| **Vite** | ^7 | Dev server + production bundler |
| **React** | ^19 | UI layer for HUD/DOM overlays |
| **TypeScript** | ^5.x strict | Type safety across the app |
| **three** | r170+ (pin exact at scaffold) | WebGL engine underneath everything |
| **@react-three/fiber** | ^9 | React renderer reconciling three scene |
| **@react-three/drei** | ^10 | Camera helpers, useProgress, misc utilities |
| **@react-three/postprocessing** | ^3 | Bloom / ChromaticAberration / Vignette / Noise effect stack |
| **lenis** | ^1.x | Smooth scroll driving the whole journey |
| **gsap** | ^3.13 (+ScrollTrigger) | DOM/HUD text reveals only — never drives the camera |
| **maath** | ^0.10 | Frame-rate-independent damping math |
| **zustand** | ^5 | Minimal global state (tier, audio, active card, progress) |
| **Tailwind CSS** | ^4 | HUD styling speed |
| **lucide-react** | latest | Line icons only (anti-slop rule) |
| **Google Fonts** | Audiowide · Space Grotesk · VT323 | Display / body / terminal type (OFL license) |
| **Vercel CLI / platform** | latest | Deployment candidate A (decision pending) |

> **Version pinning rule:** on scaffold day run `pnpm add pkg` and commit `pnpm-lock.yaml`. The table above is intent; the lockfile is law.

## Runtime Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| Node RAM (build) | 2 GB | 4 GB |
| Disk | 1 GB | 2 GB |
| Browser target | WebGL2, ES2020 | Latest evergreen Chrome/FF/Safari |

## Dependency Graph

```
GENESIS.EXE (Vite + React 19 + TS)
│
├── lenis ───────────► useScrollProgress hook ──┐
│                                               ▼
│                                        zustand store ◄── useProgress (drei)
│                                               │                 ▲
│                                               ▼                 │
│                                    CameraRig (R3F) ────── Canvas (fiber)
│                                               │                 │
│                         ┌─────────────────────┼─────────────────┤
│                         ▼                     ▼                 ▼
│                   Epoch Scenes          Postprocessing      drei utils
│                   (procedural geo,      Bloom/CAb/Vig       maath damp
│                    instanced particles, Noise)
│                         ▲
│        facts.ts ────────┘ (Interactive wrapper → raycast → FactCard)
│
└── HUD (DOM): CosmicClock · EpochLabel · BootScreen · FactCard · AudioToggle
    styling: Tailwind v4 + Google Fonts
```

## Why These Choices

| Decision | Rationale |
|----------|-----------|
| Vite over Next.js | Single static route; no SSR need; fastest iteration loop for a hackathon |
| R3F over raw three | Declarative scene graph = compact code (max-compaction rule) + React 19 concurrent safety |
| Lenis over GSAP-ScrollTrigger-driven camera | One smooth scroll value feeding one rig — impossible to desync; ST reserved for text only |
| Procedural geometry over GLTF assets | Zero download weight, zero license risk, unique look, smaller failure surface |
| zustand over Context | Per-frame progress updates without re-render storms (selectors) |
| Tailwind v4 | Speed; design tokens enforced via CSS variables from DESIGN-SYSTEM.md |
| pnpm | User decision — also best-in-class strictness against phantom deps |
| Docker regardless of host | Standing requirement: reproducible prod image keeps deploy decision swappable in minutes |

## Python Note
No Python anywhere in this project's plan. If any scripting ever becomes necessary, use **uv**, never pip (standing rule).
