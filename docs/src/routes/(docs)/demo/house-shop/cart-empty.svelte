<script lang="ts">
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
</script>

<div
	data-cart-empty-state
	in:fly={{
		y: prefersReducedMotion.current ? 0 : 12,
		delay: prefersReducedMotion.current ? 0 : 140,
		duration: prefersReducedMotion.current ? 0 : 340
	}}
>
	<svg viewBox="0 0 144 112" width="144" height="112" aria-hidden="true">
		<path data-glow d="M22 88V58a50 50 0 0 1 100 0v30Z" />
		<g
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M30 91h84M58 69h29l-4 22H62Z" />
			<path
				d="M73 69V38M73 57C58 57 50 48 51 38c13 0 22 7 22 19ZM73 46c0-13 8-22 20-23 1 13-7 23-20 23Z"
			/>
			<circle cx="105" cy="44" r="6" />
		</g>
	</svg>
	<h3 data-cart-empty-heading tabindex="-1">Room for something lovely.</h3>
	<p>Your cart is empty. Find a piece that feels like home.</p>
</div>

<style>
	[data-cart-empty-state] {
		grid-area: 1 / 1;
		align-self: start;
		display: grid;
		justify-items: center;
		gap: 12px;
		padding: 28px 16px 12px;
		text-align: center;
	}
	svg {
		color: var(--color-secondary);
		margin-bottom: 8px;
	}
	[data-glow] {
		fill: color-mix(in srgb, var(--color-secondary) 8%, transparent);
	}
	h3 {
		margin: 0;
		color: var(--color-foreground);
		font-size: clamp(1.25rem, 4vw, 1.5rem);
		font-weight: 500;
		letter-spacing: -0.03em;
	}
	h3:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 6px;
		border-radius: 4px;
	}
	p {
		max-width: 32ch;
		margin: 0;
		color: var(--color-muted);
		font-size: 14px;
		line-height: 1.6;
	}
	h3 {
		font-weight: 500;
		line-height: 1.15;
	}
	p {
		line-height: 1.7;
	}
	h3 {
		font:
			450 20px/1.2 'Bricolage Grotesque Variable',
			sans-serif;
		letter-spacing: -0.02em;
	}
</style>
