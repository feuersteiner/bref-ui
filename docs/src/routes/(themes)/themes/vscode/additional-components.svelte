<script lang="ts">
	import type { TreeItemProps } from 'bref-ui/types';
	let { components }: { components: typeof import('bref-ui-themes/vscode') } = $props();
	const languages = [
		{ id: 'svelte', label: 'Svelte', icon: { name: 'code' as const } },
		{ id: 'typescript', label: 'TypeScript', icon: { name: 'data_object' as const } },
		{ id: 'unavailable', label: 'Unavailable language', disabled: true }
	];
	const initialFiles: TreeItemProps[] = [
		{
			id: 'src',
			label: 'src',
			icon: { name: 'folder' },
			children: [
				{ id: 'app', label: 'app.svelte', icon: { name: 'code' } },
				{ id: 'styles', label: 'styles.css', icon: { name: 'palette' } },
				{ id: 'locked', label: 'locked.ts', icon: { name: 'lock' }, disabled: true }
			]
		},
		{ id: 'readme', label: 'README.md', icon: { name: 'description' } }
	];
	let enabled = $state(true);
	let language = $state<string | string[]>('svelte');
	let notes = $state('A familiar workspace. A fresh place to build.');
	let selection = $state<string | string[]>('app');
	let files = $state<TreeItemProps[]>(structuredClone(initialFiles));
	let disabled = $state(false);
	let readonly = $state(false);
	let multi = $state(false);
	let size = $state<'small' | 'medium' | 'large'>('medium');
	let invalid = $state(false);
	let saved = $state(false);
	const removeFile = (id: string) => {
		const remove = (items: TreeItemProps[]): TreeItemProps[] =>
			items
				.filter((item) => item.id !== id)
				.map((item) => ({ ...item, children: item.children && remove(item.children) }));
		files = remove(files);
		const exists = (id: string, items: TreeItemProps[]): boolean =>
			items.some((item) => item.id === id || (item.children && exists(id, item.children)));
		selection = Array.isArray(selection)
			? selection.filter((id) => exists(id, files))
			: exists(selection, files)
				? selection
				: '';
	};
</script>

<section aria-labelledby="additional-components" data-complete-components>
	<div class="section-title">
		<h2 id="additional-components">
			07 <span>More components</span>
		</h2>
		<code>Switch · Combobox · TextArea · TreeView</code>
	</div>
	<p class="note">
		A few finishing touches for the workspace. Edit settings, search a language or explore a
		project.
	</p>
	<fieldset class="specimen-controls">
		<legend>Preview controls</legend>
		<label>
			Size <select bind:value={size}>
				<option value="small">Small</option>
				<option value="medium">Medium</option>
				<option value="large">Large</option>
			</select>
		</label>
		<label>
			<input type="checkbox" bind:checked={disabled} />
			Disabled fields
		</label>
		<label>
			<input type="checkbox" bind:checked={readonly} />
			Read only text
		</label>
	</fieldset>
	<div class="specimens">
		<div class="specimen">
			<div class="specimen-heading">
				<h3>Notifications</h3>
				<code>Switch</code>
			</div>
			<label class="switch-row">
				<components.Switch {size} {disabled} bind:checked={enabled} />
				<span>Enable notifications</span>
			</label>
			<p class="note" role="status">Notifications are {enabled ? 'enabled' : 'off'}.</p>
		</div>
		<div class="specimen">
			<div class="specimen-heading">
				<h3>Language mode</h3>
				<code>Combobox</code>
			</div>
			<label for="vscode-search-language">Search languages</label>
			<components.Combobox
				id="vscode-search-language"
				{size}
				{disabled}
				{readonly}
				items={languages}
				bind:value={language}
				wide
			/>
			<label class="switch-row">
				<input
					type="checkbox"
					bind:checked={multi}
					onchange={(event) => {
						language = event.currentTarget.checked ? ['svelte'] : 'svelte';
					}}
				/>
				Select multiple languages
			</label>
			<p class="note">
				Type to filter; use arrow keys and Enter to select. Try an unmatched query.
			</p>
		</div>
		<form
			class="specimen"
			onsubmit={(event) => {
				event.preventDefault();
				invalid = false;
				saved = true;
			}}
		>
			<div class="specimen-heading">
				<h3>Workspace notes</h3>
				<code>TextArea</code>
			</div>
			<label for="vscode-workspace-notes">
				Notes <span class="note">(required)</span>
			</label>
			<components.TextArea
				id="vscode-workspace-notes"
				{size}
				{disabled}
				{readonly}
				bind:value={notes}
				rows={4}
				wide
				required
				name="notes"
				aria-invalid={invalid || undefined}
				aria-describedby="vscode-notes-feedback"
				oninvalid={() => {
					invalid = true;
					saved = false;
				}}
				oninput={() => {
					invalid = false;
					saved = false;
				}}
			/>
			<p id="vscode-notes-feedback" class:error={invalid} class="note" role="status">
				{invalid
					? 'Enter a note before saving.'
					: saved
						? 'Workspace notes saved for this preview.'
						: 'Clear the field and save to inspect native validation.'}
			</p>
			<div>
				<components.Button
					label="Save notes"
					type="submit"
					size="small"
					color="primary"
					variant="filled"
					disabled={disabled || readonly}
				/>
			</div>
		</form>
		<div class="specimen">
			<div class="specimen-heading">
				<h3>Project files</h3>
				<code>TreeView</code>
			</div>
			<components.TreeView
				{size}
				items={files}
				bind:selection
				defaultExpanded
				label="Example project files"
				onDelete={removeFile}
			/>
			<div class="tree-status">
				<p class="note">
					Selected: {Array.isArray(selection)
						? selection.join(', ') || 'None'
						: selection || 'None'}
				</p>
				<components.Button
					label="Reset files"
					size="small"
					onClick={() => {
						files = structuredClone(initialFiles);
						selection = 'app';
					}}
				/>
			</div>
			<p class="note">
				Expand folders, select a file or remove an item. The locked file stays disabled.
			</p>
		</div>
	</div>
	<div class="scheme-note">
		<div>
			<h3>One familiar color scheme.</h3>
			<p class="note">
				ThemeModeToggle controls document metadata. This fixed-color theme retains its dark
				workbench palette.
			</p>
		</div>
		<components.ThemeModeToggle mode="dark" />
	</div>
