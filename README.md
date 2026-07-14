# Buddy Script (Frontend)

Social feed app — Login, Register, and Feed pages (same design as the provided HTML).

---

## What it does

- Sign up (first name, last name, email, password)
- Log in / log out
- Feed only for logged-in users
- Create posts (text + photos/videos)
- Like / unlike posts
- Comments and replies (+ likes)
- See who liked a post
- Public posts → everyone can see  
  Private posts → only the author

---

## Tech

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS
- Redux Toolkit / RTK Query
- Better Auth session (cookie) via backend API

---

## How to run

1. Start the **backend** first (port `4000`)
2. Then:

```bash
pnpm install
pnpm dev
```

Open: http://localhost:3000

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start development |
| `pnpm build` | Production build |
| `pnpm start` | Run production build |

Optional env (defaults are fine locally):

```
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
BACKEND_URL=http://localhost:4000
```

---

## Folder structure (simple)

```
src/app/          → pages (login, register, feed)
src/features/     → auth + feed logic & API
src/components/   → shared UI (navbar, sidebars, buttons…)
src/lib/          → helpers (API, env, images)
```

---

## Notes

- **Boilerplate:** This app is built on top of my personal Next.js boilerplate. Auth wiring, Redux/RTK Query, folder structure, UI primitives, env setup, Socket scaffolding, and other base tooling already came with that starter — this project mostly adds the Buddy Script feed/auth UI and API integration on top of it.
- Design follows the original vanilla HTML pages
- Images use Next.js `Image`
- If the API returns 401, user is logged out and sent to login
- Live URL / demo video: _(add your links here)_

Backend README: see `buddy_script_backend/README.md`
