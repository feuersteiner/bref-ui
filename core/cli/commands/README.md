# Commands

[CLI overview](../README.md)

The executable and init/add commands are implemented. Commands use the current directory
as the consumer project; the registry comes from canonical sources beside the executable,
either in the installed package or the source checkout. Bun is required.

## Route commands

[`cli/index.ts`](../index.ts) calls [`runCommand`](index.ts), the commands directory’s
sole routing entry. It calls `parse`, then `execute`. Its catch block prints a concise
message directly with `console.error` and sets exit code 1.
Help, successful commands and deliberate cancellation exit with code 0.

Supported arguments are `init`, `add <component>`, `help`, `--help` and `-h`. No arguments
also shows help; `init --help` and `add --help` are accepted. Unknown commands, unsupported
options, missing component IDs and extra arguments fail before accessing project files.

```mermaid
flowchart TD
    args["CLI arguments"] --> parse["parse"]
    parse --> route["execute"]
    route --> help["Print help"]
    route --> init["initConfig"]
    route --> add["addComponent"]
    init --> report["Report result or failure"]
    add --> report
```

## Initialize configuration

[`initConfig(projectRoot)`](init.ts) creates `bref.config.json` with `{ "ui": "$lib/ui" }`
and returns `created`. An existing file is preserved without parsing and returns `exists`,
even if its contents are invalid. Checking or writing errors propagate, and the project
directory must already exist. The Bun existence check and write are separate operations;
concurrent initialization of the same project is unsupported.

```mermaid
flowchart TD
    project["Existing consumer project directory"] --> init["initConfig(projectRoot)"]
    init --> existing["Bun.file · check bref.config.json existence"]
    existing -->|Present| preserve["Return exists · preserve contents"]
    existing -->|Absent| config["Bun.write · default configuration"]
    config --> created["Return created"]
```

## Add a component

[`addComponent`](add/index.ts) connects [configuration](../config/README.md),
[registry loading](../registry/load/README.md), [dependency planning](../registry/README.md)
and [installation](../installation/README.md). It accepts the component ID, consumer
project root, canonical source root and optional alias mappings, then returns
`installed` or `cancelled`. Errors propagate to the caller.

The consumer must already have `bref.config.json`. Alias discovery is deferred;
the caller supplies overrides for the default `$lib` mapping.

```mermaid
flowchart TD
    add["addComponent"] --> read["readConfig(projectRoot)"]
    read --> resolve["resolveTargetDir(projectRoot, ui, aliases)"]
    add --> load["loadRegistry(sourceRoot)"]
    load --> plan["planDependencies(componentId, registry)"]
    resolve --> install["installComponent(entries, destination, reviewChanges)"]
    plan --> install
    install --> review["reviewChanges"]
    review --> display["displayChanges · every status and relative path"]
    display --> approve["approveOverwrites · confirm each conflicting path"]
    approve --> confirm["confirm · final installation approval"]
    approve -->|Refused or closed input| cancel["Return null · installation cancelled"]
    confirm -->|Refused or closed input| cancel
    confirm --> accepted["Return approved paths to installComponent"]
    accepted --> copy["copyFiles"]
```

Confirmations use Bun's native `prompt`. Only `y` or `yes` accepts, ignoring case and
surrounding whitespace. Refusal, empty input or closed input at any prompt cancels
without writes; remaining prompts are skipped. `index.ts` needs its own approval
when its content changes. Accepted copying can fail partially; writes are not atomic.
