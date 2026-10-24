# Maintaining Simhae

## Change a palette

1. Edit only `palettes/palette.yaml` in `simhae-theme`.
2. Run `npm test` and `npm run validate`; review the exact colour diff.
3. Commit the canonical change before syncing. The source must be committed so the consumer lock identifies reproducible data.
4. Sync explicitly from each consumer's directory:

```sh
node ../simhae-theme/scripts/sync-palette.mjs --source ../simhae-theme --target . --kind port
```

For dotfiles:

```sh
bash setup/sync-simhae.sh ~/Projects/simhae-theme
bash setup/set-theme.sh
```

The sync command reads only local committed data. It records the repository URL, full source commit, canonical path and SHA-256 in `source.json`. It refuses dirty source data, a modified consumer snapshot or an unpinned differing snapshot. Preserve edits and reconcile the palette before retrying; there is deliberately no force option. An identical unpinned file may be adopted during migration.

5. Review the port's existing mappings against the updated snapshot. Updating a snapshot alone does not recolour the app. Do not replace hex strings across backup variants indiscriminately.
6. Run each consumer's checks and commit its snapshot, source lock and mapping changes together.

## Consumer checks

- IntelliJ: `./gradlew check buildPlugin`; preserve `dev.spearkkk.simhae` and theme provider IDs. Test the ZIP in an IDE before marketplace release.
- Chrome: `python3 scripts/build.py`; load `theme/` in Chrome's extension developer mode. ZIPs go in ignored `build/`, not the source tree.
- Zen: `python3 -m unittest discover -s tests`; keep `chrome.css` and `userChrome.css` aligned. Optional `userContent.css` has separate installation.
- Dotfiles: run `bash setup/set-theme.sh` twice. The second run must produce no additional diff. Bootstrap must work without the representative checkout.

Application releases are independent. Update `data/ports.json` to `published` only when a real distribution listing is verified. Never reuse a Deep Oceanic Next marketplace ID for Simhae.

## Web and deployment

Use the repository root commands in README. `npm run build` validates data before building the site. Messages in `web/src/messages/en.json` and `ko.json` must have the same keys. Never fetch the latest palette from GitHub at runtime.

Connect the GitHub repository to Vercel with Root Directory `web`. Enable **Include source files outside of the Root Directory in the Build Step**. This is required for `palettes/`, `data/` and shared validation. Use the committed root npm lockfile; leave the framework preset as Next.js. Preview first; no custom domain is required. Production deployment is separate from app marketplace releases.

## Migration verification

This restructuring must preserve all 96 colour values (24 per variant), existing app mappings, plugin IDs, Zen IDs and dotfiles bootstrap. Read-only palette copies are not new sources of truth. Historical review HTML and Trench previews remain historical material.

## Local handoff

Remote creation/renaming and Vercel deployment are deferred for this handoff. GitHub URLs in the project index use the intended final repository names; new repository links become usable after publication. The renamed local IntelliJ checkout keeps its existing `spearkkk/simhae` remote until the GitHub rename is performed.

When publishing later: create `spearkkk/simhae-theme` and `spearkkk/simhae-chrome`, rename the existing `spearkkk/simhae` repository to `simhae-intellij`, update that local origin, then publish the reviewed branches. Do not create a second IntelliJ repository and discard the existing history. Apply `simhae` and `color-theme` topics, and connect the representative repository's `web/` directory to Vercel using the setup above.
