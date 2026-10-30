<script lang="ts">
	import { asset } from '$app/paths';
	import { untrack } from 'svelte';
	import { Dialog, Select } from 'bref-ui';
	import AddToCart from './add-to-cart.svelte';
	import { money } from './products.js';
	import type { Product, CartItem } from './products.js';
	let {
		product,
		open = $bindable(false),
		onQuantity,
		items
	}: {
		product: Product;
		open?: boolean;
		onQuantity: (product: Product, finish: string, quantity: number) => boolean;
		items: CartItem[];
	} = $props();
	// TODO(bref-ui#68): remove once Dialog closes on backdrop clicks itself.
	// Light dismiss: close only when the press starts and ends on the backdrop, not in the content.
	let backdropPress = false;
	const pressBackdrop = (event: PointerEvent & { currentTarget: HTMLDialogElement }) => {
		backdropPress =
			event.target === event.currentTarget && !event.currentTarget.querySelector(':popover-open');
	};
	const clickBackdrop = (event: MouseEvent & { currentTarget: HTMLDialogElement }) => {
		if (backdropPress && event.target === event.currentTarget) open = false;
		backdropPress = false;
	};
	let finish = $state<string | string[]>(untrack(() => product.finishes[0]));
	const quantity = $derived(
		items.find((item) => item.product.id === product.id && item.finish === String(finish))
			?.quantity ?? 0
	);
</script>

<Dialog
	bind:open
	header={{
		title: product.name,
		description: money(product.price)
	}}
	size="medium"
	glass={false}
	onpointerdown={pressBackdrop}
	onclick={clickBackdrop}
>
	<div data-product-detail={product.id}>
		<img src={asset(product.image)} alt={product.alt} width="400" height="450" />
		<div data-form>
			<p>{product.description}</p>
			{#if product.finishes.length > 1}
				<label for="product-finish">
					Finish<Select
						id="product-finish"
						bind:value={finish}
						items={product.finishes.map((name) => ({ id: name, label: name }))}
					/>
				</label>
			{:else}<p data-muted>Finish: {product.finishes[0]}</p>{/if}

			{#key String(finish)}
				<AddToCart
					name={product.name}
					finish={String(finish)}
					{quantity}
					onQuantity={(next) => onQuantity(product, String(finish), next)}
				/>
			{/key}
		</div>
	</div>
</Dialog>

<style>
	img {
		display: block;
		max-width: 100%;
	}
	label {
		display: grid;
		gap: 8px;
	}
	p {
		line-height: 1.7;
	}
	[data-muted] {
		color: var(--color-muted);
	}
	[data-form] {
		display: grid;
		gap: 20px;
	}
	img {
		border-radius: var(--forma-image-radius);
	}
	[data-product-detail='table'] > img {
		object-position: center bottom;
	}
	[data-product-detail='desk-lamp'] > img {
		object-position: right center;
	}
	[data-product-detail] {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 28px;
		align-items: start;
	}
	[data-product-detail] > img {
		width: 100%;
		height: 320px;
		object-fit: cover;
	}
	[data-product-detail] p[data-muted] {
		font-size: 11px;
	}
	@media (max-width: 600px) {
		[data-product-detail] {
			grid-template-columns: 1fr;
		}

		[data-product-detail] > img {
			height: 240px;
		}
	}
</style>
