<script lang="ts">
	import { Button } from 'bref-ui';
	import { scale } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
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
	let root: HTMLDivElement;
	let focusTarget = $state<'add' | 'increase' | 'decrease' | null>(null);
	const morph = $derived({
		start: 0.85,
		duration: prefersReducedMotion.current ? 0 : 160
	});
	$effect(() => {
		if (!focusTarget) return;
		const buttons = root.querySelectorAll('button');
		const button =
			focusTarget === 'add' || focusTarget === 'decrease'
				? buttons[0]
				: buttons[buttons.length - 1];
		button?.focus();
		focusTarget = null;
	});
	const change = (next: number) => {
		const previous = quantity;
		if (!onQuantity(next)) return;
		focusTarget = next <= 0 ? 'add' : next >= 99 ? 'decrease' : previous ? null : 'increase';
	};
</script>

<div data-grid-cart-action bind:this={root}>
	{#if quantity > 0}
		<div in:scale={morph}>
			<QuantityStepper name={`${name}, ${finish}`} {quantity} announce={false} onChange={change} />
		</div>
	{:else}
		<div in:scale={morph}>
			<Button
				icon={{ name: 'add_shopping_cart', label: `Add ${name}, ${finish} to cart` }}
				size="small"
				variant="neutral"
				onClick={() => change(1)}
			/>
		</div>
	{/if}
</div>

<style>
	[data-grid-cart-action] {
		display: flex;
		align-items: center;
	}
</style>
