<script lang="ts">
	import { asset } from '$app/paths';
	import { Button, Surface } from '$lib/index.js';
	import { money } from './products.js';
	import type { CartItem } from './products.js';
	let {
		item,
		onQuantity,
		onRemove
	}: {
		item: CartItem;
		onQuantity: (key: string, quantity: number) => void;
		onRemove: (key: string) => void;
	} = $props();
</script>

<Surface data-cart-item variant="soft" radius="small" spacing="medium">
	<img src={asset(item.product.image)} alt="" width="96" height="112" />
	<div data-cart-item-details>
		<div data-cart-item-heading>
			<h3>{item.product.name}</h3>
			<strong>{money(item.product.price * item.quantity)}</strong>
		</div>
		<p data-muted>{item.finish}</p>
	</div>
	<div data-quantity role="group" aria-label={`Quantity for ${item.product.name}`}>
		<Button
			icon={{ name: 'remove', label: `Decrease quantity of ${item.product.name}` }}
			variant="soft"
			size="small"
			rounded
			onClick={() => onQuantity(item.key, item.quantity - 1)}
		/>
		<span aria-live="polite" aria-atomic="true">{item.quantity}</span>
		<Button
			icon={{ name: 'add', label: `Increase quantity of ${item.product.name}` }}
			variant="soft"
			size="small"
			rounded
			disabled={item.quantity >= 99}
			onClick={() => onQuantity(item.key, item.quantity + 1)}
		/>
		<Button
			data-delete-item
			icon={{ name: 'delete', label: `Remove ${item.product.name} from cart` }}
			color="error"
			variant="soft"
			size="small"
			rounded
			onClick={() => onRemove(item.key)}
		/>
	</div>
</Surface>
