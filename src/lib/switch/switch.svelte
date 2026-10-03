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
		--track-width: 3.25rem;
		--track-height: 2rem;
		--thumb-size: 1.5rem;
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
		--internal-strength-light: 4%;
		--internal-strength-dark: 16%;
		--internal-highlight: color-mix(in srgb, var(--color-foreground, black) 16%, transparent);
		box-sizing: border-box;
		position: relative;
		width: 100%;
		height: 100%;
		border: 1px solid
			light-dark(
				color-mix(in srgb, var(--color-foreground, black) 12%, transparent),
				color-mix(in srgb, var(--color-foreground, black) 30%, transparent)
			);
		border-radius: 999px;
		background: color-mix(
			in srgb,
			light-dark(
					color-mix(
						in srgb,
						var(--internal-tint) var(--internal-strength-light),
						var(--color-background, white)
					),
					color-mix(
						in srgb,
						var(--internal-tint) var(--internal-strength-dark),
						var(--color-background, white)
					)
				)
				85%,
			transparent
		);
		box-shadow:
			inset 0 1px 0 var(--internal-highlight),
			0 2px 6px color-mix(in srgb, black 8%, transparent);
		-webkit-backdrop-filter: blur(0.5rem) saturate(120%);
		backdrop-filter: blur(0.5rem) saturate(120%);
		pointer-events: none;
		transition: all 150ms ease;
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
		background: var(--color-foreground);
		color: var(--color-background);
		font-size: calc(var(--thumb-size) * 0.7);
		transform: translateY(-50%);
		transition:
			left 150ms ease,
			background 150ms ease;
	}

	input:checked + span {
		--internal-tint: var(--color-primary, blue);
		--internal-strength-light: 88%;
		--internal-strength-dark: 88%;
		--internal-highlight: color-mix(in srgb, var(--color-foreground, black) 28%, transparent);
		border-color: color-mix(in srgb, var(--internal-tint) 68%, var(--color-foreground, black));
	}

	input:checked + span > span {
		left: calc(100% - var(--thumb-size) - var(--inset));
		background: var(--color-background);
		color: var(--color-foreground);
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
		--track-width: 2.75rem;
		--track-height: 1.75rem;
		--thumb-size: 1.25rem;
	}

	[data-size='large'] {
		--track-width: 3.75rem;
		--track-height: 2.25rem;
		--thumb-size: 1.625rem;
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
