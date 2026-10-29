<script lang="ts">
	import { tick } from 'svelte';
	import {
		Button,
		Checkbox,
		Progress,
		Select,
		Switch,
		Tabs,
		TextInput,
		Theme
	} from 'bref-ui-themes/vscode';
	import Editor from '../components/editor.svelte';
	import FileIcon from '../components/file-icon.svelte';
	let { time }: { time: number } = $props();
	let deployed = $state(false);
	let checks = $state(true);
	let watch = $state(true);
	let target = $state('production');
	let search = $state('');
	let tab = $state('app');
	let selectHost = $state<HTMLDivElement>();
	const phase = $derived(
		time < 4.5 ? 0 : time < 8 ? 1 : time < 10.8 ? 2 : time < 13 ? 4 : time < 16 ? 5 : 6
	);
	$effect(() => {
		const step = phase;
		search = step === 1 ? 'config' : '';
		tab = step === 0 ? 'app' : 'config';
		watch = step < 2;
		deployed = step >= 6;
		target = step >= 5 ? 'preview' : 'production';
		void tick().then(() => {
			const trigger = selectHost?.querySelector<HTMLButtonElement>('button[aria-expanded]');
			if (trigger && (trigger.getAttribute('aria-expanded') === 'true') !== (step === 4))
				trigger.click();
		});
	});
	const source = $derived(
		tab === 'app'
			? `<script lang="ts">\n  import { Theme, Button }\n    from 'bref-ui-themes/vscode';\n\x3c/script>\n\n<Theme>\n  <Button label="Deploy"\n    variant="filled"\n    color="primary" />\n</Theme>`
			: `export default {\n  framework: 'svelte',\n  target: '${target}',\n  checks: true,\n  watch: ${watch}\n};`
	);
</script>

<Theme>
	<div class="code-app">
		<nav class="workbench-menubar" aria-label="Studio">studio / workspace</nav>
		<div class="workbench-body">
			<aside class="workbench-explorer">
				<TextInput
					value={search}
					placeholder="Search files"
					aria-label="Search files"
					icon={{ name: 'search' }}
					wide
				/>{#each ['app.svelte', 'build.config.ts', 'package.json'] as file (file)}<div
						class="workspace-file"
					>
						<FileIcon />
						<span>{file}</span>
					</div>{/each}
			</aside>
			<section class="workbench-editor">
				<Tabs
					items={[
						{ id: 'app', label: 'app.svelte', icon: 'code' },
						{ id: 'config', label: 'build.config.ts', icon: 'settings' }
					]}
					bind:value={tab}
					label="Editor files"
				/><Editor {source} />
				<div class="workbench-terminal">
					<code>npm run build</code>
					<code>{deployed ? '✓ deployed' : 'ready'}</code>
				</div>
			</section>
			<section class="workbench-settings">
				<h2>Deploy</h2>
				<label for="deploy-target">Environment</label>
				<div bind:this={selectHost}>
					<Select
						id="deploy-target"
						items={[
							{ id: 'production', label: 'Production' },
							{ id: 'preview', label: 'Preview' }
						]}
						bind:value={target}
					/>
				</div>
				<label class="workbench-toggle"><Switch bind:checked={watch} />Watch changes</label>
				<label class="workbench-toggle"><Checkbox bind:checked={checks} />Run checks</label>
				<Progress value={deployed ? 1 : 0.2} label="Deployment progress" /><Button
					label={deployed ? 'Deployed' : 'Deploy project'}
					color="primary"
					variant="filled"
					size="large"
					wide
					onClick={() => (deployed = !deployed)}
				/>
			</section>
		</div>
	</div>
</Theme>
