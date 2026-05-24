# Daily

> One small thing, every day.

A reminder + routine PWA built mobile-first for iOS. See `docs/PLANNING.md` for the full project plan and `docs/DESIGN.md` for the design system.

## Stack

Next.js 16 · TypeScript · Tailwind v4 · shadcn/ui · TanStack Query · Zustand · Dexie (offline-first) · Serwist (PWA) · Supabase (Postgres + Auth + Edge Functions) · Biome · pnpm.

## Setup

```bash
pnpm install
cp .env.example .env.local   # then fill in Supabase + VAPID keys
pnpm dev                     # http://localhost:3000
```

### Supabase (local, optional)

Requires Docker. Skip if you only need the frontend.

```bash
pnpm db:start                # boots local Postgres + studio
pnpm db:reset                # applies all migrations
```

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Next.js dev server |
| `pnpm build` | Production build (generates `public/sw.js`) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm check` | Biome lint + format check |
| `pnpm format` | Biome write |
| `pnpm no-hex` | Fails if any hex literal sneaks into TS/TSX (tokens-only rule) |
| `pnpm db:start` / `db:reset` | Supabase local |

## Conventions

- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, …). Enforced by commitlint hook.
- **Tokens-only:** never write `#RRGGBB` in TS/TSX — use `var(--color-*)` or Tailwind classes (`text-ink`, `bg-blue`). CI fails otherwise.
- **Folder layout:** see `docs/PLANNING.md` §10.2.

## Status

Phase 1 — Foundation. Screens land in Phase 2 from `docs/App onboarding/`.
