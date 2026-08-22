# GENESIS.EXE

> 13.8 billion years. One scroll. — A cinematic-realism, scroll-driven 3D journey from the Big Bang to you.
> Entry for the [3D Websites Hackathon](https://3d-websites-hackathon.devpost.com/) · deadline Aug 31, 2026.

## Run

Double-click **`dev-frontend.bat`** (installs deps on first run + opens the browser), or manually:

```bash
cd frontend
pnpm install
pnpm dev        # http://localhost:5173
```

Requirements: Node 22+ LTS and pnpm (`corepack enable`).

## Build

```bash
cd frontend && pnpm build && pnpm preview
```

## Structure

```
frontend/   the app (Vite + React 19 + TypeScript strict + React Three Fiber)
backend/    reserved (client-only project — empty)
imgs/       screenshots (QA evidence + Devpost submission shots)
spec driven development/   full spec package (read SPEC.md + BUILD_PLAN.md first)
```

## Tech Stack

Vite 8 · React 19 · TypeScript · three r170 · @react-three/fiber 9 · lenis · maath · zustand · Tailwind CSS v4

## Credits & Licenses

- Planet & sky textures © Solar System Scope (CC-BY 4.0) — solarsystemscope.com/textures
- Earth imagery courtesy NASA Blue Marble
- HDRI environments from Poly Haven (CC0) — polyhaven.com
- Fonts: Audiowide, Space Grotesk, VT323 (SIL OFL) · Icons: lucide-react (ISC)

Full ledger in `spec driven development/ASSETS.md`.
