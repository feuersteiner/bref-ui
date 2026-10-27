<script lang="ts">
	import { tick } from 'svelte';
	import { fly, slide } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import { Button, Dialog, Icon } from 'bref-ui';
	import CartItemRow from './cart-item.svelte';
	import CartEmpty from './cart-empty.svelte';
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
	let focusRequest = 0;
	const announceRemoval = (key: string) => {
		const item = items.find((item) => item.key === key);
		if (item) removal = `${item.product.name}, ${item.finish}, removed from cart.`;
	};
	const removeAndFocus = async (key: string, update: () => void) => {
		const request = ++focusRequest;
		const keys = items.map((item) => item.key);
		const index = keys.indexOf(key);
		const rows = Array.from(content?.querySelectorAll<HTMLElement>('[data-cart-item-key]') ?? []);
		const row = rows.find((row) => row.dataset.cartItemKey === key);
		const focused = document.activeElement;
		const restoreFocus = !!row?.contains(focused);
		const deleting = focused?.hasAttribute('data-delete-item');
		// Outgoing rows remain mounted during their transition. Move focus out first.
		if (restoreFocus) content?.focus({ preventScroll: true });
		if (row) row.inert = true;
		update();
		await tick();
		if (items.some((item) => item.key === key)) {
			if (row) row.inert = false;
			return;
		}
		if (!restoreFocus || request !== focusRequest || document.activeElement !== content) return;
		const neighbours = [...keys.slice(index + 1), ...keys.slice(0, index).reverse()];
		const neighbour = neighbours
			.filter((key) => items.some((item) => item.key === key))
			.map((key) => rows.find((row) => row.dataset.cartItemKey === key))
			.find((row) => row?.isConnected && !row.inert);
		const target = neighbour?.querySelector<HTMLButtonElement>(
			deleting ? 'button[data-delete-item]' : 'button'
		);
		(target ?? content?.querySelector<HTMLElement>('[data-cart-empty-heading]') ?? content)?.focus({
			preventScroll: true
		});
	};
	const remove = (key: string) => {
		announceRemoval(key);
		void removeAndFocus(key, () => onRemove(key));
	};
	const changeQuantity = (key: string, quantity: number) => {
		if (quantity <= 0) {
			announceRemoval(key);
			void removeAndFocus(key, () => onQuantity(key, quantity));
		} else onQuantity(key, quantity);
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
	size="large"
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
				<div data-order-confirmed>
					<span data-order-confirmed-icon><Icon name="check_circle" /></span>
					<p role="status" tabindex="-1" bind:this={confirmation}>
						<strong data-order-confirmed-title>Your order is confirmed</strong>
						<span>
							{receipt.count}
							{receipt.count === 1 ? 'piece' : 'pieces'} · {money(receipt.total)}. Demo order, no
							payment was taken.
						</span>
					</p>
					<Button
						label="Continue shopping"
						icon={{ name: 'arrow_back' }}
						variant="soft"
						color="primary"
						onClick={() => (open = false)}
					/>
				</div>
			{:else}
				{#if stage === 'cart'}
					<div data-cart-view>
						{#if items.length}
							<!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users need to scroll the cart table on narrow screens.) -->
							<div
								data-cart-table
								role="region"
								aria-label="Cart items"
								tabindex="0"
								out:slide={{ duration: prefersReducedMotion.current ? 0 : 240 }}
							>
								<table>
									<thead>
										<tr>
											<th scope="col">Product</th>
											<th scope="col">Price</th>
											<th scope="col">Quantity</th>
											<th scope="col">Subtotal</th>
											<th scope="col"><span data-visually-hidden>Remove</span></th>
										</tr>
									</thead>
									<tbody>
										{#each items as item (item.key)}
											<CartItemRow {item} onQuantity={changeQuantity} onRemove={remove} />
										{/each}
									</tbody>
									<tfoot>
										<tr>
											<th scope="row" colspan="3">Subtotal</th>
											<td data-cart-item-subtotal><strong>{money(total)}</strong></td>
											<td></td>
										</tr>
									</tfoot>
								</table>
							</div>
						{:else}
							<CartEmpty />
						{/if}
					</div>
				{:else}
					{#each items as item (item.key)}
						<div data-order-line>
							<span>{item.product.name} × {item.quantity}</span>
							<strong>{money(item.product.price * item.quantity)}</strong>
						</div>
					{/each}
				{/if}
				{#if items.length}
					{#if stage === 'review'}
						<div data-cart-total>
							<span>Subtotal</span>
							<strong>{money(total)}</strong>
						</div>
					{/if}
					<p data-muted>Demo checkout. No payment, delivery or purchase is made.</p>
				{/if}
				<div data-cart-actions data-empty={stage === 'cart' && !items.length ? '' : undefined}>
					<Button
						label={stage === 'review' ? 'Back to cart' : 'Continue shopping'}
						icon={{ name: 'arrow_back' }}
						variant={stage === 'cart' && !items.length ? 'filled' : 'neutral'}
						color={stage === 'cart' && !items.length ? 'primary' : 'foreground'}
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

<style>
	[data-cart-view] {
		display: grid;
	}
	[data-cart-table] {
		grid-area: 1 / 1;
		align-self: start;
		min-width: 0;
	}
	[data-cart] > [data-cart-actions][data-empty] {
		justify-content: center;
	}
	p {
		line-height: 1.7;
	}
	[data-muted] {
		color: var(--color-muted);
	}
	[data-visually-hidden] {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
		border: 0;
	}
	[data-cart] > p[data-muted] {
		color: var(--color-foreground);
	}
	[data-empty] {
		grid-column: 1 / -1;
		padding-block: 48px;
		color: var(--color-muted);
	}
	[data-cart] {
		display: grid;
		gap: 24px;
	}
	[data-cart-table] {
		container: cart-table / inline-size;
		overflow-x: auto;
	}
	[data-cart-table]:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 4px;
	}
	[data-cart-table] table {
		width: 100%;
		min-width: 640px;
		border-collapse: separate;
		border-spacing: 0 12px;
	}
	[data-cart-table] th {
		padding: 16px 12px;
		text-align: left;
		vertical-align: middle;
	}
	[data-cart-table] td {
		padding: 16px 12px;
		text-align: left;
		vertical-align: middle;
	}
	[data-cart-table] th:first-child {
		padding-inline-start: 16px;
	}
	[data-cart-table] thead th {
		padding-block: 4px;
		font-size: 13px;
		font-weight: 500;
	}
	[data-cart-table] thead th:first-child {
		width: 100%;
	}
	[data-cart-table] th:nth-child(2) {
		text-align: right;
		white-space: nowrap;
		font-size: 14px;
		font-variant-numeric: tabular-nums;
	}
	[data-cart-table] th:nth-child(4) {
		text-align: right;
		white-space: nowrap;
		font-size: 14px;
		font-variant-numeric: tabular-nums;
	}
	[data-cart-item-subtotal] {
		text-align: right;
		white-space: nowrap;
		font-size: 14px;
		font-variant-numeric: tabular-nums;
	}
	[data-cart-table] th:nth-child(3) {
		text-align: center;
	}
	[data-cart-table] tfoot th {
		padding-block: 20px;
		border-bottom: 0;
	}
	[data-cart-table] tfoot td {
		padding-block: 20px;
		border-bottom: 0;
	}
	[data-cart-table] tfoot th {
		font-size: 14px;
		font-weight: 500;
	}
	@container cart-table (max-width: 639px) {
		[data-cart-table] table,
		[data-cart-table] tbody,
		[data-cart-table] tfoot {
			display: block;
		}
		[data-cart-table] table {
			min-width: 0;
		}
		[data-cart-table] thead {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
		}
		[data-cart-table] tfoot tr {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		[data-cart-table] tfoot td:empty {
			display: none;
		}
	}
	[data-cart-actions] {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
	}
	[data-order-line] {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
	}
	[data-cart-actions] {
		flex-wrap: wrap;
	}
	[data-cart-total] {
		display: flex;
		justify-content: space-between;
		padding-top: 20px;
		border-top: 1px solid var(--forma-rule);
	}
	[data-order-confirmed] {
		display: grid;
		justify-items: center;
		gap: 28px;
		padding: 56px 24px 40px;
		text-align: center;
	}
	[data-order-confirmed-icon] {
		display: flex;
		color: var(--color-success);
		font-size: 44px;
	}
	[data-order-confirmed] > p {
		display: grid;
		gap: 8px;
		max-width: 40ch;
		margin: 0;
	}
	[data-order-confirmed] > p:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 6px;
		border-radius: 4px;
	}
	[data-order-confirmed-title] {
		color: var(--color-foreground);
		font:
			450 1.5rem/1.2 'Bricolage Grotesque Variable',
			sans-serif;
		letter-spacing: -0.03em;
	}
	[data-order-confirmed] > p > span {
		color: var(--color-muted);
		font-size: 14px;
	}
	@media (prefers-reduced-motion: no-preference) {
		[data-order-confirmed] {
			animation: order-confirmed-in 480ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
		}
	}
	@keyframes order-confirmed-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
	}
</style>
