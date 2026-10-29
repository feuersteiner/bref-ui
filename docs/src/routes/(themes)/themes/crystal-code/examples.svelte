<script lang="ts">
	import * as C from 'bref-ui-themes/crystal-code';
	import type { DialogProps, TabItemDataProps, TreeItemProps } from 'bref-ui/types';
	let {
		section
	}: { section: 'actions' | 'forms' | 'organize' | 'feedback' | 'context' | 'additional' } =
		$props();
	const sizes = ['x-small', 'small', 'medium', 'large', 'x-large'] as const;
	const dialogSizes = [...sizes, 'full-screen'] as const;
	const baseSizes = ['small', 'medium', 'large'] as const;
	const variants = ['neutral', 'soft', 'filled'] as const;
	const colors = [
		'foreground',
		'primary',
		'secondary',
		'muted',
		'info',
		'success',
		'warning',
		'error'
	] as const;
	const options = [
		{ id: 'svelte', label: 'Svelte', icon: { name: 'code' as const } },
		{ id: 'ts', label: 'TypeScript' }
	];
	const tabs: TabItemDataProps[] = [
		{ id: 'editor', label: 'Editor', icon: 'edit' },
		{ id: 'files', label: 'Files', icon: 'folder' },
		{ id: 'locked', label: 'Unavailable', icon: 'lock', disabled: true }
	];
	const tree: TreeItemProps[] = [
		{
			id: 'src',
			label: 'src',
			children: [{ id: 'app', label: 'app.svelte', icon: { name: 'code' } }]
		},
		{ id: 'readme', label: 'README.md', icon: { name: 'description' } }
	];
	const id = $props.id();
	let verticalTab = $state('editor');
	let overflowTab = $state('editor');
	let sizeTabs = $state({ small: 'editor', medium: 'editor', large: 'editor' });
	let actions = $state(0);
	const recordAction = () => actions++;
	let multiple = $state<string | string[]>(['svelte']);
	let treeSelection = $state<string | string[]>(['app']);
	let choiceItems = $state(options);
	let pillVisible = $state(true);
	let pillClicks = $state(0);
	let open = $state(false);
	let popover = $state(false);
	let dialogSize = $state<NonNullable<DialogProps['size']>>('medium');
	let dismissible = $state(true);
	let footer = $state('standard');
</script>

