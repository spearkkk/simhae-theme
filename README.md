# Simhae · 심해

An ocean-inspired colour theme family. This repository owns the canonical palette, application index and bilingual Next.js site. Each application port has its own repository and release process.

## Repositories

| Repository | Responsibility |
| --- | --- |
| [simhae-theme](https://github.com/spearkkk/simhae-theme) | Palette, documentation and `web/` |
| [simhae-intellij](https://github.com/spearkkk/simhae-intellij) | JetBrains plugin |
| [simhae-chrome](https://github.com/spearkkk/simhae-chrome) | Chrome theme |
| [simhae-zen](https://github.com/spearkkk/simhae-zen) | Zen Browser theme |

The existing four palettes are preserved without colour changes. **Pelagic** is the main palette; Trench, Hadal and Benthic remain available. This project is separate from [Deep Oceanic Next](https://github.com/spearkkk/deep-oceanic-next).

## Development

```sh
mise install
npm ci
npm test
npm run validate
npm run dev
```

The website lives in `web/`, with `/ko` and `/en`. Its root URL selects a supported browser language or a saved manual preference. This is a foundation for a future landing design, not the final visual design.

```sh
npm run lint
npm run build
npm run typecheck
npx playwright install chromium
npm run test:e2e
```

## Palette ownership

Edit `palettes/palette.yaml` here, commit it, and explicitly sync to consumers. Their source commits are recorded next to snapshots; consumers never fetch changes on shell or application startup. No package registry, submodules, or automatic cross-repository releases are required.

See [architecture](docs/architecture.md), [maintenance](docs/maintenance.md), and [Vercel setup](web/README.md).
