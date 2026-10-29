<script lang="ts">
	import { typeWords } from '../timeline.js';
	let { id, time }: { id: string; time: number } = $props();
	const commands = $derived(
		id === 'install'
			? ['npm install bref-ui']
			: ['npm install bref-ui', 'npx bref-ui init', 'npx bref-ui add button']
	);
</script>

<div class="terminal-scene">
	<p class="eyebrow">
		{id === 'install' ? 'START SIMPLE. STAY FLEXIBLE.' : 'YOUR COMPONENTS. YOUR REPOSITORY.'}
	</p>
	<h1>
		{id === 'install' ? 'One install.' : 'Bring it home.'}
		<br />
		<em>{id === 'install' ? 'All the possibilities.' : 'Keep the source.'}</em>
	</h1>
	<div class="terminal-window">
		<div class="terminal-chrome">
			<span class="traffic-lights">● ● ●</span>
			<span>Terminal — your-svelte-app</span>
		</div>
		<div class="terminal-body">
			{#each commands as command, index (command)}
				{#if time > 0.4 + index * 2.2}
					<p>
						<span class="prompt">❯</span>
						{typeWords(command, (time - 0.4 - index * 2.2) / 1.1)}
						<span class="terminal-cursor">▎</span>
					</p>
					{#if time > 1.8 + index * 2.2}
						<p class="terminal-result">
							✓ {index === 0
								? 'Installed. Ready to build.'
								: index === 1
									? 'Added #bref imports to package.json.'
									: 'Reviewed & copied button + icon + theme.'}
						</p>
					{/if}
				{/if}
			{/each}
		</div>
	</div>
	<p class="terminal-caption">
		{id === 'install'
			? 'Svelte components. Native CSS. Nothing to memorize.'
			: 'The CLI previews every file and asks before overwriting.'}
	</p>
</div>
