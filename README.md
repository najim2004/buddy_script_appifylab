# My Business — Frontend

Industry-grade, feature-based **Next.js 16** application.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Redux Toolkit · RTK Query · Socket.IO · React Hook Form + Zod · next-themes

---

## Getting Started

```bash
pnpm install
cp .env.example .env.local   # then edit the values
pnpm dev                     # http://localhost:3000
```

| Script              | What it does                      |
| ------------------- | --------------------------------- |
| `pnpm dev`          | Start the dev server (Turbopack)  |
| `pnpm build`        | Production build                  |
| `pnpm start`        | Run the production build          |
| `pnpm lint`         | Run ESLint                        |
| `pnpm typecheck`    | Type-check with `tsc --noEmit`    |
| `pnpm format`       | Format the codebase with Prettier |
| `pnpm format:check` | Check formatting without writing  |

### Environment variables

All client-side vars must be prefixed with `NEXT_PUBLIC_`. They are validated at runtime with Zod in `src/lib/env.ts` — the app will refuse to start if any are invalid.

| Variable                 | Description             |
| ------------------------ | ----------------------- |
| `NEXT_PUBLIC_API_URL`    | REST API base URL       |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.IO server URL    |
| `NEXT_PUBLIC_APP_NAME`   | Display name of the app |

---

## Architecture at a glance

This project uses a **feature-based (modular) architecture**, not a page-based one. Three rules keep it scalable:

1. **`app/` is for routing only** — business logic lives in `features/`.
2. **Colocation** — everything a feature needs (UI, hooks, state, API, types) lives inside that feature's folder.
3. **Public API via barrels** — each feature exposes only what it wants through its `index.ts`; import features through that barrel, never reach into their internal files.

> **Dependency direction:** `app/` → `features/` → `lib/` + `store/` + `components/ui`. Lower layers never import from higher ones.

---

## Folder structure — what goes where & why

```
frontend/
├── src/
│   ├── app/            # Routing layer (App Router)
│   ├── components/     # Shared UI used across many features
│   ├── features/       # Self-contained business modules ⭐ (the heart of the app)
│   ├── store/          # Global Redux store wiring
│   ├── lib/            # Framework-agnostic core: api client, socket, env, utils
│   ├── hooks/          # Generic, reusable React hooks
│   ├── config/         # Static app configuration (nav, site metadata)
│   └── types/          # Global / shared TypeScript types
├── proxy.ts            # (root) Edge/Node request handling — formerly "middleware"
├── components.json     # shadcn/ui config
└── .env.local          # Local environment variables
```

### `src/app/` — Routing only

The Next.js App Router. **Only put routing concerns here**: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, route groups, and route handlers (`api/`). Pages should be thin — they import UI and logic from `features/` and `components/`.

- **Route groups** like `(auth)/` organize routes and share a layout _without_ adding a URL segment.
- `layout.tsx` (root) wires in the global `<Providers>`.
- **Why:** keeping routing separate from logic means you can restructure URLs without touching business code, and features stay reusable across routes.

### `src/features/` — Business modules (⭐ most important)

Each feature is a vertical slice owning its full stack. Standard sub-folders:

| Sub-folder    | Holds                                                | Why                                       |
| ------------- | ---------------------------------------------------- | ----------------------------------------- |
| `components/` | Feature-specific React components (e.g. `LoginForm`) | UI that only this feature uses            |
| `hooks/`      | Feature hooks (e.g. `useAuth`, `useChatSocket`)      | Encapsulate feature logic                 |
| `api/`        | RTK Query endpoints via `apiSlice.injectEndpoints`   | Colocated, code-split data layer          |
| `store/`      | Redux slice (`*.slice.ts`)                           | Local client state for the feature        |
| `schemas/`    | Zod schemas for forms/validation                     | Single source of truth for shapes + types |
| `types/`      | Feature TypeScript types                             | Domain models for this feature            |
| `index.ts`    | **Barrel** — the feature's public API                | Controls what the outside can import      |

> **Rule:** import a feature only through its `index.ts` (e.g. `import { LoginForm } from "@/features/auth"`). Never import `@/features/auth/components/login-form` from outside the feature.

Current features: `auth` (login, slice, RTK Query + auto-refresh) and `chat` (Socket.IO real-time example).

### `src/components/` — Shared UI

Components used by **two or more** features. (Feature-only components belong in that feature.)

| Sub-folder   | Holds                                                                                                     |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| `ui/`        | **shadcn/ui** primitives (button, input, card, form…). Generated by the CLI — edit freely, they're yours. |
| `providers/` | All client-side context providers (`redux`, `theme`, `auth`, `socket`) composed in `providers/index.tsx`  |
| `common/`    | Shared composite components (e.g. `ThemeToggle`); add `layout/` here for `Navbar`/`Sidebar`/`Footer`      |

