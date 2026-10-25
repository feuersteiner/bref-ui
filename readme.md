# Bref-ui

A Svelte-first, human-first, agent-first UI library for building beautiful sites
and apps with components you can make your own.

[![npm](https://img.shields.io/npm/v/bref-ui?logo=npm)](https://www.npmjs.com/package/bref-ui)
[![Discord](https://img.shields.io/badge/Discord-Join-5865F2?logo=discord&logoColor=white)](https://discord.gg/JpgQRTUsVS)
[![MIT license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

Ready-made themes and complete site demos are hosted in
[bref-ui-themes](https://github.com/feuersteiner/bref-ui-themes), the companion package
for Bref-ui. [Explore the themes showcase](https://feuersteiner.github.io/bref-ui-themes/).

https://github.com/user-attachments/assets/09b9a73d-c6fb-4e8d-b4f5-2267c4552ad7

## Get started

### Install

In an existing Svelte 5.56.1+ or SvelteKit project:

```sh
npm install bref-ui
```

Import components directly from `bref-ui`. Bun and local packaging are not required.

### Use components

Render `Theme` once in the application root (`src/routes/+layout.svelte` in SvelteKit
or `src/App.svelte` in a plain Svelte app). It opts into the palette, reset and
Material Symbols font setup. If already configured, import only `Button` where needed.

Minimal `.svelte` example:

```svelte
<script lang="ts">
	import { Button, Theme } from 'bref-ui';
</script>

<Theme />
<Button label="Save" />
```

Button accepts text through `label` and a click handler through `onClick`. See the
[Button documentation](https://feuersteiner.github.io/bref-ui/button) for the full API.

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

[Watch Bref-ui in 60 seconds](https://feuersteiner.github.io/bref-ui/#why-bref-ui): themes,
scoped Svelte CSS, npm installation and CLI source ownership.
The [demo video](static/bref-ui-demo.mp4) is also available in this repository.

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

## Copy components into a project (optional)

The optional `bref-ui` CLI requires Bun to copy editable component source into a
project. After `npm install bref-ui`, run commands from the project's root:

```sh
bun run bref-ui init
bun run bref-ui add button
bun run bref-ui --help
```

`init` adds a `#bref` subpath import to `package.json` and leaves existing `#bref`
entries untouched:

```json
"imports": {
	"#bref": "./src/lib/ui/index.js",
	"#bref/*": "./src/lib/ui/*"
}
```

The default destination is a `ui` directory inside the project's `#lib/*` target, or
`src/lib/ui` without one. Edit both `#bref` entries to change the destination; `add`
copies into the directory mapped by `"#bref/*"`.

Upgrading from v2: `bref.config.json` and `$lib` paths are no longer read. Run
`bun run bref-ui init`, point both `#bref` entries at the directory your `ui` setting
used (for example `$lib/ui` becomes `./src/lib/ui`), delete `bref.config.json` and
import copied components from `#bref`.

`add <component>` copies the component and its registry dependencies, then merges
component exports into the destination's `index.ts`. Button includes Icon and Theme.
The preview lists `add`, `unchanged` and `conflict` files. Each conflicting file
requires overwrite approval, followed by a final installation confirmation. Declining
a prompt cancels without writes; identical files are skipped.

Use the copied components in a `.svelte` file:

```svelte
<script lang="ts">
	import { Button, Theme } from '#bref';
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

Explore the [component gallery](https://feuersteiner.github.io/bref-ui/) for examples,
props and theme customization.

To run the gallery locally, use Bun and Node 22.12+ within Node 22, or Node 24:

```sh
git clone https://github.com/feuersteiner/bref-ui.git
cd bref-ui
bun install
bun run dev
```

Open the URL printed in the terminal.
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
