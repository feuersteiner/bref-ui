<script lang="ts">
	import Icon from '../icon/icon.svelte';
	import type { TreeSectionProps } from './types.js';

	let { label, description, icon }: TreeSectionProps = $props();
</script>

<header>
	<div>
		{#if icon}<Icon {...icon} label={undefined} />{/if}
		<span>{label}</span>
	</div>
	{#if description}<p>{description}</p>{/if}
</header>

<style>
	header {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.375rem;
		padding: 1rem 0.75rem 0.75rem;
		color: var(--color-muted);
		line-height: 1.4;
		overflow-wrap: anywhere;
	}
	div {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		min-width: 0;
		color: var(--color-foreground);
		font-size: 0.875em;
		font-weight: 500;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	p {
		margin: 0;
		font-size: 0.75em;
	}
</style>
