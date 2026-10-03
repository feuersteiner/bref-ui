<script lang="ts">
	import Button from '../button/button.svelte';
	import Icon from '../icon/icon.svelte';
	import type { DialogHeaderProps } from './types.js';

	let {
		header,
		dismissible,
		titleId,
		descriptionId,
		onDismiss
	}: {
		header: DialogHeaderProps;
		dismissible: boolean;
		titleId: string;
		descriptionId: string;
		onDismiss: () => void;
	} = $props();
</script>

<header>
	<div>
		<div data-title>
			{#if header.icon}<Icon
					{...header.icon}
					size="medium"
					color="foreground"
					label={undefined}
				/>{/if}
			<h2 id={titleId}>{header.title}</h2>
		</div>
		{#if header.description}<p id={descriptionId}>{header.description}</p>{/if}
	</div>
	{#if dismissible}
		<Button
			rounded
			icon={{ name: 'close', label: 'Close dialog' }}
			size="small"
			onClick={onDismiss}
		/>
	{/if}
</header>

<style>
	header {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding: 1.5rem 1.5rem 0;
	}
	header > div {
		flex: 1;
		min-width: 0;
	}
	[data-title] {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		min-height: 2.5rem;
	}
	h2 {
		margin: 0;
		font: inherit;
		font-size: 1.375rem;
		font-weight: 600;
		line-height: 1.4;
	}
	p {
		margin: 0.5rem 0 0;
		color: var(--color-muted, #555);
		line-height: 1.5;
	}
</style>
