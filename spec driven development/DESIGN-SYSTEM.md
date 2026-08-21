# ===== FILE: DESIGN-SYSTEM.md =====
# Design System: GENESIS.EXE

> **PIVOT (user decision):** Neon synthwave is DEAD. Art direction is now **CINEMATIC REALISM** —
> a $2M sci-fi title sequence look built from real PBR assets, volumetric light, and film-grade
> postprocessing. Every visual must survive the question: *"could this frame be from a space film?"*

---

## 1. Visual Identity

| Pillar | Rule |
|--------|------|
| Realism first | Real planet/sun textures (NASA / Solar System Scope), physically-plausible lighting, ACES tone mapping |
| Light is the protagonist | Emissive sources (stars, sun, accretion disks) against true black voids; volumetric god rays where dust/gas exists |
| Camera = cinema | Subtle handheld drift (≤0.5° noise), anamorphic-style flares, shallow DOF accents at set-piece moments only |
| Grade | Filmic contrast, deep shadow crush, restrained teal/orange bias — NO neon saturation, no wireframes, no flat shading |
| HUD contrast | UI stays precise/technical (thin lines, mono numerals) so the organic cosmos owns the beauty |

## 2. Color Tokens

### Base
| Token | Hex | Use |
|-------|-----|-----|
| VOID | `#000005` | Space background (true blacker) |
| DEEP | `#0A0E18` | Fog bases, card glass tint |
| WHITE-HOT | `#FFF7E6` | Ignition flash, young star cores |

### Grading accents (post/color-grade level — never raw geometry colors)
| Token | Hex | Use |
|-------|-----|-----|
| STEEL-BLUE | `#6FA8C9` | Cold starlight rim, Earth atmosphere |
| EMBER | `#FF8A3D` | Young suns, supernova warmth |
| VIOLET-DUST | `#8A7BC8` | Nebula dust scattering (physically motivated, not decoration) |
| SIGNAL-CYAN | `#00F0FF` | UI/HUD accent ONLY (interactive affordances) |

### Per-Epoch Grade Table (drives EpochDirector)
| Epoch | fogColor | exposure | bloom | grade bias |
|-------|----------|----------|-------|------------|
| Singularity | `#000005` | 0.9 | 1.2 | neutral |
| Inflation | `#0A0612` | 1.15 | 1.3 | warm violet haze |
| Quark Soup | `#12060A` | 1.25 | 1.3 | ember orange plasma |
| First Light | `#160A10` | 1.05 | 1.0 | amber→crimson cooling |
| Cosmic Dawn | `#010108` | 0.85 | 1.6 | cold blue starbursts |
| Galaxy Era | `#04040E` | 1.0 | 1.3 | violet-dust lanes |
| Stellar Forge | `#100806` | 1.1 | 1.4 | gold ember wash |
| Event Horizon | `#000002` | 0.95 | 2.0 | disk white-gold vs void |
| Solar System | `#020208` | 1.0 | 1.0 | balanced natural |

## 3. Typography (unchanged roles)

| Role | Font | Notes |
|------|------|-------|
| Display | Audiowide | Titles, buttons; UPPERCASE, tracking +0.06em |
| Body | Space Grotesk | Fact cards, paragraphs; line-height 1.6 |
| Terminal/HUD | VT323 | Cosmic Clock, boot lines; ≥18px |

Scale: display `clamp(44px, 9vw, 128px)` · epoch label `clamp(22px, 3.4vw, 40px)` · body `clamp(15px, 1.4vw, 18px)` · HUD `clamp(16px, 1.6vw, 22px)`.

## 4. Motion Tokens (unchanged)

| Token | Value |
|-------|-------|
| ease-cinematic | `cubic-bezier(0.16, 1, 0.3, 1)` |
| dur-fast/mid/slow/epic | 150ms / 300ms / 600ms / 1200ms |
| scroll damping λ | 4 |
| camera drift | ≤0.5° Perlin-noise handheld sway, always on (reduced-motion: off) |

## 5. Postprocessing Chain (order matters)

1. **Bloom** — threshold 0.75, radius 0.85, strength per grade table (× tier scale); LOW tier renders at half-res
2. **DepthOfField** — OFF by default; enabled only at set-piece beats (supernova, black hole approach) on HIGH tier
3. **Vignette** — darkness 0.55, offset 0.20
4. **ChromaticAberration** — envelope-animated: title reveal, IGNITION, supernova pass, black-hole arc only
5. **Noise/grain** — opacity 0.03, filmic
6. Tone mapping: **ACESFilmic**, exposure per grade table

CRT scanline overlay: REMOVED (was synthwave motif). Boot screen keeps terminal type only.

## 6. Component Specs

### Fact Card
- Glass: `rgba(10,14,24,0.6)`, blur 14px, 1px border `rgba(111,168,201,0.35)`, radius 14px
- Name row Audiowide 18px; era chip VT323 bordered; body Space Grotesk 16px/1.6 secondary color
- Entry translateX(24px)+fade 300ms ease-cinematic

### Cosmic Clock (left rail)
- Thin vertical ruler, ticks `rgba(255,255,255,0.22)`, majors `SIGNAL-CYAN`
- Readout VT323 horizontal block top-left

### Buttons
- Ghost: transparent fill, 1px border `SIGNAL-CYAN` @ 60%, Audiowide 14px uppercase
- Hover: border brightens + glow `0 0 24px rgba(0,240,255,0.25)`; active scale(0.97)

### Loading/Boot
- Black screen, VT323 boot lines streaming, thin progress hairline (CYAN), percentage readout
- No CRT collapse animation (synthwave relic) — exit = 400ms fade through black

## 7. Anti-Slop Rules (hard constraints)

1. NEVER default Tailwind blue/purple anywhere.
2. NEVER emoji as icons — lucide-react only.
3. NEVER lorem ipsum — copy verbatim from STORYBOARD.md.
4. NEVER centered-everything layout — asymmetric HUD system (clock left, content right-weighted).
5. NEVER neon-saturated geometry or wireframe-as-decoration — color comes from physics (emission, scattering) and grade.
6. NEVER visible low-effort tiling/repeating textures on planets — use seamless NASA/Solar System Scope maps with correct rotation.
7. NEVER animate font-size; transform/opacity only.
8. NEVER more than one glass-blur surface open at once.
