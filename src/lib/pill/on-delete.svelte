<script lang="ts">
	import Button from '../button/button.svelte';
	import type { PillProps } from './types.js';

	let { label, onDelete }: Required<Pick<PillProps, 'label' | 'onDelete'>> = $props();
</script>

<span data-delete>
	<Button
		icon={{ name: 'close', label: `Remove ${label}` }}
		size="x-small"
		rounded
		onClick={(event) => {
			event.stopPropagation();
			onDelete();
		}}
	/>
</span>

<style>
	[data-delete] {
		position: relative;
		z-index: 1;
		display: inline-flex;
	}
</style>
