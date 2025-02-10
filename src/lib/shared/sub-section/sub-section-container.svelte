<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ISubSectionContainerProps } from './types.js';

	const {
		children,
		gridSize = 'full',
		gapSize = 'small',
		align = 'center',
		justifyUp
	}: {
		children: Snippet;
	} & Partial<ISubSectionContainerProps> = $props();
</script>

<div class:justifyUp class={`${gridSize} ${gapSize} ${align}`}>{@render children()}</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		flex-grow: 1;
		height: 100%;
		width: 100%;
		align-items: center;
		justify-content: center;
	}
	.justifyUp {
		justify-content: flex-start;
	}
	.full {
		grid-column: span 12;
	}
	.half {
		grid-column: span 12;
	}
	.third {
		grid-column: span 12;
	}
	.quarter {
		grid-column: span 12;
	}

	@media (min-width: 640px) {
		.half {
			grid-column: span 6;
		}
		.third {
			grid-column: span 6;
		}
		.quarter {
			grid-column: span 6;
		}

		.center {
			align-items: center;
		}
		.left {
			align-items: flex-start;
		}
		.right {
			align-items: flex-end;
		}
	}

	@media (min-width: 768px) {
		.third {
			grid-column: span 4;
		}
		.quarter {
			grid-column: span 4;
		}
	}

	@media (min-width: 1024px) {
		.quarter {
			grid-column: span 3;
		}
	}

	.small {
		gap: 0.75rem;
	}
	.medium {
		gap: 1rem;
	}
	.large {
		gap: 1.5rem;
	}
</style>
