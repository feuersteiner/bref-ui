<script lang="ts">
	import { asset } from '$app/paths';
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import CartNotice from './cart-notice.svelte';
	import { Button } from '$lib/index.js';
	import ProductCard from './product-card.svelte';
	import ProductDetails from './product-details.svelte';
	import ShoppingCart from './shopping-cart.svelte';
	import CollectionControls from './collection-controls.svelte';
	import { products } from './products.js';
	import type { Product, CartItem } from './products.js';
	let category = $state<string | string[]>('all');
	let sort = $state<string | string[]>('featured');
	let query = $state('');
	let selected = $state<Product>(products[0]);
	let productOpen = $state(false);
	let cartOpen = $state(false);
	let cart = $state<CartItem[]>([]);
	let notice = $state({ message: '', sequence: 0 });
	const announce = (message: string) => {
		notice = { message, sequence: notice.sequence + 1 };
	};
	const filtered = $derived(
		products
			.filter(
				(product) =>
					(category === 'all' || product.category === category) &&
					product.name.toLowerCase().includes(query.trim().toLowerCase())
			)
			.toSorted((a, b) =>
				sort === 'price-asc' ? a.price - b.price : sort === 'price-desc' ? b.price - a.price : 0
			)
	);
	const count = $derived(cart.reduce((sum, item) => sum + item.quantity, 0));
	const select = (product: Product) => {
		selected = product;
		productOpen = true;
	};
	const add = (product: Product, finish: string) => {
		const key = `${product.id}-${finish}`;
		const existing = cart.find((item) => item.key === key);
		cart = existing
			? cart.map((item) =>
					item.key === key ? { ...item, quantity: Math.min(item.quantity + 1, 99) } : item
				)
			: [...cart, { key, product, finish, quantity: 1 }];
		announce(`${product.name} added to your cart.`);
	};
	const changeQuantity = (key: string, quantity: number) => {
		cart = cart.flatMap((item) =>
			item.key !== key
				? [item]
				: quantity > 0
					? [{ ...item, quantity: Math.min(quantity, 99) }]
					: []
		);
	};
	const remove = (key: string) => {
		cart = cart.filter((item) => item.key !== key);
		announce('Item removed from cart.');
	};
</script>

<svelte:head>
	<title>Forma — a Bref store demo</title>
	<meta
		name="description"
		content="Browse furniture, manage a cart and try a demo checkout built with Bref."
	/>
</svelte:head>
<header data-store-header>
	<a data-brand href="#demo-content">Forma</a>
	<nav aria-label="Store"><a href="#collection">Collection</a></nav>
	<Button
		label={`Cart (${count})`}
		icon={{ name: 'shopping_cart' }}
		variant="neutral"
		onClick={() => (cartOpen = true)}
	/>
</header>
<main id="demo-content" tabindex="-1">
	<section
		data-store-hero
		in:fly={{
			y: prefersReducedMotion.current ? 0 : 24,
			duration: prefersReducedMotion.current ? 0 : 480
		}}
	>
		<div data-hero-heading>
			<h1>Furniture for living.</h1>
			<Button
				label="Explore"
				href="#collection"
				variant="neutral"
				trailingIcon={{ name: 'arrow_forward' }}
			/>
		</div>
		<img
			src={asset('/demos/forma-room.jpg')}
			alt="Natural wood, soft upholstery and plants arranged in a sunlit living room"
			width="1800"
			height="1200"
		/>
	</section>
	<section id="collection" data-collection aria-labelledby="collection-heading">
		<div
			data-collection-intro
			in:fly={{
				y: prefersReducedMotion.current ? 0 : 20,
				duration: prefersReducedMotion.current ? 0 : 420
			}}
		>
			<div data-collection-heading>
				<h2 id="collection-heading">Collection</h2>
				<span>{filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}</span>
			</div>
			<CollectionControls bind:category bind:sort bind:query />
		</div>
		<div data-product-grid>
			{#each filtered as product (product.id)}<ProductCard
					{product}
					onSelect={select}
					onAdd={add}
					quantity={cart
						.filter((item) => item.product.id === product.id)
						.reduce((sum, item) => sum + item.quantity, 0)}
				/>{:else}<p data-empty>No furniture found. Try another search or category.</p>{/each}
		</div>
	</section>
</main>
<CartNotice message={notice.message} sequence={notice.sequence} />
<footer data-store-footer>
	<span>Forma</span>
	<span>Demo store · Photography via Unsplash</span>
</footer>
{#if productOpen}<ProductDetails product={selected} bind:open={productOpen} onAdd={add} />{/if}
<ShoppingCart
	bind:open={cartOpen}
	items={cart}
	onRemove={remove}
	onQuantity={changeQuantity}
	onComplete={() => {
		cart = [];
		announce('Demo order confirmed.');
	}}
/>
