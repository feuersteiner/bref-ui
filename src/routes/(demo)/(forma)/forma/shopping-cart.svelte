<script lang="ts">
	import { tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import { Button, Dialog, Icon } from '$lib/index.js';
	import CartItemRow from './cart-item.svelte';
	import { money } from './products.js';
	import type { CartItem } from './products.js';
	let {
		open = $bindable(false),
		items,
		onRemove,
		onQuantity,
		onComplete
	}: {
		open?: boolean;
		items: CartItem[];
		onRemove: (key: string) => void;
		onQuantity: (key: string, quantity: number) => void;
		onComplete: () => void;
	} = $props();
	let stage = $state<'cart' | 'review' | 'complete'>('cart');
	let removal = $state('');
	const announceRemoval = (key: string) => {
		const item = items.find((item) => item.key === key);
		if (item) removal = `${item.product.name}, ${item.finish}, removed from cart.`;
	};
	const remove = (key: string) => {
		announceRemoval(key);
		onRemove(key);
	};
	const changeQuantity = (key: string, quantity: number) => {
		if (quantity <= 0) announceRemoval(key);
		onQuantity(key, quantity);
	};
	let receipt = $state({ total: 0, count: 0 });
	let confirmation = $state<HTMLParagraphElement>();
	let content = $state<HTMLDivElement>();
	const changeStage = async (next: 'cart' | 'review') => {
		stage = next;
		await tick();
		content?.focus();
	};
	const total = $derived(items.reduce((sum, item) => sum + item.product.price * item.quantity, 0));
	const confirm = async () => {
		receipt = { total, count: items.reduce((sum, item) => sum + item.quantity, 0) };
		stage = 'complete';
		onComplete();
		await tick();
		confirmation?.focus();
	};
</script>

<Dialog
	bind:open
	header={{
		title:
			stage === 'complete' ? 'Order confirmed' : stage === 'review' ? 'Review order' : 'Your cart',
		icon: { name: stage === 'complete' ? 'check_circle' : 'shopping_cart' }
	}}
	size="medium"
	onclose={() => {
		stage = 'cart';
		removal = '';
	}}
>
	<p role="status" aria-atomic="true" data-visually-hidden>{removal}</p>
	{#key stage}
		<div
			data-cart
			bind:this={content}
			tabindex="-1"
			in:fly={{
				y: prefersReducedMotion.current ? 0 : 24,
				duration: prefersReducedMotion.current ? 0 : 360
			}}
		>
			{#if stage === 'complete'}
				<p role="status" tabindex="-1" bind:this={confirmation}>
					{receipt.count}
					{receipt.count === 1 ? 'piece' : 'pieces'} · {money(receipt.total)}. This was a demo
					order. No payment was taken.
				</p>
				<Button
					label="Continue shopping"
					icon={{ name: 'arrow_back' }}
					onClick={() => (open = false)}
				/>
			{:else}
				{#if stage === 'cart'}
					{#each items as item (item.key)}
						<CartItemRow {item} onQuantity={changeQuantity} onRemove={remove} />
					{:else}<div data-cart-empty>
							<Icon name="shopping_cart" size="large" />
							<p>Your cart is empty.</p>
						</div>{/each}
				{:else}
					{#each items as item (item.key)}
						<div data-order-line>
							<span>{item.product.name} × {item.quantity}</span>
							<strong>{money(item.product.price * item.quantity)}</strong>
						</div>
					{/each}
				{/if}
				{#if items.length}
					<div data-cart-total>
						<span>Subtotal</span>
						<strong>{money(total)}</strong>
					</div>
					<p data-muted>Demo checkout. No payment, delivery or purchase is made.</p>
				{/if}
				<div data-cart-actions>
					<Button
						label={stage === 'review' ? 'Back to cart' : 'Continue shopping'}
						icon={{ name: 'arrow_back' }}
						variant="neutral"
						onClick={() => (stage === 'review' ? changeStage('cart') : (open = false))}
					/>
					{#if items.length}<Button
							label={stage === 'review' ? 'Confirm demo order' : 'Checkout'}
							icon={{ name: stage === 'review' ? 'check' : 'arrow_forward' }}
							variant="filled"
							color="primary"
							onClick={() => (stage === 'review' ? confirm() : changeStage('review'))}
						/>{/if}
				</div>
			{/if}
		</div>
	{/key}
</Dialog>
