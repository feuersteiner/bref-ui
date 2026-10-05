<script lang="ts">
	import Icon from '../icon/icon.svelte';
	import type { SelectTriggerProps } from './types.js';

	let { id, open, selected, placeholder, disabled, onToggle }: SelectTriggerProps = $props();
</script>

<button {id} type="button" {disabled} aria-expanded={open} onclick={onToggle}>
	{#if selected.length === 1 && selected[0].icon}
		<span data-icon><Icon {...selected[0].icon} /></span>
	{/if}
	<span data-value data-placeholder={selected.length === 0 || undefined}>
		{selected.length ? selected.map((item) => item.label).join(', ') : placeholder}
	</span>
	<span data-icon><Icon name="arrow_drop_down" /></span>
</button>

<style>
	button {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		gap: 0.6rem;
		width: 100%;
		min-height: var(--internal-height);
		padding: 0.375rem var(--internal-padding);
		border: 1px solid color-mix(in srgb, var(--color-foreground) 12%, transparent);
		border-radius: 0.5rem;
		background: color-mix(in srgb, var(--color-foreground) 4%, transparent);
		color: var(--color-foreground);
		font: inherit;
		text-align: left;
		cursor: pointer;
	}
	[data-value] {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	[data-placeholder],
	[data-icon] {
		color: var(--color-muted);
	}
	[data-icon] {
		display: inline-flex;
		flex: 0 0 auto;
		font-size: var(--internal-icon-size);
	}
	button:hover:not(:disabled) {
		background: color-mix(in srgb, var(--color-foreground) 7%, transparent);
	}
	button:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	@media (forced-colors: active) {
		button {
			border-color: CanvasText;
		}
		button:focus-visible {
			outline-color: Highlight;
		}
	}
</style>
