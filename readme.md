# SV-Marketing

> 🚧 Still in active development.
>
> 🧑‍💻 Need to expose a variable? feel free to submit a PR.

Build beautiful marketing sites with SvelteKit - A lightweight, customizable component library for static marketing websites.

## Features

- 🚀 Built for SvelteKit
- 🎨 Highly customizable through CSS variables
- 📱 Fully responsive components
- ⚡ Lightweight and fast
- 🔧 Easy to integrate
- 📈 SEO-friendly with the right semantic components and `jsonLD`

## Installation

```bash
npm install sv-marketing
```

## Available Components

### Content Sections

- Hero
  - Basic Hero `<BasicHero {...props} />`
  - Hero with Media `<MediaHero {...props} />`
- Text & Media `<TextAndMedia {...props} />`
- Features Grid `<Features {...props} />`
- Pricing Table `<Pricing {...props} />`
- Call-to-Action (CTA) `<CallToAction {...props} />`
- Testimonials Grid `<Testimonials {...props} />`
- FAQ Accordion `<FrequentlyAskedQuestions {...props} />` (with `SEO` ✨)
- Brand Showcase List `<Brands {...props} />`
- Blog List View `<BlogListing {...props} />`
- Blog Post View `<BlogPost {...props} />`

### Navigation & Structure

- Layout `<Layout {...props} />`
- Breadcrumbs `<Breadcrumbs {...props} />` (with `SEO` ✨)
- Page SEO `<PageSeo {...props} />` (with `jsonLD` ✨)

### Compose your own

- SectionContainer `<SectionContainer {...props} />`, a wrapper for all sections (using a 12-column grid system)
- SubSectionContainer `<SubSectionContainer {...props} />`, a container for organizing content within sections with these props:
  - `children`: Svelte components to render inside the container
  - `gridSize`: Sets container width ('full' by default)
  - `gapSize`: Controls spacing between items ('small' by default)
  - `align`: Alignment of content ('center' by default)
  - `justifyUp`: Controls vertical alignment
  - `itemsCount`: Specifies number of items in the container
- SectionHeader `<SectionHeader {...props} />`, a header for each section with these props:
  - `title`: Title of the section
  - `subtitle`: Subtitle of the section
  - `align`: Alignment of content ('center' by default)
  - `justifyUp`: Controls vertical alignment
  - `itemsCount`: Specifies number of items in the container

## Usage

Components use Svelte's runes mode and can be styled through CSS variables imported to your `+layout.svelte` file.

## CSS Variables

The following CSS variables can be customized:

- `--section-max-width`: Sets the maximum width (`1200px` as fallback) for section containers to ensure consistent layout across different screen sizes.
- `--color-primary`: Sets the primary color (`#00f` as fallback) for buttons and other elements.
- `--color-primary-alternate-text`: Sets the text color for buttons and other elements that are styled (`#fff` as fallback).
- `--color-primary-background`: Sets the background color for primary sections (`#eee` as fallback).
- `--color-secondary-background`: Sets the background color for secondary sections (`#aaa` as fallback).
- `--color-text`: Sets the text color (`#222` as fallback) for all text elements.

## CSS Classes

Each component has specific class names to enable custom styling in your own `CSS` files. These classes follow a consistent pattern:

### Component Classes

- **Section Container Classes**

  - `.section` - Applied to all sections for generic styling
  - Component-specific class (e.g., `.text-and-media`, `.hero`, `.features`) for targeted styling

- **Item Classes**
  - Component-specific item class (e.g., `.text-and-media-item`, `.features-item`) for styling individual items within a component
  - `.sub-section` - Applied to sub-section containers within components

### Component-Specific Classes

- **Text and Media Component**

  - `.text-and-media` - Main container
  - `.text-and-media-item` - Individual text/media pairs
  - `.text-and-media-media` - Media within text/media pairs

- **Hero Components**

  - `.basic-hero` - Basic hero section
  - `.media-hero` - Hero with media section

- **Features Component**

  - `.features` - Main container
  - `.features-item` - Individual feature items
  - `.feature-media` - Media within feature items

- **Testimonials Component**

  - `.testimonials` - Main container
  - `.testimonials-item` - Individual testimonial
  - `.testimonial-media` - Avatar/media within testimonials

- **Pricing Component**

  - `.pricing` - Main container
  - `.pricing-item` - Individual pricing plans

- **FAQ Component**

  - `.faq` - Main container
  - `.faq-item` - Individual question/answer pairs

- **Call-to-Action Component**

  - `.cta` - Main container

- **Brands Component**

  - `.brands` - Main container
  - `.brands-item` - Individual brand items

- **Navbar Component**

  - `.navbar` - Main container
  - `.desktop-navbar` - Desktop navigation
  - `.mobile-navbar` - Mobile navigation

- **Footer Component**
  - `.footer` - Main container
  - `.footer-item` - Individual footer sub section

### Example Usage

To style all text and media sections:

```css
.text-and-media {
 background-color: #f9f9f9;
}

.text-and-media-item {
 border-left: 3px solid var(--color-primary);
}
```

## TODO

- Add template `CSS` for quick start
- Add demo site
- Add Markdown support for `p` tags and blog posts
- Add much clearer documentation
- Add Contact Form component (with `API` Submission)
