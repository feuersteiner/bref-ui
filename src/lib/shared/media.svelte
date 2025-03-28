<script lang="ts">
	import type { IMediaProps } from './types.js';

	const { src, alt, type, fill, className }: IMediaProps = $props();

	const isImage = type === 'image';
	const isVideo = type === 'video';

	const mediaClassName = 'media' + (className ? ` ${className}` : '');
</script>

{#if isImage}
	<img {src} {alt} class:fill class={mediaClassName} />
{/if}

{#if isVideo}
	<!-- svelte-ignore a11y_media_has_caption -->
	<video autoplay muted loop controls={false} title={alt} class={mediaClassName}>
		<source {src} type="video/mp4" />
	</video>
{/if}

<style>
	video,
	img {
		max-width: 100%;
		object-fit: contain;
		max-height: calc(100vh / 2);
	}
	.fill {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
