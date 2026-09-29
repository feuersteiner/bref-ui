# CLI contribution rules

Follow the [root contribution rules](../AGENTS.md). The [CLI overview](README.md) describes
the agreed layout and current stage status.

## Modules

- Keep one public function per functional module. A single-file stage stays a named file;
  a stage needing supporting files becomes a folder with `index.ts` as its sole public entry.
- An entry file defines only its public orchestration function, with no other named or
  nested helper functions. Keep its body a readable sequence of calls to named steps;
  put each step in a sibling kebab-case file such as `read-index.ts` or `collect-exports.ts`.
- Internal step files export their functions for the entry to import. These are internal
  imports, not additional public entry points; do not re-export them from `index.ts`.
  General helpers belong in the stage's `utils.ts`. Simple stages stay single files
  when extracting steps would add no meaningful separation.
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

The orchestration pattern is:

```ts
import { stepA } from './step-a.js';
import { stepB } from './step-b.js';
import { stepC } from './step-c.js';

export const doSomethingImportant = () => {
	const input = stepA();
	const result = stepB(input);
	return stepC(result);
};
```
