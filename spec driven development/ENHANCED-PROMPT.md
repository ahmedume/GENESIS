# ===== FILE: ENHANCED-PROMPT.md =====
# Master Brief — GENESIS.EXE

You are a senior creative frontend engineer with deep expertise in real-time WebGL rendering,
React Three Fiber, scroll-driven cinematography, and performance optimization. You are building
**GENESIS.EXE**, an award-caliber entry for the Devpost 3D Websites Hackathon.

## Project Context

GENESIS.EXE is a single-page, scroll-driven 3D web experience where scrolling IS the flow of
cosmic time: one continuous scroll journey from the Big Bang (T=0) to the present day (T+13.8
billion years). The scrollbar becomes a **Cosmic Clock**, page sections become cosmological epochs,
and a dolly camera travels through nine visually distinct eras — singularity, inflation, quark soup,
first light (CMB), cosmic dawn, galaxies, supernovae, a black hole flyby, and finally our solar
system with a "YOU ARE HERE" finale. Art direction is **neon synthwave**: flat-shaded low-poly
geometry, bloom-drenched magenta/cyan/violet gradients, a perspective neon grid that represents
spacetime itself and ripples with gravitational waves, CRT scanline overlays, and chromatic-aberration
typography. It must make a first-time visitor stop within 5 seconds and say "wow" — the explicit
judging criterion. Judges are high-school students browsing quickly; atmosphere, lighting, and polish
beat technical complexity. Content must be appropriate for all audiences.

## Your Task

Build the complete experience: scaffold the Vite + React + TypeScript app inside `frontend/`; implement
the Lenis smooth-scroll → scroll-progress pipeline; build the R3F canvas with a camera rig driven by
damped scroll progress; construct all nine epoch scenes with procedural geometry, instanced particle
systems, custom shader materials, and postprocessing (Bloom, ChromaticAberration, Vignette); implement
the HUD overlay (Cosmic Clock with log-time readout, epoch labels, fact cards, sound toggle, rewind
button); wire interactivity (mouse parallax, cursor-reactive particle attraction, clickable celestial
objects, spacetime-grid ripple shader); add the CRT boot-screen loader; enforce the
`prefers-reduced-motion` fallback; optimize to PERFORMANCE-BUDGET.md; containerize per DEPLOYMENT.md;
deploy to the chosen host with correct meta/OG tags; and prepare submission artifacts per
SUBMISSION-CHECKLIST.md.

## Tech Stack

- Runtime: Node.js 22 LTS, **pnpm** (locked by user)
- Framework: Vite 7 + React 19 + TypeScript 5 (strict)
- 3D: three (r170+), @react-three/fiber v9, @react-three/drei v10
- Postprocessing: @react-three/postprocessing v3 (Bloom, ChromaticAberration, Vignette, Noise)
- Scroll: lenis (smooth scroll) + custom useScrollProgress hook
- Animation: gsap 3.13 (HUD text reveals only — camera is driven by our rig), maath for damping
- State: zustand v5 (quality tier, audio on/off, active epoch, open fact card)
- Styling: Tailwind CSS v4 + Google Fonts (Audiowide, Space Grotesk, VT323)
- Audio: one CC0 synthwave ambient loop via WebAudio API, off by default
- Deployment: TBD — Vercel recommended default (see DEPLOYMENT.md); Dockerfile required regardless

## Output Requirements

- Complete app under `frontend/` matching SDS.md folder structure exactly (frontend/backend separation rule)
- All files < 300 lines; components split by epoch scene and concern; maximum code compaction — if it
  fits in a function, it stays a function
- `pnpm dev` serves at localhost:5173; `pnpm build` passes with zero TypeScript errors
- Docker image builds and serves the production bundle
- Working states: boot screen → singularity hero → full time-journey → finale plaque, plus
  reduced-motion static mode

## Constraints

- NEVER use external GLTF models as hard dependencies — all primary geometry is procedural; optional
  CC0 models may enhance but the site must look complete without them
- NEVER block first paint on 3D assets — show the boot-screen loader while shaders compile
- NEVER exceed PERFORMANCE-BUDGET.md limits (draw calls, triangle counts, texture sizes)
- NEVER autoplay audio — default muted, user must opt in
- NEVER use copyrighted assets — everything CC0/public-domain/OFL or self-made
- NEVER hardcode secrets (.env values, tokens, personal emails) — repo has `.env.example` with empty values only
- Do NOT implement multi-page routing, backend, database, or auth — single-page static site
- Do NOT add features absent from SPEC.md without asking the user first (always propose best approach)

## Success Criteria

1. Scrolling top→bottom plays one uninterrupted time-journey through all nine epochs ending at the
   solar-system finale; scrolling up rewinds smoothly; no snapping or desync
2. The Cosmic Clock displays scientifically honest log-scale time labels (10⁻⁴³s → 13.8 Gyr) and epoch
   names match STORYBOARD.md exactly
3. Sustained ≥ 60 FPS on a mid-range laptop and ≥ 30 FPS on a mid-range phone (auto quality tiers)
4. Every interactive object shows its fact card on click, per INTERACTIONS.md
5. `prefers-reduced-motion` users get a static poster scene with epoch jump buttons — no forced animation
6. All SUBMISSION-CHECKLIST.md items are green before deadline day, screenshots captured into `imgs/`
