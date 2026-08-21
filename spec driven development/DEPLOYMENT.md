# ===== FILE: DEPLOYMENT.md =====
# Deployment: GENESIS.EXE

> **Status:** Deploy target DECISION PENDING (user choice). Dockerfile is a standing requirement but
> is **built in Phase 7 (last)** per user decision — it exists to keep the host swappable in minutes.

---

## 1. Host Comparison

| Criterion | Vercel ⭐ default rec | Netlify | GitHub Pages |
|-----------|---------------------|---------|--------------|
| Free tier fit | ✅ plenty | ✅ plenty | ✅ |
| Setup effort | Git import, zero config for Vite | Similar | Needs Actions workflow |
| Custom headers (CSP/cache) | vercel.json ✅ | netlify.toml ✅ | ❌ limited (no headers API) |
| Preview deploys per push | ✅ | ✅ | ❌ |
| Edge network speed | Excellent | Excellent | Good |
| Lock-in risk | Low | Low | None |

**Decision rule:** if headers matter most → Vercel or Netlify; if absolute simplicity > polish → GH Pages.
Final pick recorded here before Phase 6.

---

## 2. Build Pipeline (identical everywhere)

```
pnpm install --frozen-lockfile
pnpm build          # vite build → frontend/dist
```
- Node 22, pnpm via corepack.
- Output is fully static — any static host works.

---

## 3. Dockerfile (standing requirement)

```dockerfile
# ---- build stage ----
FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable
COPY frontend/package.json frontend/pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile
COPY frontend/ .
RUN pnpm build

# ---- serve stage ----
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK CMD wget -qO- http://localhost/ >/dev/null || exit 1
```

`nginx.conf` essentials:
- `gzip on` for js/css/svg; `try_files $uri $uri/ /index.html` SPA fallback
- Cache: `/assets/*` immutable max-age=31536000; `index.html` no-cache
- Security headers (below)

### Security Headers (all hosts must set)
```
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  media-src 'self' blob:;
  img-src 'self' data:;
  connect-src 'self';
  object-src 'none'; base-uri 'none'
```
(If Google Fonts self-hosted later → drop external style/font directives entirely.)

---

## 4. Host Runbooks

### Vercel (recommended path)
1. Push repo to GitHub (public — source code is a submission requirement anyway).
2. Vercel → Import Project → framework auto-detects Vite.
3. Root directory: `frontend`; build `pnpm build`; output `dist`.
4. Add security headers via `frontend/vercel.json` (headers block mirroring §3).
5. First deploy → preview URL → verify checklist (§6) → promote to production URL.

### Netlify (alternative)
1. Import repo; base `frontend`, command `pnpm build`, publish `frontend/dist`.
2. Headers via `frontend/public/_headers` file (same directives).
3. Verify + promote same as above.

### GitHub Pages (fallback)
1. Actions workflow: setup-node 22 + corepack pnpm → build → deploy `frontend/dist` to `gh-pages`.
2. Set `base` in vite.config to `/<repo-name>/` for asset paths.
3. No custom headers available — CSP handled by meta tag in index.html instead (weaker but acceptable).

---

## 5. OG Image & Share Polish

- Export hero-frame screenshot to `imgs/og/og.png` (1200×630, <300 KB).
- Meta tags per ACCESSIBILITY.md §6 verified with metatags.io-style checker before submission.

---

## 6. Post-Deploy Verification Checklist

| Check | Expected |
|-------|----------|
| URL returns HTTP 200 | ✅ |
| Boot screen paints < 1.5 s (desktop) | ✅ |
| Full journey scroll both directions | ✅ no snap |
| Audio opt-in plays after click | ✅ (never before gesture) |
| iOS Safari + Android Chrome spot check | ✅ ≥ 30 FPS feel |
| Lighthouse desktop run saved to `imgs/perf/` | Performance ≥ 70 |
| og:image renders in link-preview tool | ✅ |
| No console errors/warnings (prod build) | ✅ clean |

## 7. Rollback

Host-side redeploy of previous build (Vercel/Netlify instant rollback) — never hotfix directly in prod dashboard; fix forward through git.
