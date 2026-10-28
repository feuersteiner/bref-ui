<script lang="ts">
	import AdditionalComponents from './additional-components.svelte';
	import * as AllComponents from 'bref-ui-themes/crystal-code';
	import { fade } from 'svelte/transition';
	import {
		Button,
		Checkbox,
		Dialog,
		Icon,
		Pill,
		PillChoiceGroup,
		PillGroup,
		Popover,
		Progress,
		Select,
		Spinner,
		Surface,
		Tabs,
		TextInput
	} from 'bref-ui-themes/crystal-code';
	import type { Size, Variant, Color, TabItemDataProps, TabTransition } from 'bref-ui/types';
	const panelTabs: TabItemDataProps[] = [
		{ id: 'problems', label: 'Problems', icon: 'error' },
		{ id: 'output', label: 'Output', icon: 'output' },
		{ id: 'debug', label: 'Debug console', icon: 'bug_report', disabled: true },
		{ id: 'terminal', label: 'Terminal', icon: 'terminal' },
		{ id: 'ports', label: 'Forwarded ports', icon: 'lan' }
	];
	const scopeTabs: TabItemDataProps[] = [
		{ id: 'user', label: 'User', icon: 'person' },
		{ id: 'workspace', label: 'Workspace', icon: 'folder' },
		{ id: 'remote', label: 'Remote', icon: 'cloud_off', disabled: true }
	];
	const settingTabs: TabItemDataProps[] = [
		{ id: 'editor', label: 'Editor', icon: 'edit' },
		{ id: 'files', label: 'Files', icon: 'folder_open' },
		{ id: 'extensions', label: 'Extensions', icon: 'extension', disabled: true }
	];
	let panel = $state('problems');
	let scope = $state('user');
	let setting = $state('editor');
	let panelChanges = $state(0);
	let userSetting = $state('14');
	let workspaceSetting = $state('16');
	let formatOnSave = $state(true);
	let autoSave = $state(false);
	const indicatorTransition: TabTransition = (node) =>
		fade(node, {
			duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 100
		});
	let enabled = $state(true);
	let name = $state('');
	let submitted = $state(false);
	let open = $state(false);
	let popover = $state(false);
	let language = $state<string | string[]>('ts');
	let languages = $state<string | string[]>(['ts']);
	let selection = $state<string | string[]>('default');
	let multiple = $state<string | string[]>(['lint']);
	let seek = $state(0.42);
	let presses = $state(0);
	let tags = $state([
		{ id: 'svelte', label: 'Svelte' },
		{ id: 'typescript', label: 'TypeScript' },
		{ id: 'css', label: 'CSS' }
	]);
	let removable = $state(true);
	const options = [
		{ id: 'ts', label: 'TypeScript', icon: { name: 'code' as const } },
		{ id: 'js', label: 'JavaScript' },
		{ id: 'locked', label: 'Unavailable language', disabled: true }
	];
	const sizes: Size[] = ['x-small', 'small', 'medium', 'large', 'x-large'];
	const variants: Variant[] = ['neutral', 'soft', 'filled'];
	const semanticIcons = {
		primary: 'bolt',
		secondary: 'auto_awesome',
		foreground: 'code',
		muted: 'visibility_off',
		info: 'info',
		success: 'check_circle',
		warning: 'warning',
		error: 'error'
	} as const;
	const colors: Exclude<Color, 'background'>[] = [
		'primary',
		'secondary',
		'foreground',
		'muted',
		'info',
		'success',
		'warning',
		'error'
	];
</script>

