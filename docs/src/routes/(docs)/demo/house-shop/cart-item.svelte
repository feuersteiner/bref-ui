<script lang="ts">
	import { asset } from '$app/paths';
	import { prefersReducedMotion } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { Button, surface } from 'bref-ui';
	import { money } from './products.js';
	import type { CartItem } from './products.js';
	import QuantityStepper from './quantity-stepper.svelte';
	let {
		item,
		onQuantity,
		onRemove
	}: {
		item: CartItem;
		onQuantity: (key: string, quantity: number) => void;
		onRemove: (key: string) => void;
	} = $props();
	const collapse = (node: HTMLElement) => {
		for (const cell of node.querySelectorAll<HTMLElement>('[data-cart-cell]')) {
			cell.style.setProperty('--cart-cell-height', `${cell.offsetHeight}px`);
		}
		return {
			duration: prefersReducedMotion.current ? 0 : 240,
			easing: cubicOut,
			css: (t: number) => `opacity: ${t}; --cart-row-progress: ${t}; --cart-cell-overflow: hidden;`
		};
	};
</script>

<tr
	data-cart-item
	data-cart-item-key={item.key}
	class={surface({ variant: 'soft', color: 'background' })}
	out:collapse
>
	<td>
		<div data-cart-cell>
			<div data-cart-product>
				<img src={asset(item.product.image)} alt="" width="64" height="80" />
				<div data-cart-item-details>
					<h3>{item.product.name}</h3>
					<p data-muted>{item.finish}</p>
				</div>
			</div>
		</div>
	</td>
	<td data-cart-item-price><div data-cart-cell>{money(item.product.price)}</div></td>
	<td data-cart-item-quantity>
		<div data-cart-cell>
			<QuantityStepper
				name={item.product.name}
				quantity={item.quantity}
				onChange={(quantity) => onQuantity(item.key, quantity)}
			/>
		</div>
	</td>
	<td data-cart-item-subtotal>
		<div data-cart-cell><strong>{money(item.product.price * item.quantity)}</strong></div>
	</td>
	<td data-cart-item-remove>
		<div data-cart-cell>
			<Button
				data-delete-item
				icon={{ name: 'delete', label: `Remove ${item.product.name} from cart` }}
				color="error"
				variant="neutral"
				size="small"
				rounded
				onClick={() => onRemove(item.key)}
			/>
		</div>
	</td>
</tr>

<style>
	/* The global reset zeroes td padding and the cart's scoped td rules only reach its own cells. */
	[data-cart-item] > td {
		padding-block: calc(16px * var(--cart-row-progress, 1));
		padding-inline: 12px;
		vertical-align: middle;
		background: var(--surface-fill);
	}
	[data-cart-item] > td:first-child {
		padding-inline-start: 16px;
		border-start-start-radius: 12px;
		border-end-start-radius: 12px;
	}
	[data-cart-item] > td:last-child {
		border-start-end-radius: 12px;
		border-end-end-radius: 12px;
	}
	[data-cart-cell] {
		display: flex;
		align-items: center;
		max-height: calc(var(--cart-cell-height, 100vh) * var(--cart-row-progress, 1));
		overflow: var(--cart-cell-overflow, visible);
	}
	[data-cart-item-quantity] > [data-cart-cell] {
		justify-content: center;
	}
	[data-cart-item-price] > [data-cart-cell],
	[data-cart-item-subtotal] > [data-cart-cell],
	[data-cart-item-remove] > [data-cart-cell] {
		justify-content: flex-end;
	}
	h3 {
		font-weight: 500;
		line-height: 1.15;
	}
	img {
		display: block;
		max-width: 100%;
	}
	p {
		line-height: 1.7;
	}
	[data-muted] {
		color: var(--color-muted);
	}
	img {
		border-radius: var(--forma-image-radius);
	}
	h3 {
		font:
			450 20px/1.2 'Bricolage Grotesque Variable',
			sans-serif;
		letter-spacing: -0.02em;
	}
	[data-cart-item] {
		background: transparent;
		border: 0;
	}
	[data-cart-item-price],
	[data-cart-item-subtotal] {
		text-align: right;
		white-space: nowrap;
		font-size: 14px;
		font-variant-numeric: tabular-nums;
	}
	[data-cart-product] {
		display: flex;
		align-items: center;
		gap: 16px;
		min-width: 224px;
	}
	[data-cart-product] > img {
		width: 64px;
		height: 80px;
		flex-shrink: 0;
		object-fit: cover;
	}
	[data-cart-item] h3 {
		font-size: 16px;
	}
	[data-cart-item] p {
		font-size: 12px;
		margin-block: 4px 0;
	}
	[data-cart-item-details] {
		min-width: 0;
		overflow-wrap: anywhere;
	}
	@container cart-table (max-width: 639px) {
		[data-cart-item] {
			display: grid;
			grid-template-columns: auto minmax(0, 1fr) auto;
			grid-template-areas:
				'product product remove'
				'quantity price subtotal';
			align-items: center;
			gap: calc(12px * var(--cart-row-progress, 1)) 12px;
			margin-block-end: calc(12px * var(--cart-row-progress, 1));
			padding-block: calc(12px * var(--cart-row-progress, 1));
			padding-inline: 16px 12px;
			border-radius: 12px;
			background: var(--surface-fill);
		}
		[data-cart-item] > td,
		[data-cart-item] > td:first-child,
		[data-cart-item] > td:last-child {
			padding: 0;
			border-radius: 0;
			background: none;
		}
		[data-cart-item] > td:first-child {
			grid-area: product;
		}
		[data-cart-item-price] {
			grid-area: price;
			color: var(--color-muted);
		}
		[data-cart-item-price] > [data-cart-cell]::after {
			content: '\a0 each';
		}
		[data-cart-item-quantity] {
			grid-area: quantity;
		}
		[data-cart-item-quantity] > [data-cart-cell] {
			justify-content: flex-start;
		}
		[data-cart-item-subtotal] {
			grid-area: subtotal;
		}
		[data-cart-item-remove] {
			grid-area: remove;
		}
		[data-cart-product] {
			min-width: 0;
		}
	}
</style>