</section>

<style>
	section {
		display: grid;
		gap: 24px;
		padding-block: 44px;
		border-top: 1px solid var(--vscode-border);
	}
	.section-title,
	.specimen-heading,
	.tree-status {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 8px;
	}
	h2 {
		margin: 0;
		scroll-margin-top: calc(var(--workbench-title-height) + 20px);
		font: 12px / 1.5 var(--vscode-font-mono);
		color: var(--color-muted);
	}
	h2 span {
		margin-left: 10px;
		font:
			500 22px / 1.4 'Segoe UI',
			system-ui,
			sans-serif;
		color: var(--color-foreground);
	}
	h3 {
		font-size: 14px;
		font-weight: 500;
	}
	code {
		font: 11px / 1.6 var(--vscode-font-mono);
		color: var(--color-info);
		overflow-wrap: anywhere;
	}
	p,
	label {
		font-size: 13px;
		line-height: 1.6;
	}
	.note {
		color: var(--color-muted);
	}
	.specimen-controls {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 16px 24px;
		border: 1px solid var(--vscode-border);
		padding: 12px 16px;
	}
	legend {
		padding-inline: 6px;
		font: 11px / 1.5 var(--vscode-font-mono);
		color: var(--color-muted);
	}
	.specimen-controls label,
	.switch-row {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	select {
		padding: 4px 24px 4px 8px;
		border: 1px solid var(--vscode-border);
		border-radius: 0;
		background: var(--vscode-input);
		color: var(--color-foreground);
		font: inherit;
	}
	input {
		accent-color: var(--color-primary);
	}
	.specimens {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 32px;
	}
	.specimen {
		display: grid;
		align-content: start;
		gap: 16px;
		min-width: 0;
		padding-top: 20px;
		border-top: 1px solid var(--vscode-border);
	}
	.specimen-heading {
		margin-bottom: 4px;
	}
	.scheme-note {
		display: flex;
		align-items: center;
		gap: 24px;
		padding: 20px;
		background: var(--vscode-panel);
		border-left: 2px solid var(--color-primary);
	}
	.scheme-note > div {
		display: grid;
		gap: 8px;
		flex: 1;
	}
	.error {
		color: var(--color-error);
	}
	select:focus-visible,
	input:focus-visible {
		outline: 1px solid var(--color-primary);
		outline-offset: 3px;
	}
	@media (max-width: 1050px) {
		.specimens {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 680px) {
		section {
			padding-block: 32px;
		}
		.scheme-note {
			align-items: start;
		}
	}
</style>
