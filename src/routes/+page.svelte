<script lang="ts">
	import { MediaHero, TextAndMedia } from '$lib/index.js';
	import BasicHero from '$lib/sections/hero/basic-hero.svelte';
</script>

<MediaHero
	title="Welcome to SV-Marketing"
	subtitle="This is a basic hero component."
	primaryButton={{ label: 'Primary Button', type: 'primary', href: '#' }}
	secondaryButton={{ label: 'Secondary Button', type: 'secondary', href: '#' }}
	media={{
		src: 'https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
		alt: 'Random Image',
		type: 'image'
	}}
/>
<BasicHero
	title="Welcome to SV-Marketing, Again!"
	subtitle="This is a basic hero component, again!"
	primaryButton={{ label: 'Primary Button', type: 'primary', href: '#' }}
	secondaryButton={{ label: 'Secondary Button', type: 'secondary', href: '#' }}
/>
<TextAndMedia
	title="Text And Media"
	subtitle="This is a component that displays text and media in alternating pairs."
	primaryButton={{
		label: 'Primary Button',
		type: 'primary',
		href: '#'
	}}
	secondaryButton={{
		label: 'Secondary Button',
		type: 'secondary',
		href: '#'
	}}
	items={[
		{
			title: 'Section One Out of Three',
			subtitle: `This is the first section of three.
            It contains a title, subtitle, and two buttons.
            The text spans 3 lines.`,
			media: {
				src: 'https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
				alt: 'Random Image',
				type: 'image'
			}
		},
		{
			title: 'Section One Out of Three',
			subtitle: `This is the first section of three.
            It contains a title, subtitle, and two buttons.
            The text spans 3 lines.`,
			media: {
				src: 'https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
				alt: 'Random Image',
				type: 'image'
			}
		}
	]}
/>
