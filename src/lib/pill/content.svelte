<script lang="ts">
	import { fly } from 'svelte/transition';
	import Icon from '../icon/icon.svelte';
	import type { PillProps } from './types.js';

	let { label, icon, size }: Pick<PillProps, 'label' | 'icon' | 'size'> = $props();
</script>

{#if icon}
	{#key icon.name}
		<span data-icon in:fly>
			<Icon {...icon} label={undefined} {size} color={undefined} />
		</span>
	{/key}
{/if}
<span>{label}</span>

<style>
	[data-icon] {
		display: inline-flex;
		align-items: center;
	}
</style>
