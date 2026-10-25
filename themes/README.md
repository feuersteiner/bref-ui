# bref-ui-themes

Reusable full themes for [Bref-ui](../readme.md), with an individual public entry
point for each theme. Full-theme implementations are reviewed in separate pull requests.

The current-main Todo, House Shop and RunnerAI skins use canonical Bref components
and palette configuration. Their sources and previews now live in [docs](../docs/README.md),
not in this published package.

## Development

Run `bun install` and `bun dev` from the repository root. Root commands build public
workspace exports before the docs site uses them. Package-level `check`, `build` and
`prepack` remain available here; `src/routes` is only a local library preview.

Packing includes this README and a generated copy of the repository MIT license.
Edit the root license; generated package copies are ignored.
