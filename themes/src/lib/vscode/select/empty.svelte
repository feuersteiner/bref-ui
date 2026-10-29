<script lang="ts">
	import Icon from '../icon/icon.svelte';
	import type { SelectEmptyProps } from 'bref-ui/types';

	let { message, icon }: SelectEmptyProps = $props();
</script>

<p>
	{#if icon}<Icon {...icon} />{/if}
	{message}
</p>

<style>
	p {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 6px;
		font-size: 13px;
		line-height: 22px;
		min-height: fit-content;
		margin: 0;
		padding: 4px 8px;
		color: var(--color-muted);
	}
</style>
