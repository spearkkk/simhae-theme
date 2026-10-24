# Simhae web foundation

Next.js App Router with Korean and English routes. Visual design and final copy are deferred.

Run commands from the repository root: `npm ci`, `npm run dev`, `npm run build`, `npm run typecheck`, `npm run lint`, `npm run test:e2e`.

Vercel: Root Directory `web`; enable **Include source files outside of the Root Directory in the Build Step** so `palettes/`, `data/`, and the shared validator are available. Use npm and the committed root lockfile. No secrets or external services are required. Do not use static export: `/` negotiates language on the server.

## shadcn/ui and project agents

The official Skill is checked into `../.agents/skills/shadcn/`, and project-only Codex MCP configuration is in `../.codex/config.toml`. Open a new Codex session in `simhae-theme` and trust this project to load its MCP configuration. No global MCP definition is needed. `mise`, Node 24, and `npm ci` are prerequisites. The MCP launcher resolves the active Git repository root and enters its `web/` directory, so root, nested-folder and worktree sessions use the correct application. This avoids differences in relative `cwd` handling between Codex runtimes.

The MCP launches the project-pinned shadcn CLI with `npx --no-install`; it does not install an unrelated version at startup. MCP tools were checked with a real stdio handshake and `get_project_registries`. The CLI's `codex mcp get/list` may show user-level entries only; inspect the project configuration in a project Codex session.

From `web/`, inspect and add components with:

```sh
npx --no-install shadcn info --json
npx --no-install shadcn docs button card
npx --no-install shadcn add tabs
```

Button, Card, Badge, Alert and Separator are installed from the official Radix Nova registry and used by the foundation page. The palette is supplied once on the HTML root; `globals.css` maps it to background, foreground, primary, card, border and other semantic tokens. The language switcher uses Button links, retaining real URLs and the saved preference.

Production builds use Next.js's supported Webpack builder (`next build --webpack`). Turbopack's PostCSS worker failed to bind its helper port in the restricted execution environment; Webpack builds the same Tailwind/shadcn source successfully. This does not require a change to Next.js or the canonical palette.
