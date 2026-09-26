# Bref v2

A minimal Svelte 5 UI library built with native scoped Svelte CSS. Familiar HTML
names and behavior, small public APIs, and presentation-only components are the goal.

## Principles and planned scope

- Buttons, inputs/textarea, icons, pills, tree views, and loading/progress first.
- Preserve native attributes/events, applicable bindings and Svelte snippets.
- Share variant conventions; customize through CSS custom properties.
- Keep business logic outside components; fonts, resets and icon assets are optional.

Planned theming accepts defaults, a minimal seed such as a primary color, or detailed
tokens. NPX-style tooling will generate static CSS shades, semantic tokens,
contrast-aware foreground/background pairs, hover/active states, and light/dark
values. Color-generation dependencies stay outside browser runtime. Explicit
overrides win; failing contrast combinations must be validated and reported.
Arbitrary input is not guaranteed accessible.

One canonical component source will feed npm packaging, a shadcn-style copy
registry, and the gallery. A small planned CLI will provide `init`, `add` and
`theme`, dependency-aware copying, previews, and explicit overwrite handling.
These are intended capabilities, not available commands.

See [the delivery plan and ticket workflow](tasks/README.md).
