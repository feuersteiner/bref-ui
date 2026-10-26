<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import { surface } from '../../theme/surface.js';
	import ChevronButton from './chevron-button.svelte';
	import DeleteButton from './delete-button.svelte';
	import Content from './content.svelte';
	import RecursiveNode from './tree-node.svelte';
	import type { TreeNodeProps } from 'bref-ui/types';

	let {
		item,
		selection = $bindable(),
		defaultExpanded = false,
		glass = false,
		onDelete,
		indent = 0
	}: TreeNodeProps = $props();

	// svelte-ignore state_referenced_locally
	let expanded = $state(defaultExpanded);
	const childrenId = $props.id();

	const selected = $derived(
		Array.isArray(selection) ? selection.includes(item.id) : selection === item.id
	);
	const select = () => {
		selection = Array.isArray(selection)
			? selected
				? selection.filter((id) => id !== item.id)
				: [...selection, item.id]
			: item.id;
	};
</script>

<div
	class={selected ? surface({ variant: 'soft', color: 'primary', glass }) : undefined}
	in:fly|global={{ x: -8, duration: prefersReducedMotion.current ? 0 : 200 }}
	out:fly|global={{ x: -8, duration: prefersReducedMotion.current ? 0 : 150 }}
	data-selected={selected}
	data-disabled={item.disabled}
	style:padding-left={`calc(0.25rem + ${indent} * var(--tree-action-size))`}
