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

## Documentation routes and shared components

The following rules apply to `src/routes/(docs)/`.

### Structure

```text
src/routes/(docs)/
  +layout.svelte
  +page.svelte
  sections.ts
  components/
    page-container.svelte
    section.svelte
    code-snippet.svelte
    prop-table.svelte
    layout/
      docs-layout.svelte
      sidebar.svelte
      toc.svelte
      navigation.ts
  button/
    +page.svelte
    sections.ts
```

- SvelteKit uses `src/routes` as its route root; `(docs)` groups the docs shell in
  the filesystem only. Public URLs remain `/`, `/button`, etc. Build navigation
  with Kit's `resolve()` using base-relative pathnames (`''`, `'button'`, etc.).
- Each documentation page lives in `<topic>/+page.svelte`.
- Get started contains Use the package (`library/`), Own the code (`cli/`) and Use a prebuilt
  theme (`themes/`), in that declared order. Keep Theme API documentation and its playground
  in `library/`.
- Keep the home page and Demo (`demo/`) under Overview. Demo's index and palette previews use
  the docs shell and scoped palettes. Open app demos in new tabs with standalone layouts and
  a footer link back to Bref docs.
- `+layout.svelte` composes the shared layout component.
- Shared documentation components belong in `components/`.
- Implement page-specific examples directly in `<topic>/+page.svelte`.
- Do not create `examples/` directories or trivial demo wrappers. Extract a helper
  only for meaningful reuse or complexity; file count alone is not a reason.
- Use kebab-case filenames, camelCase props and PascalCase types.
- Colocate necessary types and meaningful private children.
- Add files only when needed.

### Component responsibilities

- **Layout:** site shell and responsive arrangement.
- **Sidebar:** grouped page links and the active page’s ToC.
- **ToC:** links to sections within the current page, beneath its active sidebar item.
- **Page:** article, page heading, introduction and document metadata.
- **Section:** titled content section with a stable, unique anchor.
- **CodeSnippet:** escaped source in `pre`/`code`, with copy feedback.
- **PropTable:** prop name, type, required status, default and description.

Keep page navigation data in `components/layout/navigation.ts`.
Each documentation route has a colocated `sections.ts` exporting its `chapter` name
and ordered `sections` (stable IDs and titles). Import these values into the page
and shared navigation/ToC; do not duplicate chapter names or section definitions.

### Documentation

- Start with a one-sentence description.
- Use `PropTable` to list required props first, then optional props.
- Let `PropTable` document defaults; avoid repeating them in prose.
- Briefly explain supported native attributes, events, bindings and snippets.
- Document the implemented API accurately.
- Keep route content explicit and easy to read.

### Examples and manual testing

- Every implemented component page is both usage documentation and a debugging/testing gallery.
- Include enough live examples to exercise every public prop, every supported size,
  color and variant, omitted/default values, and both values of boolean props.
- Show matrices for combinations that affect rendering (such as color × variant,
  size × kind, and icon size × color × fill).
- Keep the main theme control in the documentation navbar. All pages and demos follow that shared mode.
  The library guide may include a second control bound to the same state. Do not
  duplicate demos per theme or force contrasting demo backgrounds; switch the shared
  control to test light, dark and system modes.
- Provide local interactive controls to combine props and test scenarios beyond
  the fixed examples. Keep representative examples visible without interaction.
- Cover meaningful compositions, long content, native attributes/events, supported
  bindings/snippets, disabled and applicable pending/error states. Do not invent
  props or states that the component does not implement.
- Make native behavior testable: keyboard focus/activation, form submit/reset and
  accessible naming where applicable. Examples must fit narrow screens.
- Load required assets and theme setup so live examples actually render correctly.
- Import components through the public `bref-ui` and `bref-ui/types` exports.
- Show minimal, copyable usage with `CodeSnippet`.
- Keep displayed code consistent with the live example.
- Keep any demo state local.

### Composition and styling

- Use typed Svelte snippets for content composition.
- Keep components focused and custom props minimal.
- Use scoped CSS, semantic selectors and existing theme tokens.
- Keep fonts, resets and global styles in explicit site theme setup.
- Contain wide code blocks and tables without overflowing the page.
- Preserve readable content widths and usable mobile layouts.

### Accessibility

Use semantic HTML, logical headings, labeled controls and visible keyboard focus.
Keep navigation and examples usable with a keyboard.