**Why a single `providers/index.tsx`:** keeps the root `layout.tsx` clean — it just renders `<Providers>` and never grows as you add more context.

### `src/store/` — Global Redux wiring

The plumbing that assembles state; **slices themselves live in their features**.

| File              | Purpose                                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------------------------- |
| `index.ts`        | `makeStore()` factory (per-request, SSR-safe) + middleware composition                                                |
| `root-reducer.ts` | Combines `apiSlice.reducer` + every feature reducer                                                                   |
| `hooks.ts`        | Typed `useAppDispatch` / `useAppSelector` / `useAppStore` — **always use these** instead of the raw react-redux hooks |
| `middleware/`     | Custom middleware (e.g. `socket.middleware.ts` bridges auth actions to the socket lifecycle)                          |

### `src/lib/` — Core, framework-agnostic utilities

Low-level building blocks with no UI.

| Path                      | Purpose                                                         |
| ------------------------- | --------------------------------------------------------------- |
| `api/api-slice.ts`        | Root RTK Query API; features extend it with `injectEndpoints`   |
| `api/base-query.ts`       | `fetchBaseQuery` + automatic JWT refresh on 401 (mutex-guarded) |
| `api/error.ts`            | Normalizes RTK Query errors into readable messages              |
| `socket/socket-client.ts` | Singleton Socket.IO client + `connect`/`disconnect` helpers     |
| `env.ts`                  | Zod-validated, type-safe environment variables                  |
| `constants.ts`            | App-wide constants (routes, storage keys, defaults)             |
| `utils.ts`                | Helpers like `cn()` (Tailwind class merger)                     |

### `src/hooks/` — Generic reusable hooks

App-wide hooks **not** tied to any feature: `use-debounce`, `use-media-query`, `use-mounted`. (A hook used by only one feature belongs in that feature's `hooks/`.)

### `src/config/` — Static configuration

Plain data, no logic: `site.ts` (app metadata) and `nav.ts` (navigation items). Centralizing config makes it easy to change labels/links in one place.

### `src/types/` — Global types

Cross-cutting TypeScript types: `api.types.ts` (shared API response/pagination shapes) and `global.d.ts` (ambient declarations like `ProcessEnv`). Feature-specific types stay inside their feature.

### `proxy.ts` (project root) — request handling

> In **Next.js 16** the `middleware` file convention was renamed to **`proxy`** (file `proxy.ts`, exported function `proxy`, runs on the Node.js runtime). It runs before a request reaches your routes — ideal for **auth route protection**, redirects, and header rewrites.

```ts
// proxy.ts (root, same level as src/app)
import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // e.g. redirect unauthenticated users away from protected routes
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

---

## Adding a new feature

1. Create `src/features/<name>/` with the sub-folders you need (`components/`, `hooks/`, `api/`, `store/`, `types/`, `schemas/`).
2. Add the slice's reducer to `src/store/root-reducer.ts`.
3. Add RTK Query endpoints via `apiSlice.injectEndpoints` in `api/<name>.api.ts`.
4. Export the public surface from `src/features/<name>/index.ts`.
5. Build routes in `src/app/` that import from the feature barrel.

---

## Session persistence (auth)

Tokens are **never stored in `localStorage`** (which is vulnerable to XSS). Instead:

- The **access token** lives only in Redux memory.
- The **refresh token** lives in an httpOnly cookie set by the backend.
- On app load, `AuthProvider` calls `/auth/me`. If the access token is missing/expired, the request returns 401 and `base-query.ts` performs a **silent refresh** using the cookie, then retries — restoring the session after a page reload without exposing tokens to JS.

> Your backend must expose `POST /auth/refresh` (reads the httpOnly cookie, returns a new `accessToken`) and `GET /auth/me`.

## Error handling

| Layer             | File / mechanism                                                      |
| ----------------- | --------------------------------------------------------------------- |
| Route errors      | `src/app/error.tsx` (per-segment boundary with `reset()`)             |
| Root layout crash | `src/app/global-error.tsx`                                            |
| 404               | `src/app/not-found.tsx`                                               |
| Loading UI        | `src/app/loading.tsx` (Suspense fallback)                             |
| API errors        | `getApiErrorMessage()` in `src/lib/api/error.ts` → surfaced via toast |

Hook your observability tool (e.g. Sentry) into the `console.error` calls in `error.tsx` / `global-error.tsx`.

---

## Conventions

- **Imports:** always use the `@/` alias (`@/*` → `src/*`). Import features via their barrel.
- **Naming:** files/folders `kebab-case`; React components `PascalCase`.
- **Server vs Client:** components are Server Components by default; add `"use client"` only when you need state, effects, Redux, or the socket.
- **Forms:** React Hook Form + Zod resolver + shadcn `<Form>`.
- **Data fetching:** RTK Query (never raw `fetch` in components).
- **Formatting:** Prettier (`pnpm format`) with the Tailwind class-sorting plugin.
