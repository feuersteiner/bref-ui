<script lang="ts">
	import { ease } from '../timeline.js';
	let { time }: { time: number } = $props();
	const actions = [
		{ text: 'File an issue.', url: 'https://github.com/feuersteiner/bref-ui/issues' },
		{ text: 'Join Discord.', url: 'https://discord.gg/JpgQRTUsVS' },
		{ text: 'Use it. Share it.', url: 'https://feuersteiner.github.io/bref-ui/' },
		{ text: 'Star it on GitHub.', url: 'https://github.com/feuersteiner/bref-ui' }
	];
</script>

<div class="closing-end">
	{#if time < 2}<div class="closing-actions">
			{#each actions as action (action.text)}<a href={action.url}>{action.text}</a>{/each}
		</div>
	{:else if time < 3.4}<h2>Build cool shit ;)</h2>
	{:else}<div class="logo" style:opacity={ease((time - 3.4) / 0.3)}>
			bref <span>/</span>
			ui
		</div>{/if}
</div>

<style>
	.closing-end {
		height: 100%;
		display: grid;
		place-items: center;
	}
	.closing-actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 55px 110px;
		text-align: center;
	}
	a {
		color: inherit;
		text-decoration: none;
		font-size: 57px;
		letter-spacing: -2px;
	}
	h2 {
		font-size: 130px;
		font-weight: 500;
		letter-spacing: -6px;
	}
	.logo > span {
		color: #92b4df;
	}
</style>
