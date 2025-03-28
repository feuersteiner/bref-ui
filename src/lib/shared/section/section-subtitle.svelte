<script lang="ts">
	import type { ISubtitleProps } from '../types.js';

	const { subtitle, align = 'center' }: ISubtitleProps = $props();
</script>

<p class={align}>{subtitle}</p>

<style>
	p {
		all: unset;
		width: 100%;
		font-size: 1.5rem;
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

	@media (max-width: 768px) {
		p {
			font-size: 1.25rem;
		}
	}

	@media (max-width: 480px) {
		p {
			font-size: 1.125rem;
		}
	}
</style>
