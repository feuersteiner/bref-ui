# bref-ui-themes

Reusable themes for [Bref-ui](../readme.md), each intended to have its own public
entry point. Theme implementations are reviewed in separate pull requests.

The Todo, House Shop and RunnerAI demos use canonical Bref components and palette
configuration. Their sources and previews live in [docs](../docs/README.md).

## Development

Run `bun install` and `bun run dev` from the repository root. The docs site consumes
public workspace source exports directly. Package-level `check`, `build` and `prepack`
remain available here; `src/lib` holds published sources and `src/routes` is only
a local library preview.

Packing includes this README and a generated copy of the repository MIT license.
Edit the root license; generated package copies are ignored.
