# CLI contribution rules

Follow the [root contribution rules](../AGENTS.md). The [CLI overview](README.md) describes
the agreed layout and current stage status.

## Modules

- Keep one public function per functional module. A single-file stage stays a named file;
  a stage needing supporting files becomes a folder with `index.ts` as its sole public entry.
- Keep helpers private to their stage. Internal helper exports support the stage entry;
  callers outside the stage use its entry point, never helper files.
- Colocate necessary shared types in the owning directory's `types.ts`.
- Preserve existing function contracts. Agree on command behavior and new public APIs
  before implementation; WIP comments describe responsibilities without defining APIs.
- Document public and private functions with JSDoc, including applicable inputs, results
  and failures. Keep remaining placeholders as two-sentence WIP comments.

## Installation and documentation

- Keep registry loading, dependency planning, preparation and preview free of writes.
- Copy component sources from the canonical registry. Keep type imports in `bref-ui/types`
  and destination barrel exports limited to components.
- Preview changes and require explicit overwrite decisions before applying conflicts.
- Update the owning directory's README when a workflow changes. Keep the overview concise;
  show function calls in directory diagrams and mark proposed wiring and WIP stages.
- For documentation changes, check formatting, relative links and consistency with source
  and JSDoc. Follow the root review and authorization gates.
