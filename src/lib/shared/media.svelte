<script lang="ts">
	import type { IMediaProps } from './types.js';

	const { src, alt, type }: IMediaProps = $props();

	const isImage = type === 'image';
	const isVideo = type === 'video';
</script>

{#if isImage}
	<img {src} {alt} />
{/if}

{#if isVideo}
	<!-- svelte-ignore a11y_media_has_caption -->
	<video controls {src} title={alt}> </video>
{/if}

<style>
	video,
	img {
		max-width: 100%;
	}
</style>
