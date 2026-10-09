<script lang="ts">
	import Pill from '../pill/pill.svelte';
	import Container from './container.svelte';
	import type { PillGroupProps } from './types.js';

	let {
		items,
		onDelete,
		color = 'foreground',
		size = 'medium',
		variant = 'neutral',
		glass,
		...attributes
	}: PillGroupProps = $props();
</script>

<Container {...attributes} {items} {size}>
	{#snippet renderItem(item)}
		<Pill
			label={item.label}
			icon={item.icon}
			{color}
			{size}
			{variant}
			{glass}
			onDelete={onDelete ? () => onDelete?.(item.id) : undefined}
		/>
	{/snippet}
</Container>
