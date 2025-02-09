<script lang="ts">
	import type { ISubtitleProps } from '../types.js';

	const { subtitle, align = 'center' }: ISubtitleProps = $props();
</script>

<p class={align}>{subtitle}</p>

<style>
	p {
		all: unset;
		width: 100%;
		white-space: pre-line;
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
