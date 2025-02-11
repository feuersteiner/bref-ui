<script lang="ts">
	import type { ITitleProps } from '../types.js';

	const { title, align = 'center' }: ITitleProps = $props();
</script>

<h3 class={align}>{title}</h3>

<style>
	h3 {
		all: unset;
		width: 100%;
		font-size: 2rem;
		cursor: inherit;
	}
	.left {
		text-align: left;
	}
	.right {
		text-align: right;
	}
	.center {
		text-align: center;
	}
</style>
