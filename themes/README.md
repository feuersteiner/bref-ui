# Bref-ui themes

Ready-to-use themes for [Bref-ui](https://github.com/feuersteiner/bref-ui), built
with Svelte 5, native HTML and scoped CSS. Pick a visual style and compose familiar
Bref components through a dedicated theme entry point.

[![npm](https://img.shields.io/npm/v/bref-ui-themes?logo=npm)](https://www.npmjs.com/package/bref-ui-themes)
[![Discord](https://img.shields.io/badge/Discord-Join-5865F2?logo=discord&logoColor=white)](https://discord.gg/JpgQRTUsVS)
[![MIT license](https://img.shields.io/badge/license-MIT-blue)](https://github.com/feuersteiner/bref-ui/blob/main/LICENSE)

Explore the [theme galleries](https://feuersteiner.github.io/bref-ui/themes) for
component examples and interaction states, or browse the
[Bref-ui documentation](https://feuersteiner.github.io/bref-ui/).

[Watch the 60-second demo](https://github.com/feuersteiner/bref-ui/raw/c31d50d44163d28ceb4c068d4819af9416538257/docs/static/bref-ui-demo.mp4)

See New Paris shopping, the ADE workbench with VS Code styling and a Glassy
workspace in action. The [video app and storyboard](https://github.com/feuersteiner/bref-ui/tree/main/video-demo#readme)
are part of this repository.

## Available themes

| Theme                                                                      | Style                                           | Import                        |
| -------------------------------------------------------------------------- | ----------------------------------------------- | ----------------------------- |
| [New Paris](https://feuersteiner.github.io/bref-ui/themes/new-paris)       | Black and ivory, serif headings, paper overlays | `bref-ui-themes/new-paris`    |
| [Glassy](https://feuersteiner.github.io/bref-ui/themes/glassy)             | Translucent controls and frosted overlays       | `bref-ui-themes/glassy`       |
| [Crystal Code](https://feuersteiner.github.io/bref-ui/themes/crystal-code) | Light and dark frosted workbench                | `bref-ui-themes/crystal-code` |
| [VS Code](https://feuersteiner.github.io/bref-ui/themes/vscode)            | Fixed-dark workbench                            | `bref-ui-themes/vscode`       |

Each entry point exports twenty components, including `Theme`, `Button`, form
controls, overlays and navigation. Importing one theme does not load the others.

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

## Community and contributing

Join [Discord](https://discord.gg/JpgQRTUsVS) and use the `bref-ui` channel for
questions and examples. Report bugs and suggest themes through
[GitHub Issues](https://github.com/feuersteiner/bref-ui/issues).

This package lives in the [Bref-ui monorepo](https://github.com/feuersteiner/bref-ui/tree/main/themes).
See [CONTRIBUTING.md](https://github.com/feuersteiner/bref-ui/blob/main/CONTRIBUTING.md)
for contribution guidelines.

## License

[MIT](https://github.com/feuersteiner/bref-ui/blob/main/LICENSE).
