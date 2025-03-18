<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ISubSectionContainerProps } from './types.js';
	import type { GridSizeType } from '../types.js';

	const {
		children,
		gridSize = 'full',
		gapSize = 'small',
		align = 'center',
		justifyUp,
		itemsCount,
		className,
		order
	}: {
		children: Snippet;
	} & Partial<ISubSectionContainerProps> = $props();

	const inferGridSizeFromItems = (count: number): GridSizeType => {
		if (count % 12 === 0) return 'twelfth';
		if (count % 6 === 0) return 'sixth';
		if (count % 4 === 0) return 'quarter';
		if (count % 3 === 0) return 'third';
		if (count % 2 === 0) return 'half';
		return 'full';
	};

	const finalGridSize = itemsCount ? inferGridSizeFromItems(itemsCount) : gridSize;

	const classes = [
		'sub-section',
		finalGridSize,
		`gap-${gapSize}`,
		`align-${align}`,
		justifyUp ? 'justify-start' : 'justify-center',
		className
	]
		.filter(Boolean)
		.join(' ');
</script>

<div class={classes} style:order>
	{@render children()}
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		height: 100%;
		width: 100%;
		gap: var(--gap-size, 1rem);
	}

	.align-center {
		align-items: center;
	}
	.align-left {
		align-items: flex-start;
	}
	.align-right {
		align-items: flex-end;
	}

	.justify-center {
		justify-content: center;
	}
	.justify-start {
		justify-content: flex-start;
	}

	.gap-small {
		--gap-size: 1rem;
	}
	.gap-medium {
		--gap-size: 2rem;
	}
	.gap-large {
		--gap-size: 4rem;
	}

	.full,
	.half,
	.third,
	.quarter,
	.sixth,
	.twelfth {
		grid-column: span 12;
	}

	@media (min-width: 640px) {
		.third,
		.quarter {
			grid-column: span 6;
		}
		.sixth,
		.twelfth {
			grid-column: span 4;
		}
	}

	@media (min-width: 768px) {
		.half {
			grid-column: span 6;
		}
		.third {
			grid-column: span 4;
		}
		.quarter {
			grid-column: span 4;
		}
		.sixth {
			grid-column: span 2;
		}
		.twelfth {
			grid-column: span 2;
		}
	}

	@media (min-width: 1024px) {
		.quarter {
			grid-column: span 3;
		}
		.sixth {
			grid-column: span 2;
		}
		.twelfth {
			grid-column: span 1;
		}
	}
</style>
