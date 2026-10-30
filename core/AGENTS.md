# Contributing to bref-ui

## 1. Component structure

Use the agreed canonical layout; the component-folder pattern is:

```text
src/lib/
  button/
    button.svelte
    types.ts          # only for necessary custom types
    registry.json     # CLI installation metadata
    docs.ts           # default export satisfying ComponentDocProps
  index.ts            # public component exports
  types.ts            # shared types and public type exports
  types/docs.ts       # ComponentDocProps and FieldDocProps
  docs/index.ts       # dedicated reference catalogue, never a runtime import
```

Use kebab-case filenames, camelCase custom props and PascalCase types. Keep components
presentation-only and small; colocate meaningful private children. Prefer native and
Svelte types over custom aliases. Reuse agreed size, color and variant types.

Forward native attributes/events and preserve applicable bindings, form semantics
and snippets. A minimal native wrapper looks like:

```svelte
<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	let { children, type = 'button', ...attributes }: HTMLButtonAttributes = $props();
</script>

<button {...attributes} {type}>
	{@render children?.()}
</button>
```

Export directly from `src/lib/index.ts`:

```ts
export { default as Button } from './button/button.svelte';
```

Keep npm, registry copies, gallery and `docs` imports tied to that single source.

### Component registry

Each CLI-installable component owns a `registry.json` beside its canonical source:

```json
{
	"id": "button",
	"files": ["button.svelte"],
	"exports": { "Button": "button.svelte" },
	"dependencies": ["icon", "theme"]
}
```

Use a stable, unique kebab-case `id`. List source files relative to the component
folder; paths must stay inside that folder. Map PascalCase component export names to
listed files. Dependencies reference other component IDs and must not form cycles.
Keep type definitions out of copied files; copied components import their types from
`bref-ui/types`. The local UI barrel exports components only.

`cli/registry/load/index.ts` discovers manifests in immediate component folders under a
supplied source root. Its shared loader validates metadata, unique IDs/export names,
file existence and the dependency graph. Development and CLI packaging reuse this
loader; no separate development command is required.

### Component reference

Every public component, including package-only exports, owns a colocated `docs.ts`
with a default export satisfying `ComponentDocProps` from `types/docs.ts`.
Use exactly `description`, `usage` and `props`. `usage` is one Markdown string with
complete fenced Svelte examples plus native behavior, accessibility and customization
guidance. Fields use `FieldDocProps`; document required props first, then optional
props, defaults and bindable state. Register the reference in `docs/index.ts`.
The CLI, `bref-ui/docs`, `/llms.txt` and gallery pages consume this data.
Keep gallery controls/live demonstrations in docs; remove duplicated reference data.
Installation metadata stays in registry.json and is generated at packaging time.
Never import reference data into component runtime code or list it among copied files.
Packaging validates component coverage and compiles/type-checks every usage example.

## 2. CSS patterns

Use scoped native CSS; prefer elements, attributes and state selectors over classes.
Keep `:global()` in explicit theme setup. Reuse agreed public tokens; keep recipe
variables private and centralize values:

```css
button {
	--internal-padding: 0.5rem 1rem;
	padding: var(--internal-padding);
}

button[data-size='small'] {
	--internal-padding: 0.25rem 0.5rem;
}
```

Resolve color once into component variables; variants reuse those variables for
foreground, background, border and interaction states. Avoid duplicating recipes
per color. Preserve visible focus, accessible names and usable touch targets.

Fonts, resets and icon assets stay opt-in. Generate light/dark theme CSS in tooling;
no runtime color-generation dependencies. Explicit overrides win; validate final
contrast pairs and report failures without silently replacing inputs.

## 3. Verification

Run `bun run check`, `bun run lint` and `bun run build` (includes packaging) here; when
public exports change, also run `check` and `build` in `docs` and `themes`. Test
meaningful native behavior, keyboard/focus, SSR/hydration and contrast. Distribution
changes also require tarball inspection and clean npm/CLI Svelte and SvelteKit
consumers; copying must preview changes, resolve dependencies and handle overwrites
explicitly.
