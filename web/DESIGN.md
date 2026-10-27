# Simhae Web UI Contract

This file is the visual source of truth for `web/`. Follow it for every UI change unless the user explicitly asks for a different direction.

## Product character

Simhae is a quiet, deep-ocean color theme for developer tools. Keep the interface calm, precise, and atmospheric. Let the ocean image and the palette carry the character; avoid adding decorative flourishes to every component.

## Tokens

- The canonical colors live in `palettes/palette.yaml` and are mapped to semantic CSS variables in the root layout and `globals.css`.
- In components and application CSS, use semantic tokens such as `--background`, `--foreground`, `--card`, `--border`, `--primary`, and `--muted-foreground` (or their shadcn utility classes).
- Never introduce literal color values for UI styling. Palette swatches are the exception because they display the canonical palette values as content.
- Use the existing shared radius `var(--radius)` and the existing semantic surface roles. Avoid inventing per-card colors, borders, shadows, and radii.

## Layout and spacing

- Use a 4px spacing rhythm: 4, 8, 12, 16, 24, 32, 48, 64, and 80px. For intermediate spacing, first check whether the surrounding layout needs correction.
- Express repeated spacing as shared CSS variables or component utilities. Use `gap` for repeated items; avoid one-off margins on individual children.
- Preserve the established widths: story text `720px`, palette and code preview `900px`, page frame `1160px`. Change them only when the user requests a different hierarchy or responsive evidence supports it.
- Keep a clear vertical rhythm between sections. Section spacing belongs to the section/container, not to its heading alone.
- Support narrow screens from 320px. Collapse multi-column layouts before content becomes cramped; prevent horizontal overflow.

## Components and hierarchy

- Render the brand as `Simhae` with this exact casing. In the header, pair it with a short definition localized to the current page language.
- Use existing components in `src/components/ui` for interactive controls and common surfaces. Compose them in application components; do not recreate buttons, cards, badges, separators, or toasts with styled generic elements.
- Prefer the component's built-in variant and semantic tokens. Add a new variant in the UI component only when the visual behavior is reusable; keep page-specific composition in the application component.
- Use the full Card composition (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`) where applicable.
- Use one consistent heading hierarchy: page sections use `h2`, subsection titles use `h3`, and text labels do not impersonate headings.
- Preserve the existing typography scale and alignment patterns. Do not add a new font, weight, uppercase treatment, or text effect without a clear purpose.

## Surface recipes

- Standard content surface: shadcn `Card` using semantic card and border tokens, shared radius, and no extra decoration.
- Palette groups: use the existing `palette-group` card recipe; keep its title, color grid, and spacing consistent across all groups.
- App gallery cards: use the existing `app-shot-card` recipe. Keep hover motion subtle and disable continuous motion for `prefers-reduced-motion`.
- Do not add accent rails, decorative rules, gradients, or shadows to an individual card. If a new surface treatment is needed, define one reusable recipe here and implement it once.

## Motion and accessibility

- Motion must explain a state change or reinforce the ocean narrative. Keep it restrained and tied to scroll or interaction; avoid unrelated bouncing, parallax, or perpetual animation.
- At the end of the landing story, the ocean overlay first covers the content, then settles over the canonical deepest surface token `--base10` (`#071420` in the main palette), leaving the ocean image faintly visible through the final state.
- Soften the retained image with a restrained blur and a translucent deep-water veil over the entire scene, then show the localized ending marker (`끝.` / `end.`) centered with the existing shadcn `Separator`; keep the marker restrained.
- Honor `prefers-reduced-motion` for all nonessential motion.
- Maintain keyboard operation, visible focus, semantic landmarks, and readable contrast. Never communicate status through color alone.

## UI change checklist

Before implementation, inspect this contract and the nearest existing component/style recipe. Before finishing, check the changed state at desktop and mobile widths, verify the spacing and semantic tokens still follow this contract, and inspect the rendered result for overflow, focus visibility, and reduced-motion behavior.
