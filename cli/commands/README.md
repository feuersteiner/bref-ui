# Commands — WIP

[CLI overview](../README.md)

The executable and both commands contain only WIP comments. The diagrams below describe
intended responsibilities; invocation syntax, public function signatures and command
behavior remain unfinished. Dashed arrows show proposed wiring.

## Route commands

[`cli/index.ts`](../index.ts) will route arguments and report command results and failures.

```mermaid
flowchart TD
    args["CLI arguments"] -.-> route["cli/index.ts · WIP"]
    route -.-> init["init.ts · WIP"]
    route -.-> add["add.ts · WIP"]
    init -.-> report["Report result or failure"]
    add -.-> report
```

## Initialize configuration

[`init.ts`](init.ts) will initialize consumer project configuration. Handling existing
configuration files still requires agreed behavior.

```mermaid
flowchart TD
    project["Consumer project"] -.-> init["init.ts · WIP"]
    init -.-> existing["Apply agreed existing-config behavior"]
    existing -.-> config["Initialize bref.config.json"]
```

## Add a component

[`add.ts`](add.ts) will connect [configuration](../config/README.md),
[registry loading](../registry/load/README.md), [dependency planning](../registry/README.md)
and [installation](../installation/README.md), then report the outcome.

```mermaid
flowchart TD
    add["add.ts · WIP"] -.-> read["readConfig(projectRoot)"]
    read -.-> resolve["resolveTargetDir(projectRoot, ui, aliases)"]
    add -.-> load["loadRegistry(sourceRoot)"]
    load -.-> plan["planDependencies(componentId, registry)"]
    resolve -.-> install["installation/index.ts · WIP"]
    plan -.-> install
    install -.-> report["Report component and dependency installation result"]
```
