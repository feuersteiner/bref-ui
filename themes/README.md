# bref-ui-themes

Reusable themes for [Bref-ui](../readme.md), each intended to have its own public
entry point. Theme implementations are reviewed in separate pull requests.

The Todo, House Shop and RunnerAI demos use canonical Bref components and palette
configuration. Their sources and previews live in [docs](../docs/README.md).

## Installation

Install [bref-ui-themes from npm](https://www.npmjs.com/package/bref-ui-themes) in a Svelte 5 app:

```sh
npm install bref-ui-themes
```

Svelte 5 is the only peer dependency. No Bref-ui installation is needed, and fonts
remain optional.

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

The root entry does not aggregate themes or load their CSS. Workspace installation and
packaging copy Bref's public types into private generated files, including icon
names, so the published package does not depend on Bref-ui. After changing shared
types in the workspace, run `bun run --cwd themes prepare` to refresh the copies.
New Paris adds no font dependencies or automatic font imports.

## New Paris

Black and ivory controls, serif typography and opaque paper overlays. All twenty components are exported through the theme subpath.

Fonts are opt-in to avoid bloating the package and apps with unused fonts. Text
falls back to system fonts. To match the gallery typography and render icons,
install and import Inter and Material Symbols directly:

```sh
npm install @fontsource-variable/inter @fontsource-variable/material-symbols-outlined
```

```svelte
<script>
	import '@fontsource-variable/inter/index.css';
	import '@fontsource-variable/material-symbols-outlined/fill.css';
	import { Theme, Button } from 'bref-ui-themes/new-paris';
</script>

<Theme><Button label="Save" /></Theme>
```

The gallery uses the same public package exports at `/themes/new-paris`.
