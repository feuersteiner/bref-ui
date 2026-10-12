<script lang="ts">
	import { asset } from '$app/paths';
	import { untrack } from 'svelte';
	import { Button, Dialog, Select } from '$lib/index.js';
	import { money } from './products.js';
	import type { Product } from './products.js';
	let {
		product,
		open = $bindable(false),
		onAdd
	}: {
		product: Product;
		open?: boolean;
		onAdd: (product: Product, finish: string) => void;
	} = $props();
	let finish = $state<string | string[]>(untrack(() => product.finishes[0]));
	const add = () => {
		onAdd(product, String(finish));
		open = false;
	};
</script>

<Dialog
	bind:open
	header={{
		title: product.name,
		description: money(product.price)
	}}
	size="medium"
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

			<Button
				label="Add to cart"
				icon={{ name: 'add_shopping_cart' }}
				color="primary"
				variant="filled"
				onClick={add}
			/>
		</div>
	</div>
</Dialog>
