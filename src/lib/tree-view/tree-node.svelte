<script module lang="ts">
	import type { IconProps } from '../types.js';
	export interface TreeItemProps {
		id: string;
		label: string;
		icon?: Omit<IconProps, 'label' | 'size' | 'color'>;
		parentId?: string;
		sectionId?: string;
		disabled?: boolean;
	}
</script>

<script lang="ts">
	/* eslint-disable max-lines -- Keep the row markup and scoped styles together. */
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import Icon from '../icon/icon.svelte';
	let {
		node,
		level,
		position,
		siblingCount,
		hasChildren,
		open,
		selected,
		activeId,
		onFocus,
		onSelect,
		onToggle,
		onDelete,
		focus
	}: {
		node: Pick<TreeItemProps, 'id' | 'label' | 'icon' | 'disabled'>;
		level: number;
		position: number;
		siblingCount: number;
		hasChildren: boolean;
		open: boolean;
		selected: boolean;
		activeId?: string;
		onFocus: (id: string) => void;
		onSelect: (id: string) => void;
		onToggle: (id: string) => void;
		onDelete?: (id: string) => void;
		focus: (id: string) => void;
	} = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	role="treeitem"
	in:fly|global={{
		y: prefersReducedMotion.current ? 0 : -6,
		duration: prefersReducedMotion.current ? 0 : 150
	}}
	data-tree-id={node.id}
	aria-label={node.label}
	aria-level={level + 1}
	style:--tree-level={level}
	aria-posinset={position}
	aria-setsize={siblingCount}
	aria-expanded={hasChildren ? open : undefined}
	aria-selected={node.disabled ? undefined : selected}
	aria-disabled={node.disabled && !hasChildren ? true : undefined}
	title={node.disabled && hasChildren ? 'Unavailable for selection' : undefined}
	data-disabled={node.disabled ? 'true' : undefined}
	tabindex={activeId === node.id ? 0 : -1}
	onfocus={(event) => {
		if (event.target === event.currentTarget) onFocus(node.id);
	}}
	onclick={(event) => {
		if (
			event.target instanceof Element &&
			event.target.closest('[role="treeitem"]') === event.currentTarget &&
			!event.target.closest('button, [data-disclosure]')
		) {
			onSelect(node.id);
			focus(node.id);
		}
	}}
>
	<span data-row>
		{#if hasChildren}
			<button
				type="button"
				data-disclosure
				aria-label={`${open ? 'Collapse' : 'Expand'} ${node.label}`}
				tabindex="-1"
				onfocus={() => onFocus(node.id)}
				onclick={(event) => {
					event.stopPropagation();
					onToggle(node.id);
					focus(node.id);
				}}
			>
				<span data-chevron data-open={open}><Icon name="chevron_right" /></span>
			</button>
		{:else}<span data-spacer aria-hidden="true"></span>{/if}
		<span data-icon>
			{#if node.icon}<Icon {...node.icon} label={undefined} />{/if}
		</span>
		<span data-label>{node.label}</span>
		{#if onDelete}
			<button
				type="button"
				aria-label={`Delete ${node.label}`}
				disabled={node.disabled}
				tabindex="-1"
				onfocus={() => onFocus(node.id)}
				onclick={(event) => {
					event.stopPropagation();
					onDelete?.(node.id);
				}}
			>
				<Icon name="close" />
			</button>
		{/if}
	</span>
</div>

<style>
	[role='treeitem'] {
		width: 100%;
		min-width: 0;
		border-radius: 999px;
		outline: none;
		cursor: pointer;
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
	[role='treeitem']:not([data-disabled='true']):hover > [data-row] {
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
	[role='treeitem'][aria-selected='true']:hover > [data-row] {
		--tree-tint: 22%;
		border-color: color-mix(in srgb, var(--color-primary) 40%, transparent);
	}
	[role='treeitem']:not([data-disabled='true']):active > [data-row] {
		--tree-tint: 26%;
	}
	[role='treeitem'][aria-selected='true']:active > [data-row] {
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
