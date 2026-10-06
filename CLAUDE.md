# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static portfolio website for Triple Tres (333-RESEARCH) — an AI automation consultancy targeting Mexican SMEs. Built with Next.js 15.2.4 / React 18 / TypeScript, deployed to GitHub Pages via static export (`out/` directory).

## Development Commands

```bash
# From new-webpage-repo/
pnpm dev          # Start dev server at localhost:3000
pnpm build        # Static export → out/
pnpm lint         # ESLint check
```

Deployment is automatic: push to `main` → GitHub Actions builds and deploys to GitHub Pages.

Note: `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds` are both `true` in `next.config.mjs` — the build will not fail on type or lint errors.

## Architecture

### Routing

- `/` — single-page portfolio (all sections in `app/page.tsx`)
- `/cv` — iframe embed of `/public/cv/index.html` (the actual CV HTML file lives in `public/cv/`)

### Internationalization

Two-layer system:

1. **`lib/translations.ts`** — flat object of all copy, keyed by section then field, each with `{ en: "...", es: "..." }`.
2. **`lib/use-translation.ts`** — `useTranslation()` hook resolves dot-path strings against `translations` for the active language.

Usage pattern in components:
```tsx
const { t, language } = useTranslation()
// t("hero.tagline") returns the string for the active language
```

The `t()` function in `lib/i18n-context.tsx` is a stub — do not use it for translations. Always use `useTranslation()` from `lib/use-translation.ts`.

Language state is held in `I18nContext` (localStorage-persisted) and toggled by `components/language-toggle.tsx`.

### Analytics

Umami is loaded via `<Script>` in `app/layout.tsx` (`data-domains="tripl3.dev"`, so localhost and previews are not recorded). Event names and properties are Spanish to match the dashboard.

- `lib/analytics.ts` - typed event map (`EventoMap`), `track()` with an 800ms dedupe, and pure helpers (source, device, bot heuristic, campaign). Tested in `lib/analytics.test.ts`.
- `components/analytics-tracker.tsx` - re-runs per route. Sends `pagina-cargada` + one `umami.identify` per page load, `caso-visto` (case `<article data-caso>` at the viewport center for 4s), and one `sesion-resumen` on tab hide / pagehide / route change (active seconds, scroll, `recorrido`, `seg_<section>` dwell, `sospecha_bot`). Nothing is sent per section or per scroll milestone.
- Clicks: tag elements with `data-evento="<name>"` plus `data-evento-<prop>="<value>"`. Untagged links/buttons fall back to `clic` (`tipo`: nav/externo/descarga/boton) or `cv-abierto`. Use `data-sin-rastreo` on elements whose event is sent from component code (cert modal, contact submit).
- Never use `data-umami-event` in React components: Umami's script auto-sends those clicks and the tracker would double count. It is only used in `public/cv/index.html`, which has no custom tracker.
- Conversion events keep their own names (Umami funnels/goals match on names): `caso-visto`, `caso-enlace`, `cert-abierta`, `cert-verificada`, `cert-descargada`, `post-abierto`, `cv-abierto`, `contacto-iniciado`, `contacto-enviado` (`resultado`), `contacto-canal`.
- `/cv` on GitHub Pages is the iframe wrapper (`app/cv/page.tsx`); `public/cv/index.html` loads Umami with `data-auto-pageview="false"` when embedded (one pageview per CV visit) and sends a `cv-lectura` reading summary.

### Key Components

- `components/mouse-trail.tsx` — canvas-based cursor trail effect (client-only)
- `components/analytics-tracker.tsx` — Umami wrapper (client-only, returns `null`)
- `components/language-toggle.tsx` — EN/ES switcher
- `components/theme-toggle.tsx` — dark/light mode toggle

### Styling

Tailwind CSS 3.4 with CSS variables (HSL) defined in `app/globals.css`. Dark mode is the default theme via `next-themes`. Custom color system — avoid hardcoding colors, use `bg-background`, `text-foreground`, etc.

### Static Export Constraints

- `images.unoptimized: true` — use plain `<img>` or Next.js `<Image>` with explicit dimensions; optimization is disabled
- `basePath` and `assetPrefix` are empty strings — site is served from a custom domain root (`public/CNAME` contains the domain)
- No server-side features (API routes, server actions, middleware) — this is a fully static site

## Repository Notes

- `components/*.backup` and `components/*.old` files are left-over backups — they are not imported anywhere
- Both `package-lock.json` and `pnpm-lock.yaml` exist; use `pnpm` locally
- `public/` contains PDFs (certificates, publications) and images referenced by components
