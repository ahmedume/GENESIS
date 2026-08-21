# ===== FILE: INTERACTIONS.md =====
# Interaction Specification: GENESIS.EXE

Every way a user can touch the experience. If an interaction isn't listed here, it doesn't exist.

---

## 1. Interaction Inventory

| # | Interaction | Input | Response | Feedback |
|---|-------------|-------|----------|----------|
| I-01 | Begin journey | First scroll past p=0.02 | IGNITION sequence (FR-03), camera unlocks | Flash + shockwave + bloom envelope |
| I-02 | Travel time | Wheel / touch drag / PgDn·PgUp / Space / ArrowKeys | Damped progress → camera along path; reverse supported fully | Continuous world morph; Cosmic Clock live |
| I-03 | Aim attention | Pointer move | Camera parallax ±2° lerped at 6/s + gravity-well particle attraction within radius | World leans toward cursor subtly |
| I-04 | Discover object | Hover interactive mesh | Emissive pulse lerp to 1.6× base; cursor ring scales 1→1.5; mini name tag near cursor | Ring border brightens SIGNAL-CYAN |
| I-05 | Open fact card | Click / tap interactive mesh | `activeFactId` set; glass card slides in right | Card entry 300ms ease-cinematic |
| I-06 | Dismiss card | ESC / X button / click outside / new object click | Previous closes (or swaps) | Exit 300ms; exactly one open max |
| I-07 | Sound toggle | Click speaker btn / `M` key | WebAudio fade in/out 1s; lowpass cutoff mapped to epoch | Icon swap volume-x ↔ volume-2 |
| I-08 | Rewind time | `⟲ REWIND TIME` btn at finale | Lenis scrollTo(0) ~8s eased; interruptible by any user scroll | Reverse journey = free content |
| I-09 | Escape boot stall | ENTER ANYWAY btn (after 8s) / Tab+Enter | Force reveal hero | 400ms fade-through-black plays regardless |
| I-10 | Epoch jump (reduced-motion only) | Jump nav buttons 1–9 | Instant poster-state swap per epoch | Active button state CYAN border |
| I-11 | Idle hint | 12s no input while unvisited interactive in view | One gentle emissive pulse on nearest object | Once per epoch per session |

---

## 2. Behavior Details

### Scroll (I-02)
- Raw progress from Lenis; displayed progress damped λ=4 — raw never renders directly.
- Overscroll bounce clamps to [0,1].
- Fast flick (0→1 <5s): transition bands guarantee each epoch palette ≥300ms visibility.
- Native scrollbar hidden (`scrollbar-width:none`, `::-webkit-scrollbar{display:none}`) — Cosmic Clock replaces it visually.
- Keyboard scrolling inherits Lenis smoothness; focus stays on body during travel.

### Gravity Well (I-03)
- Uniform: pointer NDC + strength (eased 0↔1 on enter/leave window).
- Vertex shader displacement, radius ≈ 18% viewport world-space, falloff smoothstep.
- Strength ×0.4 on touch devices; disabled tier `low` and reduced-motion.

### Raycast & Cards (I-04/I-05/I-06)
- Raycast throttled to every other frame; only when pointer moved since last cast.
- Interactive meshes registered via shared `<Interactive>` wrapper (SDS §3 pattern) — one code path for hover/click/fact lookup.
- Fact body ≤140 chars from data file; card never blocks canvas center (right-docked).

### Touch
- Tap vs drag disambiguation: tap = pointerdown/up <250ms & <10px movement → treat as click; otherwise scroll.
- No hover states on touch — direct open on tap.
- Touch targets ≥44px (ACCESSIBILITY.md).

### Keyboard Map
| Key | Action |
|-----|--------|
| Space / ArrowDown / PgDn | Advance (native scroll, smoothed by Lenis) |
| ArrowUp / PgUp | Reverse |
| ESC | Close open card |
| M | Toggle sound |
| Tab | Focus order: skip-boot (if visible) → sound toggle → interactives in scene order → rewind (when visible) |

---

## 3. State Machines

### Boot
`loading → stalled(8s, show ENTER ANYWAY) → revealed`
Transitions: loading→revealed on (progress=100 ∧ elapsed≥900ms); any→revealed via I-09.

### Card
`closed → opening(300ms) → open → closing(300ms) → closed`
Swap path: open→closing→opening with new id.

### Audio
`muted(default/persisted) → fading-in(1s) → playing → fading-out(1s) → muted`
Visibility hidden forces fading-out; return does NOT auto-resume.

---

## 4. Micro-interaction Glossary

- Cursor ring: 24px circle, 1px `SIGNAL-CYAN` border; expands + brightens over interactives (I-04).
- Epoch label change: 90ms opacity flicker before swap (CRT channel-change feel).
- Buttons: scale(1.03)/border-glow hover; scale(0.97) active press.
- Sound icon: subtle equalizer bars animation while playing (CSS, 3 bars, VT323-green? no — TEAL `#01CDCD`).
- REWIND button: slow rotating ⟲ glyph on hover (rotate 360°/2s linear loop).
