# ===== FILE: QA-SECURITY.md =====
# QA & Security Plan: GENESIS.EXE

Standing rules honored here: security testing with minimum vulnerabilities, screenshots of the whole
product stored in `imgs/`, production-grade output.

---

## 1. Automated Gates (run every phase exit)

| Gate | Command | Pass Criteria |
|------|---------|---------------|
| Types | `pnpm exec tsc --noEmit` | 0 errors |
| Build | `pnpm build` | Succeeds; record bundle sizes vs budget |
| Dependencies | `pnpm audit --prod` | 0 high/critical (fix or justify+pin) |
| Dead code | manual grep pass | No unused exports/files shipped |
| Secret scan | `grep -rEi "(api[_-]?key|secret|token|password)\s*[:=]" src/ ; git log -p \| secret-patterns` | 0 hits |

## 2. Manual Verification Protocol

- Execute **SRS §6 table** row by row at Phases 2, 5, 6. Record ✅/❌ + screenshot per row.
- INTERACTIONS.md: every row I-01…I-11 demonstrated once on desktop + once on touch.
- PERFORMANCE-BUDGET.md §5 verification protocol each phase gate.
- ACCESSIBILITY.md §7 walkthrough before Phase 6 exit.

## 3. Security Checklist (client-only app — attack surface is small; keep it that way)

| # | Check | Why |
|---|-------|-----|
| S1 | Zero secrets in repo incl. history (no keys, tokens, personal emails) | Standing rule #7 |
| S2 | `.env.example` contains empty placeholders only | Same |
| S3 | CSP headers deployed (DEPLOYMENT.md §3) and no console CSP violations | XSS hardening |
| S4 | `script-src 'self'` — no inline scripts, no eval-path dependencies | Same |
| S5 | No third-party analytics/trackers/beacons | Privacy + perf |
| S6 | localStorage access wrapped in try/catch; only non-sensitive preference stored | Fail-safe, privacy |
| S7 | External requests limited to: fonts CDN, audio asset (self-hosted) — verify in Network tab | Supply-chain minimization |
| S8 | Dependencies pinned via lockfile; no floating `latest` in package.json | Reproducibility |
| S9 | nginx/host headers: nosniff, DENY framing, strict referrer, permissions-policy | Hardening |
| S10 | Repo has LICENSE + README; issues visible (public repo hygiene) | Submission credibility |

## 4. Browser / Device Test Matrix

| Environment | When |
|-------------|------|
| Chrome desktop (primary dev) | Continuous |
| Firefox + Safari desktop | Phase 3 & 6 |
| iOS Safari real device | Phase 1 (early!), 6 |
| Android Chrome real device | Phase 6 |
| Chrome CPU 6× throttle + low GPU emulate | Every phase gate |

## 5. Screenshot Workflow → `imgs/`

```
imgs/
├── phases/          # phase-gate evidence (01-scaffold/, 02-hero/ …)
├── submission/      # SUBMISSION-CHECKLIST §B shot list (final polish shots)
├── mobile/          # device-toolbar captures
├── a11y/            # contrast checks, reduced-motion poster mode
├── perf/            # lighthouse reports (html/pdf), r3f-perf overlays
└── og/              # og.png share card export
```
- Capture with clean state: fresh reload, correct scroll position, no DevTools unless the shot IS about DevTools/perf.
- Name files exactly as checklists specify — they feed straight into the Devpost form.
- Mobile shots: 390×844 @2x device toolbar.

## 6. Regression Sweep (pre-submission, Aug 30)

1. Incognito fresh visit → boot → journey → finale → rewind, zero errors.
2. All fact cards open/close correctly.
3. Reduce-motion ON → poster mode works.
4. Throttled network → ENTER ANYWAY path works.
5. Console spotless on prod build across matrix browsers.
6. Live URL smoke test from a different network (phone LTE).
