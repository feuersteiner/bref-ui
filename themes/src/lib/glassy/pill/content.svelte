<script lang="ts">
	import { fly } from 'svelte/transition';
	import Icon from '../icon/icon.svelte';
	import type { PillProps } from 'bref-ui/types';

	let { label, icon }: Pick<PillProps, 'label' | 'icon'> = $props();
</script>

{#if icon}
	{#key icon.name}
		<i data-icon in:fly>
			<Icon {...icon} label={undefined} size={undefined} color={undefined} />
		</i>
	{/key}
{/if}
<span>{label}</span>

<style>
	[data-icon] {
		all: unset;
		display: inline-flex;
		align-items: center;
		flex-shrink: 0;
		font-size: var(--pill-icon-size, 1.125rem);
	}
	span {
		flex: 1;
		text-justify: left;
	}

	:focus-visible:not(input):not(textarea) {
		outline: 3px solid var(--color-primary);
		outline-offset: 3px;
	}
	@media (prefers-reduced-motion: reduce) {
		* {
			transition: none;
			animation: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		*::before {
			transition: none;
			animation: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		*::after {
			transition: none;
			animation: none;
		}
	}
	@media (forced-colors: active) {
		:focus-visible:not(input):not(textarea) {
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
