# Bundled documentation

[CLI overview](../README.md)

`readDocumentation(target, section?)` reads `dist-cli/docs.json`, calls `render`, then prints
the result. It accesses no consumer files, prompts or network services.

```text
documentation/
  index.ts             readDocumentation() → readCatalogue() → render()
  read-catalogue.ts    Read the package-local JSON bundle
  render.ts           Select discovery, workflow or component sections
  format-props.ts     Render required/default/bindable fields
  format-installation.ts  Render existing registry plans and type imports
  types.ts            Bundle shape and supported sections
  cli.md              General installation workflow
```

`docs list` discovers every public component, including package-only exports.
`docs cli` explains package installation, init, add and overwrite decisions.
`docs <component>` prints the full reference; `usage`, `props` and `cli` select one section.
There is no `all` section and dependency references are not expanded.
Unknown IDs/sections fail with an actionable discovery/usage command.
Every response identifies the bundled package version.

During prepack, the existing `cli/pack.ts` bundles the separately compiled `src/lib/docs`
catalogue into `dist-cli/docs.json`. TypeScript checks the shared metadata through
`ComponentDocProps` and `FieldDocProps`; packaging checks public component coverage and
compiles fenced Svelte examples. Existing registry/dependency modules provide installation
plans, and `formatInstallation` renders their files and imports. Public type imports come
from the TypeScript export information. No separate packaging scripts or temporary example
projects are used.

The dedicated `bref-ui/docs` entry exposes the same references for the static docs site
and /llms.txt. Component runtime exports never import reference data.
Design skills are deferred.
