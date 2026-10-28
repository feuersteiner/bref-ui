<script lang="ts">
	import Icon from '../icon/icon.svelte';
	import Surface from '../surface/surface.svelte';
	import type { SelectTriggerProps } from './types.js';

	let { id, open, selected, placeholder, disabled, onToggle, size }: SelectTriggerProps = $props();
</script>

<button {id} type="button" data-size={size} {disabled} aria-expanded={open} onclick={onToggle}>
	<Surface
		as="span"
		variant="neutral"
		color="foreground"
		orientation="horizontal"
		radius="0.625rem"
		width="fill"
		height="fill"
	>
		{#if selected.length === 1 && selected[0].icon}
			<span data-icon><Icon {...selected[0].icon} /></span>
		{/if}
		<span data-value data-placeholder={selected.length === 0 || undefined}>
			{selected.length ? selected.map((item) => item.label).join(', ') : placeholder}
		</span>
		<span data-icon data-chevron><Icon name="keyboard_arrow_down" /></span>
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
		border-radius: 0.625rem;
		background: light-dark(
			color-mix(in srgb, var(--color-foreground) 6%, var(--color-background)),
			color-mix(in srgb, var(--color-foreground) 10%, var(--color-background))
		);
		color: var(--color-foreground);
		font: inherit;
		text-align: left;
		cursor: pointer;
		transition: background-color 150ms ease;
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
	[data-placeholder] {
		color: color-mix(in srgb, var(--color-muted) 90%, var(--color-foreground));
	}
	[data-icon] {
		color: var(--color-muted);
	}
	[data-icon] {
		display: inline-flex;
		flex: 0 0 auto;
		font-size: var(--internal-icon-size);
	}
	button:hover:not(:disabled) {
		background: light-dark(
			color-mix(in srgb, var(--color-foreground) 8%, var(--color-background)),
			color-mix(in srgb, var(--color-foreground) 12%, var(--color-background))
		);
	}
	[data-chevron] {
		transition: transform 150ms ease;
	}
	button[aria-expanded='true'] [data-chevron] {
		transform: rotate(180deg);
	}
	button:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	@media (prefers-reduced-motion: reduce) {
		button,
		[data-chevron] {
			transition: none;
		}
	}
	@media (forced-colors: active) {
		button:focus-visible {
			outline-color: Highlight;
		}
	}
</style>
