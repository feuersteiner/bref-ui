<script lang="ts">
	import Editor from '../components/editor.svelte';
	import FileIcon from '../components/file-icon.svelte';
	import { ease, typeChars } from '../timeline.js';
	let { time }: { time: number } = $props();
	const config = `{
  "imports": {
    "#bref": "./src/lib/ui/index.js",
    "#bref/*": "./src/lib/ui/*"
  }
}`;
	const extraCommands =
		'npx bref-ui add text-input\nnpx bref-ui add switch\nnpx bref-ui add checkbox';
	const files = [
		'button/',
		'  button.svelte',
		'icon/',
		'  icon.svelte',
		'theme/',
		'  cli-theme.svelte',
		'  colors.svelte',
		'  surfaces.svelte',
		'  glass.svelte',
		'  fonts.svelte',
		'  fonts.css',
		'  styles.svelte',
		'  surface.ts',
		'text-input/',
		'  text-input.svelte',
		'checkbox/',
		'  checkbox.svelte',
		'switch/',
		'  switch.svelte',
		'index.ts'
	];
</script>

{#if time < 2.8}<div class="json-scene">
		<Editor
			source={typeChars(config, (time - 0.1) / 1.4)}
			filename="package.json"
			cursor={time < 1.5}
		/>
	</div>
{:else}<div class="source-tree">
		<h2>src/lib/ui</h2>
		{#each files as file, index (file)}<div
				class={['tree-file', { folder: file.endsWith('/'), nested: file.startsWith(' ') }]}
				style:opacity={ease((time - 2.8 - index * 0.045) / 0.2)}
			>
				<FileIcon folder={file.endsWith('/')} />
				<code>{file.trim()}</code>
			</div>{/each}
		<code class="additional-command">
			{extraCommands}
		</code>
	</div>
{/if}
