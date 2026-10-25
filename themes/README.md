# bref-ui-themes

Ready-made themes for [Bref-ui](../readme.md). Each theme will be published as its
own entry point, so an application imports only the theme CSS it uses.

This package is being moved into the Bref-ui workspace; theme sources are not imported
yet. Until then, the published themes live in
[bref-ui-themes](https://github.com/feuersteiner/bref-ui-themes).

## Development

Install from the repository root, then run commands from this directory:

```sh
bun run dev
bun run check
bun run build
```

`bref-ui` resolves to the local [core](../core) package through the workspace.
`src/lib` is the published package; `src/routes` is a local preview only.
