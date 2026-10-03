<script lang="ts">
	import type { SpinnerProps } from './types.js';

	let {
		label,
		size = 'medium',
		color = 'primary',
		ref = $bindable(null),
		...attributes
	}: SpinnerProps = $props();
</script>

<span
	{...attributes}
	bind:this={ref}
	role="status"
	data-size={size}
	style:--spinner-color={`var(--color-${color})`}
>
	<span aria-hidden="true"></span>
	<span class="sr-only">{label}</span>
</span>

<style>
	span[role='status'] {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: var(--spinner-size);
		height: var(--spinner-size);
		color: var(--spinner-color);
	}
	span[role='status'][data-size='x-small'] {
		--spinner-size: 0.875rem;
	}
	span[role='status'][data-size='small'] {
		--spinner-size: 1rem;
	}
	span[role='status'][data-size='medium'] {
		--spinner-size: 1.5rem;
	}
	span[role='status'][data-size='large'] {
		--spinner-size: 2.5rem;
	}
	span[role='status'][data-size='x-large'] {
		--spinner-size: 5rem;
	}
	span[aria-hidden='true'] {
		box-sizing: border-box;
		width: 80%;
		height: 80%;
		border: max(2px, 0.12em) solid color-mix(in srgb, currentColor 25%, transparent);
		border-top-color: currentColor;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}
	.sr-only {
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
		to {
			transform: rotate(360deg);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		span[aria-hidden='true'] {
			animation: none;
		}
	}
	@media (forced-colors: active) {
		span[aria-hidden='true'] {
			border-color: CanvasText;
			border-top-color: Highlight;
		}
	}
</style>
