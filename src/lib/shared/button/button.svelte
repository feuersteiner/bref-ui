<script lang="ts">
	import type { IButtonProps } from '../types.js';

	const { label, type = 'default', href, isTargetBlank, size = 'small' }: IButtonProps = $props();
	const target = isTargetBlank ? '_blank' : undefined;
</script>

<a class={`${type} ${size}`} {target} {href}>{label}</a>

<style>
	a {
		all: unset;
		border: none;
		text-decoration: none;
		text-align: center;
		cursor: pointer;
		padding: 0.5rem 1rem;
		border-radius: 0;
		font-weight: bold;
		filter: brightness(1);
	}
	a:hover {
		filter: brightness(1.25);
	}
	a:active {
		filter: brightness(0.9);
	}

	@media (max-width: 640px) {
		a {
			width: 100%;
		}
	}

	.default {
		background-color: color-mix(in srgb, currentColor 10%, transparent);
	}
	.primary {
		background-color: var(--primary-color, #00f);
		color: var(--primary-color-text, #fff);
	}
	.secondary {
		background-color: color-mix(in srgb, var(--primary-color, #00f) 10%, transparent);
		color: var(--primary-color, #00f);
	}
	.small {
		font-size: 0.75rem;
	}
	.medium {
		font-size: 1rem;
	}
	.large {
		font-size: 1.25rem;
	}
</style>
