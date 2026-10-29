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

| Time            | Scene                                                                                        |
| --------------- | -------------------------------------------------------------------------------------------- |
| 0:00–0:02.75    | Original logo and Human first / Svelte first / Agent first                                   |
| 0:02.75–0:04.25 | “New demos” held on screen                                                                   |
| 0:04.25–0:13.25 | Three portrait tablets: Todo, ecommerce and SaaS AI; icon titles and two interactions each   |
| 0:13.25–0:15.75 | Import the components; `npm install bref-ui`                                                 |
| 0:15.75–0:21.25 | Type and use the mini form                                                                   |
| 0:21.25–0:25.25 | Persistent “Customize your theme” heading; blue, green, red and dark controls                |
| 0:25.25–0:28.75 | Own the code; install, initialize and copy Switch                                            |
| 0:28.75–0:32.25 | `switch.svelte` flies from the filled npm cloud into `src/lib/ui`                            |
| 0:32.25–0:38.75 | Themes: #1 New Paris; anchored campaign, fashion grid, filters, cart and mini form           |
| 0:38.75–0:44.75 | Themes: #2 VS Code; ADE activity tabs, real TreeView, smaller editor, agent edits and checks |
| 0:44.75–0:50.75 | Themes: #3 Glassy; music, focus, tasks, search, workspace selector, calendar and meeting     |
| 0:50.75–0:53    | Install the single themes package and show the three public imports                          |
| 0:53–1:00       | Four linked CTAs; Build cool shit ;); logo held for the final 3.6 seconds                    |

## Composition and motion

Scene screen durations map onto explicit animation clocks. The three app
recordings are recaptured at 768×1152, then displayed as 592×888 portrait tablets
at 14/9 speed. Their full responsive framing and individual cursors remain visible.
Capture scrolls interaction targets into view before measuring cursor positions.

The New Paris header and campaign never move independently. Its collection uses
local vector product illustrations, Tabs, Select and Button before revealing the
mini form. ADE uses the public VS Code vertical Tabs and TreeView components beside
an editor, terminal and agent panel. Glassy adds a calendar with meeting controls,
a workspace selector, search, pills and avatars to the original music/focus/tasks.
Numbered theme labels remain above the apps throughout each theme scene.

The root mounts one default `Theme`. Core previews scope `data-theme` and public
`--color-*` properties to their subtree; each supplied theme uses its own scoped
`Theme` wrapper. Library components, theme sources and public APIs are unchanged.

## Delivery

The rendered MP4 is served from `docs/static/bref-ui-demo.mp4`. Root and themes
READMEs link to the same repository MP4 so they follow subsequent edits. Review screenshots belong only in
the pull request description, never in the committed diff. Target branch: `dev`.
