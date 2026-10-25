<script lang="ts">
	import { Button } from 'bref-ui';
	import type { HTMLAttributes } from 'svelte/elements';
	let {
		name,
		quantity,
		max = 99,
		announce = true,
		onChange,
		...rest
	}: {
		name: string;
		quantity: number;
		max?: number;
		// Off when the parent already announces quantity changes.
		announce?: boolean;
		onChange: (quantity: number) => void;
	} & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role' | 'onchange'> = $props();
</script>

<div data-quantity-stepper role="group" aria-label={`Quantity for ${name}`} {...rest}>
	<Button
		icon={{ name: 'remove', label: `Decrease quantity of ${name}` }}
		rounded
		variant="neutral"
		size="small"
		disabled={quantity <= 0}
		onClick={() => onChange(quantity - 1)}
	/>
	<span aria-live={announce ? 'polite' : 'off'} aria-atomic="true">{quantity}</span>
	<Button
		icon={{ name: 'add', label: `Increase quantity of ${name}` }}
		rounded
		variant="neutral"
		size="small"
		disabled={quantity >= max}
		onClick={() => onChange(quantity + 1)}
	/>
</div>

<style>
	[data-quantity-stepper] {
		display: inline-flex;
		align-items: center;
		padding: 2px;
		border: 1px solid var(--forma-rule);
		border-radius: 999px;
	}
	[data-quantity-stepper] > span {
		min-width: 32px;
		text-align: center;
		font-size: 13px;
		font-variant-numeric: tabular-nums;
	}
</style>
