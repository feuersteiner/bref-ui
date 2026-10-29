# Bref-ui video demo

A private Svelte app in the root Bun workspace. Uses the public `bref-ui` and
`bref-ui-themes` exports to produce the 60-second showcase.

```sh
bun install
bun run --cwd video-demo dev
```

The player supports chapter seeking, Space to pause, and arrow keys to seek five
seconds. Reduced motion disables autoplay. Use `?t=36.5` to preview a particular
second, or `?render&t=36.5` for the clean film frame.

## Rendering

Requires Node.js 22+, Bun, FFmpeg with libx264, and Playwright Chromium.

```sh
cd video-demo
bunx playwright install chromium
bun run verify
bun run render
cp output/bref-ui-demo.mp4 ../docs/static/bref-ui-demo.mp4
```

The silent export is 1920×1080, 30 fps, 60 seconds, H.264 with 4:2:0 color and
fast-start metadata. Every frame seeks the timeline explicitly, including the
embedded app recordings. Fonts and media are local. `output/` is ignored.

```sh
# Smaller draft or a single scene:
bun run render --width 1280 --fps 24 --output output/draft.mp4
bun run render --from 36.5 --to 42.5 --output output/new-paris.mp4

# Refresh the three actual docs app recordings:
bun run capture
```

Capture uses port 4176, render uses 4175 (`--port` overrides it), and verification
uses 4177. Each command closes its browser and server. Root `check`, `lint`, and
`build` also cover this workspace.

## Storyboard

| Time          | Scene                                                                                                    |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| 0:00–0:03.5   | Logo; Human first. Svelte first. Agent first. Enough talk. See the demos.                                |
| 0:03.5–0:12.5 | Three columns: Todo, ecommerce and SaaS AI apps scroll and perform both recorded interactions together   |
| 0:12.5–0:15   | Import the components. `npm install bref-ui`                                                             |
| 0:15–0:21     | Type the component source; slide in the mini form; fill email, change a switch, submit                   |
| 0:21–0:24.5   | One persistent row: default blue, green, red, dark mode                                                  |
| 0:24.5–0:28.5 | Own the code. Install, initialize, add Button                                                            |
| 0:28.5–0:31   | `package.json` imports, copied source, commands to add the remaining form components                     |
| 0:31–0:35     | The same mini form, now imported from `#bref`                                                            |
| 0:35–0:36.5   | Lazy? We made the themes for you ;)                                                                      |
| 0:36.5–0:42.5 | New Paris: lady campaign, “Quietly remarkable.”, scroll to the same mini form and complete it            |
| 0:42.5–0:47   | Fancy building a devtool? We got you. Tabs, search, select, switch, checkbox, progress and deployment    |
| 0:47–0:51.5   | Your next SaaS side project? Glassy is here. Music controls, focus, tasks, progress and frosted surfaces |
| 0:51.5–0:54.5 | Install the single themes package; show its three public theme imports                                   |
| 0:54.5–1:00   | All four typed CTAs; black; Build cool shit ;); black; logo; black                                       |

Each scene has a screen duration and its original animation duration. Seeking and
rendering map between those clocks, preserving every original cue and final state.
The three app recordings run together at 14/9 speed, with their full framing and
individual cursors retained. Their titles remain visible throughout.

The mini form contains a standalone icon, heading, name and email inputs with
icons, a switch, checkbox and submit button. Both import paths demonstrate the
same composition. The CLI accepts one component per invocation; the source tree
shows Button's dependencies and separate commands for TextInput, Switch and
Checkbox. Icons are actual document and folder outlines.

The three themes ship in one npm package, with `new-paris`, `vscode`, and `glassy`
entry points. The closing install scene shows that real package command followed
by three minimal import lines; it does not invent per-theme CLI commands.

## Motion and theme isolation

No persistent film header, footer or editor chrome. Titles and source type
character by character. App footage holds its original framing. Typing, scrolls,
cursor pauses and theme close-ups follow the compressed scene clocks. Each themed
app retains at most one restrained close-up around related controls. Quintic easing starts and ends at zero velocity and
acceleration. Cursor movement uses the same easing and a small pointer with a
subtle press, without large click rings.

The root mounts one default `Theme`. Following the docs theme preview, the core
viewport scopes `data-theme` and public `--color-*` properties to its own subtree.
The default preview overrides nothing. Color and mode changes leave the film's
palette unchanged. Each supplied theme uses its own scoped `Theme` wrapper.
Library component and theme sources are unchanged.

## Delivery

The rendered MP4 is served from `docs/static/bref-ui-demo.mp4`. Root and themes
READMEs link to the same repository MP4 so they follow subsequent edits. Review screenshots belong only in
the pull request description, never in the committed diff. Target branch: `dev`.
