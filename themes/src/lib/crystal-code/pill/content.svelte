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
	}
</style>
