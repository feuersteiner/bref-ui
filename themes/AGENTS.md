# Contributing to bref-ui-themes

A demo is a complete application using canonical Bref components and palette
configuration; demos belong in `docs`. A theme owns reusable component styling and
ships through an individual `bref-ui-themes` entry point.

## Themes

- Preserve imported theme implementations. Agree on changes to theme APIs, tokens or
  entry points before implementation.
- Expose each theme through its own package entry point. Importing one theme must not
  load another theme's CSS, and no entry point may import every theme.
- Add explicit direct source export paths for new themes; keep shared type forwarding
  and the package `types` field only at the root.
- Theme styles must not leak. Keep `:global()` in explicit theme setup, scoped to the
  theme, and verify neighbouring components and previews stay unaffected.
- Style Bref-ui through its public tokens and components; import it only through
  `bref-ui` and `bref-ui/types`.
- Custom text fonts and resets stay opt-in. New Paris loads its Material Symbols font
  dependency through Theme. Generate light/dark theme CSS in tooling;
  no runtime color-generation dependencies. Explicit overrides win; validate final
  contrast pairs and report failures without silently replacing inputs.
- Keep `src/lib` for published sources; `src/routes` is a local preview only. Full theme
  previews and demos belong in [docs](../docs/AGENTS.md).