>
	{#if item.children?.length}
		<ChevronButton
			aria-label={`Children of ${item.label}`}
			aria-expanded={expanded}
			aria-controls={childrenId}
			onclick={() => (expanded = !expanded)}
		/>
	{:else}
		<span data-spacer aria-hidden="true"></span>
	{/if}
	<Content {item} aria-pressed={selected} onclick={select} />
	{#if onDelete}
		<DeleteButton
			aria-label={`Delete ${item.label}`}
			disabled={item.disabled}
			onclick={() => onDelete?.(item.id)}
		/>
	{/if}
</div>
{#if item.children?.length && expanded}
	{#each item.children as child (child.id)}
		<RecursiveNode
			indent={indent + 1}
			item={child}
			bind:selection
			{defaultExpanded}
			{onDelete}
			{glass}
		/>
	{/each}
{/if}

<style>
	.bref-surface {
		--surface-color: var(--color-foreground, black);
		--surface-base: var(--color-background, white);
		--surface-foreground: var(--color-foreground, black);
		--surface-tint: var(--surface-color);
		--surface-soft-strength: 24%;
		--surface-neutral-strength: 2%;
		--surface-strength: var(--surface-neutral-strength);
		--surface-hover: 0%;
		--surface-fill: color-mix(in srgb, var(--surface-tint) var(--surface-strength), transparent);
		--surface-border: transparent;
		--surface-content: var(--surface-color);
		--surface-neutral-content: color-mix(
			in srgb,
			var(--surface-color) 80%,
			var(--surface-foreground)
		);
		--surface-highlight: 0 0 0 transparent;
		--surface-shadow: 0 0 0 transparent;
		box-sizing: border-box;
		border: 1px solid var(--surface-border);
		background: var(--surface-fill);
		color: var(--surface-content);
		box-shadow: var(--surface-highlight), var(--surface-shadow);
		transition:
			background-color 150ms ease,
			border-color 150ms ease,
			box-shadow 150ms ease,
			color 150ms ease;
	}
	.bref-surface-primary {
		--surface-color: var(--color-primary, blue);
	}
	.bref-surface-secondary {
		--surface-color: var(--color-secondary, purple);
	}
	.bref-surface-foreground {
		--surface-color: var(--color-foreground, black);
	}
	.bref-surface-background {
		--surface-color: var(--color-background, white);
		--surface-tint: var(--surface-foreground);
		--surface-soft-strength: 5%;
		--surface-content: inherit;
		--surface-neutral-content: inherit;
	}
	.bref-surface-muted {
		--surface-color: var(--color-muted, gray);
	}
	.bref-surface-info {
		--surface-color: var(--color-info, blue);
	}
	.bref-surface-success {
		--surface-color: var(--color-success, green);
	}
	.bref-surface-warning {
		--surface-color: var(--color-warning, brown);
	}
	.bref-surface-error {
		--surface-color: var(--color-error, red);
	}
	.bref-surface-soft {
		--surface-strength: var(--surface-soft-strength);
		--surface-fill: color-mix(
			in srgb,
			var(--surface-tint) var(--surface-strength),
			var(--surface-base)
		);
		--surface-content: color-mix(in srgb, var(--surface-color) 80%, var(--surface-foreground));
	}
	.bref-surface-filled {
		--surface-strength: 100%;
		--surface-fill: color-mix(
			in srgb,
			var(--surface-color) var(--surface-strength),
			var(--surface-foreground)
		);
		--surface-content: var(--surface-base);
	}
	.bref-surface-background.bref-surface-filled {
		--surface-fill: color-mix(
			in srgb,
			var(--surface-base) var(--surface-strength),
			var(--surface-foreground)
		);
	}
	.bref-surface-background:is(.bref-surface-soft, .bref-surface-filled) {
		--surface-content: var(--surface-foreground);
	}
	.bref-surface-shadow-small {
		--surface-shadow: 0 2px 6px color-mix(in srgb, black 8%, transparent);
	}
	.bref-surface-shadow-medium {
		--surface-shadow: 0 0.5rem 1.5rem color-mix(in srgb, black 12%, transparent);
	}
	.bref-surface-shadow-large {
		--surface-shadow: 0 1.5rem 4rem color-mix(in srgb, black 20%, transparent);
	}
	.bref-surface-hover-small {
		--surface-hover: 2%;
	}
	.bref-surface-hover-medium {
		--surface-hover: 4%;
	}
	.bref-surface-hover-large {
		--surface-hover: 8%;
	}
	@media (prefers-reduced-motion: reduce) {
		.bref-surface {
			transition: none;
		}
	}
	@media (forced-colors: active) {
		.bref-surface {
			border-color: CanvasText;
			background: Canvas;
			color: CanvasText;
			box-shadow: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
	}

	.bref-glass {
		--glass-paint: var(--surface-fill, var(--color-background, white));
		--glass-opacity: 20%;
		--glass-blur: blur(0.75rem) saturate(120%);
	}
	.bref-glass {
		background: var(--glass-paint);
		color: var(--surface-content, var(--color-foreground, black));
		box-shadow:
			inset 0 1px 0 color-mix(in srgb, var(--color-foreground, black) 8%, transparent),
			var(--surface-shadow, 0 0.5rem 1.5rem color-mix(in srgb, black 12%, transparent));
	}
	.bref-glass:where(.bref-surface-neutral) {
		--glass-paint: color-mix(
			in srgb,
			var(--surface-tint) var(--surface-strength),
			var(--surface-base)
		);
	}
	.bref-glass:where(.bref-surface-soft) {
		--glass-opacity: 40%;
	}
	.bref-glass:where(.bref-surface-filled) {
		--glass-opacity: 65%;
	}
	@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
		.bref-glass {
			background: color-mix(in srgb, var(--glass-paint) var(--glass-opacity), transparent);
			-webkit-backdrop-filter: var(--glass-blur);
			backdrop-filter: var(--glass-blur);
		}
	}
	@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
		.bref-glass {
			background: var(--glass-paint);
			box-shadow: var(--surface-shadow, 0 0 0 transparent);
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
	}
	@media (forced-colors: active) {
		.bref-glass {
			border-color: CanvasText;
			background: Canvas;
			color: CanvasText;
			box-shadow: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
	}

	div[data-selected] {
		box-sizing: border-box;
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.25rem;
		min-height: var(--tree-height);
		padding: 0.125rem 0.25rem;
		border: 1px solid transparent;
		border-radius: 999px;
		overflow-wrap: anywhere;
		transition: all 150ms ease;
	}
	[data-spacer] {
		flex: 0 0 var(--tree-action-size);
	}
	div[data-selected='true'] {
		--tree-action-color: var(--color-primary);
	}
	div[data-selected='false']:not([data-disabled='true']):hover {
		background: color-mix(in srgb, var(--color-foreground) 5%, transparent);
	}
	@media (prefers-reduced-motion: reduce) {
		div[data-selected] {
			transition: none;
		}
	}
	@media (forced-colors: active) {
		div[data-selected='true'] {
			outline: 1px solid Highlight;
			outline-offset: -1px;
		}
	}

	:focus-visible {
		outline-color: var(--color-primary);
		outline-offset: 2px;
	}
	.bref-surface {
		--surface-border: var(--vscode-border);
		--surface-soft-strength: 14%;
	}
	.bref-surface-primary.bref-surface-filled {
		--surface-fill: var(--vscode-accent);
		--surface-content: #ffffff;
	}
	@media (forced-colors: active) {
		.bref-surface {
			background: Canvas;
			color: CanvasText;
			border-color: ButtonText;
		}
	}
	@media (forced-colors: active) {
		.bref-surface-primary.bref-surface-filled {
			background: Canvas;
			color: CanvasText;
			border-color: ButtonText;
		}
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
