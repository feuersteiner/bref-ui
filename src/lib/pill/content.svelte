<script lang="ts">
	import { fly } from 'svelte/transition';
	import Icon from '../icon/icon.svelte';
	import type { PillProps } from './types.js';

	let { label, icon }: Pick<PillProps, 'label' | 'icon'> = $props();
</script>

{#if icon}
	{#key icon.name}
		<span data-icon in:fly>
			<Icon {...icon} label={undefined} size={undefined} color={undefined} />
		</span>
	{/key}
{/if}
<span>{label}</span>

<style>
	[data-icon] {
		display: inline-flex;
		align-items: center;
		flex-shrink: 0;
		font-size: var(--pill-icon-size, 1.125rem);
	}
</style>
