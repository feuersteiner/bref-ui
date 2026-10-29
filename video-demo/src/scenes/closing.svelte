<script lang="ts">
	import { ease } from '../timeline.js';
	let { time }: { time: number } = $props();
	const actions = [
		{
			label: 'File an issue.',
			detail: 'Make it better, together.',
			url: 'https://github.com/feuersteiner/bref-ui/issues',
			icon: '↗'
		},
		{
			label: 'Join the conversation.',
			detail: 'Come say hi on Discord.',
			url: 'https://discord.gg/JpgQRTUsVS',
			icon: '↗'
		},
		{
			label: 'Use it. Share it.',
			detail: 'Your next idea starts here.',
			url: 'https://feuersteiner.github.io/bref-ui/',
			icon: '↗'
		},
		{
			label: 'Star it on GitHub.',
			detail: 'A little star goes a long way.',
			url: 'https://github.com/feuersteiner/bref-ui',
			icon: '✳'
		}
	];
</script>

<div class="closing">
	<p class="eyebrow">SMALL LIBRARY. BIG POSSIBILITIES. YOUR TURN.</p>
	<h1>
		Build cool <em>shit</em>
		<span>;)</span>
	</h1>
	<p class="closing-caption">Make something that feels like you.</p>
	<div class="closing-actions">
		{#each actions as action, index (action.url)}<a
				href={action.url}
				style:opacity={ease((time - 0.7 - index * 0.3) / 0.6)}
				style:transform={`translateY(${(1 - ease((time - 0.7 - index * 0.3) / 0.6)) * 30}px)`}
			>
				<span>{action.icon}</span>
				<strong>{action.label}</strong>
				<small>{action.detail}</small>
			</a>{/each}
	</div>
	<a class="closing-url" href="https://github.com/feuersteiner/bref-ui">
		github.com/feuersteiner/bref-ui <span>↗</span>
	</a>
	<div class="closing-discord">discord.gg/JpgQRTUsVS</div>
	<p class="closing-signature">HUMAN FIRST. SVELTE FIRST. AGENT FIRST.</p>
</div>
