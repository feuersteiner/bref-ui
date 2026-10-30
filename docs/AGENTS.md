# Contributing to the Bref-ui docs

## Site

- Keep the site static: every route must prerender with `@sveltejs/adapter-static`.
  Build links with Kit's path helpers.
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

Whenever a public component is added, changed or removed, update its colocated core
`docs.ts` and the `bref-ui/docs` catalogue, then update navigation and verify `/llms.txt`.
Use the shared description, usage and props in gallery pages. Do not author component
reference data or static usage strings again in this package. Keep live galleries,
playground controls and their generated preview source in docs.
The library guide also consumes the separate ThemeModeToggle reference.
`/llms.txt` renders all shared references, including package-only components, without
maintaining another list of descriptions, props or examples.
