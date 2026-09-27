# Documentation pages

Root `AGENTS.md` applies. This directory contains documentation routes,
examples and shared documentation components.

## Structure

```text
src/routes/
  AGENTS.md
  +layout.svelte
  +page.svelte
  sections.ts
  components/
    page.svelte
    section.svelte
    code-snippet.svelte
    prop-table.svelte
    layout/
      layout.svelte
      sidebar.svelte
      toc.svelte
      navigation.ts
  button/
    +page.svelte
    sections.ts
```

- SvelteKit uses `src/routes` as its default route root.
- Each documentation page lives in `<topic>/+page.svelte`.
- `+layout.svelte` composes the shared layout component.
- Shared documentation components belong in `components/`.
- Implement page-specific examples directly in `<topic>/+page.svelte`.
- Do not create `examples/` directories or trivial demo wrappers. Extract a helper
  only for meaningful reuse or complexity; file count alone is not a reason.
- Use kebab-case filenames, camelCase props and PascalCase types.
- Colocate necessary types and meaningful private children.
- Add files only when needed.

## Component responsibilities

- **Layout:** site shell and responsive arrangement.
- **Sidebar:** grouped links between documentation pages.
- **ToC:** links to sections within the current page and the shared theme control.
- **Page:** article, page heading, introduction and document metadata.
- **Section:** titled content section with a stable, unique anchor.
- **CodeSnippet:** escaped source in `pre`/`code`, with copy feedback.
- **PropTable:** prop name, type, required status, default and description.

Keep page navigation data in `components/layout/navigation.ts`.
Each documentation route has a colocated `sections.ts` exporting its `chapter` name
and ordered `sections` (stable IDs and titles). Import these values into the page
and shared navigation/ToC; do not duplicate chapter names or section definitions.

## Documentation

- Start with a one-sentence description.
- Use `PropTable` to list required props first, then optional props.
- Let `PropTable` document defaults; avoid repeating them in prose.
- Briefly explain supported native attributes, events, bindings and snippets.
- Document the implemented API accurately.
- Keep route content explicit and easy to read.

## Examples and manual testing

- Every implemented component page is both usage documentation and a debugging/testing gallery.
- Include enough live examples to exercise every public prop, every supported size,
  color and variant, omitted/default values, and both values of boolean props.
- Show matrices for combinations that affect rendering (such as color × variant,
  size × kind, and icon size × color × fill).
- Keep the main theme control in the ToC. All pages and demos follow that shared mode.
  The theme page may include a second control bound to the same state. Do not
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
- Import the component from the canonical library source.
- Show minimal, copyable usage with `CodeSnippet`.
- Keep displayed code consistent with the live example.
- Keep any demo state local.

## Composition and styling

- Use typed Svelte snippets for content composition.
- Keep components focused and custom props minimal.
- Use scoped CSS, semantic selectors and existing theme tokens.
- Keep fonts, resets and global styles in explicit site theme setup.
- Contain wide code blocks and tables without overflowing the page.
- Preserve readable content widths and usable mobile layouts.

## Accessibility

Use semantic HTML, logical headings, labeled controls and visible keyboard focus.
Keep navigation and examples usable with a keyboard.
