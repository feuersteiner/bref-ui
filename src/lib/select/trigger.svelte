<script lang="ts">
	import Icon from '../icon/icon.svelte';
	import Surface from '../surface/surface.svelte';
	import type { SelectTriggerProps } from './types.js';

	let { id, open, selected, placeholder, disabled, onToggle }: SelectTriggerProps = $props();
</script>

<button {id} type="button" {disabled} aria-expanded={open} onclick={onToggle}>
	<Surface
		as="span"
		variant="soft"
		tint="foreground"
		orientation="horizontal"
		radius="small"
		hover={disabled ? undefined : 'small'}
	>
		<span data-content>
			{#if selected.length === 1 && selected[0].icon}
				<span data-icon><Icon {...selected[0].icon} /></span>
			{/if}
			<span data-value data-placeholder={selected.length === 0 || undefined}>
				{selected.length ? selected.map((item) => item.label).join(', ') : placeholder}
			</span>
			<span data-icon><Icon name="arrow_drop_down" /></span>
		</span>
	</Surface>
</button>

<style>
	button {
		box-sizing: border-box;
		display: flex;
		width: 100%;
		padding: 0;
		border: 0;
		border-radius: 0.5rem;
		background: transparent;
		color: var(--color-foreground);
		font: inherit;
		text-align: left;
		cursor: pointer;
	}
	[data-content] {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		gap: 0.6rem;
		width: 100%;
		min-width: 0;
		min-height: calc(var(--internal-height) - 2px);
		padding: 0.375rem var(--internal-padding);
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
	button:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	@media (forced-colors: active) {
		button:focus-visible {
			outline-color: Highlight;
		}
	}
</style>
