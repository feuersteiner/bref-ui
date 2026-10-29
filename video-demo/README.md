# Bref-ui video demo

Private Svelte app for producing the Bref-ui demo video and showcase. Part of the
root Bun workspace; uses `bref-ui` and `bref-ui-themes` through public workspace
exports. Production sources belong here and stay in the repository.

## Development

From the repository root:

```sh
bun install
bun run --cwd video-demo dev
bun run --cwd video-demo check
bun run --cwd video-demo build
bun run --cwd video-demo preview
```

Root `check`, `lint` and `build` commands also cover this package.

The app plays a 2:18 film with chapter navigation, seeking, pause/resume and live
components. Space toggles playback; arrow keys seek five seconds. Reduced motion
preferences disable autoplay. Open `?t=92` at a particular second, or `?render&t=92`
for a clean frame without player controls. Use the Vite URL, rather than opening
`index.html` directly from the filesystem.

## Render the video

Requires Node.js 22+, Bun, FFmpeg with `libx264`, and Playwright Chromium:

```sh
# Once, from the repository root:
bun install
cd video-demo
bunx playwright install chromium

# Check the complete storyboard, interactions and responsive player:
bun run verify

# Render the full silent film, frame by frame:
bun run render
```

The default export is `video-demo/output/bref-ui-demo.mp4`: 1920×1080, 30 fps,
138 seconds, H.264 with 4:2:0 color, and fast-start metadata for web playback. Every frame
seeks the Svelte timeline explicitly; wall-clock capture speed does not change
the film's timing. Footage is decoded to the same frame time. Fonts, images and
newly mounted scene layers settle before capture. Fonts and footage are local;
the film does not need network services.

```sh
# Faster, smaller draft; or render just one section:
bun run render --width 1280 --fps 24 --output output/draft.mp4
bun run render --from 92 --to 104 --output output/new-paris.mp4

# Replace the docs/README video after reviewing the export:
cp output/bref-ui-demo.mp4 ../docs/static/bref-ui-demo.mp4
```

`output/` is ignored, including the review screenshots written by `verify`.
The three four-second clips in `public/footage/` are captured from the actual
Todo, House Shop and RunnerAI apps in `docs`, including their interactions.
Run `bun run capture` to refresh them after changing a demo. This starts the docs
server, captures the apps with Playwright, and encodes the clips with FFmpeg.
The capture server uses port 4176, rendering uses 4175 (override with `--port`),
and verification uses 4177. Each command closes its browser and server on exit.

The three theme scenes render public `bref-ui-themes` components directly.
The composition preview uses canonical `bref-ui` components; the CLI scene
illustrates importing their copied counterparts from `#bref`. Its file tree
matches the registry, including Button's Icon/Theme dependencies and the
additional Switch command. No component or theme source is modified.

## Timing

| Time      | Scene                                            |
| --------- | ------------------------------------------------ |
| 0:00–0:08 | Logo and typed values                            |
| 0:08–0:10 | See what you can build                           |
| 0:10–0:22 | Todo, House Shop, RunnerAI — four seconds each   |
| 0:22–0:29 | Chapter #1 and npm install                       |
| 0:29–0:43 | Word-by-word Svelte composition and live preview |
| 0:43–0:50 | Three palette customizations                     |
| 0:50–0:57 | Light and dark modes                             |
| 0:57–1:08 | Chapter #2 and CLI commands                      |
| 1:08–1:17 | Package imports and copied source tree           |
| 1:17–1:29 | Compose again with local imports                 |
| 1:29–1:32 | Chapter #3                                       |
| 1:32–1:44 | New Paris                                        |
| 1:44–1:56 | VS Code                                          |
| 1:56–2:08 | Glassy                                           |
| 2:08–2:18 | Community calls to action                        |

## Storyboard

Follow this sequence. Use the existing `docs/static/bref-ui-demo.mp4` as the visual
reference for typography, gradients, code panels and transitions. Show actual
rendered components and applications, with readable code and enough pauses to
understand each change.

### 1. Bref-ui introduction

- The Bref-ui logo appears.
- Type the values in order: **Human first. Svelte first. Agent first.**
- Cut to **See what you can build.**
- Flash through **Todo**, **House Shop**, then **RunnerAI**, spending 3–5 seconds
  on each demo. Use energetic transitions and show each running application.

### 2. #1 Import and use the components

- Full-screen chapter title: **#1 Import and use the components**.
- Full-screen terminal: `npm install bref-ui`.
- A text editor appears. Compose a working Svelte example word by word using
  public Bref-ui components.
- Reveal the running composition in a right-hand preview column.
- Customize the theme and show the preview updating alongside its configuration.
- Show the composition in light and dark modes.

### 3. #2 Own the code

- Full-screen chapter title: **#2 Own the code**.
- Full-screen terminal, showing these commands in order:

  ```sh
  npm install bref-ui
  npx bref-ui init
  npx bref-ui add button
  ```

- Explain the `package.json` change: `init` adds `#bref` and `#bref/*` imports,
  pointing to `src/lib/ui/index.js` and `src/lib/ui/*` by default.
- Show the source tree gaining the Button component and its required dependencies
  under `src/lib/ui`, with exports in its local barrel. Keep the package installed
  for shared types. Match the actual CLI output and file paths.
- Repeat the same composition from chapter #1, now importing the copied components
  from `#bref`. Add any other components used by the example through the CLI too.
- Keep the code editor and running preview together so source ownership is clear.

### 4. #3 Start with a theme. Make it yours.

- Full-screen chapter title: **#3 Start with a theme. Make it yours.**
- Show only these three themes, in this order; leave Crystal Code out.
- **New Paris — Style with intention.** Show its editorial typography, ivory
  surfaces and distinctive controls in a stylish composition.
- **VS Code — Build your next dev tool.** Show the dark workbench, familiar
  controls and developer-focused composition.
- **Glassy — A little glass. A lot of personality.** Show a playful composition
  with translucent controls, frosted surfaces and layered backgrounds.
- Give each theme time to show its character, details and meaningful interactions.

### 5. Build cool shit ;)

- End full-screen with **Build cool shit ;)** and these calls to action:
  - **File an issue.** <https://github.com/feuersteiner/bref-ui/issues>
  - **Join the conversation.** <https://discord.gg/JpgQRTUsVS>
  - **Use it. Share it.** <https://feuersteiner.github.io/bref-ui/>
  - **Star it on GitHub.** <https://github.com/feuersteiner/bref-ui>
- Hold the final screen long enough to read the calls to action.

## Delivery

Render and visually review the finished video, then replace the existing video
reference in the root README and add the updated video to `themes/README.md`.
Open a pull request targeting `dev` with the production app, storyboard and README
updates. Include rendered preview screenshots in the PR description only, never
in the committed diff.
