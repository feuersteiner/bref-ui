<script lang="ts">
	import Kinetic from '../components/kinetic.svelte';
	import Paris from '../showcases/paris.svelte';
	import Code from '../showcases/code.svelte';
	import Glass from '../showcases/glass.svelte';
	let { id, time, elapsed }: { id: string; time: number; elapsed: number } = $props();
	const titles: Record<string, string> = {
		paris: '#1 New Paris',
		vscode: '#2 VS Code',
		glassy: '#3 Glassy'
	};
</script>

<div class={['theme-sequence', id]}>
	<div class="theme-label">
		<span>Themes:</span>
		<Kinetic text={titles[id]} time={elapsed} />
	</div>
	<div class="theme-live">
		{#if id === 'paris'}<Paris {time} />{:else if id === 'vscode'}<Code {time} />{:else}<Glass
				{time}
			/>{/if}
	</div>
</div>

<style>
	.theme-sequence {
		background: #e8e5dd;
	}
	.theme-label {
		position: absolute;
		left: 52px;
		top: 28px;
		display: flex;
		align-items: baseline;
		gap: 14px;
		font:
			500 34px 'Inter Variable',
			sans-serif;
		letter-spacing: -1px;
	}
	span {
		color: #74736c;
		font-weight: 400;
	}
	.theme-live {
		top: 96px;
		left: 48px;
		width: 1920px;
		height: 1000px;
		transform: scale(0.95);
		transform-origin: top left;
		border: 1px solid #0002;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 12px 36px #17233115;
	}
	.theme-label :global(.kinetic) {
		font: inherit;
		letter-spacing: inherit;
		text-align: left;
	}
</style>
