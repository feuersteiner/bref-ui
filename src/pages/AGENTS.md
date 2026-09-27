# Documentation pages

Root `AGENTS.md` applies. This directory contains documentation routes,
examples and shared documentation components.

## Structure

```text
src/pages/
  AGENTS.md
  +layout.svelte
  +page.svelte
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
    examples/
      basic.svelte
```

- SvelteKit uses `src/pages` as its configured route root.
- Each documentation page lives in `<topic>/+page.svelte`.
- `+layout.svelte` composes the shared layout component.
- Shared documentation components belong in `components/`.
- Page-specific examples and helpers stay beside their route.
- Use kebab-case filenames, camelCase props and PascalCase types.
- Colocate necessary types and meaningful private children.
- Add files only when needed.

## Component responsibilities

- **Layout:** site shell and responsive arrangement.
- **Sidebar:** grouped links between documentation pages.
- **ToC:** links to sections within the current page.
- **Page:** article, page heading, introduction and document metadata.
- **Section:** titled content section with a stable, unique anchor.
- **CodeSnippet:** escaped source in `pre`/`code`, with copy feedback.
- **PropTable:** prop name, type, required status, default and description.

Keep page navigation data in `components/layout/navigation.ts`.
Use the same section IDs and titles for headings and ToC links.

## Documentation

- Start with a one-sentence description.
- Use `PropTable` to list required props first, then optional props.
- Let `PropTable` document defaults; avoid repeating them in prose.
- Briefly explain supported native attributes, events, bindings and snippets.
- Document the implemented API accurately.
- Keep route content explicit and easy to read.

## Example

- Include exactly one simple showcase example per component page.
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
