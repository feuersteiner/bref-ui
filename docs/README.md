# Bref-ui docs

Private static SvelteKit site for component documentation, playgrounds, skins and palette previews.
It is not published to npm.

## Development

Run `bun install` and `bun dev` from the repository root. The root command builds and
watches public core/themes exports before serving docs. Root `check`, `lint` and `build`
verify every package; `bun run preview` serves the built documentation.

For a Pages build from the root:

```sh
bun run build:packages
BASE_PATH=/bref-ui bun run --cwd docs build
```

## Authoring

Component pages stay in `src/routes/(docs)/<topic>/+page.svelte`, with colocated
`sections.ts` and shared `components/`. Keep live examples and playgrounds explicit;
see the [route contribution rules](<src/routes/(docs)/AGENTS.md>).

The `(docs)` layout owns documentation typography. `(skins)/skins` contains the
full-page Todo, House Shop and RunnerAI demos and their palette previews, isolated
from that layout. Config and future full themes have separate documentation sections.
Import components and types only through public package exports.

The skin baseline was imported from [bref-ui-themes main at 9f25fa0](https://github.com/feuersteiner/bref-ui-themes/tree/9f25fa03c567c6dea82676f58574444563c787ad).
Full-theme changes remain separate pull requests.
