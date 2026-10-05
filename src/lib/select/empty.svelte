<script lang="ts">
	import Icon from '../icon/icon.svelte';
	import type { SelectEmptyProps } from './types.js';

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
		flex-direction: column;
		justify-content: center;
		gap: 0.5rem;
		min-height: fit-content;
		margin: 0;
		padding: 0.5rem;
		color: var(--color-muted);
	}
</style>
