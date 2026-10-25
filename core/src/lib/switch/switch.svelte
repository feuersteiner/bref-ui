<script lang="ts">
	import type { SwitchProps } from './types.js';

	let { checked = $bindable(), size = 'medium', children, ...attributes }: SwitchProps = $props();
</script>

<span data-switch data-size={size}>
	<input {...attributes} bind:checked type="checkbox" role="switch" />
	<span aria-hidden="true"><span>{@render children?.()}</span></span>
</span>

<style>
	[data-switch] {
		--track-width: 2.75rem;
		--track-height: 1.625rem;
		--thumb-size: 1.125rem;
		--inset: 0.25rem;
		position: relative;
		display: inline-flex;
		width: var(--track-width);
		height: var(--track-height);
		vertical-align: middle;
	}

	input {
		position: absolute;
		z-index: 1;
		inset: 0;
		width: 100%;
		height: 100%;
		margin: 0;
		opacity: 0;
		cursor: pointer;
	}

	[data-switch] > span {
		--internal-tint: var(--color-foreground, black);
		--internal-strength: 48%;
		--internal-fill: color-mix(
			in srgb,
			var(--internal-tint) var(--internal-strength),
			var(--color-background, white)
		);
		--internal-border: var(--internal-fill);
		box-sizing: border-box;
		position: relative;
		width: 100%;
		height: 100%;
		border: 1px solid var(--internal-border);
		border-radius: 999px;
		background: var(--internal-fill);
		pointer-events: none;
		transition:
			background-color 150ms ease,
			border-color 150ms ease;
	}

	[data-switch] > span > span {
		position: absolute;
		top: 50%;
		left: var(--inset);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: var(--thumb-size);
		height: var(--thumb-size);
		border-radius: 50%;
		background: var(--color-background, white);
		color: var(--color-foreground, black);
		box-shadow: 0 1px 2px color-mix(in srgb, var(--color-background, white) 12%, transparent);
		font-size: calc(var(--thumb-size) * 0.7);
		transform: translateY(-50%);
		transition: left 150ms ease;
	}

	input:hover:not(:disabled) + span {
		--internal-strength: 52%;
	}

	input:active:not(:disabled) + span {
		--internal-strength: 56%;
	}

	input:checked + span {
		--internal-tint: var(--color-primary, blue);
		--internal-strength: 88%;
	}

	input:checked:hover:not(:disabled) + span {
		--internal-strength: 92%;
	}

	input:checked:active:not(:disabled) + span {
		--internal-strength: 96%;
	}

	input:checked + span > span {
		left: calc(100% - var(--thumb-size) - var(--inset));
	}

	input:user-invalid + span,
	input[aria-invalid='true'] + span {
		--internal-border: var(--color-error, #bc2436);
	}

	input:focus-visible + span {
		outline: 2px solid var(--color-primary);
		outline-offset: 3px;
	}

	input:disabled {
		cursor: not-allowed;
	}

	input:disabled + span {
		opacity: 0.45;
	}

	[data-size='small'] {
		--track-width: 2.25rem;
		--track-height: 1.375rem;
		--thumb-size: 0.875rem;
	}

	[data-size='large'] {
		--track-width: 3.25rem;
		--track-height: 1.875rem;
		--thumb-size: 1.375rem;
	}

	@media (prefers-reduced-motion: reduce) {
		[data-switch] > span,
		[data-switch] > span > span {
			transition: none;
		}
	}

	@media (forced-colors: active) {
		[data-switch] > span {
			border-color: ButtonText;
			background: Canvas;
			box-shadow: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
		[data-switch] > span > span {
			background: ButtonText;
			color: Canvas;
			box-shadow: none;
		}
		input:checked + span {
			background: Highlight;
		}
		input:checked + span > span {
			background: HighlightText;
			color: Highlight;
		}
	}
</style>
