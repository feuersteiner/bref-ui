<script lang="ts">
	import Editor from '../components/editor.svelte';
	import { ease } from '../timeline.js';
	let { time }: { time: number } = $props();
	const config = `{
  "name": "your-svelte-app",
  "dependencies": {
    "bref-ui": "^3.0.0"
  },
  "imports": {
    "#bref": "./src/lib/ui/index.js",
    "#bref/*": "./src/lib/ui/*"
  }
}`;
	const files = [
		'button/',
		'  button.svelte',
		'icon/',
		'  icon.svelte',
		'theme/',
		'  cli-theme.svelte',
		'  colors.svelte',
		'  surfaces.svelte',
		'  …fonts, styles & surface.ts',
		'switch/',
		'  switch.svelte',
		'index.ts'
	];
</script>

<div class="composition-heading">
	<p class="eyebrow">02 / OWN THE CODE</p>
	<h1>
		Real files. <em>Yours to change.</em>
	</h1>
	<p>The source lives in your project. The decisions stay with you.</p>
</div>
<div class="files-panels">
	<div class="config-panel">
		<Editor source={config} filename="package.json" />
		<div class="file-callout">
			<span>↳</span>
			<div>
				<strong>One alias. Your source.</strong>
				<p>
					<code>#bref</code>
					points to your local components.
				</p>
			</div>
		</div>
	</div>
	<div class="file-tree" style:opacity={ease((time - 2.3) / 0.7)}>
		<div class="tree-heading">
			<span>EXPLORER</span>
			<span>YOUR-SVELTE-APP</span>
		</div>
		<p class="tree-root">
			⌄ src / lib / <strong>ui</strong>
		</p>
		{#each files as file, index (file)}<p
				class={[
					'tree-file',
					{ 'tree-folder': file.endsWith('/'), 'tree-new': !file.endsWith('/') }
				]}
				style:opacity={ease((time - 2.5 - index * 0.12) / 0.3)}
			>
				<span>{file.endsWith('/') ? '⌄' : '◇'}</span>
				<code>{file}</code>
				{#if !file.endsWith('/')}<span class="added">A</span>{/if}
			</p>{/each}
		<div class="tree-command">
			<span>❯</span>
			npx bref-ui add switch
		</div>
		<p class="tree-caption">Button brings Icon + Theme. Add Switch for the same composition.</p>
	</div>
</div>
