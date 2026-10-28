<script lang="ts">
	import type { SpinnerProps } from '#bref-types';

	let { label, size }: SpinnerProps = $props();
</script>

<div role={label ? 'status' : undefined} aria-hidden={label ? undefined : 'true'} data-size={size}>
	<span aria-hidden="true"></span>
	{#if label}<i>{label}</i>{/if}
</div>

<style>
	@property --np-spinner-angle {
		syntax: '<angle>';
		inherits: false;
		initial-value: 0deg;
	}
	@property --np-spinner-sweep {
		syntax: '<angle>';
		inherits: false;
		initial-value: 90deg;
	}
	div {
		--spinner-track: color-mix(in srgb, currentColor 18%, transparent);
		--spinner-fill: currentColor;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1em;
		height: 1em;
		font-size: inherit;
		color: inherit;
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
		width: 65%;
		height: 65%;
		padding: clamp(1px, 0.055em, 2px);
		background: conic-gradient(
			from var(--np-spinner-angle),
			var(--spinner-fill) 0deg var(--np-spinner-sweep),
			var(--spinner-track) var(--np-spinner-sweep) 360deg
		);
		mask:
			linear-gradient(black, black) content-box,
			linear-gradient(black, black);
		mask-composite: exclude;
		border-radius: 0;
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
			--np-spinner-angle: 0deg;
			--np-spinner-sweep: 30deg;
		}
		50% {
			--np-spinner-angle: 90deg;
			--np-spinner-sweep: 210deg;
		}
		100% {
			--np-spinner-angle: 360deg;
			--np-spinner-sweep: 30deg;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		span {
			animation: none;
			padding: 0;
			mask: none;
			border: clamp(1px, 0.055em, 2px) solid currentColor;
			background: none;
		}
	}
	@media (forced-colors: active) {
		span {
			animation: none;
			padding: 0;
			mask: none;
			border: clamp(1px, 0.055em, 2px) solid CanvasText;
			border-top-color: Highlight;
			background: none;
		}
	}
</style>
