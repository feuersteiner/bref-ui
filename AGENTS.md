# Contributing to Bref

**Svelte-first.** Bref-ui is modern Svelte with no runtime dependencies beyond Svelte.
Components are built from familiar HTML and scoped native CSS, forward native attributes,
events, bindings and snippets, and need no class-name vocabulary to use.

**Human-first.** Components are composable, readable and fully
customizable, and their source can be copied into a project to become the project's own
code.

**Agent-first.** Bref-ui is built so agents can discover, compose, customize and verify
interfaces.

## Contribution guidelines

### Before starting

- Stay scoped, preserve unrelated changes and ask before large diffs. Communicate briefly.
- Let the human's review pace govern coding patterns, speed and scope at all times.
  Default to one small, reviewable step: explain it, make the scoped change, show the
  diff and checks, then wait for human approval before the next step. Do not batch
  work or expand implementation unless the human explicitly authorizes it.
- Confirm public contracts before implementation; examples in package rules illustrate
  patterns, not approval of new APIs. Never commit, push or publish without authorization.

## Repository structure

A Bun workspace: run `bun install`, then `bun run dev` at the root to serve docs.
Vite follows the core/themes source exports. Root `check`, `lint` and `build` commands
cover all packages. The published copy CLI runs on Node.js through npm.

- [`core`](core): the `bref-ui` package, with [components](core/src/lib), the
  [copy CLI](core/cli/README.md).
- [`themes`](themes): the `bref-ui-themes` package, one entry point per theme (in progress).
- [`docs`](docs): the static component docs, playgrounds, demos and palette previews.

## Building

- For UI changes, include tightly cropped screenshots of the actual rendered components
  in the PR description, showing all available variants and relevant interaction states,
  with before/after comparisons when useful. Keep screenshots only in the PR
  description—never commit image files or include them in the diff.

### Checklist when adding a component

- [ ] Agree on the component API/types first with the user, keeping it closer to base html (i.e. a `<Button>` component should use just `<button>`)
- [ ] Scoped styles use agreed tokens and variants
- [ ] Add a colocated `docs.ts` satisfying `ComponentDocProps`, register it in `bref-ui/docs`, and verify CLI coverage/examples during packaging.
- [ ] In docs, buil the gallery, covering variants, interactions and meaningful states (with one playground)
