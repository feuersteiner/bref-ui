<script lang="ts">
	import {
		BasicHero,
		BreadCrumbs,
		CallToAction,
		Features,
		FrequentlyAskedQuestions,
		MediaHero,
		PageSeo,
		Testimonials,
		TextAndMedia,
		Pricing
	} from '$lib/index.js';
</script>

<PageSeo
	title="Home"
	description="This is the home page."
	keywords={['home', 'page']}
	thumbnail="https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
	path="/"
	baseUrl="https://example.com"
	jsonLd={{
		additionalType: 'https://schema.org/WebPage',
		name: 'Home',
		legalName: 'Home',
		logo: 'https://example.com/logo.png',
		socialMedia: ['https://twitter.com', 'https://facebook.com']
	}}
/>
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
<Pricing
	title="Pricing"
	subtitle="This is a pricing section."
	items={[
		{
			title: 'Basic',
			price: '$10',
			features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5'],
			ctaButton: {
				label: 'Buy',
				href: '#'
			}
		},
		{
			title: 'Pro',
			price: '$20',
			features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5'],
			ctaButton: {
				label: 'Buy',
				href: '#'
			},
			featured: true
		},
		{
			title: 'Enterprise',
			price: 'contact sales',
			features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5'],
			ctaButton: {
				label: 'Buy',
				href: '#'
			}
		}
	]}
/>
<Testimonials
	title="Testimonials"
	subtitle="This is a testimonials section."
	items={[
		{
			text: 'This is a testimonial from a satisfied customer.',
			avatar: {
				src: 'https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
				alt: 'Random Image',
				type: 'image'
			},
			person: {
				name: 'John Doe',
				company: 'Company Name'
			}
		},
		{
			text: 'This is another testimonial from another satisfied customer.',
			person: {
				name: 'Jane Doe',
				company: 'Company Name'
			}
		},
		{
			text: 'This is another testimonial from another satisfied customer.',
			person: {
				name: 'Jane Doe',
				company: 'Company Name'
			}
		}
	]}
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

<CallToAction
	title="Call To Action"
	subtitle="This is a call to action section."
	primaryButton={{
		label: 'Primary Button',
		href: '#'
	}}
/>
