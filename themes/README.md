# bref-ui-themes

Reusable themes for [Bref-ui](https://github.com/feuersteiner/bref-ui#readme):
New Paris, VS Code, Glassy and Crystal Code, each with its own public entry point.

The Todo, House Shop and RunnerAI demos use canonical Bref components and palette
configuration. Their sources and previews live in [docs](../docs/README.md).

[Watch the 60-second demo](https://github.com/feuersteiner/bref-ui/raw/c31d50d44163d28ceb4c068d4819af9416538257/docs/static/bref-ui-demo.mp4)

See New Paris shopping, the ADE workbench with VS Code styling and a Glassy
workspace in action. The [video app and storyboard](https://github.com/feuersteiner/bref-ui/tree/main/video-demo#readme)
are part of this repository.

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

## Glassy

Translucent controls and frosted overlays with scoped component styling. All twenty components are exported through the theme subpath:

```svelte
<script>
	import { Theme, Button } from 'bref-ui-themes/glassy';
</script>

<Theme><Button label="Save" /></Theme>
```

Material Symbols icons load automatically with Theme. Inter remains optional; to
match the gallery typography, install `@fontsource-variable/inter` and import
`@fontsource-variable/inter/index.css` in the app.

The gallery uses the same public package exports at `/themes/glassy`.

## Crystal Code

Light and dark frosted workbench controls with a complete component reference. All twenty components are exported through the theme subpath:

```svelte
<script>
	import { Theme, Button } from 'bref-ui-themes/crystal-code';
</script>

<Theme><Button label="Save" /></Theme>
```

Material Symbols icons load automatically with Theme. Inter remains optional; to
match the gallery typography, install and import it:

```sh
npm install @fontsource-variable/inter
```

```svelte
<script>
	import '@fontsource-variable/inter/index.css';
	import { Theme, Button } from 'bref-ui-themes/crystal-code';
</script>

<Theme><Button label="Save" icon={{ name: 'check' }} /></Theme>
```

The gallery uses the same public package exports at `/themes/crystal-code`.

## VS Code

Fixed-dark workbench controls with native interactions and scoped styling. All twenty components are exported through the theme subpath:

```svelte
<script>
	import { Theme, Button } from 'bref-ui-themes/vscode';
</script>

<Theme><Button label="Save" icon={{ name: 'check' }} /></Theme>
```

Material Symbols icons load automatically with Theme. Text uses system fonts, so
no custom text font installation is required.

The gallery uses the same public package exports at `/themes/vscode`.
