<script lang="ts">
	import Icon from '../icon/icon.svelte';
	import type { TreeSectionProps } from './types.js';

	let { label, description, icon }: TreeSectionProps = $props();
</script>

<header>
	{#if icon}<Icon {...icon} label={undefined} />{/if}
	<div>
		<span>{label}</span>
		{#if description}<p>{description}</p>{/if}
	</div>
</header>

<style>
	header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 0.5rem 0.25rem;
		color: var(--color-muted);
		font-size: 0.8em;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		overflow-wrap: anywhere;
	}
	div {
		min-width: 0;
	}
	p {
		margin: 0.25rem 0 0;
		font-weight: 400;
		letter-spacing: normal;
		text-transform: none;
	}
</style>
