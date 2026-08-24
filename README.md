# GENESIS.EXE

> **13.8 billion years. One scroll.**
> A cinematic-realism, scroll-driven 3D journey from the Big Bang to you — built with React Three Fiber.
> Entry for the [3D Websites Hackathon](https://3d-websites-hackathon.devpost.com/) · deadline **Aug 31, 2026**.

---

## Table of Contents

- [What Is This?](#what-is-this)
- [Features](#features)
- [The Journey — Nine Epochs](#the-journey--nine-epochs)
- [Quick Start](#quick-start)
- [Available Scripts](#available-scripts)
- [Production Build & Deployment](#production-build--deployment)
- [Architecture](#architecture)
- [Performance & Quality Tiers](#performance--quality-tiers)
- [Accessibility](#accessibility)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Assets & Licenses](#assets--licenses)
- [Security](#security)
- [Spec Package](#spec-package)

---

## What Is This?

GENESIS.EXE compresses 13.8 billion years of cosmic history into a single scroll.
As the visitor scrolls, a persistent WebGL world plays the story of the universe in
cinematic realism: the singularity ignites, spacetime inflates, quark soup cools into
matter, first light breaks free, stars and galaxies assemble, a supernova seeds the
elements, a black hole bends light at the event horizon — and the camera finally
arrives home at an ordinary blue planet carrying every person reading the page.

There is no backend, no accounts, no network calls. The entire experience is a static,
client-only site — which makes it trivially deployable to any static host.

## Features

| Area | Details |
|------|---------|
| Scroll-driven timeline | One continuous camera path (`src/lib/cameraPath.ts`); scroll position = cosmic time |
| Epoch director | Scenes mount/unmount around the current epoch with cross-faded fog/exposure/bloom grades (`three/EpochDirector.tsx`, `data/epochs.ts`) |
| Boot screen | DOM-only boot sequence paints before WebGL is ready; "ENTER ANYWAY" escape hatch if loading stalls |
| Cosmic Clock HUD | Live T+ readout replacing the scrollbar metaphor (`hud/CosmicClock.tsx`) |
| Fact cards | Clickable cosmology fact cards per epoch (`hud/FactCard.tsx`, data in `data/facts.ts`) |
| Finale plaque | The closing beat: *you are made of what you just scrolled past* (`hud/FinalePlaque.tsx`) |
| Ambient audio | Opt-in nebula soundscape; lazy-loaded only after the user's first click (`hud/AudioToggle.tsx`) |
| Observatory mode | Free-explore 3D viewer at `/observatory` — orbit/zoom each epoch independently (OrbitControls) |
| Rewind | Instant jump back to T = 0 |
| Reduced motion | Honors `prefers-reduced-motion`; damped/auto-scroll behavior disabled accordingly |
| Crash resilience | Canvas error boundary + WebGL context-loss guard with loop-safe auto-reload |

## The Journey — Nine Epochs

| # | Epoch | Cosmic Time | Scroll Start | Scene |
|---|-------|-------------|--------------|-------|
| 1 | THE SINGULARITY | T = 0 | 0.00 | White-hot beginning (`three/epochs/Singularity.tsx`) |
| 2 | INFLATION | T + 10⁻³² s | 0.08 | Spacetime tears open (`Inflation.tsx`) |
| 3 | THE QUARK SOUP | T + 1 μs | 0.16 | Trillion-degree plasma (`QuarkSoup.tsx`) |
| 4 | FIRST LIGHT | T + 380 kyr | 0.26 | The fog clears, CMB released (`FirstLight.tsx`) |
| 5 | COSMIC DAWN | T + 200 Myr | 0.36 | First stars ignite (`CosmicDawn.tsx`) |
| 6 | THE GALAXY ERA | T + 2 Gyr | 0.48 | Spiral structure forms (`GalaxyEra.tsx`) |
| 7 | STELLAR FORGE | T + 6 Gyr | 0.62 | Supernova seeds the elements (`StellarForge.tsx`) |
| 8 | EVENT HORIZON | T + 9 Gyr | 0.74 | Gravitational lensing black hole (`EventHorizon.tsx`) |
| 9 | YOU ARE HERE | NOW | 0.84 | Textured Solar System (`SolSystem.tsx`) |

Epoch boundaries use a 6%-of-progress cross-fade band (`TRANSITION_BAND`). Each epoch
carries its own grade — fog color/near/far, tone-mapping exposure, bloom strength.

## Quick Start

**Requirements:** Node 22+ LTS and pnpm (enable via `corepack enable`).

### One-click (Windows)

Double-click **`dev-frontend.bat`** — it checks for pnpm, installs dependencies on
first run, opens the browser, and starts the dev server.

### Manual

```bash
cd frontend
pnpm install
pnpm dev          # http://localhost:5173
```

### Observatory mode

Run the dev server and open:

```
http://localhost:5173/observatory
```

Free-orbit viewer for every epoch — drag to rotate, wheel to zoom.

## Available Scripts

All commands run from `frontend/`:

| Script | Command | What it does |
|--------|---------|--------------|
| Dev server | `pnpm dev` | Vite dev server with HMR at `localhost:5173` |
| Type-check + build | `pnpm build` | `tsc -b` strict type-check, then production bundle to `dist/` |
| Lint | `pnpm lint` | Oxlint over the source tree |
| Preview prod build | `pnpm preview` | Serves `dist/` locally for pre-deploy smoke tests |

## Production Build & Deployment

The output of `pnpm build` is a fully static bundle — any static host works.
The full host-comparison runbook (Vercel / Netlify / GitHub Pages / Docker) lives in
[`spec driven development/DEPLOYMENT.md`](spec%20driven%20development/DEPLOYMENT.md).

### GitHub Pages (current target)

A ready-made deployment workflow lives at
[`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml). It runs on every
push to `main` and on demand (`workflow_dispatch`): installs pnpm 10 + Node 22, builds
`frontend/` with `--base=/<repo-name>/`, copies `index.html` to `404.html` so
`/<repo>/observatory` is directly linkable, and deploys via the official Pages Actions.

One-time setup after pushing to GitHub:

1. Repo **Settings → Pages → Source: GitHub Actions**.
2. Push to `main` (or run the workflow manually) — site goes live at
   `https://<user>.github.io/<repo-name>/`.

Note on headers: Pages cannot set custom HTTP headers, so security headers must be
handled via `<meta>` tags or accepted as-is (see DEPLOYMENT.md §3–§4).

## Architecture

```
Browser
 └─ React 19 root (main.tsx)
     ├─ route split by pathname:
     │    ├─ "/"        → App.tsx   (scroll journey)
     │    └─ "/observatory" → Observatory.tsx (free explore)
     ├─ App
     │   ├─ <Canvas> (R3F, aria-hidden, tier-clamped DPR)
     │   │    └─ Scene
     │   │         ├─ CameraRig        — damped scroll→camera path follower
     │   │         ├─ EpochDirector    — mounts ≤2 neighboring epochs, applies grades
     │   │         ├─ epochs/*         — one self-contained scene per epoch
     │   │         ├─ Particles/Nebulae/Ignition/Singularity/SpacetimeWarp…
     │   │         └─ Effects          — EffectComposer: Bloom, chromatic aberration, vignette
     │   ├─ Hud (DOM overlay): BootScreen, CosmicClock, EpochLabel, FactCard, AudioToggle, FinalePlaque
     │   └─ QualityGovernor — rolling-FPS watchdog; downgrades tier when avg FPS < threshold
     └─ State
          ├─ zustand store (state/store.ts) — UI state only: booted/ignited/audio/tier
          └─ journey ref (hooks/useDampedProgress.ts) — per-frame values bypass React re-renders
```

Design rules enforced in code:

- **Zero allocations in the render loop** — vectors/quats are reused, not created.
- **Per-frame values never touch React state** — they flow through refs/journey.
- **Strict TypeScript** (`tsconfig.app.json`) and Oxlint-clean.

## Performance & Quality Tiers

Hard budgets from [`PERFORMANCE-BUDGET.md`](spec%20driven%20development/PERFORMANCE-BUDGET.md):

| Metric | Budget |
|--------|--------|
| Initial JS (gzipped) | ≤ 550 KB |
| Initial CSS | ≤ 60 KB |
| Total transfer (full journey) | ≤ 5 MB (audio lazy-loads on first opt-in) |
| FCP (desktop) | < 1.5 s — boot screen is DOM-only |
| Draw calls visible | ≤ 120 typical · 200 absolute peak |
| Triangles visible | ≤ 350 k |
| Mounted epoch scenes | ≤ 2 (mount window ±0.12 progress) |

Tier behavior:

| Setting | HIGH | MEDIUM | LOW |
|---------|------|--------|-----|
| Target FPS | 60 | 60 | 30 |
| DPR clamp | 1.75 | 1.5 | 1.0 |
| Starfield particles | 24,000 | 12,000 | 6,000 |
| Postprocessing | Full stack | Bloom + vignette | Bloom only + CSS overlays |

Boot starts conservatively at MEDIUM; the governor upgrades capable machines after
3 good seconds and downgrades (max twice, one-way) when rolling FPS drops below 24.

## Accessibility

Per [`ACCESSIBILITY.md`](spec%20driven%20development/ACCESSIBILITY.md):

- `prefers-reduced-motion` respected — damping and auto-scroll disabled.
- The 3D canvas is `aria-hidden`; all narrative content lives in accessible DOM HUD text.
- Touch targets ≥ 44 px; keyboard-reachable controls; focus styles preserved.
- Audio is strictly opt-in and never autoplays before a user gesture.

## Project Structure

```
.
├── dev-frontend.bat           Windows one-click dev launcher (install + open browser)
├── .env.example               Placeholder only — this project has NO secrets
├── README.md                  ← you are here
├── frontend/                  The app
│   ├── index.html             Entry HTML (meta, fonts preconnect, favicon)
│   ├── vite.config.ts         Vite config (React + Tailwind v4 plugins)
│   ├── public/
│   │   ├── assets/textures/   Solar System Scope planet textures (CC-BY 4.0)
│   │   ├── assets/audio/      Ambient soundscape (lazy-loaded)
│   │   ├── favicon.svg
│   │   └── icons.svg
│   └── src/
│       ├── main.tsx           Root — routes "/" vs "/observatory"
│       ├── App.tsx            Journey shell: Canvas, error boundary, context-loss guard
│       ├── Observatory.tsx    Free-explore mode (OrbitControls per epoch)
│       ├── three/
│       │   ├── Scene.tsx      Scene composition root
│       │   ├── CameraRig.tsx  Scroll-damped camera path
│       │   ├── EpochDirector.tsx  Mount window + grade application
│       │   ├── Effects.tsx    Postprocessing stack
│       │   └── epochs/        Nine epoch scenes (Singularity…SolSystem)
│       ├── hud/               DOM overlay UI (boot, clock, labels, facts, audio, plaque)
│       ├── hooks/             Scroll progress, damping, pointer, quality tier, reduced motion
│       ├── lib/               cameraPath, format helpers
│       ├── data/              epochs.ts (grades/boundaries), facts.ts (cosmology cards)
│       ├── state/store.ts     Zustand store (UI state only)
│       └── styles/            global.css (tokens), observatory.css
├── spec driven development/   Full spec package — start at SPEC.md + BUILD_PLAN.md
└── .codex/                    Optimization brief used for the hardening pass
```

## Tech Stack

| Layer | Choice | Version |
|-------|--------|---------|
| Bundler / dev server | Vite | 8.x |
| UI | React | 19.x |
| Language | TypeScript (strict) | ~6.0 |
| 3D engine | three | r185 |
| React renderer | @react-three/fiber | 9.x |
| 3D helpers | @react-three/drei | 10.x |
| Postprocessing | @react-three/postprocessing (+ postprocessing) | 3.x / 6.x |
| Smooth scroll | lenis | 1.3.x |
| Math helpers | maath | 0.10.x |
| State | zustand | 5.x |
| Styling | Tailwind CSS (v4 Vite plugin) | 4.x |
| Linter | Oxlint | 1.75+ |

Package manager: **pnpm** (via Corepack). Lockfile: `frontend/pnpm-lock.yaml`.

## Assets & Licenses

Full sourcing ledger: [`spec driven development/ASSETS.md`](spec%20driven%20development/ASSETS.md).

- Planet & ring textures © [Solar System Scope](https://www.solarsystemscope.com/textures/) (CC-BY 4.0)
- Earth day map imagery courtesy NASA Blue Marble
- HDRI environments from [Poly Haven](https://polyhaven.com/) (CC0)
- Fonts: **Syncopate** (display), **Jura** (body), **Space Mono** (terminal/HUD) — SIL OFL, via Google Fonts
- Icons: lucide-react (ISC)
- Audio: ambient nebula soundscape (`public/assets/audio/carina-nebula.mp3`) — see ASSETS.md

## Security

This project intentionally contains **zero secrets**: no API keys, no tokens, no
personal emails — in the working tree *or* git history (enforced by scans defined in
[`QA-SECURITY.md`](spec%20driven%20development/QA-SECURITY.md)). `.env.example` is a
placeholder documenting this policy. The site makes no external API calls; the only
third-party requests are Google Fonts stylesheet/font files.

## Spec Package

The project was built spec-first ("spec driven development"). The complete package —
PRD, SRS, SDS, storyboard, design system, performance budgets, accessibility, QA/security,
risks, submission checklist — lives in
[`spec driven development/`](spec%20driven%20development/README.md).
Recommended entry points: **SPEC.md** (what we're building) and **BUILD_PLAN.md** (how).

---

*Built for the [3D Websites Hackathon](https://3d-websites-hackathon.devpost.com/) · Aug 2026.*
