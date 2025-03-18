<script lang="ts">
	import {
		BasicHero,
		Breadcrumbs,
		CallToAction,
		Features,
		FrequentlyAskedQuestions,
		MediaHero,
		PageSeo,
		Testimonials,
		TextAndMedia,
		Pricing,
		Brands
	} from '$lib/index.js';
	import type { IMediaProps } from '$lib/shared/types.js';

	const media: IMediaProps = {
		type: 'image',
		src: 'https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
		alt: 'SV-Marketing Component Example'
	};
</script>

<PageSeo
	title="SV-Marketing - Beautiful Marketing Sites with SvelteKit"
	description="Build beautiful marketing sites with SvelteKit - A lightweight, customizable component library for static marketing websites."
	keywords={['sveltekit', 'marketing', 'components', 'library', 'static sites']}
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
<Breadcrumbs
	items={[
		{ label: 'Home', href: '/' },
		{ label: 'Components', href: '/components' },
		{ label: 'Docs', href: '/docs' }
	]}
/>
<MediaHero
	title="SV-Marketing"
	subtitle="Build beautiful marketing sites with SvelteKit - A lightweight, customizable component library for static marketing websites."
	primaryButton={{ label: 'Get Started', type: 'primary', href: '#features' }}
	secondaryButton={{
		label: 'View on GitHub',
		href: 'https://github.com/sv-marketing'
	}}
	{media}
/>
<BasicHero
	title="Another Hero!!"
	subtitle="Who knew? There are multiple heroes!"
	primaryButton={{
		label: 'Explore Components',
		href: '#components'
	}}
	secondaryButton={{
		label: 'Inflate A Balloon',
		href: '#'
	}}
/>
<Features
	title="Why Choose SV-Marketing"
	subtitle="Our lightweight component library offers everything you need to build stunning marketing sites"
	primaryButton={{
		label: 'Explore Components',
		href: '#components'
	}}
	items={[
		{
			title: 'Built for SvelteKit',
			subtitle:
				"Optimized for SvelteKit's architecture with full support for runes mode and seamless integration with your existing projects.",
			media
		},
		{
			title: 'Highly Customizable',
			subtitle:
				'Easily customize the look and feel through CSS variables to match your brand identity without writing complex overrides.',
			media
		},
		{
			title: 'SEO Friendly',
			subtitle:
				'Built-in SEO optimizations with semantic HTML and JSON-LD support to help your marketing site rank better in search results.',
			media
		}
	]}
/>
<TextAndMedia
	title="Component Showcase"
	subtitle="Explore our versatile components designed to create compelling marketing websites"
	items={[
		{
			title: 'Content Sections',
			subtitle:
				'From heroes to feature grids, our content sections help you structure your marketing message effectively and beautifully.',
			media
		},
		{
			title: 'Navigation Components',
			subtitle:
				'Create intuitive user flows with our navigation components like breadcrumbs, menus, and structured layouts.',
			media
		},
		{
			title: 'Conversion Elements',
			subtitle:
				'Drive action with our call-to-action components, pricing tables, and testimonial displays designed for maximum impact.',
			media
		},
		{
			title: 'Fully Responsive',
			subtitle:
				'All components adapt beautifully to any screen size, ensuring your marketing site looks perfect on desktop, tablet, and mobile.',
			media
		}
	]}
/>
<Features
	title="Technical Benefits"
	subtitle="Why developers love building with SV-Marketing"
	secondaryButton={{
		label: 'View Documentation',
		href: '#'
	}}
	items={[
		{
			title: 'Lightweight & Fast',
			subtitle:
				'Built with performance in mind, our components add minimal overhead to your SvelteKit application while maintaining smooth animations and transitions.',
			media
		},
		{
			title: 'Easy Integration',
			subtitle:
				'Simple import syntax and consistent prop structures make integration into new or existing projects straightforward and developer-friendly.',
			media
		},
		{
			title: 'Flexible Styling',
			subtitle:
				'Customize appearance through CSS variables or use our class naming system to apply your own styles while maintaining component functionality.',
			media
		}
	]}
/>
<Pricing
	title="Simple Pricing.. that doesn't exist"
	subtitle="Start building your marketing site today with our flexible options"
	items={[
		{
			title: 'Open Source',
			price: 'Free',
			features: [
				'All core components',
				'Runes mode support',
				'Basic CSS variables',
				'Community support',
				'MIT license'
			],
			ctaButton: {
				label: 'Get Started',
				href: 'https://github.com/sv-marketing'
			}
		},
		{
			title: 'Pro',
			price: '$49',
			features: [
				'All free features',
				'Advanced components',
				'Premium templates',
				'Priority support',
				'Regular updates'
			],
			ctaButton: {
				label: 'Subscribe',
				href: '/pricing'
			},
			featured: true
		},
		{
			title: 'Enterprise',
			price: 'Custom',
			features: [
				'Custom component development',
				'White-labeling options',
				'Dedicated support',
				'Custom integrations',
				'Training sessions'
			],
			ctaButton: {
				label: 'Contact Us',
				href: '/contact'
			}
		}
	]}
/>
<Brands
	title="Trusted By Developers"
	subtitle="Join the growing community of developers building with SV-Marketing"
	items={Array.from({ length: 12 }, (_, i) => ({
		logo: {
			src: 'https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
			alt: 'Company logo'
		},
		link: {
			href: '#'
		}
	}))}
/>
<Testimonials
	title="What Developers Say"
	subtitle="Hear from developers who have built marketing sites with our components"
	items={[
		{
			text: 'SV-Marketing has dramatically reduced our development time for marketing pages. The components are well-designed, customizable, and the documentation is excellent.',
			avatar: media,
			person: {
				name: 'Alex Chen',
				company: 'Really Headless'
			}
		},
		{
			text: 'As a solo developer, SV-Marketing has been a game-changer for my client projects. I can quickly spin up professional marketing sites with minimal custom CSS.',
			person: {
				name: 'Maria Rodriguez',
				company: 'Freelance Developer'
			}
		},
		{
			text: 'The SEO benefits alone make SV-Marketing worth it. Our marketing pages now have proper semantic structure and schema markup without extra effort on our part.',
			person: {
				name: 'Sam Taylor',
				company: 'Web Optimization Inc'
			}
		}
	]}
/>
<FrequentlyAskedQuestions
	title="Frequently Asked Questions"
	subtitle="Get answers to common questions about SV-Marketing"
	items={[
		{
			question: 'What is SV-Marketing?',
			answer:
				'SV-Marketing is a lightweight, customizable component library for SvelteKit that helps developers build beautiful marketing websites with less effort.'
		},
		{
			question: 'Do I need to know Svelte to use SV-Marketing?',
			answer:
				'Yes, SV-Marketing is built specifically for SvelteKit projects. Basic knowledge of Svelte and SvelteKit is recommended to get the most out of the library.'
		},
		{
			question: 'How customizable are the components?',
			answer:
				"All components are highly customizable through CSS variables and class-based styling. You can easily adapt them to match your brand's design system."
		},
		{
			question: 'Is SV-Marketing SEO-friendly?',
			answer:
				'Absolutely! Our components use semantic HTML and include built-in support for JSON-LD structured data, which helps search engines understand your content better.'
		}
	]}
/>

<CallToAction
	title="Ready to Build Your Marketing Site?"
	subtitle="Get started with SV-Marketing today and create beautiful, SEO-friendly marketing pages in minutes."
	primaryButton={{
		label: 'Install Now',
		href: 'https://github.com/feuersteiner/sv-marketing'
	}}
	secondaryButton={{
		label: 'View Documentation',
		href: '#'
	}}
/>
