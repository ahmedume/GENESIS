# ===== FILE: PRD.md =====
# Product Requirements Document: GENESIS.EXE

## Executive Summary

GENESIS.EXE is a single-page, scroll-driven WebGL experience that compresses 13.8 billion years of
cosmic history into one scroll journey, rendered entirely in a committed neon-synthwave art style.
It is built to win the Devpost 3D Websites Hackathon (deadline Aug 31, 2026), where judging weights
Visual Design, Creativity & Originality, and UX/Interactivity. The audience is high-school judges
browsing quickly; the product optimizes for an instant "wow," zero-learning-curve interaction
(scroll = time), and a memorable emotional payoff ("you are stardust").

---

## Problem Statement

Judges review dozens of entries in one sitting. Typical submissions are either tech demos with no
soul or pretty pages with nothing to do. There is no shortage of spinning cubes — there is a shortage
of experiences that (a) communicate their mechanic instantly, (b) look like a deliberate authored
work rather than AI output, and (c) reward interaction at every scroll depth. GENESIS.EXE solves all
three: the mechanic is scrolling itself, the synthwave identity is executed with system-level
consistency (palette, type, CRT motifs), and every epoch contains motion, color shifts, and
clickable discoveries.

---

## Goals & Success Metrics

| Goal | Metric | Target |
|------|--------|--------|
| Instant wow | First-viewport visual impact (qualitative panel of 3 peers) | ≥ 2 "whoa" reactions in first 10s |
| Zero-friction comprehension | New user starts journey without instructions | 100% within 5s |
| Smooth performance | Sustained FPS mid-range laptop / phone | ≥ 60 / ≥ 30 |
| Engagement depth | % of test users reaching finale | ≥ 80% |
| Interaction delight | Fact cards opened per completed session | ≥ 2 |
| Hackathon compliance | SUBMISSION-CHECKLIST items green before deadline | 100% by Aug 30 evening |

---

## User Personas

### Persona 1: The Fast Judge
- **Who they are:** High-school student reviewing 20+ Devpost entries on a school laptop between classes.
- **What they need:** Instant impact; something fun to share with friends in Discord; no loading pain.
- **What frustrates them:** Slow loads, confusing navigation, walls of text, jank.
- **Technical level:** Casual browser; may open DevTools if impressed.

### Persona 2: The Curious Scroller
- **Who they are:** General visitor who landed via share link, mildly interested in space.
- **What they need:** A reason to keep scrolling; small rewards (facts) along the way.
- **What frustrates them:** Feeling lectured; long unskippable animations.
- **Technical level:** Any; mobile-heavy.

### Persona 3: The Fellow Builder
- **Who they are:** Another participant checking how the competition looks under the hood.
- **What they need:** Clean repo, readable structure, honest tech list.
- **What frustrates them:** Bloated bundles, dead code, mystery dependencies.
- **Technical level:** High — repo quality is part of our reputation here.

---

## User Stories

- As a judge, I want the site's premise obvious within seconds so I immediately understand what makes it special.
- As a fast scroller, I want each epoch visually distinct so skipping still feels like a journey.
- As a curious visitor, I want to click glowing objects and learn one surprising fact so exploration feels rewarded.
- As a mobile user, I want touch scrolling to drive the same journey smoothly so I'm not excluded from the wow.
- As a sound-off-by-default visitor, I want explicit opt-in audio so nothing blasts unexpectedly.
- As a reduced-motion user, I want a non-animated way to see everything so the site respects my settings.
- As a fellow builder, I want a clean `pnpm build` and tidy repo so I trust the craft behind the entry.
- As the author, I want submission artifacts (screenshots, video script, description) produced alongside the build so deadline day is calm.

---

## Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | Scroll drives continuous camera journey through 9 epochs | Must Have |
| FR-02 | Cosmic Clock HUD shows log-scale time + epoch name live | Must Have |
| FR-03 | Big Bang ignition triggered by first scroll | Must Have |
| FR-04 | Each epoch has distinct palette/lighting/set piece | Must Have |
| FR-05 | ≥ 7 clickable objects with fact cards | Must Have |
| FR-06 | CRT boot loader gates scene reveal | Must Have |
| FR-07 | Cursor gravity-well particle attraction | Should Have |
| FR-08 | Opt-in synthwave ambience with epoch-mapped filter | Should Have |
| FR-09 | Reduced-motion static mode with epoch jump nav | Must Have |
| FR-10 | Auto quality tiers (high/medium/low) | Must Have |
| FR-11 | Finale plaque + REWIND TIME smooth-scroll | Must Have |
| FR-12 | WebGL-absent poster fallback | Should Have |

---

## Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | See PERFORMANCE-BUDGET.md — binding budgets per tier |
| Compatibility | Latest Chrome/Edge/Firefox/Safari desktop + iOS/Android Chrome/Safari |
| Accessibility | ACCESSIBILITY.md — contrast, focus, reduced-motion, touch targets |
| Security/QA | QA-SECURITY.md checklist green; no secrets in repo; dependency audit clean |
| Reliability | Context-loss recovery; boot-stall escape hatch; offline-safe fonts fallback stack |
| Maintainability | Files < 300 lines; maximum code compaction; folder structure per SDS.md |

---

## Out of Scope

See SPEC.md §9 (accounts, VR, multi-language, CMS, procedural audio).

---

## Dependencies & Risks

| Item | Type | Impact | Mitigation |
|------|------|--------|------------|
| Deploy host decision (user pending) | Dependency | Medium | DEPLOYMENT.md comparison ready; Dockerfile keeps hosts interchangeable |
| Lenis/R3F version churn | Risk | Low | Pin exact versions on scaffold day; lockfile committed |
| Bloom overuse tanking FPS | Risk | High | PERFORMANCE-BUDGET.md draw-call/tri budgets + tier gating |
| Asset license contamination | Risk | High | ASSETS.md whitelist-only sourcing (CC0/OFL/self-made) |
| Single-dev timeline crunch | Risk | High | BUILD_PLAN.md phases with daily milestones; submit Aug 30 buffer |

---

## Timeline & Milestones

| Milestone | Deliverable | Target |
|-----------|-------------|--------|
| M0 | Specs approved (this package) | Aug 22 |
| M1 | Scaffold + scroll/camera rig + hero ignition playable | Aug 23 |
| M2 | Epochs 1–5 built and graded | Aug 25 |
| M3 | Epochs 6–9 + finale built and graded | Aug 27 |
| M4 | HUD complete, fact cards, interactions, audio | Aug 28 |
| M5 | Perf pass, QA/security, accessibility, Docker, deploy | Aug 29 |
| M6 | Screenshots in `imgs/`, video recorded, Devpost submitted | Aug 30 (buffer Aug 31) |
