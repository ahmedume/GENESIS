# ===== FILE: DESIGN-SYSTEM.md =====
# Design System: GENESIS.EXE

One committed identity. If a choice doesn't reinforce "neon synthwave × cosmology," it's wrong.

---

## 1. Color Tokens

### Base
| Token | Hex | Use |
|-------|-----|-----|
| VOID | `#05010F` | Page bg, deepest space |
| DEEP | `#0B0221` | Fog bases, card glass tint |
| WHITE-HOT | `#FFF7E6` | Singularity, flash frames |

### Neon Set (accents only — never large flat fills)
| Token | Hex |
|-------|-----|
| MAGENTA | `#FF2E88` |
| HOT-ORANGE | `#FF6B1A` |
| AMBER | `#FFB347` |
| CRIMSON | `#C2185B` |
| CYAN | `#00F0FF` |
| TEAL | `#01CDCD` |
| VIOLET | `#7B2FBE` |
| PURPLE | `#B967FF` |
| BLUE | `#2E5BFF` |
| GOLD | `#FFD75E` |
| SUN | `#FFF152` |
| EARTH-BLUE | `#38BDF8` |

### Per-Epoch Grading Table
| Epoch | fogColor | accentLight | bloomStrength |
|-------|----------|-------------|---------------|
| Singularity | `#05010F` | WHITE-HOT | 1.4 |
| Inflation | `#16042E` | MAGENTA | 1.6 |
| Quark Soup | `#1C0512` | HOT-ORANGE | 1.5 |
| First Light | `#240A18` | AMBER→CRIMSON lerp | 1.2 |
| Cosmic Dawn | `#030112` | CYAN | 1.8 |
| Galaxy Era | `#0A0430` | PURPLE/BLUE | 1.5 |
| Stellar Forge | `#1A0A08` | GOLD | 1.7 |
| Event Horizon | `#020108` | ring MAGENTA→CYAN gradient | 2.0 |
| Solar System | `#04021A` | SUN | 1.3 |

### UI
- Text primary: `#F4EEFF`; secondary: rgba(244,238,255,0.64)
- Grid line: `rgba(255,46,136,0.28)`; success/ok in boot: `#01CDCD`
- Glass card: `rgba(11,2,33,0.55)`, backdrop-blur 14px, 1px border from MAGENTA→CYAN gradient, radius 14px

---

## 2. Typography

| Role | Font | Fallback stack | Notes |
|------|------|----------------|-------|
| Display | Audiowide | `"Audiowide", "Space Grotesk", system-ui, sans-serif` | Titles, epoch labels, buttons; UPPERCASE, tracking +0.06em |
| Body | Space Grotesk | `"Space Grotesk", system-ui, sans-serif` | Paragraphs, fact cards; sentence case, line-height 1.6 |
| Terminal/HUD | VT323 | `"VT323", ui-monospace, monospace` | Cosmic Clock numerals, boot lines; sizes ≥ 18px (thin pixel face) |

Scale (clamp): display `clamp(44px, 9vw, 128px)` · epoch label `clamp(22px, 3.4vw, 40px)` · body `clamp(15px, 1.4vw, 18px)` · HUD `clamp(16px, 1.6vw, 22px)`.

---

## 3. Motion Tokens

| Token | Value | Use |
|-------|-------|-----|
| ease-cinematic | `cubic-bezier(0.16, 1, 0.3, 1)` | All DOM reveals |
| ease-snap | `cubic-bezier(0.55, 0, 1, 0.45)` | Button presses |
| dur-fast / mid / slow / epic | 150ms / 300ms / 600ms / 1200ms | Micro / reveals / transitions / ignition |
| scroll damping λ | 4 (`damp(cur, target, 4, delta)`) | Camera + clock |
| parallax gain | ±2° max camera offset, lerped at 6/s | Pointer move |

Reduced motion: all of the above disabled; instant states.

---

## 4. Postprocessing & Screen Effects

| Effect | Setting | Notes |
|--------|---------|-------|
| Bloom | threshold 0.72 · strength per grading table (× tier scale) · radius 0.85 | The look lives here — budget carefully |
| ChromaticAberration | offset ≤ (0.0008, 0.0008), animated envelope | Only during: title reveal, IGNITION flash, supernova pass, black-hole arc |
| Vignette | darkness 0.62, offset 0.18 | Constant |
| Noise/grain | opacity 0.035 | Constant; CSS overlay allowed instead of pass on `low` |
| Scanlines | CSS repeating-linear-gradient, opacity 0.04 | Fixed overlay div, pointer-events none |

CRT motifs: boot power-off collapse; occasional single-frame flicker on epoch label change (opacity keyframe, 90ms); `ok` status in TEAL.

---

## 5. Component Specs

### Fact Card (glass)
- Width min(360px, 88vw); padding 20px; name row = Audiowide 18px + era chip (VT323, bordered)
- Fact body Space Grotesk 16px/1.6 secondary color
- Entry: translateX(24px)+fade 300ms ease-cinematic; exit reverse
- Glow shadow: `0 0 32px rgba(255,46,136,0.18)` — subtle, never pulsing

### Cosmic Clock (left rail)
- 56px wide fixed column; vertical tick ruler (CSS gradient ticks every 8px, major every 5th taller + CYAN)
- Readout rotated? No — horizontal readout block top-left below logo mark; ruler is the vertical element

### Buttons
- Ghost style: transparent fill, 1px neon border (MAGENTA or CYAN), Audiowide 14px uppercase, hover = border glow + slight scale(1.03), active scale(0.97)

### Scroll cue
- Chevron SVG animating translateY loop 1.6s; label VT323 `SCROLL TO BEGIN TIME`

---

## 6. Anti-Slop Rules (hard constraints)

1. NEVER default Tailwind blue/purple (#3B82F6/#8B5CF6) anywhere.
2. NEVER emoji as icons — lucide-react line icons only.
3. NEVER lorem ipsum — copy comes from STORYBOARD.md verbatim.
4. NEVER center-align everything — the layout system is asymmetric by design (clock left, content right-weighted).
5. NEVER text drop-shadows for "style" — glow belongs to geometry via bloom.
6. NEVER more than one glass-blur surface visible at once (fact cards are the exception class).
7. NEVER animate font-size; animate transform/opacity only.
8. NEVER mix radius systems — 14px cards, 999px pills/buttons, sharp corners elsewhere.
