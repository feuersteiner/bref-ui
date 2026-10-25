<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import { Icon, Surface } from 'bref-ui';
	const demos = [
		{
			name: 'Todo',
			icon: 'checklist',
			href: resolve('/(skins)/skins/(sites)/(todo)/todo'),
			preview: 'relay',
			description: 'Organize projects, edit tasks and track completed work.'
		},
		{
			name: 'House Shop',
			icon: 'storefront',
			href: resolve('/(skins)/skins/(sites)/(house-shop)/house-shop'),
			preview: 'forma',
			description: 'Browse furniture and manage a shopping cart.'
		},
		{
			name: 'RunnerAI',
			icon: 'smart_toy',
			href: resolve('/(skins)/skins/(sites)/(runner-ai)/runner-ai'),
			preview: 'elsewhere',
			description: 'Assess marketing copy, follow each check and apply suggested edits.'
		}
	] as const;
</script>

<div data-live-demos>
	{#each demos as demo (demo.preview)}
		<a href={demo.href}>
			<Surface variant="soft" radius="medium" spacing="medium" hover="medium" height="fill">
				<figure>
					<img
						src={asset(`previews/${demo.preview}.jpg`)}
						alt={demo.preview === 'elsewhere'
							? 'Earlier Elsewhere audit demo'
							: `${demo.name} demo as rendered in a browser`}
						width="1440"
						height="960"
						loading="lazy"
					/>
					{#if demo.preview === 'elsewhere'}<figcaption>Earlier audit demo</figcaption>{/if}
				</figure>
				<h3>
					<span data-brand><Icon name={demo.icon} />{demo.name}</span><Icon name="arrow_outward" />
				</h3>
				<p>{demo.description}</p>
				<span data-link>Explore demo</span>
			</Surface>
		</a>
	{/each}
</div>

<style>
	[data-live-demos] {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 24px;
	}
	a {
		display: block;
		color: var(--color-foreground);
		text-decoration: none;
		min-width: 0;
	}
	a:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 4px;
		border-radius: 1.5rem;
	}
	figure {
		margin: 0;
	}
	figcaption {
		margin-top: 8px;
		color: var(--color-muted);
		font-size: 12px;
	}
	img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 3/2;
		object-fit: cover;
		object-position: top;
		border-radius: 0.5rem;
	}
	h3 {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font:
			400 24px / 1.2 'Syne Variable',
			sans-serif;
	}
	p {
		color: var(--color-muted);
		font-size: 14px;
		line-height: 1.6;
	}
	[data-brand] {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}
	[data-link] {
		font-size: 13px;
		font-weight: 600;
		color: var(--color-primary);
	}
	@media (max-width: 780px) {
		[data-live-demos] {
			grid-template-columns: 1fr;
		}
	}
</style>
