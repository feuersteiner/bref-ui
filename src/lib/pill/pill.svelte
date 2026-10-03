<script lang="ts">
	/* eslint-disable max-lines -- Component recipe and animation remain colocated. */
	import type { PillProps } from './types.js';
	import { fly } from 'svelte/transition';
	import Icon from '../icon/icon.svelte';
	import Button from '../button/button.svelte';

	let {
		children,
		label,
		icon,
		onClick,
		onDelete,
		swoosh = false,
		color = 'foreground',
		size = 'medium',
		variant = 'neutral',
		...attributes
	}: PillProps = $props();
</script>

{#snippet content()}
	{#if icon}
		{#key icon.name}
			<span data-icon in:fly>
				<Icon {...icon} label={undefined} {size} color={undefined} />
			</span>
		{/key}
	{/if}
	<span>{label}</span>
{/snippet}

<div
	{...attributes}
	onclick={onClick}
	data-swoosh={swoosh || undefined}
	data-clickable={onClick ? '' : undefined}
	data-removable={onDelete ? '' : undefined}
	data-color={color}
	data-size={size}
	data-variant={variant}
	style:--pill-color={`var(--color-${color}, #28231f)`}
>
	{#if onClick}
		<button
			type="button"
			data-pill-action
			aria-label={attributes['aria-labelledby'] ? undefined : (attributes['aria-label'] ?? label)}
			aria-labelledby={attributes['aria-labelledby']}
		>
			{@render content()}
		</button>
	{:else}
		{@render content()}
	{/if}
	{@render children?.()}
	{#if onDelete}
		<span data-delete>
			<Button
				icon={{ name: 'close', label: `Remove ${label}` }}
				size="x-small"
				rounded
				onClick={(event) => {
					event.stopPropagation();
					onDelete();
				}}
			/>
		</span>
	{/if}
</div>

<style>
	div {
		--pill-tint: 3%;
		--pill-background: color-mix(
			in srgb,
			color-mix(in srgb, var(--pill-color) var(--pill-tint), var(--color-background, white)) 85%,
			transparent
		);
		--pill-border: color-mix(in srgb, var(--pill-color) 20%, transparent);
		--pill-highlight: color-mix(in srgb, var(--color-foreground, black) 16%, transparent);
		--pill-content: var(--pill-color);
		--pill-padding: 1.125rem;
		--pill-height: 3rem;
		box-sizing: border-box;
		display: inline-flex;
		position: relative;
		isolation: isolate;
		align-items: center;
		gap: 0.5rem;
		justify-content: center;
		min-width: 0;
		max-width: 100%;
		min-height: var(--pill-height);
		padding: 0.25rem var(--pill-padding);
		border: 1px solid var(--pill-border);
		border-radius: 999px;
		background: var(--pill-background);
		box-shadow:
			inset 0 1px 0 var(--pill-highlight),
			0 2px 6px color-mix(in srgb, var(--color-foreground, black) 8%, transparent);
		-webkit-backdrop-filter: blur(0.5rem) saturate(120%);
		backdrop-filter: blur(0.5rem) saturate(120%);
		transition: all 150ms;
		color: var(--pill-content);
		font: inherit;
		line-height: 1.25;
		text-align: center;
		white-space: normal;
		overflow-wrap: anywhere;
		overflow: hidden;
	}
	div[data-size='x-small'] {
		--pill-height: 1.75rem;
		--pill-padding: 0.5rem;
		font-size: 0.8rem;
	}
	div[data-size='small'] {
		--pill-height: 2.5rem;
		--pill-padding: 0.875rem;
	}
	div[data-size='large'] {
		--pill-height: 4rem;
		--pill-padding: 1.5rem;
		font-size: 1.25rem;
	}
	div[data-size='x-large'] {
		--pill-height: 5rem;
		--pill-padding: 2rem;
		font-size: 1.5rem;
	}
	div[data-variant='soft'] {
		--pill-tint: 16%;
		--pill-border: color-mix(in srgb, var(--pill-color) 30%, transparent);
		--pill-content: color-mix(in srgb, var(--pill-color) 80%, var(--color-foreground, black));
	}
	div[data-variant='filled'] {
		--pill-tint: 88%;
		--pill-border: color-mix(in srgb, var(--pill-color) 68%, var(--color-foreground, black));
		--pill-highlight: color-mix(in srgb, var(--color-foreground, black) 28%, transparent);
		--pill-content: color-mix(in srgb, var(--color-background, white) 90%, var(--pill-color));
	}
	div[data-removable] {
		padding-right: 0.25rem;
	}
	div[data-clickable] {
		cursor: pointer;
	}
	[data-delete] {
		position: relative;
		z-index: 1;
		display: inline-flex;
	}
	[data-icon] {
		display: inline-flex;
		align-items: center;
	}
	button[data-pill-action] {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		min-width: 0;
		padding: 0;
		border: 0;
		background: transparent;
		color: inherit;
		font: inherit;
		text-align: inherit;
		white-space: inherit;
		overflow-wrap: inherit;
		cursor: inherit;
	}
	div:has(> button[data-pill-action]:focus-visible) {
		outline: 2px solid var(--color-primary, currentColor);
		outline-offset: 3px;
	}
	button[data-pill-action]:focus-visible {
		outline: none;
	}
	div[data-swoosh]::before {
		position: absolute;
		z-index: -1;
		inset-block: -50%;
		inset-inline-start: -45%;
		width: 40%;
		content: '';
		background: linear-gradient(
			90deg,
			transparent,
			color-mix(in srgb, var(--pill-color) 28%, transparent),
			transparent
		);
		filter: blur(0.3rem);
		opacity: 0;
		pointer-events: none;
		transform: skewX(-18deg);
		animation: pill-swoosh 2s ease-in-out infinite;
	}
	@keyframes pill-swoosh {
		0%,
		20% {
			opacity: 0;
			transform: translateX(0) skewX(-18deg);
		}
		45%,
		60% {
			opacity: 0.75;
		}
		80%,
		100% {
			opacity: 0;
			transform: translateX(400%) skewX(-18deg);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		div {
			transition: none;
		}
		div[data-swoosh]::before {
			animation: none;
		}
	}
	@media (forced-colors: active) {
		div {
			border-color: CanvasText;
			color: CanvasText;
			background: Canvas;
			box-shadow: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
	}
</style>
