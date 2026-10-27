# Contributing to bref-ui

## 1. Component structure

Use the agreed canonical layout; the component-folder pattern is:

```text
src/lib/
  button/
    button.svelte
    types.ts          # only for necessary custom types
    registry.json     # CLI installation metadata
  index.ts            # public component exports
  types.ts            # shared types and public type exports
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

## 4. Copy CLI

The following rules apply to `cli/`.

### Modules

- Keep one public function per functional module. A single-file stage stays a named file;
  a stage needing supporting files becomes a folder with `index.ts` as its sole public entry.
- An entry file defines only its public orchestration function, with no other named or
  nested helper functions. Keep its body a readable sequence of calls to named steps;
  put each step in a sibling kebab-case file such as `read-index.ts` or `collect-exports.ts`.
- Internal step files export their functions for the entry to import. These are internal
  imports, not additional public entry points; do not re-export them from `index.ts`.
  General helpers belong in the stage's `utils.ts`. Simple stages stay single files
  when extracting steps would add no meaningful separation.
- Keep helpers private to their stage. Internal helper exports support the stage entry;
  callers outside the stage use its entry point, never helper files.
- Colocate necessary shared types in the owning directory's `types.ts`.
- Preserve existing function contracts. Agree on command behavior and new public APIs
  before implementation; WIP comments describe responsibilities without defining APIs.
- Document public and private functions with JSDoc, including applicable inputs, results
  and failures. Keep remaining placeholders as two-sentence WIP comments.

### Installation and documentation

- Keep registry loading, dependency planning, preparation and preview free of writes.
- Copy component sources from the canonical registry. Keep type imports in `bref-ui/types`
  and destination barrel exports limited to components.
- Preview changes and require explicit overwrite decisions before applying conflicts.
- Update the owning directory's README when a workflow changes. Keep the overview concise;
  show function calls in directory diagrams and mark proposed wiring and WIP stages.
- For documentation changes, check formatting, relative links and consistency with source
  and JSDoc. Follow the root review and authorization gates.

The orchestration pattern is:

```ts
import { stepA } from './step-a.js';
import { stepB } from './step-b.js';
import { stepC } from './step-c.js';

export const doSomethingImportant = () => {
	const input = stepA();
	const result = stepB(input);
	return stepC(result);
};
```
