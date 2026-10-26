<script lang="ts">
	import Button from '../button/button.svelte';
	import Icon from '../icon/icon.svelte';
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import type { DialogHeaderProps } from 'bref-ui/types';

	let { title, description, icon, dismissible, id, onDismiss }: DialogHeaderProps = $props();
</script>

<header>
	<div>
		{#key `${icon?.name ?? ''}:${title}`}
			<div
				data-title
				in:fly={{
					y: prefersReducedMotion.current ? 0 : 8,
					duration: prefersReducedMotion.current ? 0 : 180
				}}
			>
				{#if icon}<Icon {...icon} size="medium" color="foreground" label={undefined} />{/if}
				<h2 id={`${id}-title`}>{title}</h2>
			</div>
		{/key}
		{#if description}<p id={`${id}-description`}>{description}</p>{/if}
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
		padding: 1.75rem 1.75rem 0;
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
		font-size: 1.5rem;
		font-weight: 400;
		line-height: 1.3;
	}
	p {
		margin: 0.5rem 0 0;
		color: var(--color-muted, #555);
		line-height: 1.5;
	}

	:focus-visible {
		outline-color: var(--color-primary);
		outline-offset: 2px;
	}
	header {
		padding: 16px 20px 0;
	}
	header h2 {
		font-size: 18px;
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
