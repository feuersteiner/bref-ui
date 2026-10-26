<script lang="ts">
	import { appearanceMotion } from '../theme/overlay-motion.js';
	import Icon from '../icon/icon.svelte';
	import type { PillProps } from 'bref-ui/types';

	let { label, icon }: Pick<PillProps, 'label' | 'icon'> = $props();
</script>

{#if icon}
	{#key icon.name}
		<i data-icon in:appearanceMotion>
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

	:focus-visible {
		outline: 1px solid var(--color-primary);
		outline-offset: 3px;
	}
	@media (prefers-reduced-motion: reduce) {
		* {
			animation: none !important;
			transition: none !important;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		*::before {
			animation: none !important;
			transition: none !important;
		}
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
