# Configuration

[CLI overview](../README.md) · [Configuration types](types.ts) · [JSON schema](schema.json)

## Read configuration

[`readConfig(projectRoot)`](read.ts) reads `bref.config.json` and returns `{ ui }`.
An omitted `ui` defaults to `$lib/ui`; a missing file is an error, not a default configuration.

```mermaid
flowchart TD
    read["readConfig(projectRoot)"] --> json["Read and parse bref.config.json"]
    json --> object{"Root is an object?"}
    object -->|No| error["Throw error"]
    object -->|Yes| supplied{"ui supplied?"}
    supplied -->|No| default["Return ui: $lib/ui"]
    supplied -->|Yes| string{"ui is a string?"}
    string -->|No| error
    string -->|Yes| result["Return supplied ui"]
```

Unreadable files and invalid JSON also reject the operation. Other configuration fields
are not returned.

## Resolve the destination

[`resolveTargetDir(projectRoot, ui, aliases?)`](resolve.ts) returns a normalized absolute
destination without accessing the filesystem. Supplied mappings override `$lib → src/lib`.

```mermaid
flowchart TD
    resolve["resolveTargetDir(projectRoot, ui, aliases)"] --> merge["Merge default and supplied aliases"]
    merge --> sort["Sort aliases by longest prefix"]
    sort --> match{"Exact alias or alias/ prefix matches?"}
    match -->|No| error["Throw unknown-alias error"]
    match -->|Yes| target{"Alias target is absolute?"}
    target -->|No| relative["Base target on projectRoot"]
    target -->|Yes| absolute["Use target directly"]
    relative --> result["Append suffix and normalize absolute path"]
    absolute --> result
```

With defaults, `$lib/ui` resolves to `<projectRoot>/src/lib/ui`. Actual project alias
discovery is deferred; callers must supply overrides. The command connecting reading
and resolution remains WIP.
