<script lang="ts">
	/* eslint-disable max-lines -- Keep the route theme in its layout. */
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
</script>

<div data-relay>{@render children()}</div>

<style>
	:global {
		[data-relay] {
			--font-text: 'Inter Variable', sans-serif;
			--relay-rule: color-mix(in srgb, var(--color-foreground) 9%, transparent);
			--relay-panel: color-mix(in srgb, white 65%, transparent);
			min-height: calc(100dvh - 43px);
			font-family: var(--font-text);
			background:
				radial-gradient(ellipse at 90% 20%, #e5eafa, transparent 55%), var(--color-background);
		}
		[data-relay] [data-workspace] {
			max-width: 1380px;
			margin: auto;
			padding: 0 48px;
		}
		[data-relay] [data-workspace-nav] {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 24px;
			min-height: 100px;
		}
		[data-relay] [data-brand] {
			display: flex;
			align-items: center;
			gap: 10px;
			font-size: 24px;
			font-weight: 550;
			letter-spacing: -0.04em;
			text-decoration: none;
		}
		[data-relay] [data-workspace-nav] nav {
			display: flex;
			align-items: center;
			gap: 10px;
		}
		[data-relay] [data-workspace-nav] nav label {
			width: 230px;
		}
		[data-relay] [data-team] {
			display: flex;
			gap: 6px;
		}
		[data-relay] [data-avatar] {
			display: inline-grid;
			place-items: center;
			flex-shrink: 0;
			width: 30px;
			height: 30px;
			border-radius: 50%;
			background: #e4eaf3;
			color: var(--color-foreground);
			font-size: 10px;
		}
		[data-relay] [data-project-stage] {
			position: relative;
			isolation: isolate;
			height: 244px;
			border-radius: 24px;
			overflow: hidden;
			background: #dce5ef;
		}
		[data-relay] [data-project-stage] > img {
			position: absolute;
			inset: 0;
			width: 100%;
			height: 100%;
			object-fit: cover;
			object-position: center 55%;
			z-index: -2;
		}
		[data-relay] [data-project-stage]::after {
			content: '';
			position: absolute;
			inset: 0;
			z-index: -1;
			background: linear-gradient(90deg, #18283c99, #18283c0a);
		}
		[data-relay] [data-project-stage][data-project='website'] > img {
			object-position: center 65%;
		}
		[data-relay] [data-project-stage][data-project='website']::after {
			background: linear-gradient(90deg, #27395088, #27395000);
		}
		[data-relay] [data-project-caption] {
			height: 100%;
			display: flex;
			align-items: end;
			justify-content: space-between;
			gap: 24px;
			padding: 32px;
		}
		[data-relay] [data-project-stage] h1 {
			font: 450 clamp(30px, 4vw, 44px)/1.1 var(--font-text);
			letter-spacing: -0.05em;
			color: white;
		}
		[data-relay] [data-project-progress] {
			min-width: 208px;
			gap: 12px;
			font-size: 12px;
			color: var(--color-foreground);
		}
		[data-relay] [data-project-progress] > span {
			display: flex;
			align-items: center;
			gap: 8px;
		}
		[data-relay] [data-tasks] {
			padding-top: 36px;
		}
		[data-relay] [data-toolbar],
		[data-relay] [data-task-actions] {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 16px;
		}
		[data-relay] [data-toolbar] {
			padding-bottom: 20px;
		}
		[data-relay] [data-toolbar] h2 {
			display: flex;
			align-items: center;
			gap: 10px;
			font-size: 18px;
		}
		[data-relay] [data-task-actions] > div {
			width: min(360px, 42vw);
		}
		[data-relay] .button {
			border-radius: 999px;
		}
		[data-relay] [data-task-board] {
			list-style: none;
		}
		[data-relay] [data-task] {
			--relay-title-row: 1;
			--relay-meta-row: 2;
			display: grid;
			grid-template-columns: 20px minmax(170px, 1fr) auto 80px 36px;
			align-items: center;
			gap: 18px;
			padding: 20px 22px;
			margin-bottom: 10px;
			border-radius: 18px;
			background: var(--relay-panel);
			backdrop-filter: blur(20px);
			box-shadow: 0 1px 0 #ffffffcc;
		}
		[data-relay] [data-task-content] {
			min-width: 0;
		}
		[data-relay] [data-task] > [data-checkbox],
		[data-relay] [data-task-content],
		[data-relay] [data-task-tags],
		[data-relay] [data-assignee],
		[data-relay] [data-task] > .button {
			grid-row: var(--relay-title-row);
		}
		[data-relay] [data-task-content] h3 {
			font: 400 15px/1.5 var(--font-text);
			letter-spacing: -0.02em;
			overflow-wrap: anywhere;
		}
		[data-relay] [data-task][data-done='true'] h3:not([data-completed-heading]) {
			text-decoration: line-through;
			color: var(--color-muted);
		}
		[data-relay] [data-task][data-done='true'] {
			background: #ffffff44;
		}
		[data-relay] [data-task-tags] {
			display: flex;
			flex-wrap: wrap;
			gap: 8px;
		}
		[data-relay] [data-completed-heading] {
			grid-column: 1/-1;
			grid-row: 1;
			font: 500 12px/1.4 var(--font-text);
			color: var(--color-muted);
			padding-bottom: 4px;
		}
		[data-relay] [data-task]:has([data-completed-heading]) {
			--relay-title-row: 2;
			--relay-meta-row: 3;
			margin-top: 28px;
		}
		[data-relay] [data-assignee] {
			display: flex;
			align-items: center;
			gap: 8px;
			font-size: 12px;
		}
		[data-relay] [data-empty] {
			padding: 40px 0;
			color: var(--color-muted);
		}
		[data-relay] [data-work-footer] {
			padding: 18px 0;
			color: var(--color-muted);
			font-size: 11px;
		}
		[data-relay] [data-announcement] {
			min-height: 24px;
			color: var(--color-primary);
			font-size: 12px;
			padding-bottom: 24px;
		}
		[data-relay] [data-actions] .button {
			border-radius: 999px;
		}
		@media (max-width: 1100px) {
			[data-relay] [data-workspace] {
				padding-inline: 28px;
			}
			[data-relay] [data-team] {
				display: none;
			}
			[data-relay] [data-task] {
				grid-template-columns: 20px minmax(0, 1fr) 80px 36px;
				gap: 12px;
			}
			[data-relay] [data-task-content] {
				grid-column: 2;
			}
			[data-relay] [data-task-tags] {
				grid-column: 2;
				grid-row: var(--relay-meta-row);
			}
			[data-relay] [data-assignee] {
				grid-column: 3;
				grid-row: var(--relay-title-row) / span 2;
			}
			[data-relay] [data-task] > .button {
				grid-column: 4;
				grid-row: var(--relay-title-row) / span 2;
			}
		}
		@media (max-width: 650px) {
			[data-relay] [data-workspace] {
				padding-inline: 20px;
			}
			[data-relay] [data-workspace-nav] {
				align-items: start;
				flex-direction: column;
				gap: 16px;
				padding-block: 24px;
			}
			[data-relay] [data-workspace-nav] nav {
				width: 100%;
			}
			[data-relay] [data-workspace-nav] nav label {
				min-width: 0;
				flex: 1;
			}
			[data-relay] [data-project-stage] {
				height: 260px;
				border-radius: 20px;
			}
			[data-relay] [data-project-caption] {
				align-items: start;
				justify-content: end;
				flex-direction: column;
				gap: 20px;
				padding: 24px;
			}
			[data-relay] [data-project-progress] {
				min-width: 190px;
			}
			[data-relay] [data-toolbar] {
				align-items: center;
				flex-direction: row;
				flex-wrap: wrap;
				gap: 16px;
			}
			[data-relay] [data-task-actions] {
				width: 100%;
			}
			[data-relay] [data-task-actions] > div {
				min-width: 0;
				flex: 1;
			}
			[data-relay] [data-task] {
				grid-template-columns: 20px minmax(0, 1fr) 32px;
				padding: 18px 16px;
				gap: 12px;
			}
			[data-relay] [data-task-content] {
				grid-column: 2;
			}
			[data-relay] [data-task] > .button {
				grid-column: 3;
				grid-row: var(--relay-title-row);
			}
			[data-relay] [data-assignee] {
				grid-column: 2/4;
				grid-row: calc(var(--relay-meta-row) + 1);
			}
			[data-relay] [data-task-tags] {
				grid-column: 2/4;
			}
			[data-relay] [data-avatar] {
				width: 24px;
				height: 24px;
			}
		}
		@media (prefers-reduced-motion: reduce) {
			[data-relay] * {
				transition-duration: 0ms;
			}
		}

		[data-relay] [data-task] > [data-checkbox] {
			--internal-size: 1.375rem;
			border-radius: 0.5rem;
			border-color: #6e829e;
			background: linear-gradient(145deg, #fff, #eaf0f8);
			box-shadow:
				inset 0 1px 2px #2633460a,
				0 1px 2px #2633460a;
			transition:
				background-color 160ms,
				border-color 160ms,
				box-shadow 160ms;
		}
		[data-relay] [data-task] > [data-checkbox]:has(input:checked) {
			background: linear-gradient(145deg, #587da8, #375b86);
			border-color: #375b86;
			box-shadow: 0 2px 5px #375b8626;
		}
		[data-relay] [data-task] > [data-checkbox]:has(input:hover:not(:disabled)) {
			border-color: var(--color-primary);
			box-shadow: 0 0 0 3px #375b860c;
		}
		[data-relay] input:not([type='checkbox']):focus-visible {
			outline: none;
		}
		@media (prefers-reduced-motion: reduce) {
			[data-relay] [data-task] > [data-checkbox] {
				transition: none;
			}
		}
	}
</style>
