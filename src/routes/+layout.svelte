<script lang="ts">
	import { Layout } from '$lib/index.js';
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();

	import '$lib/templates/template.css';

	const logo = {
		src: 'https://images.pexels.com/photos/430205/pexels-photo-430205.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
		alt: 'Logo',
		href: '#',
		label: 'Logo'
	};
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
		logo,
		primaryButton: {
			label: 'Sign Up',
			href: '#'
		}
	}}
	footer={{
		copyright: 'Contoso Inc',
		tagline: 'The best company in the world',
		logo,
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
