<script lang="ts">
	import {
		BasicHero,
		BreadCrumbs,
		Features,
		FrequentlyAskedQuestions,
		MediaHero,
		TextAndMedia
	} from '$lib/index.js';
</script>

<BreadCrumbs
	items={[
		{ label: 'Home', href: '#' },
		{ label: 'About', href: '#' },
		{ label: 'Contact', href: '#' }
	]}
/>
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
<Features
	title="Features"
	subtitle={`This is a features section. 
		It demonstrates multiple features in a grid layout.
		Each feature includes a title, description, and image.`}
	secondaryButton={{
		label: 'Secondary Button',
		href: '#'
	}}
	gridSize="third"
	items={Array.from({ length: 3 }, (_, i) => ({
		title: `Feature ${i + 1}`,
		subtitle: `This is feature number ${i + 1}.
			A simple description for the feature.
			Additional details about the feature.`,
		media: {
			src: 'https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
			alt: 'Random Image',
			type: 'image'
		}
	}))}
/>
<FrequentlyAskedQuestions
	title="FAQ"
	subtitle="This is a FAQ section."
	items={[
		{
			question: 'What is SveteKit?',
			answer:
				'SvelteKit is a framework for building web applications of all sizes, with a beautiful development experience and flexible filesystem-based routing.'
		},
		{
			question: 'What is Svelte?',
			answer:
				'Svelte is a radical new approach to building user interfaces. Whereas traditional frameworks like React and Vue do the bulk of their work in the browser, Svelte shifts that work into a compile step that happens when you build your app.'
		},
		{
			question: 'What is Africa?',
			answer: `Africa is the world's second-largest and second-most populous continent, after Asia in both cases. At about 30.3 million km² including adjacent islands, it covers 6% of Earth's total surface area and 20% of its land area.`
		}
	]}
/>
