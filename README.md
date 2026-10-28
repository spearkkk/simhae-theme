<div align="center">

<img src="web/src/assets/ocean-hero.webp" alt="Light slipping through the deep ocean" width="100%">

# Simhae · 심해

### A palette from the deep.

An ocean-inspired colour theme for the tools you work in every day.

[JetBrains IDEs](https://github.com/spearkkk/simhae-intellij) · [Chrome](https://github.com/spearkkk/simhae-chrome) · [Zen Browser](https://github.com/spearkkk/simhae-zen)

</div>

---

## Have you been in the deep ocean before?

It is a place where light bends and dances, and colours shift and deepen beyond what we can see from the shore. Vast, quiet, and endlessly captivating, the deep ocean is a mystery that feels close even when we have never touched it.

For years, I have been both fascinated and terrified by the ocean. I cannot swim, yet I keep imagining its depths. **Simhae** grew from that contradiction: a palette that moves from near-black water to the glimmers of light that find their way through.

This theme brings a piece of that unknown into your screens and workspaces. A small reminder that wonder can begin before we take the plunge.

## The palette

Simhae is built around **24 colours**, grouped by the roles they play. The `pelagic` palette is the public theme; `trench`, `hadal`, and `benthic` remain available as preserved variants.

<table>
  <tr>
    <td bgcolor="#0A1F2E" width="12%">&nbsp;</td>
    <td bgcolor="#142C3E" width="12%">&nbsp;</td>
    <td bgcolor="#1C3A50" width="12%">&nbsp;</td>
    <td bgcolor="#24425C" width="12%">&nbsp;</td>
    <td bgcolor="#4A6E86" width="12%">&nbsp;</td>
    <td bgcolor="#C6D8E4" width="12%">&nbsp;</td>
    <td bgcolor="#50C4C0" width="12%">&nbsp;</td>
    <td bgcolor="#7896CC" width="12%">&nbsp;</td>
  </tr>
  <tr>
    <td><sub>Background<br><code>#0A1F2E</code></sub></td>
    <td><sub>Surface<br><code>#142C3E</code></sub></td>
    <td><sub>Selection<br><code>#1C3A50</code></sub></td>
    <td><sub>Border<br><code>#24425C</code></sub></td>
    <td><sub>Comment<br><code>#4A6E86</code></sub></td>
    <td><sub>Foreground<br><code>#C6D8E4</code></sub></td>
    <td><sub>Accent<br><code>#50C4C0</code></sub></td>
    <td><sub>Function<br><code>#7896CC</code></sub></td>
  </tr>
</table>

See all 24 colours and their roles in the [palette source](palettes/palette.yaml).

## Across your setup

| Application | Theme | Variants | Status |
| --- | --- | --- | --- |
| JetBrains IDEs | [Simhae for IntelliJ](https://github.com/spearkkk/simhae-intellij) | Pelagic, Trench, Hadal, Benthic | Install from source |
| Chrome | [Simhae for Chrome](https://github.com/spearkkk/simhae-chrome) | Pelagic | Install from source |
| Zen Browser | [Simhae for Zen](https://github.com/spearkkk/simhae-zen) | Pelagic | Install from source |

Each application port has its own repository and release process. Simhae is separate from [Deep Oceanic Next](https://github.com/spearkkk/deep-oceanic-next).

## Use the palette

The canonical palette lives in [`palettes/palette.yaml`](palettes/palette.yaml). To make a palette change, edit and commit that file, then explicitly sync the snapshots in the application repositories. Their source commits are recorded alongside each snapshot; consumers never fetch palette changes on startup.

## Work on the website

The bilingual Next.js site lives in [`web/`](web/). It tells the story behind Simhae, presents the palette, and previews the supported application themes.

```sh
mise install
npm ci
npm run dev
```

Visit `/en` or `/ko` for a specific language; `/` follows a saved preference or your browser language.

Run the project checks before submitting changes:

```sh
npm test
npm run validate
npm run lint
npm run build
npm run typecheck
npx playwright install chromium
npm run test:e2e
```

For the project structure and palette workflow, see [architecture](docs/architecture.md) and [maintenance](docs/maintenance.md). For website deployment settings, see the [web README](web/README.md).
