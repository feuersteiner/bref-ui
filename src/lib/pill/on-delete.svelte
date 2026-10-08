<script lang="ts">
	import Button from '../button/button.svelte';
	import type { PillProps } from './types.js';

	let { label, onDelete }: Required<Pick<PillProps, 'label' | 'onDelete'>> = $props();
</script>

<span data-delete>
	<Button
		icon={{ name: 'close', label: `Remove ${label}` }}
		size="x-small"
		style="--internal-height: var(--pill-delete-size, 1.5rem); --internal-icon-size: var(--pill-icon-size, 1.125rem); color: inherit; outline-color: currentColor; outline-offset: -2px;"
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
		flex-shrink: 0;
	}
</style>
