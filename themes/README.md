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

The root entry does not aggregate themes or load their CSS. New Paris uses Bref’s
public types and includes its required Inter and Material Symbols font assets.

## New Paris

Black and ivory controls, serif typography and opaque paper overlays. All twenty components are exported through the theme subpath:

```svelte
<script>
	import { Theme, Button } from 'bref-ui-themes/new-paris';
</script>

<Theme><Button label="Save" /></Theme>
```

The gallery uses the same public package exports at `/themes/new-paris`.
