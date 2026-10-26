<script lang="ts">
	import AdditionalComponents from './additional-components.svelte';
	import * as AllComponents from 'bref-ui-themes/vscode';
	import { resolve } from '$app/paths';
	import { fade } from 'svelte/transition';
	import {
		Theme,
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
	} from 'bref-ui-themes/vscode';
	import type { Size, Variant, Color, TabItemDataProps, TabTransition } from 'bref-ui/types';
	const files = [
		{ id: 'buttons', name: 'Buttons' },
		{ id: 'inputs', name: 'Inputs' },
		{ id: 'pills', name: 'Tags' },
		{ id: 'feedback', name: 'Feedback' },
		{ id: 'surfaces', name: 'Overlays' },
		{ id: 'tabs', name: 'Tabs' }
	];
	let activeFileId = $state('buttons');
	const activeFile = $derived(files.find((file) => file.id === activeFileId) ?? files[0]);
	const editorFiles: TabItemDataProps[] = files.map((file) => ({
		id: file.id,
		label: `${file.name}.svelte`,
		icon: 'description'
	}));
	const revealFile = (id: string) =>
		requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }));
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
			duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 120
		});
	let sidebarVisible = $state(true);
	let searching = $state(false);
	let query = $state('');
	const visibleFiles = $derived(
		files.filter((file) => file.name.toLowerCase().includes(query.toLowerCase()))
	);
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
	const selectedLanguage = $derived(
		options.find((option) => option.id === language)?.label ?? 'Plain text'
	);
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