<div class="examples">
	{#if section === 'actions'}
		<h4>Text buttons · XS to XL</h4>
		<div class="row">
			{#each sizes as size (size)}<C.Button
					onClick={recordAction}
					label={size}
					{size}
					variant="soft"
				/>{/each}
		</div>
		<h4>Icon buttons · square and rounded</h4>
		{#each [false, true] as rounded (rounded)}
			<div class="row">
				{#each sizes as size, index (size)}<C.Button
						onClick={recordAction}
						icon={{ name: 'favorite' }}
						aria-label={`${size} favorite${rounded ? ', rounded' : ''}`}
						{size}
						{rounded}
						variant={variants[index % 3]}
						color="primary"
					/>{/each}<C.Button
					onClick={recordAction}
					icon={{ name: 'lock' }}
					aria-label="Unavailable action"
					disabled
					{rounded}
				/>
			</div>
		{/each}
		<div class="row">
			<C.Button
				onClick={recordAction}
				label="Continue"
				trailingIcon={{ name: 'arrow_forward' }}
				variant="soft"
			/><C.Button
				onClick={recordAction}
				label="Glass action"
				icon={{ name: 'layers' }}
				variant="soft"
				glass
			/>
		</div>
		<C.Button onClick={recordAction} label="Full width action" variant="soft" wide />
		<div class="row">
			{#each colors as color (color)}<C.Button
					onClick={recordAction}
					label={color}
					{color}
					variant="soft"
				/>{/each}
		</div>
		<h4>Icons · sizes, outline and fill</h4>
		<div class="row">
			{#each sizes as size (size)}<C.Icon
					name="favorite"
					{size}
					label={`${size} outlined favorite`}
				/><C.Icon name="favorite" {size} filled label={`${size} filled favorite`} />{/each}
		</div>
		<div class="row">
			{#each colors as color (color)}<C.Icon
					name="circle"
					{color}
					size="small"
					label={color}
				/>{/each}
			<span style="font-size:24px"><C.Icon name="code" /> Inherited size and color</span>
		</div>
		<p role="status">{actions} actions activated.</p>
	{:else if section === 'forms'}
		<h4>Input sizes · small, medium, large</h4>
		{#each baseSizes as size (size)}
			<div class="fields">
				<C.TextInput
					aria-label={`${size} search`}
					placeholder={size}
					icon={{ name: 'search' }}
					variant="soft"
					{size}
				/>
				<div class="field">
					<label for={`${id}-${size}`}>Select · {size}</label>
					<C.Select id={`${id}-${size}`} items={options} placeholder={size} {size} />
				</div>
			</div>
		{/each}
		<div class="fields">
			<C.TextInput
				aria-label="Glass search"
				placeholder="Glass search"
				icon={{ name: 'search' }}
				variant="soft"
				glass
			/><C.TextInput aria-label="Readonly setting" value="Read only" readonly />
		</div>
		<label class="row"><C.Checkbox aria-invalid="true" /> Invalid checkbox</label>
		<h4>Multiple and empty selection</h4>
		<div class="fields">
			<div class="field">
				<label for={`${id}-multiple`}>Multiple languages</label>
				<C.Select id={`${id}-multiple`} items={options} bind:value={multiple} />
			</div>
			<div class="field">
				<label for={`${id}-empty`}>Empty languages</label>
				<C.Select
					id={`${id}-empty`}
					items={[]}
					placeholder="No options"
					emptyMessage={{ message: 'No languages available', icon: { name: 'search_off' } }}
				/>
			</div>
		</div>
	{:else if section === 'organize'}
		<h4>Interactive and removable labels</h4>
		<div class="row">
			{#if pillVisible}<C.Pill
					label={`Activated ${pillClicks} times`}
					icon={{ name: 'label' }}
					onClick={() => pillClicks++}
					onDelete={() => (pillVisible = false)}
					swoosh
				/>{:else}<C.Button
					label="Restore interactive label"
					onClick={() => (pillVisible = true)}
				/>{/if}<C.Pill label="Glass label" variant="soft" glass />
			<C.Pill
				label="Build complete"
				color="success"
				variant="soft"
				icon={{ name: 'check_circle' }}
			/>
		</div>
		<C.Pill label="Full width label" variant="soft" wide />
		{#each variants.filter((variant) => variant !== 'neutral') as variant (variant)}<C.PillGroup
				items={options}
				{variant}
			/>{/each}
		<C.PillChoiceGroup
			items={choiceItems}
			bind:selection={multiple}
			variant="soft"
			onDelete={(id) => {
				choiceItems = choiceItems.filter((item) => item.id !== id);
				multiple = Array.isArray(multiple) ? multiple.filter((item) => item !== id) : [];
			}}
			animateSelected
			aria-label="Language labels with icons"
		/>
		<C.Button label="Restore language labels" onClick={() => (choiceItems = options)} />
	{:else if section === 'feedback'}
		<h4>Progress · small, medium, large</h4>
		{#each baseSizes as size (size)}<C.Progress
				value={0.6}
				{size}
				label={`${size} read only progress`}
			/>{/each}
		<C.Progress label="Indeterminate progress" />
		<h4>Loading sizes · XS to XL</h4>
		<div class="row">
			{#each sizes as size (size)}<C.Spinner {size} label={`${size} loading`} />{/each}
		</div>
	{:else if section === 'context'}
		<h4>Surface variants</h4>
		<div class="cards">
			{#each variants as variant (variant)}<C.Surface
					{variant}
					color="primary"
					spacing="medium"
					radius="small"
				>
					<strong>{variant}</strong>
					<p>Content inside a surface.</p>
				</C.Surface>{/each}
		</div>
		<h4>Surface spacing · XS to XL</h4>
		<div class="row">
			{#each sizes as spacing (spacing)}<C.Surface {spacing} width="fit" radius="small">
					<span>{spacing}</span>
					<span>Padding and gap</span>
				</C.Surface>{/each}
		</div>
		<div class="cards">
			<C.Surface
				orientation="horizontal"
				width="fit"
				spacing="small"
				variant="soft"
				color="primary"
				radius="small"
			>
				<C.Icon name="folder" />
				<span>Horizontal · fit</span>
			</C.Surface>
			<div class="glass-stage">
				<C.Surface glass variant="soft" color="background" spacing="medium" radius="small">
					<p>Glass · fill width</p>
				</C.Surface>
			</div>
			<div style="height:100px">
				<C.Surface
					height="fill"
					scroll
					spacing="small"
					radius="small"
					aria-label="Scrollable surface"
				>
					{#each Array(8).keys() as index (index)}<p>Scrollable row {index + 1}</p>{/each}
				</C.Surface>
			</div>
		</div>
		<h4>Hover and shadow strengths</h4>
		<div class="cards">
			{#each baseSizes as strength (strength)}<C.Surface
					hover={strength}
					shadow={strength}
					spacing="medium"
					radius="small"
				>
					<p>{strength} hover and shadow</p>
				</C.Surface>{/each}
		</div>
		<h4>Vertical tabs · icons only</h4>
		<div class="tab-demo">
			<C.Tabs
				items={tabs}
				orientation="vertical"
				bind:value={verticalTab}
				label="Vertical workspace views"
			/>
			<div class="tab-content">
				<h4>{verticalTab === 'editor' ? 'Editor preferences' : 'Project files'}</h4>
				<p>
					{verticalTab === 'editor'
						? 'Choose settings for this workspace.'
						: 'app.svelte · README.md'}
				</p>
			</div>
		</div>
		<h4>Tabs · sizes and fill width</h4>
		{#each baseSizes as size (size)}<C.Tabs
				items={tabs}
				{size}
				width="fill"
				bind:value={sizeTabs[size]}
				label={`${size} filled width tabs`}
			/>
			<p>{size} selection: {sizeTabs[size]}</p>{/each}
		<div class="overflow-tabs">
			<C.Tabs
				items={[
					...tabs,
					{ id: 'history', label: 'Workspace history', icon: 'history' },
					{ id: 'settings', label: 'Workspace settings', icon: 'tune' }
				]}
				bind:value={overflowTab}
				filled
				label="Scrollable tabs with filled icons"
			/>
		</div>
		<p>
			Scrollable selection: {overflowTab}. Arrow keys move between tabs; Home and End reach the
			first and last available tab. Scroll the narrow strip to reveal more tabs.
		</p>
		<h4>Popover states</h4>
		<div class="row">
			<C.Popover disabled>
				{#snippet trigger()}<C.Button label="Details unavailable" disabled />{/snippet}
				<p>Unavailable details</p>
			</C.Popover>
			<C.Popover
				bind:open={popover}
				variant="filled"
				color="primary"
				spacing="medium"
				scroll
				style="max-height:160px"
			>
				{#snippet trigger()}<C.Button
						label="Scrollable popover"
						aria-expanded={popover}
						onClick={() => (popover = !popover)}
					/>{/snippet}{#each Array(12).keys() as index (index)}<p>
						Workspace detail {index + 1}
					</p>{/each}
			</C.Popover>
		</div>
		<h4>Dialog options</h4>
		<div class="row">
			<div class="field">
				<label for={`${id}-dialog-size`}>Size</label>
				<C.Select
					id={`${id}-dialog-size`}
					size="small"
					items={dialogSizes.map((size) => ({ id: size, label: size }))}
					bind:value={
						() => dialogSize,
						(value) => {
							const next = dialogSizes.find((size) => size === value);
							if (next) dialogSize = next;
						}
					}
				/>
			</div>
			<div class="field">
				<label for={`${id}-dialog-footer`}>Footer</label>
				<C.Select
					id={`${id}-dialog-footer`}
					size="small"
					items={['standard', 'custom', 'none'].map((footer) => ({ id: footer, label: footer }))}
					bind:value={
						() => footer,
						(next) => {
							if (typeof next === 'string') footer = next;
						}
					}
				/>
			</div>
			<label class="row"><C.Checkbox bind:checked={dismissible} /> Dismissible</label>
			<C.Button label="Open dialog example" onClick={() => (open = true)} />
		</div>
		{#snippet customFooter()}<C.Button
				label="Custom footer action"
				variant="soft"
				onClick={() => (open = false)}
			/>{/snippet}
		<C.Dialog
			bind:open
			size={dialogSize}
			{dismissible}
			header={{
				title: 'Dialog example',
				description: `${dialogSize} · ${dismissible ? 'Escape or dismiss to close' : 'Use the close action'}`,
				icon: { name: 'folder' }
			}}
			footer={footer === 'none'
				? undefined
				: footer === 'custom'
					? customFooter
					: {
							primary: { label: 'Done', onClick: () => (open = false) },
							secondary: { label: 'Cancel', onClick: () => (open = false) }
						}}
		>
			<p>Choose a size, footer and dismissal behavior before opening.</p>
			<C.Button label="Close example" onClick={() => (open = false)} />
		</C.Dialog>
	{:else}
		<h4>Editor controls · small, medium, large</h4>
		{#each baseSizes as size (size)}<div class="fields">
				<C.Combobox
					items={options}
					placeholder={`${size} language`}
					aria-label={`${size} language`}
					variant="soft"
					{size}
				/>
				<label class="row"><C.Switch {size} /> {size} switch</label>
				<C.TextArea
					aria-label={`${size} notes`}
					placeholder={`${size} notes`}
					icon={{ name: 'edit' }}
					variant="soft"
					{size}
					rows={2}
				/>
			</div>{/each}
		<h4>Disabled, read only and invalid</h4>
		{#each ['disabled', 'readonly', 'invalid'] as state (state)}<div class="fields">
				<C.Combobox
					items={options}
					value="svelte"
					aria-label={`${state} language`}
					disabled={state === 'disabled'}
					readonly={state === 'readonly'}
					aria-invalid={state === 'invalid'}
				/><C.TextArea
					value={state}
					aria-label={`${state} notes`}
					disabled={state === 'disabled'}
					readonly={state === 'readonly'}
					aria-invalid={state === 'invalid'}
					resizable={false}
					rows={2}
				/>
			</div>{/each}
		<div class="row">
			<label class="row"><C.Switch disabled /> Disabled off</label>
			<label class="row"><C.Switch checked disabled /> Disabled on</label>
			<label class="row"><C.Switch aria-invalid="true" /> Invalid switch</label>
		</div>
		<div class="fields">
			<C.Combobox
				items={options}
				bind:value={multiple}
				aria-label="Multiple languages"
			/><C.Combobox
				items={[]}
				placeholder="No languages"
				emptyMessage={{ message: 'No languages available' }}
				aria-label="Empty language choices"
			/>
		</div>
		<h4>Tree sizes · small, medium, large</h4>
		<div class="cards">
			{#each baseSizes as size (size)}<div>
					<p>{size}</p>
					<C.TreeView items={tree} {size} defaultExpanded label={`${size} project tree`} />
				</div>{/each}
		</div>
		<h4>Multiple selection and sections</h4>
		<C.TreeView
			items={tree}
			bind:selection={treeSelection}
			defaultExpanded
			sections={[
				{
					id: 'workspace',
					label: 'Workspace',
					description: 'Shared project files',
					icon: { name: 'folder' },
					items: [{ id: 'settings', label: 'settings.json', icon: { name: 'settings' } }]
				}
			]}
			label="Project files with multiple selection"
		/>
		<p>
			Selected: {Array.isArray(treeSelection) ? treeSelection.join(', ') || 'none' : treeSelection}
		</p>
	{/if}
</div>

<style>
	.examples {
		display: grid;
		gap: 18px;
		min-width: 0;
	}
	h4,
	p {
		margin: 0;
		font-size: 12px;
	}
	h4 {
		font-weight: 500;
	}
	p {
		color: inherit;
		line-height: 1.7;
	}
	.examples > p,
	.tab-content p {
		color: var(--color-muted);
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
	}
	.cards,
	.fields {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr));
		align-items: start;
		gap: 16px;
		min-width: 0;
	}
	.field {
		display: grid;
		gap: 8px;
	}
	.tab-demo {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: 24px;
	}
	.tab-content {
		display: grid;
		align-content: start;
		gap: 12px;
		padding: 12px;
	}
	.overflow-tabs {
		width: 280px;
		max-width: 100%;
		min-width: 0;
	}
	.glass-stage {
		padding: 12px;
		background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
		border-radius: 8px;
	}
	label {
		font: inherit;
		font-size: 12px;
	}
</style>
