# Registry loading

[Registry overview](../README.md) · [Entry point](index.ts) · [Metadata helpers](utils.ts)

`loadRegistry(sourceRoot)` scans immediate component folders for `registry.json`, returning
entries keyed by component ID in sorted manifest-path order. Loading writes no files.

```mermaid
flowchart TD
    load["loadRegistry(sourceRoot)"] --> discover["discoverManifests · discover-manifests.ts"]
    discover --> entry["loadEntry · load-entry.ts, concurrently"]
    entry --> json["Read and parse JSON"]
    json --> parse["parseItem"]
    parse --> fields["Validate ID, files, exports and dependencies"]
    fields --> paths["isId / isRelativeFile"]
    paths --> exists["Check listed files exist"]
    exists --> directory["Attach containing directory"]
    directory --> registry["createRegistry · create-registry.ts: reject duplicate IDs and export names"]
    registry --> validate["validateDependencies · validate-dependencies.ts"]
    validate --> visit["Traverse: reject missing dependencies and cycles"]
    visit --> result["Return Map of RegistryEntry"]
```

`parseItem` validates required fields, unique file and dependency lists, and PascalCase
exports pointing to listed files. File paths must be relative, without empty, dot or parent
segments, backslashes or colons. These checks are lexical; symlinks are not resolved.

`validateDependencies` recursively visits each entry. An active-chain set detects cycles;
a completed set skips previously validated chains. Any read, metadata, file, uniqueness or
dependency failure rejects loading.

`utils.ts` exports `parseItem` only for internal use by the stage. The entry file calls the
four sibling steps; external callers use `load/index.ts`.
