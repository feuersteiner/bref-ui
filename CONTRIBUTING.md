# Contributing to Bref

Keep Bref Svelte-first, human-first and agent-first: native HTML and Svelte APIs,
scoped CSS, readable source and composable components. The [root instructions](AGENTS.md)
contain the full contribution and review rules.

## Working together

- Keep changes small and scoped; preserve unrelated work and ask before large diffs.
- Agree on public APIs before implementation. Explain one reviewable step, show its
  diff and checks, then wait for approval before expanding the work.
- Never commit, push or publish without authorization.

## Package guidance

- [Core](core/AGENTS.md) and [CLI rules](core/cli/AGENTS.md): use canonical component sources, native attributes/events,
  agreed tokens and accessible behavior. Keep CLI stages focused, preview copies and
  require explicit overwrite decisions.
- [Docs](docs/AGENTS.md) and [route rules](<docs/src/routes/(docs)/AGENTS.md>): keep the site static, import public package exports and use
  Kit path helpers. Cover APIs, variants, interactions and accessibility in galleries;
  keep navigation and `/llms.txt` current.
- [Themes](themes/AGENTS.md): agree on theme contracts, isolate styles and entry points,
  keep assets opt-in and validate contrast without silently changing inputs.

## Verification

Run relevant checks from the repository root:

```sh
bun run check
bun run lint
bun run --workspaces --if-present test
bun run build
```

Distribution changes also need tarball inspection and clean npm/CLI consumers in
Svelte and SvelteKit. UI pull requests need cropped screenshots of rendered variants
and interaction states; keep screenshots in the PR description, outside the Git diff.
