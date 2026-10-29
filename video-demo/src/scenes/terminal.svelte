<script lang="ts">
	import { typeChars, ease } from '../timeline.js';
	let { id, time }: { id: string; time: number } = $props();
	const commands = $derived(
		id === 'install'
			? ['npm install bref-ui']
			: id === 'theme-install'
				? time < 2.5
					? ['npm install bref-ui bref-ui-themes']
					: [
							"import * as Paris from 'bref-ui-themes/new-paris';",
							"import * as VSCode from 'bref-ui-themes/vscode';",
							"import * as Glassy from 'bref-ui-themes/glassy';"
						]
				: ['npm install bref-ui', 'npx bref-ui init', 'npx bref-ui add button']
	);
	const clock = $derived(id === 'theme-install' && time >= 2.5 ? time - 2.5 : time);
	const interval = $derived(id === 'theme-install' ? 1 : 2.7);
</script>

<div class="commands" class:theme-imports={id === 'theme-install'}>
	{#each commands as command, index (command)}<div
			style:opacity={ease((clock - index * interval) / 0.2)}
		>
			<span>
				{typeChars(
					command,
					(clock - 0.1 - index * interval) / (id === 'theme-install' ? 0.8 : 1.5)
				)}
			</span>
			{#if clock > index * interval && clock < index * interval + 1.6}<i></i>{/if}
		</div>{/each}
</div>
