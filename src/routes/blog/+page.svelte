<script lang="ts">
	import { BlogListing } from '$lib/index.js';
</script>

<BlogListing
	title="Blog"
	subtitle="Welcome to my blog. Here you will find a collection of my thoughts, ideas, and experiences."
	posts={Array.from({ length: 20 }, (_, i) => ({
		title: `Article ${i + 2}`,
		subtitle: `Blog post ${i + 2}`,
		datePublished: new Date(
			2021 + Math.floor(Math.random() * 3),
			Math.floor(Math.random() * 12),
			Math.floor(Math.random() * 28) + 1
		),
		href: `/blog/some-article`,
		thumbnail: {
			src: 'https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
			alt: 'img'
		}
	}))}
/>
