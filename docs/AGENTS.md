# Contributing to the Bref-ui docs

## Site

- Keep the site static: every route must prerender with `@sveltejs/adapter-static`.
  Support a configurable base path for GitHub Pages; build links with Kit's path helpers.
- Import components and themes only through the public `bref-ui`, `bref-ui/types` and
  `bref-ui-themes` exports, never from another package's source files.
- Keep site helpers in this package; never add docs-only code to published packages.
- Isolate each skin and theme preview so its styles cannot affect other pages.

## Gallery and documentation

Import the component from `bref-ui` into a gallery demo and compose it from the gallery
page. Keep gallery helpers in this package; update existing navigation if applicable.
Cover all public variants, disabled and applicable loading/error states, keyboard
interaction, responsive layouts and light/dark themes.

Document the component in one sentence, list required then optional custom props,
explain native attributes/bindings/snippets, and show minimal usage:

```svelte
<Button disabled={saving} onclick={save}>Save</Button>
```

### Agent documentation (`/llms.txt`)

Documentation routes and `/llms.txt` references live in `docs/src/routes/(docs)`.
`(docs)` is only a filesystem layout group; public URLs remain `/`, `/button`,
`/llms.txt`, etc. Build navigation with Kit's `resolve()` using base-relative
pathnames (`''` for `/`, `'button'` for `/button`).
Use the package (`/library`) covers setup and Theme; Own the code (`/cli`) covers copied source.

Whenever a public component is added, changed or removed, update its documentation
page's `props` array, navigation and its `src/routes/(docs)/llms.txt/<component>.ts` reference
(`purpose`, optional `setup`, `example`, `props: string`), then verify `/llms.txt`.
Register added or removed references in `src/routes/(docs)/llms.txt/+server.ts`.
Cover every public component separately, including ThemeModeToggle. Keep entries
brief: name, purpose, one working example and all props on one line, required first,
with types and defaults. No tables, subsections, indexes or playgrounds. Format:

````markdown
## ComponentName

Use for <purpose>.

```svelte
<ComponentName requiredProp="value" />
```

Props: requiredProp: string; optionalProp?: boolean = false
````
