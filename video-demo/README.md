# Bref-ui video demo

A private Svelte app in the root Bun workspace. Uses the public `bref-ui` and
`bref-ui-themes` exports to produce the 3:34 showcase.

```sh
bun install
bun run --cwd video-demo dev
```

The player supports chapter seeking, Space to pause, and arrow keys to seek five
seconds. Reduced motion disables autoplay. Use `?t=134` to preview a particular
second, or `?render&t=134` for the clean film frame.

## Rendering

Requires Node.js 22+, Bun, FFmpeg with libx264, and Playwright Chromium.

```sh
cd video-demo
bunx playwright install chromium
bun run verify
bun run render
cp output/bref-ui-demo.mp4 ../docs/static/bref-ui-demo.mp4
```

The silent export is 1920×1080, 30 fps, 214 seconds, H.264 with 4:2:0 color and
fast-start metadata. Every frame seeks the timeline explicitly, including the
embedded app recordings. Fonts and media are local. `output/` is ignored.

```sh
# Smaller draft or a single scene:
bun run render --width 1280 --fps 24 --output output/draft.mp4
bun run render --from 134 --to 156 --output output/new-paris.mp4

# Refresh the three actual docs app recordings:
bun run capture
```

Capture uses port 4176, render uses 4175 (`--port` overrides it), and verification
uses 4177. Each command closes its browser and server. Root `check`, `lint`, and
`build` also cover this workspace.

## Storyboard

| Time          | Scene                                                                                                           |
| ------------- | --------------------------------------------------------------------------------------------------------------- |
| 0:00–0:07     | Logo; Human first. Svelte first. Agent first. See the demos.                                                    |
| 0:07–0:24     | Todo app: title, slow scroll, complete a task, open the task form                                               |
| 0:24–0:41     | Ecommerce shop: title, scroll to the collection, inspect a chair, add it to the cart                            |
| 0:41–0:58     | SaaS AI app: title, slow scroll, retry a run, inspect a workflow step                                           |
| 0:58–1:03.5   | Import the components. `npm install bref-ui`                                                                    |
| 1:03.5–1:21.5 | Type the component source character by character; slide in the mini form; fill email, change a switch, submit   |
| 1:21.5–1:33.5 | One persistent row: default blue, green, red, dark mode. Cursor pauses before each change                       |
| 1:33.5–1:45   | Own the code. Install, initialize, add Button                                                                   |
| 1:45–1:52     | `package.json` imports, copied source, commands to add the remaining form components                            |
| 1:52–2:10     | The same mini form, now imported from `#bref`                                                                   |
| 2:10–2:14     | Lazy? We made the themes for you ;)                                                                             |
| 2:14–2:36     | New Paris: retain the lady campaign and “Quietly remarkable.” Scroll down to the same mini form and complete it |
| 2:36–2:56     | Fancy building a devtool? We got you. Tabs, search, select, switch, checkbox, progress and deployment           |
| 2:56–3:16     | Your next SaaS side project? Glassy is here. Music controls, focus, tasks, progress and frosted surfaces        |
| 3:16–3:23     | Install the single themes package; show its three public theme imports                                          |
| 3:23–3:34     | Fullscreen typed CTAs; black; Build cool shit ;); black; logo; black                                            |

The mini form contains a standalone icon, heading, name and email inputs with
icons, a switch, checkbox and submit button. Both import paths demonstrate the
same composition. The CLI accepts one component per invocation; the source tree
shows Button's dependencies and separate commands for TextInput, Switch and
Checkbox. Icons are actual document and folder outlines.

The three themes ship in one npm package, with `new-paris`, `vscode`, and `glassy`
entry points. The closing install scene shows that real package command followed
by three minimal import lines; it does not invent per-theme CLI commands.

## Motion and theme isolation

No persistent film header, footer, editor chrome or promotional captions. Titles
and source type character by character. App footage holds its original framing;
scrolls take four seconds and clicks have readable pauses. Each themed app has
at most one restrained close-up: two seconds in, a long hold around related
controls, two seconds out. Quintic easing starts and ends at zero velocity and
acceleration. Cursor movement uses the same easing and a small pointer with a
subtle press, without large click rings.

The root mounts one default `Theme`. Following the docs theme preview, the core
viewport scopes `data-theme` and public `--color-*` properties to its own subtree.
The default preview overrides nothing. Color and mode changes leave the film's
palette unchanged. Each supplied theme uses its own scoped `Theme` wrapper.
Library component and theme sources are unchanged.

## Delivery

The rendered MP4 is served from `docs/static/bref-ui-demo.mp4`. Root and themes
READMEs embed its uploaded GitHub attachment. Review screenshots belong only in
the pull request description, never in the committed diff. Target branch: `dev`.
