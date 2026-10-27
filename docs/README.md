# Bref-ui docs

Private static SvelteKit site for component documentation, playgrounds, demos and palette previews.
It is not published to npm.

## Development

Run `bun install` and `bun run dev` from the repository root. Vite serves docs using
public core/themes source exports. Root `check`, `lint` and `build` verify the workspace;
`bun run --workspaces --if-present test` runs the CLI contracts, and `bun run preview`
serves the built documentation.

To build only docs from the root:

```sh
bun run --cwd docs build
```

Docs deploy on every push to `main`, with manual dispatch also available.

## Authoring

Component pages stay in `src/routes/(docs)/<topic>/+page.svelte`, with colocated
`sections.ts` and shared `components/`. Keep live examples and playgrounds explicit;
see the [route contribution rules](<src/routes/(docs)/AGENTS.md>).

The `(docs)` layout owns documentation typography, the `/demo` catalog and palette
previews. Standalone demos at `/demo/todo`, `/demo/house-shop` and `/demo/runner-ai`
use layouts isolated from the docs shell. Get started contains Use the package
(`/library`), Own the code (`/cli`) and Use a prebuilt theme (`/themes`). Import
components and types only through public package exports.

The demo baseline was imported from [bref-ui-themes main at 9f25fa0](https://github.com/feuersteiner/bref-ui-themes/tree/9f25fa03c567c6dea82676f58574444563c787ad).
Full-theme changes remain separate pull requests.
