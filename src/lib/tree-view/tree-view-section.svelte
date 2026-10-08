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
		gap: 0.25rem;
		padding: 0.75rem 0.5rem 0.25rem;
		color: var(--color-muted);
		font-size: 0.8em;
		font-weight: inherit;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		overflow-wrap: anywhere;
	}
	div {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		min-width: 0;
	}
	p {
		margin: 0;
		letter-spacing: normal;
		text-transform: none;
	}
</style>
