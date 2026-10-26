<script lang="ts">
	import type { TreeItemProps } from 'bref-ui/types';
	let { components }: { components: typeof import('bref-ui-themes/vscode') } = $props();
	const sizes = ['small', 'medium', 'large'] as const;
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
				{ id: 'locked', label: 'locked.ts', icon: { name: 'lock' }, disabled: true }
			]
		},
		{ id: 'readme', label: 'README.md', icon: { name: 'description' } }
	];
	let enabled = $state(true);
	let language = $state<string | string[]>('svelte');
	let multiple = $state<string | string[]>(['svelte']);
	let notes = $state('A theme owns every component and its scoped styles.');
	let selection = $state<string | string[]>('app');
	let files = $state<TreeItemProps[]>(structuredClone(initialFiles));
	let invalid = $state(false);
	const removeFile = (id: string) => {
		const remove = (items: TreeItemProps[]): TreeItemProps[] =>
			items
				.filter((item) => item.id !== id)
				.map((item) => ({ ...item, children: item.children && remove(item.children) }));
		files = remove(files);
	};
</script>

<section aria-labelledby="additional-components" data-complete-components>
	<h2 id="additional-components">More components</h2>
	<p>
		These controls use this theme's own CLI-copied sources. Tab through fields, search options with
		the keyboard, and expand or select files.
	</p>
	<div data-grid>
		{#each sizes as size (size)}
			<div data-specimen>
				<h3>{size}</h3>
				<label data-switch-row>
					<components.Switch {size} bind:checked={enabled} />
					<span>Enable notifications · {size}</span>
				</label>
				<label>
					Language · {size}<components.Combobox
						{size}
						items={languages}
						bind:value={language}
						aria-label={`Language ${size}`}
					/>
				</label>
				<label>
					Notes · {size}<components.TextArea
						{size}
						bind:value={notes}
						rows={3}
						aria-label={`Notes ${size}`}
					/>
				</label>
				<components.TreeView
					{size}
					items={files}
					bind:selection
					defaultExpanded
					label={`Project files ${size}`}
					onDelete={removeFile}
				/>
			</div>
		{/each}
	</div>
	<div data-grid>
		<div data-specimen>
			<h3>Selection and disabled states</h3>
			<label data-switch-row>
				<components.Switch checked disabled />
				<span>Enabled and disabled</span>
			</label>
			<label data-switch-row>
				<components.Switch disabled />
				<span>Off and disabled</span>
			</label>
			<label>
				Multiple languages<components.Combobox
					items={languages}
					bind:value={multiple}
					aria-label="Multiple languages"
				/>
			</label>
			<components.Combobox
				items={languages}
				value="svelte"
				disabled
				aria-label="Disabled language"
			/>
			<components.TextArea value="Read only notes" readonly aria-label="Read only notes" />
			<components.TextArea value="Unavailable notes" disabled aria-label="Disabled notes" />
		</div>
		<form
			data-specimen
			onsubmit={(event) => {
				event.preventDefault();
				invalid = false;
			}}
		>
			<h3>Native validation</h3>
			<label>
				Required notes<components.TextArea
					name="notes"
					required
					variant="soft"
					aria-label="Required notes"
					aria-invalid={invalid || undefined}
					oninvalid={() => (invalid = true)}
				/>
			</label>
			<label>
				Required language<components.Combobox
					items={languages}
					name="language"
					required
					aria-label="Required language"
					aria-invalid={invalid || undefined}
				/>
			</label>
			{#if invalid}<p role="alert">Complete the required fields.</p>{/if}
			<components.Button type="submit" label="Validate" variant="filled" color="primary" />
		</form>
		<div data-specimen>
			<h3>Bound values</h3>
			<p>Notifications: {enabled ? 'enabled' : 'off'}</p>
			<p>Language: {Array.isArray(language) ? language.join(', ') : language}</p>
			<p>Selection: {Array.isArray(selection) ? selection.join(', ') : selection}</p>
			<components.Button
				label="Reset files"
				onClick={() => {
					files = structuredClone(initialFiles);
					selection = 'app';
				}}
			/>
			<p>
				<code>ThemeModeToggle</code>
				is also exported for document color-scheme metadata. Fixed-color themes retain their own scheme.
			</p>
		</div>
	</div>
</section>

<style>
	section {
		margin-block: 3rem;
		padding-block: 1.5rem;
		border-block-start: 1px solid color-mix(in srgb, var(--color-foreground) 20%, transparent);
	}
	h2,
	h3 {
		font-family: var(--font-display, inherit);
	}
	h2 {
		font-size: 1.5rem;
		margin-block-end: 1rem;
	}
	h3 {
		font-size: 1rem;
	}
	p {
		font-size: 0.875rem;
		line-height: 1.6;
		overflow-wrap: anywhere;
	}
	[data-grid] {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1.5rem;
		margin-block-start: 1.5rem;
	}
	[data-specimen] {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		min-width: 0;
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
	@media (max-width: 60rem) {
		[data-grid] {
			grid-template-columns: 1fr;
		}
	}
</style>
