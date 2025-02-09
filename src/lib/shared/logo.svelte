<script lang="ts">
	import type { ILogoProps } from './types.js';

	const { src, alt, href, isTargetBlank, label, size }: ILogoProps = $props();
</script>

<a {href} title={label} target={isTargetBlank ? '_blank' : undefined}>
	<img {src} {alt} class={size} />
</a>

<style>
    .small {
        height: 1.5rem;
        width: auto;
    }
    .medium {
        height: 2.5rem;
        width: auto;
    }
    .large {
        height: 5rem;
        width: auto;
    }
    a {
        all: unset;
        cursor: pointer;
        display: inline-block;
    }
    img {
        all: unset;
        display: block;
        height: 100%;
        width: auto;
    }
</style>
