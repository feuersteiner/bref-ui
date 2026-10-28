<script lang="ts">
	import { MediaQuery } from 'svelte/reactivity';
	import Icon from '../icon/icon.svelte';
	import { surface } from '../theme/surface.js';
	import type { TabItemProps } from 'bref-ui/types';

	let {
		label,
		icon,
		disabled = false,
		selected,
		orientation = 'horizontal',
		width = 'fit',
		size = 'medium',
		filled = false,
		onSelect,
		transitionIn = () => ({}),
		transitionOut = () => ({})
	}: TabItemProps = $props();
	const smallScreen = new MediaQuery('(max-width: 575px)', false);
	const showLabel = $derived(orientation === 'horizontal' && (!smallScreen.current || selected));
</script>

<button
	type="button"
	role="tab"
	aria-label={label}
	title={orientation === 'vertical' ? label : undefined}
	aria-selected={selected ?? false}
	data-width={orientation === 'horizontal' ? width : undefined}
	data-size={size}
	data-orientation={orientation}
	data-icon-only={!showLabel}
	tabindex={selected === undefined ? undefined : selected ? 0 : -1}
	{disabled}
	onclick={onSelect}
>
	{#if orientation === 'vertical'}
		<span class="activity-icon" aria-hidden="true">
			<Icon name={icon} filled={selected === true} />
		</span>
	{:else}
		<span class="editor-icon" aria-hidden="true">
			<Icon name={icon} filled={filled || selected === true} />
		</span>
	{/if}
	{#if showLabel}<span>{label}</span>{/if}
	{#if selected}
		<i
			class={surface({ color: 'primary', variant: 'soft', glass: true })}
			aria-hidden="true"
			in:transitionIn
			out:transitionOut
		></i>
	{/if}
</button>

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

	button {
		--internal-selected-foreground: color-mix(
			in srgb,
			var(--color-primary) 80%,
			var(--color-foreground)
		);
		--internal-hover-background: color-mix(in srgb, var(--color-primary) 5%, transparent);
		--internal-height: 2.75rem;
		--internal-padding: 0.875rem;
		--internal-font-size: 0.875rem;
		position: relative;
		isolation: isolate;
		box-sizing: border-box;
		display: inline-flex;
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: max-content;
		min-width: var(--internal-height);
		min-height: var(--internal-height);
		padding: 0.25rem var(--internal-padding);
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: var(--color-primary);
		font: inherit;
		font-size: var(--internal-font-size);
		font-weight: 500;
		line-height: 1.5;
		text-align: start;
		white-space: nowrap;
		cursor: pointer;
		transition:
			color 150ms ease,
			background-color 150ms ease;
	}
	button[data-size='small'] {
		--internal-height: 2.25rem;
		--internal-padding: 0.625rem;
		--internal-font-size: 0.8125rem;
	}
	button[data-size='large'] {
		--internal-height: 3.25rem;
		--internal-padding: 1.125rem;
		--internal-font-size: 1rem;
	}
	button[data-width='fill'] {
		flex: 1 1 auto;
		width: auto;
		max-width: 100%;
		padding-inline: calc(var(--internal-padding) * 0.6);
	}
	button[data-orientation='vertical'] {
		justify-content: start;
		width: 100%;
		max-width: 100%;
	}
	button[data-icon-only='true'] {
		justify-content: center;
		padding-inline: calc(var(--internal-padding) * 0.85);
	}
	button[aria-selected='true'] {
		color: var(--internal-selected-foreground);
	}
	button:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
	button:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}
	span {
		display: block;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	i {
		position: absolute;
		inset: 0;
		z-index: -1;
		border-radius: inherit;
		pointer-events: none;
	}
	@media (pointer: coarse) {
		button[data-size='small'] {
			--internal-height: 44px;
		}
	}
	@media (hover: hover) {
		button:hover:not(:disabled, [aria-selected='true']) {
			background: var(--internal-hover-background);
			color: var(--color-primary);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		button {
			transition: none;
		}
	}
	@media (forced-colors: active) {
		button[aria-selected='true'] {
			outline: 2px solid Highlight;
			outline-offset: -2px;
		}
		button:focus-visible {
			outline-style: dashed;
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
	[role='tab'] {
		min-height: 35px;
		padding: 8px 12px;
		border-inline-end: 1px solid var(--vscode-border);
		border-radius: 2px;
		color: #a0a0a0;
		font-size: 13px;
		font-weight: 400;
	}
	[role='tab'] > i {
		inset-block-end: auto;
		block-size: 2px;
		border: 0;
		border-radius: 0;
		background: var(--vscode-accent);
		box-shadow: none;
		-webkit-backdrop-filter: none;
		backdrop-filter: none;
	}
	[role='tab'][aria-selected='true'] {
		background: var(--color-background);
		color: #ffffff;
	}
	[role='tab']:hover:not(:disabled, [aria-selected='true']) {
		background: #2d2d2d;
		color: #ffffff;
	}
	[role='tab']:focus-visible {
		outline: 1px solid var(--color-primary);
		outline-offset: -3px;
	}
	[role='tab']:disabled {
		color: var(--color-muted);
		opacity: 0.45;
	}
	[role='tab'][data-width='fill'] {
		flex-basis: 0;
		justify-content: center;
		padding-inline: 8px;
	}
	/* VS Code 1.143.1 Modern UI connected editor tabs: 24px labels in a 32px row. */
	[role='tab'][data-orientation='horizontal'] {
		--internal-height: 31px;
		--internal-padding: 8px;
		min-height: var(--internal-height);
		padding: 0 var(--internal-padding);
		padding-inline-start: calc(var(--internal-padding) - 2px);
		border: 0;
		border-radius: 7px 7px 0 0;
		background: transparent;
		color: #9d9d9d;
		font-size: 13px;
		transition: none;
	}
	[role='tab'][data-orientation='horizontal'][data-size='small'] {
		--internal-height: 27px;
		--internal-padding: 6px;
		font-size: 12px;
	}
	[role='tab'][data-orientation='horizontal'][data-size='large'] {
		--internal-height: 35px;
		--internal-padding: 10px;
		font-size: 14px;
	}
	.editor-icon {
		display: inline-flex;
		flex-shrink: 0;
		overflow: visible;
		font-size: 16px;
		line-height: 1;
	}
	[data-size='small'] > .editor-icon {
		font-size: 14px;
	}
	[data-size='large'] > .editor-icon {
		font-size: 18px;
	}
	[role='tab'][data-orientation='horizontal'][aria-selected='true'] {
		background: transparent;
		color: #ffffff;
	}
	[role='tab'][data-orientation='horizontal'] > i {
		inset: 0 0 -1px;
		block-size: auto;
		border: 1px solid transparent;
		border-bottom: 0;
		border-radius: inherit;
		background: var(--color-background);
	}
	[role='tab'][data-orientation='horizontal'] > i::before,
	[role='tab'][data-orientation='horizontal'] > i::after {
		content: '';
		position: absolute;
		bottom: 0;
		width: 7px;
		height: 7px;
		clip-path: inset(0);
		pointer-events: none;
	}
	[role='tab'][data-orientation='horizontal'] > i::before {
		right: 100%;
		border-bottom-right-radius: 7px;
		box-shadow: 3.5px 3.5px 0 3.5px var(--color-background);
	}
	[role='tab'][data-orientation='horizontal'] > i::after {
		left: 100%;
		border-bottom-left-radius: 7px;
		box-shadow: -3.5px 3.5px 0 3.5px var(--color-background);
	}
	[role='tab'][data-orientation='horizontal']:first-child > i::before {
		content: none;
	}
	[role='tab'][data-orientation='horizontal']:hover:not(:disabled, [aria-selected='true']) {
		background: transparent;
	}
	[role='tab'][data-orientation='horizontal']:hover:not(:disabled, [aria-selected='true'])::after {
		content: '';
		position: absolute;
		inset: 0 2px;
		z-index: -1;
		border-radius: 4px;
		background: color-mix(in srgb, var(--color-foreground) 6%, #2b2b2b);
		pointer-events: none;
	}

	/* The connected editor-tab silhouette, turned toward the content beside the strip. */
	[role='tab'][data-orientation='vertical'] {
		--internal-height: 31px;
		--internal-join-offset: 3.5px;
		justify-content: center;
		width: var(--internal-height);
		min-width: var(--internal-height);
		min-height: var(--internal-height);
		height: var(--internal-height);
		padding: 0;
		border: 0;
		border-radius: 0;
		border-start-start-radius: 7px;
		border-end-start-radius: 7px;
		background: transparent;
		color: #9d9d9d;
		font-size: 13px;
		transition: none;
	}
	[role='tab'][data-orientation='vertical']:dir(rtl) {
		--internal-join-offset: -3.5px;
	}
	[role='tab'][data-orientation='vertical'][data-size='small'] {
		--internal-height: 27px;
		font-size: 12px;
	}
	[role='tab'][data-orientation='vertical'][data-size='large'] {
		--internal-height: 35px;
		font-size: 14px;
	}
	[role='tab'][data-orientation='vertical'][aria-selected='true'] {
		background: transparent;
		color: #ffffff;
	}
	[role='tab'][data-orientation='vertical'] > i {
		inset: 0;
		inset-inline-end: -1px;
		block-size: auto;
		border: 1px solid transparent;
		border-inline-end: 0;
		border-radius: inherit;
		background: var(--color-background);
	}
	[role='tab'][data-orientation='vertical'] > i::before,
	[role='tab'][data-orientation='vertical'] > i::after {
		content: '';
		position: absolute;
		inset-inline-end: 0;
		inline-size: 7px;
		block-size: 7px;
		clip-path: inset(0);
		pointer-events: none;
	}
	[role='tab'][data-orientation='vertical'] > i::before {
		inset-block-end: 100%;
		border-end-end-radius: 7px;
		box-shadow: var(--internal-join-offset) 3.5px 0 3.5px var(--color-background);
	}
	[role='tab'][data-orientation='vertical'] > i::after {
		inset-block-start: 100%;
		border-start-end-radius: 7px;
		box-shadow: var(--internal-join-offset) -3.5px 0 3.5px var(--color-background);
	}
	[role='tab'][data-orientation='vertical']:first-child > i::before {
		content: none;
	}
	[role='tab'][data-orientation='vertical']:focus-visible {
		outline: 1px solid var(--vscode-accent);
		outline-offset: -3px;
	}
	[role='tab'][data-orientation='vertical']:disabled {
		color: var(--color-muted);
		opacity: 0.4;
		cursor: default;
	}
	.activity-icon {
		display: inline-flex;
		flex-shrink: 0;
		overflow: visible;
		font-size: 16px;
		line-height: 1;
	}
	[data-size='small'] > .activity-icon {
		font-size: 14px;
	}
	[data-size='large'] > .activity-icon {
		font-size: 18px;
	}
	.activity-icon :global(span) {
		font-variation-settings:
			'FILL' 0,
			'wght' 100;
	}
	.activity-icon :global(.filled) {
		font-variation-settings:
			'FILL' 1,
			'wght' 100;
	}
	@media (hover: hover) {
		[role='tab'][data-orientation='vertical']:hover:not(:disabled, [aria-selected='true']) {
			background: transparent;
			color: #ffffff;
		}
		[role='tab'][data-orientation='vertical']:hover:not(:disabled, [aria-selected='true'])::after {
			content: '';
			position: absolute;
			inset: 2px 0;
			z-index: -1;
			border-radius: 4px;
			background: color-mix(in srgb, var(--color-foreground) 6%, #2b2b2b);
			pointer-events: none;
		}
	}
	@media (pointer: coarse) {
		[role='tab'],
		[role='tab'][data-orientation='horizontal'] {
			min-height: 44px;
		}
		[role='tab'][data-orientation='vertical'] {
			width: max(44px, var(--internal-height));
			min-width: 44px;
			min-height: 44px;
		}
	}
	@media (forced-colors: active) {
		[role='tab'] {
			background: Canvas;
			color: CanvasText;
			border-color: ButtonText;
		}
		[role='tab'] > i {
			background: Highlight;
		}
		[role='tab'][data-orientation='vertical'],
		[role='tab'][data-orientation='vertical']:is([aria-selected='true'], :focus-visible),
		[role='tab'][data-orientation='vertical']:hover:not(:disabled, [aria-selected='true']) {
			background: Canvas;
			color: CanvasText;
		}
		[role='tab'][data-orientation='vertical'] > i {
			background: Canvas;
			border: 1px solid Highlight;
		}
		[role='tab'][data-orientation='vertical'] > i::before,
		[role='tab'][data-orientation='vertical'] > i::after,
		[role='tab'][data-orientation='vertical']::after {
			display: none;
		}
		[role='tab'][data-orientation='vertical'][aria-selected='true']:not(:focus-visible) {
			outline: none;
		}
		[role='tab'][data-orientation='vertical']:disabled {
			color: GrayText;
			opacity: 1;
		}
		[role='tab'][data-orientation='vertical']:focus-visible {
			outline-color: Highlight;
		}
		[role='tab']:focus-visible {
			outline-color: Highlight;
		}
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

	@media (forced-colors: active) {
		[role='tab'][data-orientation='horizontal'],
		[role='tab'][data-orientation='horizontal'][aria-selected='true'],
		[role='tab'][data-orientation='horizontal']:hover:not(:disabled, [aria-selected='true']) {
			background: Canvas;
			color: CanvasText;
		}
		[role='tab'][data-orientation='horizontal'] > i {
			background: Canvas;
			border: 1px solid Highlight;
		}
		[role='tab'][data-orientation='horizontal'] > i::before,
		[role='tab'][data-orientation='horizontal'] > i::after,
		[role='tab'][data-orientation='horizontal']::after {
			display: none;
		}
		[role='tab'][data-orientation='horizontal'][aria-selected='true']:not(:focus-visible) {
			outline: none;
		}
		[role='tab'][data-orientation='horizontal']:disabled {
			color: GrayText;
			opacity: 1;
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
