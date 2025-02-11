# SV-Marketing

>
> 🚧 Still in active development.
>
> 🧑‍💻 Need to expose a variable? feel free to submit a PR.
>

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

- ✅ Hero
  - ✅ Basic Hero
  - ✅ Hero with Image
- ✅ Text And Media Pairs
- ✅ Feature blocks
- ✅ Pricing tables
- ✅ Call-to-action (CTA)
- ✅ Testimonials
- ✅ FAQ accordions (with `SEO` ✨)
- ✅ Navbar
- ✅ Footer
- ✅ Breadcrumbs (with `SEO` ✨)
- ✅ Page Layout
- ✅ Page `SEO` (with `jsonLD` ✨)
- ✅ Blog Listing Page
- ✅ Blog Post Page

## Usage

Components use Svelte's runes mode and can be styled through CSS variables imported to your `+layout.svelte` file.

## CSS Variables

The following CSS variables can be customized:

- `--max-section-width`: Sets the maximum width (`1200px` as fallback) for section containers to ensure consistent layout across different screen sizes.
- `--color-primary`: Sets the primary color (`#00f` as fallback) for buttons and other elements.
- `--color-primary-text`: Sets the text color for buttons and other elements that are styled (`#fff` as fallback).

## TODO

- Add template `CSS` for quick start
- Add demo site
- Add `CSS` classes to all sections
- Add Markdown support for `p` tags and blog posts
- Add much clearer documentation
- Add Contact Form component (with `API` Submission)
