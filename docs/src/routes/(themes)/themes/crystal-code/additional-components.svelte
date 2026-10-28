<script lang="ts">
	import type { TreeItemProps } from 'bref-ui/types';
	let { components }: { components: typeof import('bref-ui-themes/crystal-code') } = $props();
	const languages = [
		{ id: 'svelte', label: 'Svelte', icon: { name: 'code' as const } },
		{ id: 'typescript', label: 'TypeScript', icon: { name: 'data_object' as const } },
		{ id: 'unavailable', label: 'Unavailable', disabled: true }
	];
	const initialFiles: TreeItemProps[] = [
		{
			id: 'src',
			label: 'src',
			icon: { name: 'folder' },
			children: [
				{ id: 'app', label: 'app.svelte', icon: { name: 'code' } },
				{ id: 'theme', label: 'theme.css', icon: { name: 'palette' } },
				{ id: 'locked', label: 'locked.ts', icon: { name: 'lock' }, disabled: true }
			]
		},
		{ id: 'readme', label: 'README.md', icon: { name: 'description' } }
	];
	let enabled = $state(true);
	let language = $state<string | string[]>('svelte');
	let notes = $state('Keep the interface quiet. Give the work room to breathe.');
	let selection = $state<string | string[]>('app');
	let files = $state<TreeItemProps[]>(structuredClone(initialFiles));
	const removeFile = (id: string) => {
		const remove = (items: TreeItemProps[]): TreeItemProps[] =>
			items
				.filter((item) => item.id !== id)
				.map((item) => ({ ...item, children: item.children && remove(item.children) }));
		files = remove(files);
	};
</script>

<section aria-labelledby="additional-components">
	<div class="section-heading">
		<div>
			<p class="eyebrow">06 / THE REST OF THE TOOLKIT</p>
			<h3 id="additional-components">More components</h3>
		</div>
		<code>Switch · Combobox · TextArea · TreeView</code>
	</div>
	<div class="grid">
		<div class="panel stack">
			<h4>Editor preferences</h4>
			<label class="switch-row">
				<components.Switch bind:checked={enabled} />
				<span>Inline suggestions</span>
			</label>
			<p class="muted">Suggestions are {enabled ? 'enabled' : 'off'}.</p>
			<label for="syntax-language">Syntax language</label>
			<components.Combobox
				id="syntax-language"
				items={languages}
				bind:value={language}
				aria-label="Syntax language"
			/>
			<label for="workspace-notes">Workspace notes</label>
			<components.TextArea id="workspace-notes" bind:value={notes} rows={4} />
		</div>
		<div class="panel stack">
			<div class="files-heading">
				<h4>Project files</h4>
				<components.Button
					label="Restore files"
					icon={{ name: 'restart_alt' }}
					onClick={() => {
						files = structuredClone(initialFiles);
						selection = 'app';
					}}
				/>
			</div>
			<components.TreeView
				items={files}
				bind:selection
				defaultExpanded
				label="Project files"
				onDelete={removeFile}
			/>
			<p class="muted">Expand folders, select a file, or remove an editable item.</p>
			<p class="mono">
				Selected: {Array.isArray(selection) ? selection.join(', ') || 'none' : selection || 'none'}
			</p>
		</div>
	</div>
	<p class="metadata">
		<code>ThemeModeToggle</code>
		supplies document color-scheme metadata. The header switches this preview between light and dark.
	</p>
</section>

<style>
	section {
		display: grid;
		gap: 24px;
		min-width: 0;
	}
	.section-heading {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: end;
		gap: 16px;
	}
	.eyebrow,
	code,
	.mono {
		font: 10px/1.7 var(--crystal-code-font-mono);
		color: var(--color-muted);
	}
	.eyebrow {
		letter-spacing: 0.06em;
	}
	.section-heading > code {
		font-size: 11px;
	}
	h3 {
		margin-top: 12px;
		font-size: 20px;
		font-weight: 500;
		letter-spacing: -0.03em;
	}
	h4 {
		font-size: 13px;
		font-weight: 500;
	}
	p {
		font-size: 12px;
		line-height: 1.8;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 24px;
	}
	.panel {
		padding: clamp(24px, 3vw, 40px);
		background: var(--crystal-code-panel);
		border-radius: 14px;
		box-shadow: var(--crystal-code-pane-shadow);
		min-width: 0;
	}
	.stack {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 16px;
	}
	.stack > h4 {
		margin-bottom: 8px;
	}
	label {
		font-size: 12px;
	}
	.switch-row,
	.files-heading {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
	}
	.files-heading {
		justify-content: space-between;
	}
	.muted,
	.metadata {
		color: var(--color-muted);
	}
	.metadata {
		max-width: 680px;
	}
	@media (max-width: 760px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
