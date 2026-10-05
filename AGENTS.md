# Contributing to Bref

`AGENTS.md` is authoritative; keep `CONTRIBUTING.md` identical.

## Before starting

- Stay scoped, preserve unrelated changes and ask before large diffs. Communicate briefly.
- Let the human's review pace govern coding patterns, speed and scope at all times.
  Default to one small, reviewable step: explain it, make the scoped change, show the
  diff and checks, then wait for human approval before the next step. Do not batch
  tickets or expand implementation unless the human explicitly authorizes it.
- Read the assigned ticket, [delivery workflow](.tasks/README.md) and
  `references.local.md`. Consult matching components and their coding rules read-only,
  in the order specified there. Report missing references; keep reference names and
  private paths out of tracked documentation.
- Follow the workflow's ownership, independent review and human approval gates.
  Confirm public contracts before implementation; examples below illustrate patterns,
  not approval of new APIs. Never commit, push or publish without authorization.

## Checklist

- [ ] Native component API and source layout agreed
- [ ] Component, necessary types and public exports added
- [ ] Scoped styles use agreed tokens and variants
- [ ] Gallery covers variants, interactions and meaningful states
- [ ] Usage documentation and applicable checks updated

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

Keep npm, registry copies and gallery imports tied to that single source.

### Component registry

Each CLI-installable component owns a `registry.json` beside its canonical source:

```json
{
	"id": "button",
	"files": ["button.svelte"],
	"exports": { "Button": "button.svelte" },
	"dependencies": ["icon"]
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

## 3. Gallery and documentation

Import the canonical component into a gallery demo and compose it from the gallery
page. Keep gallery helpers outside `src/lib`; update existing navigation if applicable.
Cover all public variants, disabled and applicable loading/error states, keyboard
interaction, responsive layouts and light/dark themes.

Document the component in one sentence, list required then optional custom props,
explain native attributes/bindings/snippets, and show minimal usage:

```svelte
<Button disabled={saving} onclick={save}>Save</Button>
```

## 4. Verification

Read `package.json`; run applicable `bun run check`, `bun run lint`, `bun run test`
and `bun run build` (includes packaging). Test meaningful native behavior,
keyboard/focus, SSR/hydration and contrast. Distribution changes also require tarball
inspection and clean npm/CLI Svelte and SvelteKit consumers; copying must preview
changes, resolve dependencies and handle overwrites explicitly.

Record results and independent code/rendered review evidence using
[the ticket template](.tasks/TEMPLATE.md). Static checks do not grant visual approval.
For UI changes, include tightly cropped screenshots of the actual rendered components
in the PR description, showing all available variants and relevant interaction states,
with before/after comparisons when useful. Keep screenshots only in the PR
description—never commit image files or include them in the diff.
For documentation only, check formatting, links, mirror equality and reference ignores.
Authorized commits use a type-plus-emoji prefix such as `fix🐛:`; no agent co-author.
