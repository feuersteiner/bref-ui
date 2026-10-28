<script lang="ts">
	import type { SwitchProps } from 'bref-ui/types';

	let { checked = $bindable(), size = 'medium', children, ...attributes }: SwitchProps = $props();
</script>

<span data-switch data-size={size}>
	<input {...attributes} bind:checked type="checkbox" role="switch" />
	<span aria-hidden="true"><span>{@render children?.()}</span></span>
</span>

<style>
	/* Geometry and states follow VS Code 1.143.1's base/browser/ui/toggle/switch.css. */
	[data-switch] {
		--track-width: 28px;
		--track-height: 16px;
		position: relative;
		display: inline-flex;
		flex-shrink: 0;
		width: var(--track-width);
		height: var(--track-height);
		border-radius: 9999px;
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
		--internal-fill: color-mix(in srgb, var(--color-muted, #9d9d9d) 36%, transparent);
		--internal-border: transparent;
		box-sizing: border-box;
		position: relative;
		container-type: size;
		width: 100%;
		height: 100%;
		border: 1px solid var(--internal-border);
		border-radius: inherit;
		background: var(--internal-fill);
		pointer-events: none;
		transition:
			background-color 120ms ease,
			border-color 120ms ease;
	}

	[data-switch] > span > span {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		/* Border insets keep the thumb's gaps equal at fractional display scales. */
		width: 100cqh;
		border: 1px solid transparent;
		border-radius: inherit;
		background-color: white;
		background-clip: padding-box;
		color: var(--color-background, #1f1f1f);
		font-size: calc((var(--track-height) - 4px) * 0.7);
		transition: left 120ms ease;
	}

	input:checked + span {
		--internal-fill: var(--vscode-accent, var(--color-primary, #0078d4));
		--internal-border: var(--internal-fill);
	}

	input:checked + span > span {
		left: calc(100% - 100cqh);
	}

	input:user-invalid + span,
	input[aria-invalid='true'] + span {
		--internal-border: var(--color-error, #bc2436);
	}

	input:focus-visible + span {
		outline: 1px solid var(--vscode-accent, var(--color-primary, #0078d4));
		outline-offset: 2px;
	}

	input:disabled {
		cursor: not-allowed;
	}

	input:disabled + span {
		opacity: 0.5;
	}

	[data-size='small'] {
		--track-width: 24px;
		--track-height: 14px;
	}

	[data-size='large'] {
		--track-width: 32px;
		--track-height: 18px;
	}

	@media (forced-colors: active) {
		[data-switch] > span {
			forced-color-adjust: none;
			border-color: ButtonText;
			background: Canvas;
		}
		[data-switch] > span > span {
			background-color: ButtonText;
			color: Canvas;
		}
		input:checked + span {
			background: Highlight;
		}
		input:checked + span > span {
			background-color: HighlightText;
			color: Highlight;
		}
		input:focus-visible + span {
			outline-color: Highlight;
		}
		input:disabled + span {
			border-color: GrayText;
			opacity: 1;
		}
		input:disabled + span > span {
			background-color: GrayText;
		}
		input:disabled:checked + span {
			background: GrayText;
		}
		input:disabled:checked + span > span {
			background-color: Canvas;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		[data-switch] > span,
		[data-switch] > span > span {
			transition: none;
		}
	}
</style>
