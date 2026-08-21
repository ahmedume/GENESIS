# ===== FILE: ACCESSIBILITY.md =====
# Accessibility & Compliance: GENESIS.EXE

An animation-heavy experience can still be open to everyone. These are requirements, not suggestions.

---

## 1. Reduced Motion (FR-09)

- Trigger: `matchMedia('(prefers-reduced-motion: reduce)')` at mount; live-listen for changes.
- Behavior:
  - No camera travel, no particle drift, no IGNITION flash, no gravity well, no gsap reveals — static poster composition per epoch.
  - Epoch jump navigation appears: 9 buttons + finale, keyboard operable, visible focus.
  - Boot screen collapses instantly (no CRT animation), progress still shown as plain text.
- The poster mode must communicate every fact card's content via the same jump nav (cards reachable per epoch).

## 2. Photosensitivity / All-Audiences (hackathon hard rule)

- IGNITION flash is a single ≤250 ms event — never strobing.
- Star ignitions spaced ≥ 400 ms apart; no rapid multi-flash sequences anywhere.
- Supernova overexposure ≤ 300 ms with immediate recovery curve.
- No horror imagery, gore, jump scares, or disturbing audio. Content = wonder, not fear.

## 3. Visual Contrast

| Element | Requirement |
|---------|-------------|
| Body text (`#F4EEFF` on VOID/DEEP) | ≥ 7:1 (verify) |
| Secondary text rgba(244,238,255,.64) | ≥ 4.5:1 effective composite (verify each bg epoch) |
| HUD numerals VT323 CYAN on dark | ≥ 4.5:1 (CYAN #00F0FF passes easily on VOID) |
| Focus indicators | 2px `#00F0FF` outline, 2px offset — never removed |

Epoch grading must not push text backgrounds below ratios — darkest fog values are locked in DESIGN-SYSTEM.md; verify First Light (brightest epoch) specifically.

## 4. Semantic & Assistive Tech

- `<Canvas>` container: `aria-hidden="true"` (decorative world); ALL information duplicated in DOM.
- Landmarks: `<header>` (wordmark/sound), `<main>` (journey region), `<footer>` (finale plaque).
- Fact card: `role="dialog"`, labelled by its name, ESC-closable, focus moves to card on open and returns to triggering object's proxy button on close.
- Each interactive 3D object gets an invisible-but-focusable proxy `<button>` in DOM order of scene appearance — Tab users can "reach into" the scene without a pointer.
- Cosmic Clock readout: `aria-live="polite"` but throttled — announce only epoch *changes*, not per-frame numbers.
- Sound toggle: `aria-pressed`; JumpNav buttons: `aria-current`.
- `html lang="en"`; page title + meta description set (SEO section below).

## 5. Motor / Input

- Touch targets ≥ 44×44 px (sound toggle, card close X, jump nav, ENTER ANYWAY, REWIND).
- No drag-required interactions; everything reachable by scroll + click + keyboard.
- Journey works without fine pointer precision (gravity well is decorative only).

## 6. SEO / Sharing Meta (judges click links — make the preview sell)

- `<title>` GENESIS.EXE — 13.8 Billion Years. One Scroll.
- meta description: one-liner from SPEC.md §1.
- OG/Twitter: title, description, `og:image` 1200×630 hero frame exported to `imgs/og/og.png`, `twitter:card=summary_large_image`.
- Theme color `#05010F`; favicon.svg neon point motif.
- Fonts preconnect + preload; graceful system-font fallback stacks already defined.

## 7. Verification

- Keyboard-only walkthrough: boot → full journey → all cards → finale → rewind, zero mouse.
- VoiceOver (iOS) or NVDA spot-check: epoch changes announced once; card content readable.
- OS-level reduce-motion ON → poster mode confirmed on desktop + mobile.
- Contrast spot-checks with DevTools picker across all 9 epochs → screenshots into `imgs/a11y/`.
