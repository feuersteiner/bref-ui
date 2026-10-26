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
		gap: 0.6rem;
		min-height: fit-content;
		margin: 0;
		padding: 0.5rem;
		color: var(--color-muted);
	}

	:focus-visible {
		outline-color: var(--color-primary);
		outline-offset: 2px;
	}
	@media (forced-colors: active) {
		:focus-visible {
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
