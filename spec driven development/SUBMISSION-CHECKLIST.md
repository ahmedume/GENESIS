# ===== FILE: SUBMISSION-CHECKLIST.md =====
# Devpost Submission Checklist: GENESIS.EXE

Hackathon: 3D Websites Hackathon · Deadline **Aug 31, 2026 @ 5:00pm CDT** · Target submit: **Aug 30 evening**.

---

## A. Required Items → Status

| # | Requirement | Artifact / Owner | Status |
|---|-------------|------------------|--------|
| 1 | Publicly accessible website link | Deployed URL (DEPLOYMENT.md §6 verified) | ⬜ Pending deploy decision |
| 2 | Project description (idea + inspiration) | Draft outline below; finalize Phase 7 | ⬜ |
| 3 | At least 3 screenshots | Shot list §B — stored in `imgs/submission/` | ⬜ |
| 4 | Demo video 1–5 min (optional but we ship it) | Script §C — record Phase 7 | ⬜ |
| 5 | Technologies & tools list | Generated from TECH_STACK.md | ⬜ |
| 6 | Source code | Public GitHub repo (clean README, no secrets) | ⬜ |

## B. Screenshot Shot List (capture into `imgs/submission/`)

| File | Frame | Must show |
|------|-------|-----------|
| `01-boot.png` | CRT boot screen mid-load | Wordmark + boot lines + % |
| `02-hero.png` | Singularity hero pre-scroll | Title lockup + scroll cue |
| `03-inflation.png` | Inflation epoch | Grid streaks magenta/violet |
| `04-cosmic-dawn.png` | Star ignition moment [SIG] | Cyan burst on darkness |
| `05-galaxy-era.png` | Vinyl-disc galaxy weave | Disc detail + nebula |
| `06-blackhole.png` | Event horizon arc | Accretion ring + warped grid |
| `07-finale.png` | You Are Here plaque | Plaque copy + solar system |
| `08-clock-card.png` | Cosmic Clock + open fact card | HUD instruments visible |

Rules: desktop 1920×1080 native DPR (crisp), plus 2 mobile shots (`09-mobile-hero.png`, `10-mobile-dawn.png`) via device toolbar 390×844. No browser chrome in crops except one full-window shot for authenticity.

## C. Demo Video Script (~75 s)

| Time | Beat |
|------|------|
| 0–8s | Boot screen plays → hero reveals. VO: "This is GENESIS.EXE — the entire universe, in one scroll." |
| 8–20s | IGNITION flash → inflation streaks. VO explains scroll=time mechanic. |
| 20–40s | Fast tour: quark soup → first light → cosmic dawn ignitions → galaxies. |
| 40–55s | Interactions demo: click black hole → fact card; gravity-well cursor; sound toggle. |
| 55–70s | Supernova beat → black hole arc → solar system assembly → YOU ARE HERE plaque. VO: closing stardust line. |
| 70–75s | End card: URL + "Built with React Three Fiber" + rewind gag (screen rewinds itself). |

Capture at 60 FPS, 1080p, calm cursor movement, audio bed optional (site sound off by default — add music in edit, CC0).

## D. Project Description Outline (fill in Phase 7)

1. Hook line (stardust payoff teaser)
2. Inspiration: why cosmology + why synthwave (one paragraph, honest)
3. What it is: scroll=time journey through 9 epochs (list them)
4. Highlights: IGNITION, cosmic dawn, supernova pass, black-hole warp grid, finale crane reveal
5. Interaction inventory summary
6. Tech stack block (auto from TECH_STACK.md)
7. Built-by line + acknowledgments of CC0/OFL assets

## E. Compliance Matrix (hackathon rules)

| Rule | Status |
|------|--------|
| Web-based | ✅ static SPA |
| Meaningful 3D/immersive elements | ✅ entire experience is 3D |
| Appropriate for all audiences | ✅ ACCESSIBILITY.md §2 enforced |
| AI tools allowed | ✅ used for dev assistance; assets CC0/OFL/procedural |
| Teams/solo | Solo |
| Submitted before deadline with buffer | Target Aug 30 evening |

## F. Final Sweep (Aug 30)

⬜ All SRS §6 validation rows green · ⬜ QA-SECURITY.md fully checked · ⬜ README run instructions accurate · ⬜ repo secret-scan clean · ⬜ live URL smoke test on fresh device/incognito · ⬜ submit + confirm listing appears in gallery
