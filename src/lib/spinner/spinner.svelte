<script lang="ts">
	import type { SpinnerProps } from './types.js';

	let { label, size }: SpinnerProps = $props();
</script>

<div role={label ? 'status' : undefined} aria-hidden={label ? undefined : 'true'} data-size={size}>
	<span aria-hidden="true"></span>
	{#if label}<i>{label}</i>{/if}
</div>

<style>
	@property --spinner-sweep {
		syntax: '<angle>';
		inherits: false;
		initial-value: 90deg;
	}
	div {
		--spinner-track: color-mix(
			in srgb,
			color-mix(in srgb, var(--color-foreground) 16%, var(--color-background)) 85%,
			transparent
		);
		--spinner-fill: color-mix(
			in srgb,
			color-mix(in srgb, var(--color-primary) 88%, var(--color-background)) 85%,
			transparent
		);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1em;
		height: 1em;
		font-size: inherit;
		color: var(--color-primary);
	}
	div[data-size='x-small'] {
		font-size: 0.875rem;
	}
	div[data-size='small'] {
		font-size: 1rem;
	}
	div[data-size='medium'] {
		font-size: 1.5rem;
	}
	div[data-size='large'] {
		font-size: 2.5rem;
	}
	div[data-size='x-large'] {
		font-size: 5rem;
	}
	span {
		box-sizing: border-box;
		width: 80%;
		height: 80%;
		padding: max(2px, 0.12em);
		background: conic-gradient(
			var(--spinner-fill) 0deg var(--spinner-sweep),
			var(--spinner-track) var(--spinner-sweep) 360deg
		);
		box-shadow: inset 0 1px 0 color-mix(in srgb, var(--color-foreground) 28%, transparent);
		-webkit-backdrop-filter: blur(0.5rem) saturate(120%);
		backdrop-filter: blur(0.5rem) saturate(120%);
		mask:
			linear-gradient(black, black) content-box,
			linear-gradient(black, black);
		mask-composite: exclude;
		border-radius: 50%;
		animation: spin 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
	}
	i {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
	@keyframes spin {
		0% {
			--spinner-sweep: 30deg;
			transform: rotate(0deg);
		}
		50% {
			--spinner-sweep: 270deg;
			transform: rotate(180deg);
		}
		100% {
			--spinner-sweep: 30deg;
			transform: rotate(360deg);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		span {
			animation: none;
		}
	}
	@media (forced-colors: active) {
		span {
			padding: 0;
			mask: none;
			border: max(2px, 0.12em) solid CanvasText;
			border-color: CanvasText;
			border-top-color: Highlight;
			background: none;
			box-shadow: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
	}
</style>
