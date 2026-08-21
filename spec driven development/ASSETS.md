# ===== FILE: ASSETS.md =====
# Asset Sourcing Plan: GENESIS.EXE

Strategy (user-locked): **hybrid** — downloaded real assets where they earn wow (celestial bodies,
environments), shader-built where physics is cheap (stars, dust, gas). Every asset carries a license
line. Whitelist-only sources — nothing outside this table ships.

---

## 1. Textures (planets, sun, moon)

| Asset | Source | License | Spec | Used in |
|-------|--------|---------|------|---------|
| Sun surface + corona maps | [Solar System Scope](https://www.solarsystemscope.com/textures/) | CC-BY 4.0 (attribution in README + credits) | 2K jpg, downres from 8K | SolSystem |
| Mercury / Venus / Mars / Jupiter / Saturn (+ring alpha) / Uranus / Neptune | Solar System Scope | CC-BY 4.0 | 2K jpg each ≤600KB | SolSystem |
| Earth day map + clouds + night lights | NASA Blue Marble (via Solar System Scope mirror) | Public domain / CC-BY 4.0 | 2K jpg | SolSystem finale |
| Moon map | NASA / SScope | PD / CC-BY 4.0 | 1–2K | SolSystem |
| Milky Way skybox panorama | Solar System Scope | CC-BY 4.0 | 4K→2K downres, background only | Galaxy Era backdrop |

**Rules:** download once into `frontend/public/assets/textures/`; never hotlink; keep total texture payload ≤ 6 MB; 2K cap (mobile tiers get same files — they're already small).

## 2. HDRI Environments

| Asset | Source | License | Use |
|-------|--------|---------|-----|
| Space HDRIs (starfield env maps, e.g. "Milky Way", "Dark Side of the Moon" style) | [Poly Haven](https://polyhaven.com/hdris/space) | CC0 | Image-based lighting for planets/moons; subtle reflections |

Rules: 1K resolution versions only (lighting fidelity is enough); ≤2 HDRIs total.

## 3. Models (GLB, sparing)

| Asset | Source | License | Use |
|-------|--------|---------|-----|
| Asteroid/rock pack (low-poly PBR, 3–5 variants) | Sketchfab (filter: Downloadable + CC0) or Quaternius/Kenney space packs | CC0 | Stellar Forge debris field, SolSystem asteroid belt |
| Cometary nucleus (icy rock) | Sketchfab CC0 | CC0 | optional SolSystem accent |

**Model rules:** GLB only (Draco-compress if >500KB), ≤150KB per model target, no rigged/animated imports, must survive `useGLTF` preload without blocking boot. If a candidate model fails perf/license review → procedural fallback (displaced icosphere) ships instead.

## 4. Audio

| Asset | Source | License | Use |
|-------|--------|---------|-----|
| Deep-space ambience bed (~60–90s loop) | freesound.org / pixabay.com — filter CC0 | CC0 | opt-in ambience (FR-08) |

Fallback if no clean CC0 find: WebAudio-generated drone (filtered noise + slow LFO) — zero-license risk by construction.

## 5. Procedural (shader-built — no downloads)

| Element | Technique |
|---------|-----------|
| Starfield | Instanced points w/ size+color variance, custom sprite texture generated on canvas |
| Nebula clouds | Layered fbm-noise billboards/shader planes, additive |
| Black hole accretion disk | Custom fragment shader: doppler-brightened ring noise + photon ring |
| Supernova shockwave | Expanding ring mesh + emissive falloff + aberration spike |
| CMB static field | Inside-out sphere, animated fine-grain noise shader |
| Inflation streaks | GPU particle stretch along -Z during epoch window |
| God rays | Radial-blur post pass or billboard light shafts at sun limb |

## 6. Fonts & Icons

- Google Fonts OFL: Audiowide, Space Grotesk, VT323 (already linked)
- lucide-react (ISC) for UI icons

## 7. Attribution Ledger (ships in README + finale credits line)

```
Planet & sky textures © Solar System Scope (CC-BY 4.0) — solarsystemscope.com/textures
Earth imagery courtesy NASA Blue Marble
HDRI environments from Poly Haven (CC0) — polyhaven.com
[any Sketchfab models] by [author] (CC0) — sketchfab.com/[id]
Audio: [track] by [author] (CC0) — freesound.org/s/[id]
```
Every downloaded file gets its source URL + license appended here the day it's added — no exceptions (RISKS #7).
