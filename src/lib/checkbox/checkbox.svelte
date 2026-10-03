<script lang="ts">
	import type { CheckboxProps } from './types.js';

	let {
		size = 'medium',
		checked = $bindable(false),
		indeterminate = $bindable(false),
		ref = $bindable(),
		...attributes
	}: CheckboxProps = $props();
</script>

<input
	{...attributes}
	type="checkbox"
	data-size={size}
	bind:checked
	bind:indeterminate
	bind:this={ref}
/>

<style>
	input {
		box-sizing: border-box;
		inline-size: 1.25rem;
		block-size: 1.25rem;
		margin: 0;
		accent-color: var(--color-primary, #555);
		cursor: pointer;
		vertical-align: middle;
	}
	input[data-size='small'] {
		inline-size: 1rem;
		block-size: 1rem;
	}
	input[data-size='large'] {
		inline-size: 1.5rem;
		block-size: 1.5rem;
	}
	input:focus-visible {
		outline: 2px solid var(--color-foreground, black);
		outline-offset: 3px;
	}
	input:disabled {
		cursor: not-allowed;
	}
</style>
