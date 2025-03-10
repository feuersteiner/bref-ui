<script lang="ts">
	import type { IButtonProps } from '../types.js';

	const {
		label,
		type = 'default',
		href,
		isTargetBlank,
		size = 'small',
		fullWidth
	}: IButtonProps = $props();
	const target = isTargetBlank ? '_blank' : undefined;
</script>

<a class={`${type} ${size}`} {target} {href} class:fullWidth>{label}</a>

<style>
	a {
		all: unset;
		box-sizing: border-box;
		border: none;
		text-decoration: none;
		text-align: center;
		cursor: pointer;
		padding: 0.5rem 1rem;
		border-radius: 0;
		font-weight: bold;
		filter: brightness(1);
		width: fit-content;
		max-width: 100%;
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
		background-color: var(--color-primary, #00f);
		color: var(--color-primary-alternate-text, #fff);
	}
	.secondary {
		background-color: color-mix(in srgb, var(--color-primary, #00f) 10%, transparent);
		color: var(--color-primary, #00f);
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
	.fullWidth {
		width: 100%;
	}
</style>
