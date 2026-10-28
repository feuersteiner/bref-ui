# bref-ui-themes

Reusable themes for [Bref-ui](../readme.md), each intended to have its own public
entry point. Theme implementations are reviewed in separate pull requests.

The Todo, House Shop and RunnerAI demos use canonical Bref components and palette
configuration. Their sources and previews live in [docs](../docs/README.md).

## Installation

Install [bref-ui-themes from npm](https://www.npmjs.com/package/bref-ui-themes) in a Svelte 5 app:

```sh
npm install bref-ui bref-ui-themes
```

Bref-ui 3 and Svelte 5 are peer dependencies. The custom text font remains optional.

Import components from the theme's entry point:

```svelte
<script>
	import { Theme, Button } from 'bref-ui-themes/new-paris';
</script>

<Theme><Button label="Save" /></Theme>
```

## Development

Run `bun install` and `bun run dev` from the repository root. The docs site consumes
public workspace source exports directly. Package-level `check`, `build` and `prepack`
remain available here; `src/lib` holds published sources and `src/routes` is only
a local library preview.

Packing includes this README and a generated copy of the repository MIT license.
Edit the root license; generated package copies are ignored.

Shared types come directly from `bref-ui/types` and are re-exported as types from
`bref-ui-themes`. The root entry does not aggregate components or load theme CSS.
New Paris depends on Material Symbols and loads its variable fill font through Theme.

## New Paris

Black and ivory controls, serif typography and opaque paper overlays. All twenty components are exported through the theme subpath.

Material Symbols icons load automatically with Theme. The custom text font, Inter,
is optional to avoid adding unused font assets to apps; text falls back to system
fonts. To match the gallery typography, install and import Inter:

```sh
npm install @fontsource-variable/inter
```

```svelte
<script>
	import '@fontsource-variable/inter/index.css';
	import { Theme, Button } from 'bref-ui-themes/new-paris';
</script>

<Theme><Button label="Save" /></Theme>
```

The gallery uses the same public package exports at `/themes/new-paris`.
