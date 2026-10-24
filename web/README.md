# Simhae web foundation

Next.js App Router with Korean and English routes. Visual design and final copy are deferred.

Run commands from the repository root: `npm ci`, `npm run dev`, `npm run build`, `npm run typecheck`, `npm run lint`, `npm run test:e2e`.

Vercel: Root Directory `web`; enable **Include source files outside of the Root Directory in the Build Step** so `palettes/`, `data/`, and the shared validator are available. Use npm and the committed root lockfile. No secrets or external services are required. Do not use static export: `/` negotiates language on the server.
