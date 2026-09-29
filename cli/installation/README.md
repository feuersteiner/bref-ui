# Installation

[CLI overview](../README.md) · [Installation types](types.ts)

Preparation and preview are implemented. [`index.ts`](index.ts), [`copy.ts`](copy.ts) and
[`installed.ts`](installed.ts) remain WIP placeholders in this checkout.

## Prepare source

[`prepareSource(entries)`](prepare.ts) reads planned files and returns `PreparedFile[]`
containing relative destination paths and source content. Paths retain source folder names;
file order follows entries and their manifests.

```mermaid
flowchart TD
    prepare["prepareSource(entries)"] --> files["Build source and destination-relative paths"]
    files --> read["Read each source, concurrently"]
    read --> rewrite["rewriteSource(content, filename)"]
    rewrite --> kind{"Source kind?"}
    kind -->|Svelte| scripts["Parse module and instance scripts, last to first"]
    kind -->|JS or TS| imports["rewriteImports"]
    kind -->|Other| unchanged["Keep original content"]
    scripts --> imports
    imports --> result["Return prepared path and content"]
    unchanged --> result
```

`rewriteImports` redirects relative, type-only imports to `bref-ui/types`, except imports
ending in `.svelte`. Runtime imports and non-relative imports remain unchanged. Relative
non-component imports mixing inline type and value specifiers are rejected. Script edits
preserve other text, including Svelte markup and CSS; read and parsing failures propagate.

## Preview changes

[`previewChanges(files, destination)`](preview.ts) compares prepared content with destination
files without writing. Results retain prepared-file order.

```mermaid
flowchart TD
    preview["previewChanges(files, destination)"] --> read["Read each destination file, concurrently"]
    read --> outcome{"Read result?"}
    outcome -->|ENOENT| add["status: add"]
    outcome -->|Other error| error["Throw error"]
    outcome -->|Content| compare{"Matches prepared content?"}
    compare -->|Yes| unchanged["status: unchanged"]
    compare -->|No| conflict["status: conflict"]
```

Preview reports statuses only; it does not request approval or perform copying.

## Copy files — WIP

The separate copying task targets explicit approved overwrite paths, skipping identical
files and rejecting unapproved conflicts before any writes. This is the intended flow;
[`copy.ts`](copy.ts) has no function yet in this checkout.

```mermaid
flowchart TD
    input["Prepared files, destination and approved overwrite paths"] -.-> inspect["Check all destination files"]
    inspect -.-> conflicts{"Any unapproved conflicts?"}
    conflicts -.->|Yes| reject["Reject before writes"]
    conflicts -.->|No| copy["Copy additions and approved overwrites; skip identical files"]
```

## Maintain installed exports — WIP

[`installed.ts`](installed.ts) is intended to add missing component exports to the destination
`index.ts`, without duplicating or replacing existing exports. Its API and implementation
are unfinished.

```mermaid
flowchart TD
    exports["Installed component exports"] -.-> merge["Add missing exports; preserve existing exports"]
    merge -.-> barrel["Destination index.ts"]
```

## Coordinate installation — WIP

[`index.ts`](index.ts) will coordinate these stages. Dashed arrows show proposed wiring;
approval and cancellation behavior are not implemented.

```mermaid
flowchart TD
    entries["Planned entries and destination"] -.-> prepare["prepareSource"]
    prepare -.-> preview["previewChanges"]
    preview -.-> decisions["Required conflict and overwrite decisions"]
    decisions -.->|Cancel| stop["Stop without applying changes"]
    decisions -.->|Proceed| copy["copy.ts · WIP"]
    copy -.-> exports["installed.ts · WIP"]
```
