<script lang="ts">
	const items = [
		{ x: 8, y: -15, size: 14 },
		{ x: 72, y: 60, size: 14 },
		{ x: 45, y: 35, size: 9 },
		{ x: 85, y: 5, size: 8 },
		{ x: -5, y: 45, size: 11 },
		{ x: 65, y: 60, size: 7 },
		{ x: 25, y: 70, size: 10 },
		{ x: 52, y: 25, size: 6 }
	];
</script>

<div aria-hidden="true">
	{#each items as item, index (index)}
		<span
			style={`--x: ${item.x}%; --y: ${item.y}%; --size: ${item.size}rem; --index: ${index}`}
		></span>
	{/each}
</div>

<style>
	div {
		position: absolute;
		inset: 0;
		overflow: hidden;
		border-radius: 1rem;
		pointer-events: none;
		background: linear-gradient(
			120deg,
			color-mix(in srgb, var(--color-primary) 40%, var(--color-background)),
			color-mix(in srgb, var(--color-secondary) 40%, var(--color-background))
		);
	}
	span {
		position: absolute;
		left: var(--x);
		top: var(--y);
		width: var(--size);
		height: var(--size);
		border-radius: 50%;
		background: var(--color-primary);
		animation: drift calc(9s + var(--index) * 1s) ease-in-out infinite alternate;
		animation-delay: calc(var(--index) * -3s);
	}
	span:nth-child(even) {
		background: var(--color-secondary);
	}
	span:nth-child(3),
	span:nth-child(7) {
		background: color-mix(in srgb, var(--color-primary) 40%, var(--color-secondary));
	}
	@keyframes drift {
		from {
			transform: translate(-2rem, -1rem) scale(0.9);
		}
		to {
			transform: translate(3rem, 2rem) scale(1.1);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		span {
			animation: none;
		}
	}
</style>
