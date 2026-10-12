<script lang="ts">
	import { asset } from '$app/paths';
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import { Button } from '$lib/index.js';
	import { money } from './products.js';
	import type { Product } from './products.js';
	let {
		product,
		onSelect,
		onAdd,
		quantity = 0
	}: {
		product: Product;
		quantity?: number;
		onSelect: (product: Product) => void;
		onAdd: (product: Product, finish: string) => void;
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
		<div data-product-cart>
			{#if quantity}<span data-cart-count aria-label={`${quantity} in cart`}>{quantity}</span>{/if}
			<Button
				color="secondary"
				icon={{ name: 'add_shopping_cart', label: `Add ${product.name} to cart` }}
				variant="soft"
				size="small"
				rounded
				onClick={() => onAdd(product, product.finishes[0])}
			/>
		</div>
	</div>
</article>
