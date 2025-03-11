<script lang="ts">
	import type { IMediaProps } from './types.js';

	const { src, alt, type, fill }: IMediaProps = $props();

	const isImage = type === 'image';
	const isVideo = type === 'video';
</script>

{#if isImage}
	<img {src} {alt} class:fill />
{/if}

{#if isVideo}
	<!-- svelte-ignore a11y_media_has_caption -->
	<video autoplay muted loop controls={false} title={alt}>
		<source {src} type="video/mp4" />
	</video>
{/if}

<style>
	video,
	img {
		max-width: 100%;
	}
	.fill {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
