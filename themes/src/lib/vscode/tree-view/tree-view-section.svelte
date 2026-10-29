<script lang="ts">
	import Icon from '../icon/icon.svelte';
	import type { TreeSectionProps } from 'bref-ui/types';

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
		gap: 0;
		padding: 4px 6px;
		color: var(--color-muted);
		line-height: 1.4;
		overflow-wrap: anywhere;
	}
	div {
		display: flex;
		align-items: center;
		gap: 6px;
		min-width: 0;
		color: var(--color-foreground);
		font-size: 11px;
		font-weight: 700;
		text-transform: uppercase;
	}
	p {
		margin: 0;
		font-size: 12px;
	}
</style>
