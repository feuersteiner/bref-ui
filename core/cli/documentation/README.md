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
  types.ts            Bundle shape and supported sections
  cli.md              General installation workflow
```

`docs list` discovers every public component, including package-only exports.
`docs cli` explains package installation, init, add and overwrite decisions.
`docs <component>` prints the full reference; `usage`, `props` and `cli` select one section.
There is no `all` section and dependency references are not expanded.
Unknown IDs/sections fail with an actionable discovery/usage command.
Every response identifies the bundled package version.

During prepack, `scripts/pack-docs.mjs` consumes the separately compiled `src/lib/docs`
catalogue. It validates coverage, field structure and copy/runtime separation, then compiles
and type-checks all fenced Svelte examples. It generates installation references from the
validated registry, dependency plans and public type exports; no installation metadata belongs
in component docs.ts files. The compiled JSON ships with the executable.

The dedicated `bref-ui/docs` entry exposes the same references for the static docs site
and /llms.txt. Component runtime exports never import reference data.
Design skills are deferred.
