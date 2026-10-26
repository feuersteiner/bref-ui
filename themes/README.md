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

Theme pull requests add individual subpaths such as `bref-ui-themes/new-paris`.
The root entry does not aggregate themes or load their CSS. The package peers on
workspace-compatible Bref/Svelte versions and supplies the icons used by the imported themes.

## New Paris

Black and ivory controls, serif typography and opaque paper overlays. All twenty components are exported through the theme subpath:

```svelte
<script>
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

The gallery uses the same public package exports at `/themes/glassy`.
