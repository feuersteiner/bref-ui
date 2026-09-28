<script lang="ts">
	import type { IconProps } from './types.js';

	let {
		class: className,
		color,
		filled = false,
		label,
		name,
		size,
		...attributes
	}: IconProps = $props();
</script>

<span
	{...attributes}
	class={[className, size, color, { filled }]}
	role={label ? 'img' : undefined}
	aria-hidden={label ? undefined : 'true'}
	aria-label={label}
>
	{name}
</span>

<style>
	span {
		display: inline-flex;
		width: 1em;
		height: 1em;
		align-items: center;
		justify-content: center;
		font-family: 'Material Symbols Outlined';
		font-style: normal;
		font-weight: 100;
		line-height: 1;
		color: inherit;
		letter-spacing: normal;
		font-size: inherit;
		text-transform: none;
		white-space: nowrap;
		font-feature-settings: 'liga';
		font-variation-settings:
			'FILL' 0,
			'wght' 100;
	}

	.filled {
		font-variation-settings:
			'FILL' 1,
			'wght' 100;
	}

	.x-small {
		font-size: 0.875rem;
	}

	.small {
		font-size: 1rem;
	}

	.medium {
		font-size: 1.5rem;
	}

	.large {
		font-size: 2.5rem;
	}

	.x-large {
		font-size: 5rem;
	}

	.primary {
		color: var(--color-primary);
	}

	.secondary {
		color: var(--color-secondary);
	}

	.foreground {
		color: var(--color-foreground);
	}

	.background {
		color: var(--color-background);
	}

	.muted {
		color: var(--color-muted);
	}

	.info {
		color: var(--color-info);
	}

	.success {
		color: var(--color-success);
	}

	.warning {
		color: var(--color-warning);
	}

	.error {
		color: var(--color-error);
	}
</style>