<div class="reference">
	<section aria-labelledby="buttons">
		<div class="section-title">
			<h2 id="buttons">
				01 <span>Buttons</span>
			</h2>
			<code>Button</code>
		</div>
		<p class="note">Neutral, soft and filled; five sizes. Tab to inspect focus.</p>
		{#each variants as variant (variant)}<div class="row">
				<span class="key">{variant}</span>
				{#each sizes as size (size)}<Button
						label={size}
						{size}
						{variant}
						color="primary"
						onClick={() => presses++}
					/>{/each}
			</div>{/each}
		<div class="row">
			<Button label="Disabled" disabled /><Button
				label="Pressed"
				aria-pressed="true"
				color="primary"
				variant="soft"
			/><Button
				icon={{ name: 'settings', label: 'Settings example' }}
				size="small"
				onClick={() => presses++}
			/><Button
				icon={{ name: 'add', label: 'Rounded example' }}
				rounded
				size="small"
				onClick={() => presses++}
			/><Button href="#inputs" label="Link button" size="small" /><Button
				href="#inputs"
				label="Disabled link"
				disabled
				size="small"
			/>
		</div>
		<div class="colors">
			{#each colors as color (color)}<Button
					label={color}
					size="small"
					variant="soft"
					{color}
				/>{/each}
		</div>
	</section>
	<section aria-labelledby="inputs">
		<div class="section-title">
			<h2 id="inputs">
				02 <span>Inputs & selection</span>
			</h2>
			<code>TextInput · Checkbox · Select</code>
		</div>
		<div class="grid">
			<form
				onsubmit={(event) => {
					event.preventDefault();
					submitted = true;
				}}
				novalidate
			>
				<label for="setting-name">Setting name</label>
				<TextInput
					id="setting-name"
					bind:value={name}
					placeholder="editor.fontSize"
					icon={{ name: 'search' }}
					required
					aria-invalid={submitted && !name.trim()}
					aria-describedby="name-feedback"
					wide
				/>
				<p
					id="name-feedback"
					class:error={submitted && !name.trim()}
					role={submitted && !name.trim() ? 'alert' : 'status'}
				>
					{submitted
						? name.trim()
							? `Accepted: ${name}`
							: 'Enter a setting name.'
						: 'Submit an empty value to inspect the error state.'}
				</p>
				<Button
					type="submit"
					label="Validate input"
					variant="filled"
					color="primary"
					size="small"
				/>
				<label for="readonly">Read only</label>
				<TextInput id="readonly" value="workbench.colorTheme" readonly wide />
				<label for="disabled-input">Disabled</label>
				<TextInput id="disabled-input" value="Managed by policy" disabled wide />
				<div class="row">
					{#each ['small', 'medium', 'large'] as size (size)}<TextInput
							aria-label={`${size} input`}
							placeholder={size}
							size={size as 'small' | 'medium' | 'large'}
						/>{/each}
				</div>
			</form>
			<div class="control-stack">
				<label for="language">Language</label>
				<Select id="language" items={options} bind:value={language} />
				<p class="note">Selected: {language}. Open, Tab to an option, then Enter.</p>
				<label for="languages">Multiple languages</label>
				<Select id="languages" items={options} bind:value={languages} size="small" />
				<label for="disabled-select">Disabled select</label>
				<Select id="disabled-select" items={options} value="ts" disabled />
				<label for="empty-select">Empty select</label>
				<Select id="empty-select" items={[]} placeholder="No languages" size="large" />
				<div class="checks">
					<label><Checkbox bind:checked={enabled} /> Enable formatting</label>
					<label><Checkbox checked disabled /> Disabled checked</label>
					<label><Checkbox disabled /> Disabled unchecked</label>
					<label><Checkbox aria-invalid="true" /> Error checkbox</label>
				</div>
				<div class="row">
					{#each sizes as size (size)}<label class="size-check">
							<Checkbox {size} aria-label={`${size} checkbox`} />{size}
						</label>{/each}
				</div>
			</div>
		</div>
	</section>
	<section aria-labelledby="pills">
		<div class="section-title">
			<h2 id="pills">
				03 <span>Tags & choices</span>
			</h2>
			<code>Pill · PillGroup · PillChoiceGroup</code>
		</div>
		<div class="row">
			{#each variants as variant (variant)}<Pill
					label={variant}
					{variant}
					color="secondary"
					icon={{ name: 'label' }}
				/>{/each}<Pill
				label="Activate tag"
				onClick={() => presses++}
				color="primary"
			/>{#if removable}<Pill
					label="Removable tag"
					onDelete={() => (removable = false)}
				/>{:else}<Button label="Restore tag" size="small" onClick={() => (removable = true)} />{/if}
		</div>
		<div class="row">
			{#each sizes as size (size)}<Pill label={size} {size} color="info" variant="soft" />{/each}
		</div>
		<div class="grid">
			<div class="control-stack">
				<h3>Removable group</h3>
				<PillGroup
					items={tags}
					onDelete={(id) => (tags = tags.filter((tag) => tag.id !== id))}
					size="small"
				/><Button
					label="Reset tags"
					size="small"
					onClick={() =>
						(tags = [
							{ id: 'svelte', label: 'Svelte' },
							{ id: 'typescript', label: 'TypeScript' },
							{ id: 'css', label: 'CSS' }
						])}
				/>
			</div>
			<div class="control-stack">
				<h3>Single choice / native radios</h3>
				<PillChoiceGroup
					aria-label="Formatting mode"
					items={[
						{ id: 'default', label: 'Default' },
						{ id: 'compact', label: 'Compact' },
						{ id: 'expanded', label: 'Expanded' }
					]}
					bind:selection
					color="primary"
					size="small"
				/>
				<p class="note">Mode: {selection}</p>
				<h3>Multiple choice / native checkboxes</h3>
				<PillChoiceGroup
					aria-label="Checks"
					items={[
						{ id: 'lint', label: 'Lint' },
						{ id: 'types', label: 'Types' }
					]}
					bind:selection={multiple}
					variant="soft"
					color="success"
				/><PillChoiceGroup
					aria-label="Disabled choices"
					items={[{ id: 'locked', label: 'Locked choice' }]}
					selection="locked"
					disabled
				/>
			</div>
		</div>
	</section>
	<section aria-labelledby="feedback">
		<div class="section-title">
			<h2 id="feedback">
				04 <span>Feedback & icons</span>
			</h2>
			<code>Progress · Spinner · Icon</code>
		</div>
		<div class="grid">
			<div class="control-stack">
				<label for="seek">Seekable progress · {Math.round(seek * 100)}%</label>
				<Progress id="seek" value={seek} onSeek={(value) => (seek = value)} /><Progress
					label="Disabled seek"
					value={0.6}
					onSeek={() => {}}
					disabled
				/><Progress label="Indeterminate progress" />
				<div class="row">
					{#each ['small', 'medium', 'large'] as size (size)}<div class="progress-sample">
							<span>{size}</span>
							<Progress
								label={`${size} progress`}
								value={0.65}
								size={size as 'small' | 'medium' | 'large'}
							/>
						</div>{/each}
				</div>
			</div>
			<div class="control-stack">
				<h3>Loading indicators</h3>
				<div class="row">
					{#each sizes as size (size)}<Spinner label={`${size} loading example`} {size} />{/each}
				</div>
				<h3>Semantic icons</h3>
				<div class="row">
					{#each colors as color (color)}<Icon
							name={semanticIcons[color]}
							label={`${color} icon`}
							{color}
							size="medium"
						/>{/each}
				</div>
				<div class="row">
					{#each sizes as size (size)}<Icon
							name="code"
							label={`${size} code icon`}
							{size}
						/>{/each}<Icon name="star" filled label="Filled star" color="warning" />
				</div>
			</div>
		</div>
	</section>
	<section aria-labelledby="surfaces">
		<div class="section-title">
			<h2 id="surfaces">
				05 <span>Surfaces & overlays</span>
			</h2>
			<code>Surface · Popover · Dialog</code>
		</div>
		<div class="surface-grid">
			{#each variants as variant (variant)}<Surface
					{variant}
					color={variant === 'filled' ? 'primary' : 'background'}
					spacing="medium"
					radius="small"
				>
					<h3>{variant}</h3>
					<p>Semantic paint with explicit spacing.</p>
					<Pill label="Surface" size="x-small" />
				</Surface>{/each}
		</div>
		<div class="row">
			<Surface
				width="fit"
				orientation="horizontal"
				variant="soft"
				spacing="small"
				radius="small"
				hover="small"
			>
				<Icon name="info" color="info" />
				<span>Horizontal surface</span>
			</Surface><Surface width="fit" spacing="small" radius="small" shadow>
				<span>Widget shadow</span>
			</Surface>
		</div>
		<Surface glass shadow variant="soft" color="primary" spacing="small" radius="small" width="fit">
			<span>Frosted surface</span>
		</Surface>
		<Surface
			scroll
			spacing="small"
			radius="small"
			style="max-height: 96px"
			aria-label="Scrollable surface"
		>
			{#each [1, 2, 3, 4, 5] as line (line)}<p>
					Scrollable content, line {line}. Focus and use the arrow keys.
				</p>{/each}
		</Surface>
		<div class="row">
			<Popover bind:open={popover} spacing="medium" radius="small">
				{#snippet trigger()}<Button
						label="Open popover"
						aria-expanded={popover}
						size="small"
						onClick={() => (popover = !popover)}
					/>{/snippet}
				<h3>Popover reference</h3>
				<p>Native light dismissal and Escape.</p>
				<Button label="Close popover" size="small" onClick={() => (popover = false)} />
			</Popover><Popover disabled spacing="small">
				{#snippet trigger()}<Button label="Disabled popover" disabled size="small" />{/snippet}
				<p>Disabled content</p>
			</Popover><Button
				label="Open dialog"
				size="small"
				variant="filled"
				color="primary"
				onClick={() => (open = true)}
			/>
		</div>
	</section>
	<section aria-labelledby="tabs">
		<div class="section-title">
			<h2 id="tabs">
				06 <span>Tabs</span>
			</h2>
			<code>Tabs · consumer-owned content</code>
		</div>
		<p class="note">
			Arrow keys select; Home and End jump. Disabled items are skipped. Overflow stays within each
			strip.
		</p>
		<div class="tabs-examples">
			<div class="tab-example" data-tabs-example="fit">
				<h3>Panel · horizontal fit</h3>
				<div class="panel-strip">
					<Tabs
						items={panelTabs}
						bind:value={panel}
						label="Workbench panels"
						onChange={() => panelChanges++}
					/>
				</div>
				<div class="tab-content" role="region" aria-label="Selected workbench panel">
					{#if panel === 'problems'}
						<p>
							<Icon name="check_circle" color="success" /> No problems detected in the workspace.
						</p>
					{:else if panel === 'output'}
						<code>[formatter] Settings loaded. Ready to format on save.</code>
					{:else if panel === 'terminal'}
						<code>
							$ bun run check
							<br />
							0 errors, 0 warnings
						</code>
					{:else if panel === 'ports'}
						<p>localhost:5173 · Development server · Private</p>
					{/if}
				</div>
				<p class="note" role="status">Panel changes: {panelChanges}</p>
			</div>
			<div class="tab-example" data-tabs-example="fill">
				<h3>Settings scope · horizontal fill</h3>
				<Tabs
					items={scopeTabs}
					bind:value={scope}
					width="fill"
					label="Settings scope"
					filled
					transitionIn={indicatorTransition}
					transitionOut={indicatorTransition}
				/>
				<div class="tab-content" role="region" aria-label="Selected settings scope">
					<label for="scope-font-size">{scope === 'user' ? 'User' : 'Workspace'} font size</label>
					{#if scope === 'user'}
						<TextInput id="scope-font-size" bind:value={userSetting} aria-label="User font size" />
					{:else}
						<TextInput
							id="scope-font-size"
							bind:value={workspaceSetting}
							aria-label="Workspace font size"
						/>
					{/if}
					<p class="note">
						Values persist independently when switching scope. Filled icons and a
						reduced-motion-aware fade.
					</p>
				</div>
			</div>
			<div class="tab-example" data-tabs-example="vertical">
				<h3>Preferences · vertical</h3>
				<div class="vertical-tabs">
					<Tabs
						items={settingTabs}
						bind:value={setting}
						orientation="vertical"
						label="Preference categories"
					/>
					<div class="tab-content" role="region" aria-label="Selected preference category">
						{#if setting === 'editor'}
							<label class="setting-check">
								<Checkbox bind:checked={formatOnSave} /> Format on save
							</label>
							<p class="note">
								Formatting is {formatOnSave ? 'enabled' : 'disabled'} for this workspace.
							</p>
						{:else}
							<label class="setting-check"><Checkbox bind:checked={autoSave} /> Auto save</label>
							<p class="note">Files save {autoSave ? 'automatically' : 'only on command'}.</p>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</section>
	<AdditionalComponents components={AllComponents} />
</div>
<Dialog
	bind:open
	header={{
		title: 'Dialog reference',
		icon: { name: 'settings' },
		description: 'Native modal focus, Escape and return to trigger.'
	}}
	footer={{
		primary: { label: 'Done', onClick: () => (open = false) },
		secondary: { label: 'Cancel', onClick: () => (open = false) }
	}}
	size="small"
>
	<label for="dialog-setting">Example value</label>
	<TextInput id="dialog-setting" placeholder="Type here" wide />
	<p>
		Tab and Shift+Tab cycle within the dialog. Small screens use the native full-screen
		presentation.
	</p>
</Dialog>

<style>
	.reference {
		display: grid;
		gap: 32px;
		padding: 24px;
	}
	section {
		display: grid;
		gap: 20px;
		min-width: 0;
	}
	.section-title,
	.row,
	.colors {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 12px;
	}
	.section-title {
		justify-content: space-between;
	}
	h2,
	h3,
	p {
		margin: 0;
		font-size: 13px;
	}
	h2 span {
		margin-left: 10px;
	}
	code,
	.key {
		font: 11px/1.7 var(--crystal-code-font-mono);
		overflow-wrap: anywhere;
	}
	.note,
	.key {
		color: var(--color-muted);
	}
	.key {
		min-width: 52px;
	}
	.grid,
	.surface-grid,
	.tabs-examples {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 24px;
	}
	form,
	.control-stack {
		display: grid;
		align-content: start;
		gap: 12px;
		min-width: 0;
	}
	form :global(> .button),
	.control-stack :global(> .button) {
		justify-self: start;
	}
	.error {
		color: var(--color-error);
	}
	.checks {
		display: grid;
		gap: 12px;
	}
	.checks label,
	.size-check,
	.setting-check {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.size-check {
		flex-direction: column;
		font-size: 11px;
	}
	.progress-sample {
		display: grid;
		gap: 8px;
		min-width: 60px;
		flex: 1;
	}
	.tab-example {
		min-width: 0;
	}
	.tab-example h3 {
		margin-bottom: 12px;
	}
	.panel-strip {
		max-width: 340px;
	}
	.tab-content {
		min-width: 0;
		padding: 16px;
		background: var(--crystal-code-well);
		border-radius: 8px;
		overflow-wrap: anywhere;
	}
	.tab-content label {
		display: block;
		margin-bottom: 8px;
	}
	.vertical-tabs {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
	}
	@media (max-width: 680px) {
		.reference {
			padding: 16px;
		}
		.grid,
		.surface-grid,
		.tabs-examples {
			grid-template-columns: 1fr;
		}
	}
</style>
