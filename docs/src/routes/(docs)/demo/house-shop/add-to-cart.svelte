<script lang="ts">
	import { tick } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { scale } from 'svelte/transition';
	import { Button } from 'bref-ui';
	import QuantityStepper from './quantity-stepper.svelte';
	let {
		name,
		finish,
		quantity,
		onQuantity
	}: {
		name: string;
		finish: string;
		quantity: number;
		onQuantity: (quantity: number) => boolean;
	} = $props();
	let control: HTMLDivElement;
	const morph = $derived({ start: 0.94, duration: prefersReducedMotion.current ? 0 : 160 });
	// The cart notice announces each change, so this control only moves focus across the swap.
	const focus = async (selector: string) => {
		await tick();
		control.querySelector<HTMLElement>(selector)?.focus();
	};
	const add = () => {
		if (onQuantity(1)) focus('[data-quantity-stepper] button:last-of-type');
	};
	const change = (next: number) => {
		if (onQuantity(next) && next <= 0) focus('[data-add-button]');
	};
</script>

<div data-add-control bind:this={control}>
	{#if quantity > 0}
		<div data-in-cart in:scale={morph}>
			<QuantityStepper name={`${name}, ${finish}`} {quantity} announce={false} onChange={change} />
			<p>In cart · {finish}</p>
		</div>
	{:else}
		<div in:scale={morph}>
			<Button
				label="Add to cart"
				icon={{ name: 'add_shopping_cart' }}
				variant="filled"
				color="primary"
				size="medium"
				onClick={add}
				aria-label={`Add ${name}, ${finish} to cart`}
				data-add-button
			/>
		</div>
	{/if}
</div>

<style>
	[data-add-control] {
		display: grid;
		justify-items: start;
		min-width: 0;
	}
	[data-in-cart] {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		align-items: center;
	}
	p {
		color: var(--color-muted);
		font-size: 12px;
	}
</style>
