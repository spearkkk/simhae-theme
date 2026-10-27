# Simhae website

The finished bilingual landing page is built with the Next.js App Router. `/ko` and `/en` provide localized copy, palette labels and ending states. `/` negotiates a supported browser language or a saved manual preference. The page moves from the full-screen ocean image through the theme story, palette, code preview and supported application gallery; its final scroll state retains a faint, softened ocean image.

Run commands from the repository root: `npm ci`, `npm run dev`, `npm run build`, `npm run typecheck`, `npm run lint`, `npm run test:e2e`. `npm run validate` checks the canonical palettes and app index; `npm test` runs the Node test suite.

## Deployment

The app builds from the `web/` workspace and reads shared files from the repository root. For Vercel, set Root Directory to `web`, enable **Include source files outside of the Root Directory in the Build Step**, keep the Next.js framework preset, and use npm with the committed root lockfile. No custom `vercel.json` is needed. The Vercel dashboard project settings and a preview deployment still need to be verified. Do not use static export: `/` negotiates language on the server. Set `NEXT_PUBLIC_SITE_URL` when a stable production domain is assigned; otherwise Vercel's `VERCEL_PROJECT_PRODUCTION_URL` provides the metadata origin.

## shadcn/ui and project agents

The official Skill is checked into `../.agents/skills/shadcn/`, and project-only Codex MCP configuration is in `../.codex/config.toml`. Open a new Codex session in `simhae-theme` and trust this project to load its MCP configuration. No global MCP definition is needed. `mise`, Node 24, and `npm ci` are prerequisites. The MCP launcher resolves the active Git repository root and enters its `web/` directory, so root, nested-folder and worktree sessions use the correct application. This avoids differences in relative `cwd` handling between Codex runtimes.

The MCP launches the project-pinned shadcn CLI with `npx --no-install`; it does not install an unrelated version at startup. MCP tools were checked with a real stdio handshake and `get_project_registries`. The CLI's `codex mcp get/list` may show user-level entries only; inspect the project configuration in a project Codex session.

From `web/`, inspect and add components with:

```sh
npx --no-install shadcn info --json
npx --no-install shadcn docs button card
npx --no-install shadcn add tabs
```

Button, Card, Badge, Alert and Separator are installed from the official Radix Nova registry and used by the landing page. The palette is supplied once on the HTML root; `globals.css` maps it to background, foreground, primary, card, border and other semantic tokens. The language switcher uses Button links, retaining real URLs and the saved preference.

Production builds use Next.js's supported Webpack builder (`next build --webpack`). Turbopack's PostCSS worker failed to bind its helper port in the restricted execution environment; Webpack builds the same Tailwind/shadcn source successfully. This does not require a change to Next.js or the canonical palette.
