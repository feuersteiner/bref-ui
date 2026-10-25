<script lang="ts">
	import { asset } from '$app/paths';
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import { Button } from 'bref-ui';
	import GridCartAction from './grid-cart-action.svelte';
	import { money } from './products.js';
	import type { Product } from './products.js';
	let {
		product,
		onSelect,
		onQuantity,
		quantity = 0
	}: {
		product: Product;
		quantity?: number;
		onSelect: (product: Product) => void;
		onQuantity: (product: Product, finish: string, quantity: number) => boolean;
	} = $props();
</script>

<article
	data-product={product.id}
	in:fly={{
		y: prefersReducedMotion.current ? 0 : 20,
		duration: prefersReducedMotion.current ? 0 : 420
	}}
>
	<button data-product-image onclick={() => onSelect(product)} aria-label={`View ${product.name}`}>
		<img src={asset(product.image)} alt={product.alt} width="700" height="800" loading="lazy" />
	</button>
	<div data-product-meta>
		<h3>{product.name}</h3>
		<span>{money(product.price)}</span>
	</div>
	<div data-product-actions>
		<Button
			label="Details"
			variant="neutral"
			size="small"
			trailingIcon={{ name: 'arrow_forward' }}
			onClick={() => onSelect(product)}
		/>
		<GridCartAction
			name={product.name}
			finish={product.finishes[0]}
			{quantity}
			onQuantity={(next) => onQuantity(product, product.finishes[0], next)}
		/>
	</div>
</article>

<style>
	[data-product-actions] {
		gap: 12px;
		flex-wrap: wrap;
	}
	h3 {
		font-weight: 500;
		line-height: 1.15;
	}
	img {
		display: block;
		max-width: 100%;
	}
	img {
		border-radius: var(--forma-image-radius);
	}
	[data-product-image] {
		border-radius: var(--forma-image-radius);
	}
	[data-product-image] {
		display: block;
		width: 100%;
		padding: 0;
		border: 0;
		background: #f3f4f1;
		overflow: hidden;
		cursor: pointer;
	}
	[data-product-image] img {
		cursor: inherit;
		width: 100%;
		height: 340px;
		object-fit: cover;
		transition: transform 350ms ease;
	}
	[data-product]:hover [data-product-image] img {
		transform: scale(1.035);
	}
	[data-product]:focus-within [data-product-image] img {
		transform: scale(1.035);
	}
	[data-product-actions] {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	[data-product='lounge'] [data-product-image] img {
		object-position: center 65%;
	}
	[data-product='table'] [data-product-image] img {
		object-position: center bottom;
	}
	[data-product='desk-lamp'] [data-product-image] img {
		object-position: right center;
	}
	[data-product-meta] {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 16px;
		margin: 20px 0 12px;
	}
	h3 {
		font:
			450 20px/1.2 'Bricolage Grotesque Variable',
			sans-serif;
		letter-spacing: -0.02em;
	}
	[data-product-meta] > span {
		font-size: 13px;
	}
	@media (prefers-reduced-motion: reduce) {
		[data-product-image] img {
			transition: none;
		}
	}
	@media (max-width: 900px) {
		[data-product-image] img {
			height: 260px;
		}
	}
	@media (max-width: 600px) {
		[data-product-image] img {
			height: 360px;
		}
	}
</style>
