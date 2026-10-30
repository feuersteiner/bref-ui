## Install and use the package

Install in an existing Svelte 5 project:

```sh
npm install bref-ui
# or
pnpm add bref-ui
```

Import packaged components from 'bref-ui' and types from 'bref-ui/types'.
Render Theme once at the app root for tokens, native styles and icon fonts.
Use `bref-ui docs list` to discover IDs and copy availability, then
`bref-ui docs <component> [usage|props|cli]` to read only the needed reference.
Omit the section for the full reference. Dependencies' documentation is never expanded.

## Copy editable source

Run from the consumer project directory:

```sh
npx bref-ui init
npx bref-ui add button
# or, with pnpm
pnpm exec bref-ui init
pnpm exec bref-ui add button
```

init adds '#bref' and '#bref/_' to package.json imports, pointing to
'./src/lib/ui/index.js' and './src/lib/ui/_', or the ui folder under an existing
'#lib/_' alias. Existing #bref mappings are preserved. Edit '#bref/_' to choose
a different destination; no separate configuration file is used.

add requires initialization. It previews every new, changed and unchanged file,
resolves transitive dependencies, and adds component exports to the local barrel.
Each conflicting source or index.ts needs explicit overwrite approval, followed
by final installation approval. Empty input, refusal or closed stdin cancels before writes.
Copied sources import types from 'bref-ui/types', so keep the package installed.
Import copied components from '#bref'; the barrel exports components only.

The copied Theme is a default-only theme: customize its CSS tokens in the copied source.
The packaged Theme accepts palette props. Package-only exports cannot be copied;
read `bref-ui docs <component> cli` for the specific installation reference.

## Read without a project

All docs commands only print bundled references; they never install or modify files.
Once the package is installed, `bref-ui docs list`, `bref-ui docs cli` and component
references work offline without package.json, init or prompts. npm/pnpm may need the
network to obtain the package initially; use the installed executable for offline reads.
Every reference identifies the installed package version.
