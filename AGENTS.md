# Simhae

- `palettes/palette.yaml` is the only editable palette source. Keep all 24 values in each variant unless explicitly changing the palette.
- Consumers carry snapshots and `source.json`; update them with `npm run sync:palette` after committing the canonical palette.
- `data/ports.json` owns application links and availability. Do not reuse Deep Oceanic Next marketplace IDs.
- `web/` is a bilingual Next.js foundation. Final visual design and marketing copy are intentionally deferred.
- Run `npm test`, `npm run validate`, `npm run lint`, `npm run build`, `npm run typecheck`, and `npm run test:e2e` before delivery.
- Do not commit generated build output, caches, credentials, or screenshots of private code.

## shadcn/ui

- Use the installed official skill at `.agents/skills/shadcn/SKILL.md` for web UI work. Run the CLI from `web/` so it reads `web/components.json`.
- Prefer existing `web/src/components/ui` components and built-in variants. Compose application UI outside that directory.
- Theme colours are semantic CSS tokens mapped to the canonical pelagic palette on the root layout; do not edit generated component colours individually.
- The MCP definition lives only in `.codex/config.toml`, with its working directory pointing to `web/`.
