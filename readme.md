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

The CLI/registry changes are currently local and uncommitted, so they are absent
from the clone above. This section and the copy workflow below require the
development checkout containing those changes.

In that checkout, build a local package:

```sh
bun run build
npm pack --ignore-scripts
```

This produces `bref-ui-2.0.0.tgz`. In an existing Svelte 5.56.1+ project with its
dependencies installed, install that tarball, replacing the example path:

```sh
npm install /path/to/bref-ui-2.0.0.tgz
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
Material Symbols font setup. For palette CSS alone, import `bref-ui/theme.css`
instead; it supplies no fonts or reset. The current package declares a Material
Symbols font dependency, so zero runtime dependencies beyond Svelte remains a goal.

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

## Copy components into a project (WIP)

The local package includes the `bref` executable. After installing the tarball,
preview and accept the setup and Button copies:

Import `src/lib/bref/button/button.svelte` directly and import
`src/lib/bref/theme.svelte` once, using paths relative to the host entry/layout.
Button copies include Icon and required types. SvelteKit can use
`--alias '$lib/bref'` during init after its existing sync command.

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