<Theme>
	<div data-vscode-gallery data-sidebar-hidden={!sidebarVisible || undefined}>
		<a class="skip" href="#theme-content">Skip to components</a>
		<nav class="theme-nav" aria-label="Theme demonstrations">
			<a href={resolve('themes')}>← Showcase</a>
			<div>
				{#each ['relay', 'forma', 'elsewhere', 'vscode'] as theme (theme)}<a
						href={theme === 'vscode' ? resolve('themes/vscode') : resolve(`demo/themes/${theme}`)}
						aria-current={theme === 'vscode' ? 'page' : undefined}
					>
						{theme === 'vscode' ? 'VS Code' : theme[0].toUpperCase() + theme.slice(1)}
					</a>{/each}
			</div>
		</nav>
		<nav class="activity-bar" aria-label="Workbench">
			<button
				type="button"
				aria-label="Explorer"
				title="Explorer"
				aria-pressed={sidebarVisible && !searching}
				onclick={() => {
					sidebarVisible = searching || !sidebarVisible;
					searching = false;
					query = '';
				}}
			>
				<span class="workbench-icon" aria-hidden="true"><Icon name="file_copy" /></span>
			</button>
			<button
				type="button"
				aria-label="Search components"
				title="Search components"
				aria-pressed={sidebarVisible && searching}
				onclick={() => {
					sidebarVisible = true;
					searching = !searching;
					query = '';
				}}
			>
				<span class="workbench-icon" aria-hidden="true"><Icon name="search" /></span>
			</button>
			<a class="manage" href="#inputs" aria-label="Settings" title="Settings">
				<span class="workbench-icon" aria-hidden="true"><Icon name="settings" /></span>
			</a>
		</nav>
		<nav class="explorer" id="explorer" aria-label="Component explorer" hidden={!sidebarVisible}>
			<div class="explorer-heading">{searching ? 'SEARCH' : 'EXPLORER'}</div>
			{#if searching}
				<div class="explorer-search">
					<input aria-label="Find component file" placeholder="Search files" bind:value={query} />
				</div>
			{/if}
			<details class="explorer-group">
				<summary>
					<span class="workbench-icon twistie" aria-hidden="true">
						<Icon name="chevron_right" />
					</span>
					OPEN EDITORS
				</summary>
				<a class="file-entry" href={`#${activeFile.id}`}>
					<span class="workbench-icon file-icon" aria-hidden="true">
						<Icon name="description" />
					</span>
					{activeFile.name}.svelte
				</a>
			</details>
			<details class="explorer-group" open>
				<summary>
					<span class="workbench-icon twistie" aria-hidden="true">
						<Icon name="chevron_right" />
					</span>
					BREF-UI-THEMES
				</summary>
				<details class="folder" open>
					<summary>
						<span class="workbench-icon twistie" aria-hidden="true">
							<Icon name="chevron_right" />
						</span>
						<span class="workbench-icon" aria-hidden="true"><Icon name="folder_open" /></span>
						src / lib / vscode
					</summary>
					<div class="file-list">
						{#each visibleFiles as file (file.id)}
							<a
								class="file-entry"
								href={`#${file.id}`}
								aria-current={activeFile.id === file.id ? 'true' : undefined}
								onclick={() => (activeFileId = file.id)}
							>
								<span class="workbench-icon file-icon" aria-hidden="true">
									<Icon name="description" />
								</span>
								{file.name}.svelte
							</a>
						{/each}
						{#if visibleFiles.length === 0}<p class="empty-files">No matching files</p>{/if}
					</div>
				</details>
			</details>
			<details class="explorer-group outline">
				<summary>
					<span class="workbench-icon twistie" aria-hidden="true">
						<Icon name="chevron_right" />
					</span>
					OUTLINE
				</summary>
				{#each files as file (file.id)}<a
						class="file-entry"
						href={`#${file.id}`}
						onclick={() => (activeFileId = file.id)}
					>
						<span class="workbench-icon" aria-hidden="true"><Icon name="data_object" /></span>
						{file.name}
					</a>{/each}
			</details>
		</nav>
		<div class="editor-tabs">
			<Tabs
				items={editorFiles}
				bind:value={activeFileId}
				label="Editor files"
				onChange={revealFile}
			/>
		</div>
		<header>
			<p class="eyebrow"><Icon name="code" /> BREF / THEME COLLECTION</p>
			<h1>
				VS Code
				<span>Component reference</span>
			</h1>
			<p>Editor colors. Workbench precision. Native Bref interactions.</p>
			<code>import &#123; Theme, Button &#125; from 'bref-ui-themes/vscode';</code>
		</header>
		<main id="theme-content" tabindex="-1">
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
						/>{:else}<Button
							label="Restore tag"
							size="small"
							onClick={() => (removable = true)}
						/>{/if}
				</div>
				<div class="row">
					{#each sizes as size (size)}<Pill
							label={size}
							{size}
							color="info"
							variant="soft"
						/>{/each}
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
							{#each sizes as size (size)}<Spinner
									label={`${size} loading example`}
									{size}
								/>{/each}
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
							radius="0.1875rem"
						>
							<h3>{variant}</h3>
							<p>A crisp container with semantic paint and explicit spacing.</p>
							<Pill label="Surface" size="x-small" />
						</Surface>{/each}
				</div>
				<div class="row">
					<Surface
						width="fit"
						orientation="horizontal"
						variant="soft"
						spacing="small"
						radius="0.125rem"
						hover="small"
					>
						<Icon name="info" color="info" />
						<span>Horizontal surface</span>
					</Surface><Surface width="fit" spacing="small" radius="0.125rem" shadow>
						<span>Widget shadow</span>
					</Surface>
				</div>
				<Surface
					scroll
					spacing="small"
					radius="0.125rem"
					style="max-height: 96px"
					aria-label="Scrollable surface"
				>
					{#each [1, 2, 3, 4, 5] as line (line)}<p>
							Scrollable content, line {line}. Focus and use the arrow keys.
						</p>{/each}
				</Surface>
				<div class="row">
					<Popover bind:open={popover} spacing="medium" radius="0.1875rem">
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
					Arrow keys select; Home and End jump. Disabled items are skipped. Overflow stays within
					each strip.
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
							<label for="scope-font-size">
								{scope === 'user' ? 'User' : 'Workspace'} font size
							</label>
							{#if scope === 'user'}
								<TextInput
									id="scope-font-size"
									bind:value={userSetting}
									aria-label="User font size"
								/>
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
									<label class="setting-check">
										<Checkbox bind:checked={autoSave} /> Auto save
									</label>
									<p class="note">Files save {autoSave ? 'automatically' : 'only on command'}.</p>
								{/if}
							</div>
						</div>
					</div>
				</div>
			</section>
			<AdditionalComponents components={AllComponents} />
		</main>
		<footer class="status-bar">
			<span role="status">Activations: {presses}</span>
			<span>{selectedLanguage}</span>
			<span>20 exports · one reusable theme</span>
			<a href={resolve('themes')}>Back to showcase ↗</a>
		</footer>
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
	</div>
</Theme>

<style>
	[data-vscode-gallery] {
		display: grid;
		--workbench-title-height: 46px;
		--workbench-status-height: 24px;
		grid-template-columns: 48px 240px minmax(0, 1fr);
		grid-template-rows: auto auto auto 1fr;
		min-height: 100vh;
		padding-bottom: var(--workbench-status-height);
	}
	.theme-nav,
	.theme-nav div,
	.row,
	.colors {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 10px;
	}
	.theme-nav {
		position: sticky;
		top: 0;
		z-index: 2;
		height: var(--workbench-title-height);
		background: var(--color-background);
		grid-column: 1 / -1;
		justify-content: space-between;
		border-bottom: 1px solid var(--vscode-border);
		padding: 8px 24px;
	}
	.theme-nav div {
		gap: 20px;
	}
	.theme-nav a {
		text-decoration: none;
		color: var(--color-muted);
	}
	.theme-nav a[aria-current] {
		color: var(--color-foreground);
		border-bottom: 2px solid var(--color-primary);
	}
	[data-vscode-gallery][data-sidebar-hidden] {
		grid-template-columns: 48px 0 minmax(0, 1fr);
	}
	.activity-bar,
	.explorer {
		grid-row: 2 / 5;
		position: sticky;
		top: var(--workbench-title-height);
		align-self: start;
		height: calc(100dvh - var(--workbench-title-height) - var(--workbench-status-height));
	}
	.activity-bar {
		grid-column: 1;
		background: #333333;
		display: flex;
		flex-direction: column;
	}
	.activity-bar button,
	.activity-bar a {
		display: grid;
		place-items: center;
		width: 48px;
		height: 48px;
		flex-shrink: 0;
		padding: 0;
		border: 0;
		border-left: 2px solid transparent;
		background: transparent;
		color: #858585;
		text-decoration: none;
		cursor: pointer;
	}
	.workbench-icon {
		display: inline-flex;
		flex-shrink: 0;
		width: 16px;
		height: 16px;
		font-size: 16px;
	}
	.activity-bar .workbench-icon {
		width: 24px;
		height: 24px;
		font-size: 24px;
	}
	.activity-bar button[aria-pressed='true'] {
		border-left-color: #ffffff;
		color: #ffffff;
	}
	.activity-bar :is(button, a):hover {
		color: #ffffff;
	}
	.activity-bar .manage {
		margin-top: auto;
	}
	.explorer {
		grid-column: 2;
		display: flex;
		flex-direction: column;
		background: var(--vscode-panel);
		font-size: 13px;
		overflow: auto;
	}
	.explorer[hidden] {
		display: none;
	}
	.explorer-heading {
		display: flex;
		align-items: center;
		min-height: 35px;
		padding: 0 20px;
		font-size: 11px;
	}
	.explorer summary,
	.file-entry {
		display: flex;
		align-items: center;
		gap: 6px;
		height: 22px;
		padding: 0 6px;
		cursor: pointer;
		white-space: nowrap;
	}
	.explorer summary {
		list-style: none;
	}
	.explorer summary::-webkit-details-marker {
		display: none;
	}
	.explorer-group > summary {
		font-size: 11px;
		font-weight: 700;
	}
	.explorer details[open] > summary > .twistie {
		transform: rotate(90deg);
	}
	.explorer .folder > summary {
		padding-left: 18px;
	}
	.file-list {
		position: relative;
	}
	.file-list::before {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: 25px;
		width: 1px;
		background: #404040;
		pointer-events: none;
	}
	.explorer .file-entry {
		padding-left: 22px;
		color: var(--color-foreground);
		text-decoration: none;
	}
	.file-list .file-entry {
		padding-left: 40px;
	}
	.file-entry:hover,
	.explorer summary:hover {
		background: #2a2d2e;
	}
	.file-entry[aria-current] {
		background: #37373d;
	}
	.file-entry[aria-current]:focus {
		background: #094771;
	}
	.explorer .outline {
		margin-top: auto;
		border-top: 1px solid #333333;
	}
	.explorer-search {
		padding: 4px 12px 10px;
	}
	.explorer-search input {
		width: 100%;
		padding: 4px 6px;
		border: 1px solid var(--vscode-border);
		border-radius: 0;
		background: var(--vscode-input);
		color: var(--color-foreground);
	}
	.empty-files {
		padding: 4px 40px;
		color: var(--color-muted);
	}
	.file-icon {
		color: #e37933;
	}
	.editor-tabs {
		background: var(--vscode-panel);
		border-bottom: 1px solid var(--vscode-border);
	}

	header,
	main,
	.editor-tabs {
		grid-column: 3;
		min-width: 0;
	}
	main {
		padding: 0 32px;
	}
	header {
		padding: 32px 32px 24px;
	}
	.eyebrow {
		display: flex;
		align-items: center;
		gap: 8px;
		font: 11px / 1.5 var(--vscode-font-mono);
		color: var(--color-info);
		letter-spacing: 0.08em;
	}
	h1 {
		margin: 12px 0;
		font-size: 36px;
		line-height: 1.2;
		color: #f0f0f0;
	}
	h1 span {
		display: inline-block;
		margin-left: 16px;
		color: var(--color-muted);
		font-size: 16px;
	}
	code {
		font: 12px / 1.6 var(--vscode-font-mono);
		color: var(--color-info);
		overflow-wrap: anywhere;
	}
	header > code {
		display: block;
		border-left: 2px solid var(--color-primary);
		padding: 8px 12px;
		background: var(--vscode-panel);
	}
	section {
		display: grid;
		gap: 16px;
		padding: 24px 0;
		border-top: 1px solid var(--vscode-border);
		scroll-margin-top: 16px;
	}
	.section-title {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 8px;
	}
	h2 {
		font: 12px / 1.5 var(--vscode-font-mono);
		color: var(--color-muted);
		margin: 0;
	}
	h2 span {
		margin-left: 10px;
		font:
			500 18px / 1.5 'Segoe UI',
			system-ui,
			sans-serif;
		color: var(--color-foreground);
	}
	h3 {
		font-size: 13px;
		margin: 0;
	}
	p {
		margin: 0;
	}
	.note,
	.key,
	footer {
		color: var(--color-muted);
	}
	.key {
		min-width: 52px;
		font: 12px / 1.5 var(--vscode-font-mono);
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 32px;
	}
	form,
	.control-stack {
		display: grid;
		align-content: start;
		gap: 10px;
		min-width: 0;
	}
	form :global(> .button),
	.control-stack :global(> .button) {
		justify-self: start;
	}
	section:last-child {
		padding-bottom: 180px;
	}
	form > label:not(:first-child) {
		margin-top: 8px;
	}
	.error {
		color: var(--color-error);
	}
	.checks {
		display: grid;
		gap: 12px;
		padding: 8px 0;
	}
	.checks label,
	.size-check {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}
	.size-check {
		flex-direction: column;
		font-size: 11px;
	}
	.progress-sample {
		display: grid;
		flex: 1;
		min-width: 60px;
		gap: 8px;
	}
	.surface-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 12px;
	}
	.tabs-examples {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 24px;
	}
	.tab-example {
		min-width: 0;
	}
	.tab-example h3 {
		margin: 0 0 12px;
		font-size: 13px;
	}
	.panel-strip {
		max-width: 340px;
	}
	.tab-content {
		min-width: 0;
		padding: 16px;
		border: 1px solid var(--vscode-border);
		background: var(--vscode-panel);
		overflow-wrap: anywhere;
	}
	.tab-content > p:first-child {
		margin-top: 0;
	}
	.tab-content > label {
		display: block;
		margin-bottom: 8px;
	}
	.tab-content > code {
		white-space: normal;
	}
	.vertical-tabs {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
	}
	.setting-check {
		display: flex !important;
		align-items: center;
		gap: 8px;
	}
	.status-bar {
		position: fixed;
		inset: auto 0 0;
		z-index: 1;
		display: flex;
		justify-content: space-between;
		gap: 2px 16px;
		padding: 4px 12px;
		background: #007acc;
		color: white;
		font-size: 11px;
		flex-wrap: wrap;
	}
	.status-bar a {
		color: white;
	}
	.skip {
		position: fixed;
		left: 8px;
		top: 8px;
		z-index: 10;
		padding: 8px 12px;
		background: var(--vscode-panel);
		transform: translateY(-160%);
	}
	.skip:focus {
		transform: none;
	}
	@media (max-width: 680px) {
		[data-vscode-gallery],
		[data-vscode-gallery][data-sidebar-hidden] {
			--workbench-status-height: 44px;
			grid-template-columns: 48px minmax(0, 1fr);
		}
		.explorer {
			position: static;
			height: auto;
			grid-column: 2;
			grid-row: 2;
			border-bottom: 1px solid var(--vscode-border);
		}
		.activity-bar {
			height: calc(100dvh - var(--workbench-title-height) - var(--workbench-status-height));
			grid-row: 2 / 6;
		}
		header,
		main,
		.editor-tabs {
			grid-column: 2;
		}
		header,
		main {
			padding-inline: 16px;
		}
		.grid,
		.surface-grid,
		.tabs-examples {
			grid-template-columns: 1fr;
			gap: 20px;
		}
		h1 span {
			display: block;
			margin: 8px 0 0;
		}
		.theme-nav div {
			gap: 12px;
		}
		.explorer .outline {
			margin-top: 16px;
		}
	}
	@media (max-width: 380px) {
		[data-vscode-gallery] {
			--workbench-title-height: 70px;
			--workbench-status-height: 64px;
		}
	}
</style>
