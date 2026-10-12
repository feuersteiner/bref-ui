<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Theme, ThemeModeToggle } from '$lib/index.js';
	import { page } from '$app/state';
	import DemoNav from './demo-nav.svelte';
	import '@fontsource-variable/inter';
	let { children }: { children: Snippet } = $props();
</script>

<Theme
	palette={{
		primary: '#375b86',
		secondary: '#695985',
		background: '#f3f6fa',
		foreground: '#263346',
		muted: '#59677b',
		success: '#326b58'
	}}
>
	<ThemeModeToggle mode="light" />
	<div data-demo-root data-active-demo={page.route.id?.split('/').at(-1)}>
		<DemoNav />
		{@render children()}
	</div>
</Theme>

<style>
	:global {
		html:has([data-demo-root]),
		[data-demo-root] :where(main, dialog, [data-scroll], [data-content]) {
			scroll-behavior: smooth;
			scroll-padding-block: 24px;
		}
		@media (prefers-reduced-motion: reduce) {
			html:has([data-demo-root]),
			[data-demo-root] :where(main, dialog, [data-scroll], [data-content]) {
				scroll-behavior: auto;
			}
		}
		body:has([data-demo-root]) {
			font:
				400 14px/1.6 'Inter Variable',
				sans-serif;
			font-synthesis: none;
		}
		[data-demo-root] h1,
		[data-demo-root] h2,
		[data-demo-root] h3 {
			font-weight: 500;
			line-height: 1.15;
		}
		[data-demo-root] a:not(.surface) {
			color: inherit;
		}
		[data-demo-root] button,
		[data-demo-root] input,
		[data-demo-root] select {
			font: inherit;
		}
		[data-demo-root] button:not(:disabled),
		[data-demo-root] summary {
			cursor: pointer;
		}
		[data-demo-root] :focus-visible:not(input):not(textarea) {
			outline: 2px solid var(--color-primary);
			outline-offset: 4px;
		}
		[data-demo-root] img {
			display: block;
			max-width: 100%;
		}
		[data-demo-root] main {
			min-width: 0;
		}
		[data-demo-root] label {
			display: grid;
			gap: 8px;
		}
		[data-demo-root] p {
			line-height: 1.7;
		}
		[data-demo-root] [data-eyebrow] {
			font-size: 11px;
			letter-spacing: 0.13em;
			text-transform: uppercase;
			font-weight: 600;
		}
		[data-demo-root] [data-muted] {
			color: var(--color-muted);
		}
		[data-demo-root] [data-actions] {
			display: flex;
			align-items: center;
			gap: 12px;
			flex-wrap: wrap;
		}
		[data-demo-root] [data-form] {
			display: grid;
			gap: 20px;
		}

		[data-demo-root] [data-visually-hidden] {
			position: absolute;
			width: 1px;
			height: 1px;
			padding: 0;
			margin: -1px;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
			border: 0;
		}

		[data-demo-root]:not([data-active-demo='relay']) > [data-relay],
		[data-demo-root]:not([data-active-demo='forma']) > [data-forma],
		[data-demo-root]:not([data-active-demo='elsewhere']) > [data-elsewhere] {
			display: none;
		}
	}
</style>
