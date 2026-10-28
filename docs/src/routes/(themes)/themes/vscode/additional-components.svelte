<script lang="ts">
	let { components }: { components: typeof import('bref-ui-themes/vscode') } = $props();
	const languages = [
		{ id: 'svelte', label: 'Svelte', icon: { name: 'code' as const } },
		{ id: 'typescript', label: 'TypeScript', icon: { name: 'data_object' as const } },
		{ id: 'unavailable', label: 'Unavailable language', disabled: true }
	];
	const sizes = [
		{ id: 'small', label: 'Small' },
		{ id: 'medium', label: 'Medium' },
		{ id: 'large', label: 'Large' }
	];
	let enabled = $state(true);
	let language = $state<string | string[]>('svelte');
	let notes = $state('A familiar workspace. A fresh place to build.');
	let disabled = $state(false);
	let readonly = $state(false);
	let multi = $state(false);
	let size = $state<'small' | 'medium' | 'large'>('small');
	let invalid = $state(false);
	let saved = $state(false);
</script>

<section aria-labelledby="additional-components" data-complete-components>
	<div class="section-title">
		<h2 id="additional-components">
			07 <span>More components</span>
		</h2>
		<code>Switch · Combobox · TextArea</code>
	</div>
	<p class="note introduction">
		A few finishing touches for the workspace. Edit settings or search a language. The <a
			href="#explorer"
		>
			navigation sidebar
		</a>
		is the TreeView example: expand the source folder, select a file or filter with Search. Tab between
		controls; Enter or Space activates them. The unavailable file stays disabled.
	</p>
	<fieldset class="specimen-controls">
		<legend>Preview configuration</legend>
		<div class="size-control">
			<label for="vscode-preview-size">Size</label>
			<div class="size-field">
				<components.Select
					id="vscode-preview-size"
					items={sizes}
					value={size}
					size="small"
					onChange={(value) => {
						if (value === 'small' || value === 'medium' || value === 'large') size = value;
					}}
				/>
			</div>
		</div>
		<label>
			<components.Checkbox bind:checked={disabled} />
			Disabled fields
		</label>
		<label>
			<components.Checkbox bind:checked={readonly} />
			Read only text
		</label>
	</fieldset>
	<p class="note preview-status" role="status">
		{disabled ? 'Fields disabled.' : readonly ? 'Text fields read only.' : 'Fields editable.'}
	</p>
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
			<div class="setting-field">
				<components.Combobox
					id="vscode-search-language"
					{size}
					{disabled}
					{readonly}
					items={languages}
					bind:value={language}
					wide
				/>
			</div>
			<label class="switch-row">
				<components.Checkbox
					bind:checked={multi}
					disabled={disabled || readonly}
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
			<div class="setting-field">
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
			</div>
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
	</div>
	<div class="scheme-note">
		<div>
			<h3>Appearance</h3>
			<p class="note">The VS Code preview uses a fixed dark workbench palette.</p>
		</div>
		<components.ThemeModeToggle mode="dark" />
	</div>
</section>

<style>
	section {
		display: grid;
		gap: 16px;
		padding-block: 44px;
		border-top: 1px solid var(--vscode-border);
	}
	.section-title,
	.specimen-heading {
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
		margin: 0;
		font-size: 13px;
		font-weight: 600;
	}
	code {
		font: 11px / 1.6 var(--vscode-font-mono);
		color: var(--color-muted);
		overflow-wrap: anywhere;
	}
	p,
	label {
		margin: 0;
		font-size: 13px;
		line-height: 1.4;
	}
	.note {
		color: var(--color-muted);
	}
	.introduction {
		max-width: 80ch;
	}
	.specimen-controls,
	.specimens,
	.scheme-note {
		box-sizing: border-box;
		width: 100%;
		max-width: 740px;
		min-width: 0;
	}
	.specimen-controls {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px 20px;
		margin: 0;
		border: 1px solid var(--vscode-border);
		padding: 10px 14px 12px;
		background: var(--vscode-panel);
	}
	legend {
		padding-inline: 6px;
		font:
			12px / 1.5 'Segoe UI',
			system-ui,
			sans-serif;
		color: var(--color-muted);
	}
	.specimen-controls label,
	.size-control,
	.switch-row {
		display: flex;
		align-items: center;
		gap: 9px;
		min-height: 26px;
	}
	.size-field {
		width: 140px;
		min-width: 0;
	}
	.preview-status {
		font-size: 12px;
	}
	.switch-row:has(:disabled) {
		color: var(--color-muted);
	}
	.specimens {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
	}
	.specimen {
		display: grid;
		align-content: start;
		gap: 8px;
		min-width: 0;
		padding: 14px;
		border-top: 1px solid var(--vscode-border);
	}
	.setting-field {
		width: 100%;
		max-width: 420px;
		min-width: 0;
	}
	.scheme-note {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 14px;
		border-top: 1px solid var(--vscode-border);
	}
	.scheme-note > div {
		display: grid;
		gap: 4px;
		flex: 1;
	}
	.error {
		color: var(--color-error);
	}
	@media (max-width: 680px) {
		section {
			padding-block: 32px;
		}
		.size-control {
			flex-basis: 100%;
		}
		.scheme-note {
			align-items: start;
		}
	}
</style>
