# Bref-ui

A Svelte-first, human-first, agent-first UI library for building beautiful sites
and apps with components you can make your own.

[![npm](https://img.shields.io/npm/v/bref-ui?logo=npm)](https://www.npmjs.com/package/bref-ui)
[![Discord](https://img.shields.io/badge/Discord-Join-5865F2?logo=discord&logoColor=white)](https://discord.gg/JpgQRTUsVS)
[![MIT license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

> <small>V2 is in development and has not been published to npm. The npm badge tracks the
> published release; the examples below use the v2 development checkout. Button,
> Icon, Surface, Theme and ThemeModeToggle exist today. Agent skills, site generation
> and live generative UI are planned.</small>

## Get started

### Explore the gallery

Use Bun and Node 22.12+ within Node 22, or Node 24:

```sh
git clone https://github.com/feuersteiner/bref-ui.git
cd bref-ui
bun install
bun run dev
```

Open the URL printed in the terminal. The gallery includes component examples,
props and theme customization on `/button`, `/icon` and `/theme`.

### Use the local package

The package includes the component CLI and canonical sources. Build a local package
from the development checkout:

```sh
bun run build
npm pack --ignore-scripts
```

This produces `bref-ui-2.1.2.tgz`. In an existing Svelte 5.56.1+ project with its
dependencies installed, install that tarball, replacing the example path:

```sh
npm install /path/to/bref-ui-2.1.2.tgz
```

Then use the components in a `.svelte` file:

```svelte
<script lang="ts">
	import { Button, Theme } from 'bref-ui';

	let count = $state(0);
</script>

<Theme />
<Button label={`Count: ${count}`} onClick={() => count++} />
```

The button increments the count when clicked. The current Button uses `label` and
`onClick`; the gallery documents each component's current API.

Render `Theme` once in the application root to opt into its palette, reset and
Material Symbols font setup. The current package declares a Material Symbols font
dependency, so zero runtime dependencies beyond Svelte remains a goal.

### Shared surface styles

Theme composes internal colors, surfaces, fonts and styles components. Surface and
Button use the same paint recipe; apply it to native HTML with the typed helper:

```svelte
<script>
	import { Theme, surface } from 'bref-ui';
</script>

<Theme />
<button class={surface({ variant: 'filled', color: 'primary', shadow: 'small', hover: 'medium' })}>
	Save
</button>
```

All options are optional: variant defaults to neutral and color to foreground;
shadow and hover accept small, medium or large. Shadow also accepts true for medium
and false for none. Set `glass: true` for translucent paint and backdrop blur, or use
`<Surface glass>` and `<Button glass>`; glass defaults to false.
SurfaceProps extends SurfaceBaseProps with component props.
Supply padding, radius and layout
in element styles. The helper adds classes only; Theme loads their CSS. SurfaceBaseProps
is available from `bref-ui/types`. Copied components include the helper in
`theme/surface.ts`; the local UI barrel keeps component exports only.

## Why Bref-ui?

1. **Svelte-first.** The goal is modern components with zero runtime dependencies
   beyond Svelte, built from scoped CSS, familiar HTML, native events, bindings and
   snippets. Readable styles, with no class-name vocabulary to memorize. The
   collection will grow from small UI components to marketing sections and
   complete app interfaces.
2. **Human-first.** Composable components with full control over appearance and
   behavior. Inspired by shadcn's source ownership model, tooling brings component
   source into the project for unrestricted customization. Planned agent skills
   and validation tools help developers adapt components while preserving native
   behavior and accessibility.
3. **Agent-first.** A component collection paired with tools that help agents
   discover, compose, customize and verify interfaces. Planned capabilities include
   complete site generation, generative UI and interactive interfaces for agent
   workflows.

## Copy components into a project

The package includes the `bref-ui` executable, which requires Bun. After installing
the tarball, run commands from the consumer project's root:

```sh
bun run bref-ui init
bun run bref-ui add button
bun run bref-ui --help
```

`init` creates `bref.config.json` and leaves an existing file untouched:

```json
{
	"ui": "$lib/ui"
}
```

The default destination is `src/lib/ui`. Edit `ui` to another `$lib` path, such as
`$lib/bref`, to change the destination. The CLI maps `$lib` to `src/lib`; it does not
discover project aliases or accept an `--alias` option. Configure the same alias
in a plain Svelte project if using `$lib/ui` imports.

`add <component>` copies the component and its registry dependencies, then merges
component exports into the destination's `index.ts`. Button includes Icon and Theme.
The preview lists `add`, `unchanged` and `conflict` files. Each conflicting file
requires overwrite approval, followed by a final installation confirmation. Declining
a prompt cancels without writes; identical files are skipped.

Use the copied components in a `.svelte` file:

```svelte
<script lang="ts">
	import { Button, Theme } from '$lib/ui';
</script>

<Theme />
<Button label="Save" />
```

Keep `bref-ui` installed for shared types imported from `bref-ui/types`. To copy
Theme separately, run `bun run bref-ui add theme`. The copied Theme uses the default
palette and has no `palette` prop; customize its copied CSS tokens. The package
Theme retains its `palette` prop.

Available component IDs: `button`, `checkbox`, `combobox`, `dialog`, `icon`, `pill`,
`pill-choice-group`, `pill-group`, `popover`, `progress`, `select`, `spinner`,
`surface`, `switch`, `text-area`, `text-input`, `theme` and `tree-view`.

## Documentation and demos

Run `bun run dev` in the repository for the gallery and current API documentation.
Explore the [component exports](src/lib/index.ts) and [component source](src/lib)
to inspect and customize the implementation.

## Roadmap

- **Component foundation:** inputs/textarea, pills, tree views, loading/progress,
  static theme tooling and complete npm/copy distribution. Planned theme tooling
  emits the existing light/dark palette with literal primary and per-mode overrides;
  contrast failures are reported without silently replacing inputs.
- **Marketing sites:** reusable sections and design recipes, then validated YAML/JSON
  generation of complete SvelteKit sites with content, assets, routes and metadata.
  Prove a small multipage site in two distinct recipes.
- **Agent tooling:** a machine-readable catalog, skills and shared CLI/SDK operations
  for discovery, validation, planning, preview and repair. Regeneration previews
  changes and detects human-edit conflicts; exported source can become human-owned.
- **Generative UI:** evaluate a Bref catalog on json-render with one interactive
  task, preserving input and focus while invoking registered host actions. Measure
  runtime cost before choosing a renderer and adding one optional host integration.

Generation tooling and agent integrations will be optional. A visual editor,
arbitrary application logic generation and hosted model services are deferred.
Accessibility depends on the final composition, theme and interactions; component
checks and generated CSS do not guarantee that every customization is accessible.

## Community and contributing

For questions and examples, join [Discord](https://discord.gg/JpgQRTUsVS) and use the
`bref-ui` channel. Report bugs and suggest features through
[GitHub Issues](https://github.com/feuersteiner/bref-ui/issues).

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## License

[MIT](LICENSE).
