# Simhae

- `palettes/palette.yaml` is the only editable palette source. Keep all 24 values in each variant unless explicitly changing the palette.
- Consumers carry snapshots and `source.json`; update them with `npm run sync:palette` after committing the canonical palette.
- `data/ports.json` owns application links and availability. Do not reuse Deep Oceanic Next marketplace IDs.
- `web/` is a bilingual Next.js foundation. Final visual design and marketing copy are intentionally deferred.
- Run `npm test`, `npm run validate`, `npm run lint`, `npm run build`, `npm run typecheck`, and `npm run test:e2e` before delivery.
- Do not commit generated build output, caches, credentials, or screenshots of private code.
