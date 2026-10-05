<script lang="ts">
	import Icon from '../icon/icon.svelte';
	import Surface from '../surface/surface.svelte';
	import type { SelectTriggerProps } from './types.js';

	let { id, open, selected, placeholder, disabled, onToggle, size }: SelectTriggerProps = $props();
</script>

<button {id} type="button" data-size={size} {disabled} aria-expanded={open} onclick={onToggle}>
	<Surface
		as="span"
		variant="soft"
		color="foreground"
		orientation="horizontal"
		radius="small"
		width="fill"
		height="fill"
		hover={disabled ? undefined : 'small'}
	>
		{#if selected.length === 1 && selected[0].icon}
			<span data-icon><Icon {...selected[0].icon} /></span>
		{/if}
		<span data-value data-placeholder={selected.length === 0 || undefined}>
			{selected.length ? selected.map((item) => item.label).join(', ') : placeholder}
		</span>
		<span data-icon><Icon name="arrow_drop_down" /></span>
	</Surface>
</button>

<style>
	button {
		box-sizing: border-box;
		display: flex;
		width: 100%;
		height: var(--internal-height);
		padding: 0;
		border: 0;
		border-radius: 0.5rem;
		background: transparent;
		color: var(--color-foreground);
		font: inherit;
		text-align: left;
		cursor: pointer;
	}
	span:first-child {
		margin-inline-start: var(--internal-padding);
	}
	span:last-child {
		margin-inline-end: var(--internal-padding);
	}
	span + span {
		margin-inline-start: 0.6rem;
	}
	[data-value] {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 1rem;
		font-weight: 200;
		line-height: 1.4;
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
