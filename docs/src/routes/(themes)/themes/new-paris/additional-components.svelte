<script lang="ts">
	import type { TreeItemProps } from 'bref-ui/types';
	let { components }: { components: typeof import('bref-ui-themes/new-paris') } = $props();
	const languages = [
		{ id: 'svelte', label: 'Svelte', icon: { name: 'code' as const } },
		{ id: 'typescript', label: 'TypeScript', icon: { name: 'data_object' as const } }
	];
	const files: TreeItemProps[] = [
		{
			id: 'src',
			label: 'src',
			icon: { name: 'folder' },
			children: [
				{ id: 'app', label: 'app.svelte', icon: { name: 'code' } },
				{ id: 'styles', label: 'styles.css', icon: { name: 'palette' } }
			]
		},
		{ id: 'readme', label: 'README.md', icon: { name: 'description' } }
	];
	let enabled = $state(true);
	let language = $state<string | string[]>('svelte');
	let notes = $state('Review the typography, spacing and navigation.');
	let selection = $state<string | string[]>('app');
</script>

<section aria-labelledby="additional-components" data-complete-components>
	<h2 id="additional-components">More components</h2>
	<p>Switches, searchable choices, text areas and file trees.</p>
	<div data-grid>
		<div data-specimen>
			<h3>Switch</h3>
			<label data-switch-row>
				<components.Switch bind:checked={enabled} />
				<span>Enable notifications</span>
			</label>
		</div>
		<div data-specimen>
			<h3>Combobox</h3>
			<label for="np-language">Language</label>
			<components.Combobox
				id="np-language"
				items={languages}
				bind:value={language}
				aria-label="Language"
				wide
			/>
		</div>
		<div data-specimen>
			<h3>TextArea</h3>
			<label for="np-notes">Notes</label>
			<components.TextArea id="np-notes" bind:value={notes} rows={4} wide />
		</div>
		<div data-specimen>
			<h3>TreeView</h3>
			<components.TreeView items={files} bind:selection defaultExpanded label="Project files" />
		</div>
	</div>
</section>

<style>
	section {
		max-width: 1320px;
		margin-inline: auto;
		padding-block: 4rem 6rem;
		padding-inline: var(--np-page-gutter, 24px);
		border-block-start: 1px solid color-mix(in srgb, var(--color-foreground) 20%, transparent);
	}
	h2,
	h3 {
		font-family: var(--font-display, inherit);
	}
	h2 {
		font-size: clamp(2rem, 4vw, 2.625rem);
		margin-block-end: 1rem;
	}
	h3 {
		font-size: 1.75rem;
	}
	p {
		font-size: 0.875rem;
		line-height: 1.6;
		overflow-wrap: anywhere;
	}
	section > p {
		max-width: 60ch;
		color: var(--color-muted);
	}
	[data-grid] {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 4rem;
		margin-block-start: 3rem;
	}
	[data-specimen] {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		min-width: 0;
		padding-top: 1.5rem;
		border-top: 1px solid var(--np-rule);
	}
	label {
		display: grid;
		gap: 0.5rem;
		font-size: 0.875rem;
	}
	[data-switch-row] {
		display: flex;
		align-items: center;
	}
	@media (max-width: 48rem) {
		[data-grid] {
			grid-template-columns: 1fr;
		}
	}
</style>
