<script module lang="ts">
	import type { IconProps } from '../types.js';
	export interface TreeNodeProps {
		id: string;
		label: string;
		icon?: Omit<IconProps, 'label' | 'size' | 'color'>;
		onClose?: () => void;
		onClick: () => void;
		items?: TreeNodeProps[];
		disabled?: boolean;
		open?: boolean;
		selected?: boolean;
		tabIndex?: number;
		level?: number;
		position?: number;
		siblingCount?: number;
		onFocus?: () => void;
		onToggle?: () => void;
	}
</script>

<script lang="ts">
	/* eslint-disable max-lines -- Keep the recursive row markup and scoped styles together. */
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import Icon from '../icon/icon.svelte';
	import RecursiveNode from './tree-node.svelte';
	let {
		id,
		label,
		icon,
		onClose,
		onClick,
		items = [],
		disabled,
		open = false,
		selected = false,
		tabIndex = -1,
		level = 0,
		position,
		siblingCount,
		onFocus,
		onToggle
	}: TreeNodeProps = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	role="treeitem"
	in:fly|global={{
		y: prefersReducedMotion.current ? 0 : -6,
		duration: prefersReducedMotion.current ? 0 : 150
	}}
	data-tree-id={id}
	aria-label={label}
	aria-level={level + 1}
	style:--tree-level={level}
	aria-posinset={position}
	aria-setsize={siblingCount}
	aria-expanded={items.length ? open : undefined}
	aria-selected={disabled ? undefined : selected}
	aria-disabled={disabled && !items.length ? true : undefined}
	title={disabled && items.length ? 'Unavailable for selection' : undefined}
	data-disabled={disabled ? 'true' : undefined}
	tabindex={tabIndex}
	onfocus={(event) => {
		if (event.target === event.currentTarget) onFocus?.();
	}}
	onclick={(event) => {
		if (
			event.target instanceof Element &&
			event.target.closest('[role="treeitem"]') === event.currentTarget &&
			!event.target.closest('button, [data-disclosure]')
		)
			onClick();
	}}
>
	<span data-row>
		{#if items.length}
			<button
				type="button"
				data-disclosure
				aria-label={`${open ? 'Collapse' : 'Expand'} ${label}`}
				tabindex="-1"
				onfocus={() => onFocus?.()}
				onclick={(event) => {
					event.stopPropagation();
					onToggle?.();
				}}
			>
				<span data-chevron data-open={open}><Icon name="chevron_right" /></span>
			</button>
		{:else}<span data-spacer aria-hidden="true"></span>{/if}
		<span data-icon>
			{#if icon}<Icon {...icon} label={undefined} />{/if}
		</span>
		<span data-label>{label}</span>
		{#if onClose}
			<button
				type="button"
				aria-label={`Delete ${label}`}
				{disabled}
				tabindex="-1"
				onfocus={() => onFocus?.()}
				onclick={(event) => {
					event.stopPropagation();
					onClose?.();
				}}
			>
				<Icon name="close" />
			</button>
		{/if}
	</span>
	{#if open && items.length}
		<div role="group" data-children>
			{#each items as item (item.id)}
				<RecursiveNode {...item} />
			{/each}
		</div>
	{/if}
</div>

<style>
	[role='treeitem'] {
		display: grid;
		gap: 0.375rem;
		width: 100%;
		min-width: 0;
		border-radius: 999px;
		outline: none;
		cursor: pointer;
	}
	[data-children] {
		display: grid;
		gap: 0.375rem;
		min-width: 0;
	}
	[data-row] {
		--tree-tint: 0%;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		min-height: var(--tree-height);
		padding: 0.25rem 0.5rem;
		padding-inline-start: calc(0.5rem + var(--tree-level) * 1.25rem);
		border: 1px solid transparent;
		border-radius: inherit;
		background: color-mix(in srgb, var(--color-primary) var(--tree-tint), transparent);
		transition: all 150ms;
	}
	[role='treeitem']:not([data-disabled='true']) > [data-row]:hover {
		--tree-tint: 8%;
	}
	[role='treeitem'][aria-selected='true'] > [data-row] {
		--tree-tint: 16%;
		background: color-mix(
			in srgb,
			color-mix(in srgb, var(--color-primary) var(--tree-tint), var(--color-background)) 85%,
			transparent
		);
		border-color: color-mix(in srgb, var(--color-primary) 30%, transparent);
		box-shadow:
			inset 0 1px 0 color-mix(in srgb, var(--color-foreground) 16%, transparent),
			0 2px 6px color-mix(in srgb, var(--color-foreground) 8%, transparent);
		-webkit-backdrop-filter: blur(0.5rem) saturate(120%);
		backdrop-filter: blur(0.5rem) saturate(120%);
		color: var(--color-primary);
	}
	[role='treeitem'][aria-selected='true'] > [data-row]:hover {
		--tree-tint: 22%;
		border-color: color-mix(in srgb, var(--color-primary) 40%, transparent);
	}
	[role='treeitem']:not([data-disabled='true']) > [data-row]:active {
		--tree-tint: 26%;
	}
	[role='treeitem'][aria-selected='true'] > [data-row]:active {
		--tree-tint: 28%;
	}
	[role='treeitem'][data-disabled='true'] > [data-row] {
		color: var(--color-muted);
	}
	[role='treeitem']:focus-visible > [data-row] {
		outline: 2px solid var(--color-primary);
		outline-offset: -2px;
	}
	[data-spacer] {
		flex: 0 0 var(--tree-action-size);
	}
	[data-icon] {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: 0 0 var(--tree-icon-size);
		font-size: var(--tree-icon-size);
	}
	[data-chevron] {
		display: inline-flex;
		transition: all 150ms;
	}
	[data-chevron][data-open='true'] {
		transform: rotate(90deg);
	}
	[data-label] {
		flex: 1;
		min-width: 0;
		overflow-wrap: anywhere;
	}
	button {
		display: inline-grid;
		place-items: center;
		flex: 0 0 var(--tree-action-size);
		width: var(--tree-action-size);
		height: var(--tree-action-size);
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: transparent;
		color: inherit;
		font-size: var(--tree-icon-size);
		cursor: pointer;
		transition: all 150ms;
	}
	button:not(:disabled):hover {
		background: color-mix(in srgb, var(--color-primary) 12%, transparent);
	}
	button:focus-visible {
		outline: 2px solid var(--color-primary);
	}
	button:disabled {
		cursor: default;
		opacity: 0.5;
	}
	@media (prefers-reduced-motion: reduce) {
		[data-row],
		[data-chevron],
		button {
			transition: none;
		}
	}
	@media (forced-colors: active) {
		[role='treeitem'][aria-selected='true'] > [data-row] {
			outline: 1px solid Highlight;
			border-color: Highlight;
			background: Canvas;
			box-shadow: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
			color: Highlight;
		}
		[role='treeitem']:focus-visible > [data-row] {
			outline-color: Highlight;
		}
		[role='treeitem'][data-disabled='true'] > [data-row] {
			color: GrayText;
		}
	}
</style>
