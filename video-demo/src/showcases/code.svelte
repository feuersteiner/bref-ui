<script lang="ts">
	import {
		Button,
		Checkbox,
		Pill,
		Progress,
		Select,
		Switch,
		TextInput,
		Theme
	} from 'bref-ui-themes/vscode';
	import Editor from '../components/editor.svelte';
	let { time }: { time: number } = $props();
	let triggered = $state(false);
	let checked = $state(true);
	let watch = $state(true);
	let target = $state('production');
	const running = $derived(triggered || time > 4);
	const complete = $derived(time > 8);
	const source = `export const build = {
  name: 'something-great',
  framework: 'svelte',
  components: 'bref-ui',

  pipeline: [
    'check',
    'build',
    'ship'
  ],

  ready: true
};`;
</script>

<Theme>
	<div class="code-app">
		<div class="workbench-menubar">
			<span>◈ STUDIO / WORKSPACE</span>
			<span>File · Edit · View · Terminal · Help</span>
			<span>⌘ K</span>
		</div>
		<div class="workbench-body">
			<aside class="workbench-explorer">
				<p>EXPLORER</p>
				<TextInput
					placeholder="Search files…"
					aria-label="Search workspace files"
					icon={{ name: 'search' }}
					wide
				/>
				<p>⌄ YOUR-NEXT-TOOL</p>
				<div class="workspace-file">⌄ src</div>
				<div class="workspace-file indent">◇ app.svelte</div>
				<div class="workspace-file indent selected">◇ build.config.ts</div>
				<div class="workspace-file indent">◇ theme.ts</div>
				<div class="workspace-file">◇ package.json</div>
				<div class="workspace-file">◇ README.md</div>
				<div class="explorer-bottom">
					<Pill label="Svelte 5" color="success" size="small" />
					<p>ALL SYSTEMS GO.</p>
				</div>
			</aside>
			<div class="workbench-editor">
				<Editor {source} filename="build.config.ts" />
				<div class="workbench-terminal">
					<p>
						TERMINAL <span>PROBLEMS · OUTPUT</span>
					</p>
					<code>❯ npm run build</code>
					<code class="terminal-green">
						{complete
							? '✓ Built in 428 ms. Ready for the world.'
							: running
								? '✓ Checking types…\n✓ Compiling Svelte components…'
								: 'Your next big idea starts here.'}
					</code>
				</div>
			</div>
			<section class="workbench-settings">
				<p>DEPLOYMENT</p>
				<h2>
					Ready when
					<br />
					you are.
				</h2>
				<label for="deploy-target">Target environment</label>
				<Select
					id="deploy-target"
					items={[
						{ id: 'production', label: 'Production' },
						{ id: 'preview', label: 'Preview' }
					]}
					bind:value={target}
				/>
				<label class="workbench-toggle"><Switch bind:checked={watch} />Watch for changes</label>
				<label class="workbench-toggle"><Checkbox bind:checked />Run checks before build</label>
				<div class="deployment-progress">
					<span>
						{complete
							? 'Deployment complete'
							: running
								? 'Building your next thing…'
								: 'Waiting for your next idea'}
					</span>
					<Progress value={complete ? 1 : running ? 0.6 : 0.12} label="Deployment progress" />
				</div>
				<Button
					label={complete ? 'Deployed successfully' : running ? 'Building…' : 'Deploy project'}
					variant="filled"
					color="primary"
					icon={{ name: complete ? 'check' : 'rocket_launch' }}
					onClick={() => (triggered = !triggered)}
					wide
				/>
				<small>
					FAMILIAR CONTROLS.
					<br />
					ENTIRELY YOUR TOOL.
				</small>
			</section>
		</div>
		<div class="workbench-status">
			<span>⑂ main · ✓ 0 errors · △ 0 warnings</span>
			<span>TypeScript · Svelte · UTF-8 · ◉ Connected</span>
		</div>
	</div>
</Theme>
