<script lang="ts">
	import { Layout } from '$lib/index.js';
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
</script>

<Layout
	navbar={{
		items: [
			{
				label: 'Home',
				href: '#'
			},
			{
				label: 'About',
				href: '#'
			},
			{
				label: 'Contact',
				href: '#'
			}
		],
		logo: {
			src: 'https://images.pexels.com/photos/430205/pexels-photo-430205.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
			alt: 'Logo',
			href: '#',
			label: 'Logo'
		},
		primaryCta: {
			label: 'Sign Up',
			href: '#'
		}
	}}
	footer={{
		columns: [
			...Array.from({ length: 3 }, (_, i) => ({
				header: {
					label: `Column ${i + 1}`,
					href: '#'
				},
				children: Array.from({ length: 3 }, (_, j) => ({
					label: `Item ${j + 1}`,
					href: '#'
				}))
			}))
		]
	}}
>
	{@render children()}
</Layout>
