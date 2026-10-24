# Simhae architecture

`simhae-theme` is the representative repository under the personal `spearkkk` GitHub account. It owns the colour source and public application index. Application repositories remain independent because JetBrains plugins, Chrome themes and Zen CSS have different build and release requirements.

## Ownership

- `palettes/palette.yaml`: editable canonical data; the original four palettes and all their colours are preserved.
- `data/ports.json`: stable application IDs, repository and installation URLs, availability, supported variants and optional screenshot paths. Missing screenshots are omitted, not replaced with images from the old theme.
- `web/`: Next.js App Router with Korean and English messages. It reads shared data at build time, not from a remote API on every request.
- `scripts/`: palette validation and explicit snapshot synchronization.
- `docs/`: the maintenance procedure and structural decisions, understandable without a ticket.

IntelliJ, Chrome and Zen keep an identical palette snapshot plus `palettes/source.json`. Dotfiles keeps the same snapshot in its existing `share/themes/simhae/` path, so bootstrap and existing theme generators continue to work offline. Neovim, Ghostty, fish, SketchyBar, Hammerspoon, btop, k9s, tmux, Starship and Alfred are not split into new repositories.

Snapshot synchronization does not rewrite application-specific colour mappings. Those mappings remain the responsibility of each port. A palette change therefore involves an explicit snapshot update, mapping review and application validation.

## Web

The root request redirects using a saved `simhae_locale` preference, then the browser's weighted `Accept-Language`, then English. `/en` and `/ko` are explicit and do not get overridden. Locale pages are prerendered. Language preference redirects are private and uncached. Asset requests never pass through language redirection.

Vercel builds the `web/` workspace and includes shared files outside that directory. Final typography, illustration, page composition, screenshots and marketing copy are a separate design task. The current screen is only a working data/i18n foundation.

## Migration boundaries

The IntelliJ repository is renamed, but plugin and theme IDs are preserved. Chrome becomes a Git repository; caches and release archives are excluded. Zen keeps its theme ID and existing CSS. Deep Oceanic Next remains unchanged. Public README documents are English; the site supports both Korean and English.
