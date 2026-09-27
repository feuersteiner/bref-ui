<script lang="ts">
	import { Icon } from '$lib/index.js';

	let {
		href,
		title,
		current
	}: {
		href: string;
		title: string;
		current?: 'page' | 'location';
	} = $props();
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- Page URLs are resolved by Sidebar; ToC passes current-page fragments. -->
<a {href} aria-current={current}>
	{#if current}<span aria-hidden="true"><Icon name="arrow_forward" size="medium" /></span>{/if}
	{title}
</a>

<style>
	a {
		position: relative;
		display: flex;
		align-items: center;
		min-height: var(--navigation-link-min-height, 48px);
		padding-left: 0;
		color: var(--navigation-link-color, var(--color-muted));
		font: var(--navigation-link-font, inherit);
		text-decoration: none;
	}
	span {
		position: absolute;
		left: 0;
		display: flex;
		align-items: center;
		animation: arrow-in 240ms ease-out both;
	}
	a:hover {
		color: var(--color-foreground);
	}
	a[aria-current] {
		padding-left: var(--navigation-link-current-indent, 48px);
		color: var(--navigation-link-current-color, var(--color-primary));
		animation: selection-in 240ms ease-out both;
	}
	@keyframes selection-in {
		from {
			padding-left: 0;
		}
		to {
			padding-left: var(--navigation-link-current-indent, 48px);
		}
	}
	@keyframes arrow-in {
		from {
			opacity: 0;
			transform: translateX(-24px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		a[aria-current],
		span {
			animation: none;
		}
	}
</style>
