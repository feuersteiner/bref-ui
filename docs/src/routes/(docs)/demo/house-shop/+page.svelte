<script lang="ts">
	import { asset } from '$app/paths';
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import CartNotice from './cart-notice.svelte';
	import { Button } from 'bref-ui';
	import ProductCard from './product-card.svelte';
	import ProductDetails from './product-details.svelte';
	import ShoppingCart from './shopping-cart.svelte';
	import StoreNav from './store-nav.svelte';
	import CollectionControls from './collection-controls.svelte';
	import { products } from './products.js';
	import type { Product, CartItem } from './products.js';
	let category = $state('all');
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
		if (existing && existing.quantity >= 99) return false;
		cart = existing
			? cart.map((item) =>
					item.key === key ? { ...item, quantity: Math.min(item.quantity + 1, 99) } : item
				)
			: [...cart, { key, product, finish, quantity: 1 }];
		announce(`${product.name}, ${finish}, added. ${(existing?.quantity ?? 0) + 1} in cart.`);
		return true;
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
	const setQuantity = (product: Product, finish: string, quantity: number) => {
		const key = `${product.id}-${finish}`;
		if (!cart.some((item) => item.key === key)) return quantity > 0 && add(product, finish);
		changeQuantity(key, quantity);
		announce(
			quantity > 0
				? `${product.name}, ${finish}: ${Math.min(quantity, 99)} in cart.`
				: `${product.name}, ${finish}, removed from cart.`
		);
		return true;
	};
	const remove = (key: string) => {
		cart = cart.filter((item) => item.key !== key);
		announce('Item removed from cart.');
	};
</script>

<svelte:head>
	<title>House Shop — a Bref ecommerce demo</title>
	<meta
		name="description"
		content="House Shop is an ecommerce furniture shop built with Bref. Browse the collection, manage a cart and try a demo checkout."
	/>
</svelte:head>
<StoreNav {count} onCart={() => (cartOpen = true)} />
<div data-demo-content id="demo-content" tabindex="-1">
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
			src={asset('demos/forma-room.jpg')}
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
		<div
			data-product-grid
			role="tabpanel"
			aria-label={`${category === 'all' ? 'All' : category} furniture`}
			tabindex="0"
		>
			{#each filtered as product (product.id)}<ProductCard
					{product}
					onSelect={select}
					onQuantity={setQuantity}
					quantity={cart.find(
						(item) => item.product.id === product.id && item.finish === product.finishes[0]
					)?.quantity ?? 0}
				/>{:else}<p data-empty>No furniture found. Try another search or category.</p>{/each}
		</div>
	</section>
</div>
<CartNotice message={notice.message} sequence={notice.sequence} />
<footer data-store-footer>
	<span>House Shop</span>
	<span>Demo store · Photography via Unsplash</span>
</footer>
{#if productOpen}<ProductDetails
		product={selected}
		bind:open={productOpen}
		onQuantity={setQuantity}
		items={cart}
	/>{/if}
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

<style>
	h1,
	h2 {
		font-weight: 500;
		line-height: 1.15;
	}
	img {
		display: block;
		max-width: 100%;
	}
	[data-demo-content] {
		min-width: 0;
	}
	p {
		line-height: 1.7;
	}
	img {
		border-radius: var(--forma-image-radius);
	}
	[data-demo-content] {
		max-width: 1280px;
		margin: auto;
		padding-inline: 48px;
	}
	[data-store-footer] {
		max-width: 1280px;
		margin: auto;
		padding-inline: 48px;
	}
	#demo-content {
		scroll-margin-block-start: calc(var(--forma-nav-height, 0px) + 16px);
	}
	[data-hero-heading] {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		padding: 32px 0 28px;
	}
	h1 {
		font:
			450 clamp(28px, 3.5vw, 42px)/1.1 'Bricolage Grotesque Variable',
			sans-serif;
		letter-spacing: -0.045em;
	}
	[data-store-hero] > img {
		width: 100%;
		height: 460px;
		object-fit: cover;
		object-position: center 58%;
	}
	[data-collection] {
		padding-block: 64px 32px;
		scroll-margin-top: calc(var(--forma-nav-height, 0px) + 16px);
	}
	[data-collection-heading] {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
	}
	h2 {
		font:
			450 28px/1.2 'Bricolage Grotesque Variable',
			sans-serif;
		letter-spacing: -0.04em;
	}
	[data-collection-heading] > span {
		color: var(--color-muted);
		font-size: 12px;
	}
	[data-product-grid] {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 32px;
	}
	[data-empty] {
		grid-column: 1 / -1;
		padding-block: 48px;
		color: var(--color-muted);
	}
	[data-store-footer] {
		display: flex;
		justify-content: space-between;
		gap: 24px;
		padding-block: 32px;
		border-top: 1px solid var(--forma-rule);
		font-size: 11px;
		color: var(--color-muted);
	}
	@container demo (max-width: 900px) {
		[data-demo-content] {
			padding-inline: 28px;
		}

		[data-store-footer] {
			padding-inline: 28px;
		}

		[data-product-grid] {
			gap: 20px;
		}
	}
	@container demo (max-width: 600px) {
		[data-demo-content] {
			padding-inline: 24px;
		}

		[data-store-footer] {
			padding-inline: 24px;
		}

		[data-hero-heading] {
			align-items: start;
			flex-direction: column;
			gap: 16px;
			padding-top: 16px;
		}

		[data-store-hero] > img {
			height: 320px;
		}

		[data-collection] {
			padding-top: 40px;
		}

		[data-product-grid] {
			grid-template-columns: 1fr;
			gap: 32px;
		}

		[data-store-footer] {
			flex-direction: column;
			gap: 8px;
		}
	}
</style>
