<script lang="ts">
	import Icon from '../icon/icon.svelte';
	import type { SelectEmptyProps } from '#bref-types';

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
		gap: 0.6rem;
		min-height: fit-content;
		margin: 0;
		padding: 0.5rem;
		color: var(--color-muted);
	}

	:focus-visible:not(input) {
		outline: 2px solid var(--color-primary);
		outline-offset: 4px;
	}
	@media (forced-colors: active) {
		:focus-visible:not(input) {
			outline-color: Highlight;
		}
	}

	:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
	@media (prefers-reduced-motion: reduce) {
		* {
			animation: none;
			transition: none;
		}
	}
</style>
