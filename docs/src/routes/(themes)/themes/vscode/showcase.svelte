<script lang="ts">
	import AdditionalComponents from './additional-components.svelte';
	import CodeSnippet from '../../../(docs)/components/code-snippet.svelte';
	import GithubStars from '../../../(docs)/components/layout/github-stars.svelte';
	import * as AllComponents from 'bref-ui-themes/vscode';
	import { asset, resolve } from '$app/paths';
	import { cubicOut } from 'svelte/easing';
	import { crossfade, fade } from 'svelte/transition';
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
		TextInput,
		TreeView
	} from 'bref-ui-themes/vscode';
	import type {
		Size,
		Variant,
		Color,
		TabItemDataProps,
		TabTransition,
		TreeItemProps
	} from 'bref-ui/types';
	const files = [
		{ id: 'buttons', name: 'Buttons' },
		{ id: 'inputs', name: 'Inputs' },
		{ id: 'pills', name: 'Tags' },
		{ id: 'feedback', name: 'Feedback' },
		{ id: 'surfaces', name: 'Overlays' },
		{ id: 'tabs', name: 'Tabs' },
		{ id: 'additional-components', name: 'More components' },
		{ id: 'usage', name: 'Getting started' }
	];
	let activeFileId = $state('buttons');
	let editorTabs: HTMLDivElement | undefined = $state();
	const activeFile = $derived(files.find((file) => file.id === activeFileId) ?? files[0]);
	const editorFiles: TabItemDataProps[] = files.map((file) => ({
		id: file.id,
		label: `${file.name}.svelte`,
		icon: 'description'
	}));
	const revealFile = (id: string) =>
		requestAnimationFrame(() => {
			const target = document.getElementById(id);
			if (!target) return;
			const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
			window.scrollBy({
				top: target.getBoundingClientRect().top - margin - (editorTabs?.offsetHeight ?? 0),
				behavior: 'instant'
			});
		});
	const panelTabs: TabItemDataProps[] = [
		{ id: 'preview', label: 'Preview', icon: 'preview' },
		{ id: 'usage', label: 'Usage', icon: 'code' },
		{ id: 'shortcuts', label: 'Keyboard', icon: 'keyboard' },
		{ id: 'history', label: 'History', icon: 'history', disabled: true }
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
	let panel = $state('preview');
	let horizontalSize = $state<'small' | 'medium' | 'large'>('medium');
	let scope = $state('user');
	let setting = $state('editor');
	let activitySize = $state<'small' | 'medium' | 'large'>('medium');
	let panelChanges = $state(0);
	let userSetting = $state('14');
	let workspaceSetting = $state('16');
	let formatOnSave = $state(true);
	let autoSave = $state(false);
	const indicatorTransition: TabTransition = (node) =>
		fade(node, {
			duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 120
		});
	const [sendActivity, receiveActivity] = crossfade({
		duration: () => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 180),
		easing: cubicOut
	});
	let sidebarVisible = $state(true);
	let searching = $state(false);
	let query = $state('');
	const fileNode = (file: (typeof files)[number]): TreeItemProps => ({
		id: file.id,
		label: `${file.name}.svelte`,
		icon: { name: 'description' }
	});
	const visibleFiles = $derived<TreeItemProps[]>(
		[
			...files.map(fileNode),
			{
				id: 'unavailable-file',
				label: 'Unavailable.svelte',
				icon: { name: 'lock' as const },
				disabled: true
			}
		].filter((file) => file.label.toLowerCase().includes(query.toLowerCase()))
	);
	const explorerItems = $derived<TreeItemProps[]>([
		{
			id: 'vscode-source',
			label: 'src / lib / vscode',
			icon: { name: 'folder_open' },
			children: visibleFiles
		}
	]);
	const navigateFile = (value: string | string[] | undefined) => {
		if (typeof value === 'string' && files.some((file) => file.id === value)) {
			activeFileId = value;
			window.location.hash = value;
			revealFile(value);
		}
	};

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
	let pressed = $state(true);
	let tags = $state([
		{ id: 'svelte', label: 'Svelte' },
		{ id: 'typescript', label: 'TypeScript' },
		{ id: 'css', label: 'CSS' }
	]);
	let removable = $state(true);
	let swoosh = $state(true);
	const usage = `<script>
  import { Theme, Button, Pill } from 'bref-ui-themes/vscode';
${'</' + 'script>'}

<Theme>
  <Button label="Save changes" variant="filled" color="primary" />
  <Pill label="In progress" swoosh color="info" variant="soft" />
</Theme>`;
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
		<nav class="theme-nav" aria-label="VS Code theme navigation">
			<a href={resolve('themes')}>← Theme docs</a>
			<div>
				<a href={resolve('themes/vscode')} aria-current="page">VS Code</a>
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
				<span class="workbench-icon" aria-hidden="true">
					<Icon name="file_copy" filled={sidebarVisible && !searching} />
				</span>
				{#if sidebarVisible && !searching}
					<span
						class="activity-selection"
						aria-hidden="true"
						in:receiveActivity={{ key: 'active-view' }}
						out:sendActivity={{ key: 'active-view' }}
					></span>
				{/if}
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
				<span class="workbench-icon" aria-hidden="true">
					<Icon name="search" filled={sidebarVisible && searching} />
				</span>
				{#if sidebarVisible && searching}
					<span
						class="activity-selection"
						aria-hidden="true"
						in:receiveActivity={{ key: 'active-view' }}
						out:sendActivity={{ key: 'active-view' }}
					></span>
				{/if}
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
				<TreeView
					items={[fileNode(activeFile)]}
					label="Open editors"
					bind:selection={() => activeFileId, navigateFile}
				/>
			</details>
			<details class="explorer-group" open>
				<summary>
					<span class="workbench-icon twistie" aria-hidden="true">
						<Icon name="chevron_right" />
					</span>
					BREF-UI-THEMES
				</summary>
				<TreeView
					items={explorerItems}
					label="Component files"
					defaultExpanded
					bind:selection={() => activeFileId, navigateFile}
				/>
				{#if visibleFiles.length === 0}<p class="empty-files">No matching files</p>{/if}
			</details>
			<details class="explorer-group outline">
				<summary>
					<span class="workbench-icon twistie" aria-hidden="true">
						<Icon name="chevron_right" />
					</span>
					OUTLINE
				</summary>
				<TreeView
					items={files.map((file) => ({
						id: file.id,
						label: file.name,
						icon: { name: 'data_object' }
					}))}
					label="Component outline"
					bind:selection={() => activeFileId, navigateFile}
				/>
			</details>
		</nav>
		<div class="editor-tabs" bind:this={editorTabs}>
			<Tabs
				items={editorFiles}
				bind:value={activeFileId}
				label="Editor files"
				onChange={revealFile}
			/>
		</div>
		<header>
			<p class="breadcrumb">
				bref-ui-themes <span>›</span>
				vscode
				<span>›</span>
				{activeFile.name}.svelte
			</p>
			<p class="eyebrow"><Icon name="code" /> THE WORKBENCH COLLECTION</p>
			<h1>
				VS Code
				<span>A familiar place to build.</span>
			</h1>
			<p class="intro">
				Editor colors, crisp controls and a little workbench precision. Explore twenty Svelte
				exports, from the first button to the last setting.
			</p>
			<div class="hero-actions">
				<Button
					label="Explore components"
					href="#buttons"
					variant="filled"
					color="primary"
					icon={{ name: 'arrow_downward' }}
				/>
				<Button label="Use this theme" href="#usage" icon={{ name: 'code' }} />
			</div>
			<div class="hero-meta">
				<span>
					<span class="status-dot"></span>
					Native Svelte
				</span>
				<span>Scoped CSS</span>
				<span>Keyboard ready</span>
			</div>
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
				<div class="command-preview">
					<div>
						<h3>Ready when you are.</h3>
						<p class="note">Native buttons, links and icon actions.</p>
					</div>
					<Button
						label="Run action"
						icon={{ name: 'play_arrow' }}
						variant="filled"
						color="primary"
						onClick={() => presses++}
					/>
					<p role="status" class="action-status">
						{presses
							? `${presses} ${presses === 1 ? 'action' : 'actions'} triggered`
							: 'Try an action'}
					</p>
				</div>
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
						aria-pressed={pressed}
						onClick={() => (pressed = !pressed)}
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
				<div class="animated-pill">
					<div>
						<h3>Activity, at a glance</h3>
						<p class="note">A subtle swoosh for work in progress. Respects reduced motion.</p>
					</div>
					<Pill
						label={swoosh ? 'Syncing changes' : 'Changes synced'}
						{swoosh}
						icon={{ name: swoosh ? 'sync' : 'check' }}
						color={swoosh ? 'info' : 'success'}
						variant="soft"
					/>
					<Button
						label={swoosh ? 'Finish sync' : 'Replay animation'}
						size="small"
						onClick={() => (swoosh = !swoosh)}
					/>
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
				<label class="editor-density">
					Horizontal tab size
					<select bind:value={horizontalSize}>
						<option value="small">Small</option>
						<option value="medium">Medium</option>
						<option value="large">Large</option>
					</select>
				</label>
				<div class="tabs-examples">
					<div class="tab-example" data-tabs-example="fit">
						<h3>Panel · horizontal fit</h3>
						<div class="panel-strip">
							<Tabs
								items={panelTabs}
								size={horizontalSize}
								bind:value={panel}
								label="Workbench panels"
								onChange={() => panelChanges++}
							/>
						</div>
						<div class="tab-content" role="region" aria-label="Selected workbench panel">
							{#if panel === 'preview'}
								<h4>Content belongs to the page.</h4>
								<p class="note">
									Tabs select a value. Compose the matching content with ordinary Svelte.
								</p>
							{:else if panel === 'usage'}
								<code>
									&lt;Tabs items=&#123;items&#125; bind:value label="Preview panels" /&gt;
								</code>
							{:else if panel === 'shortcuts'}
								<p>
									<kbd>←</kbd>
									<kbd>→</kbd>
									Select a tab.
									<kbd>Home</kbd>
									<kbd>End</kbd>
									Jump to an edge.
								</p>
							{/if}
						</div>
						<p class="note" role="status">Panel changes: {panelChanges}</p>
					</div>
					<div class="tab-example" data-tabs-example="fill">
						<h3>Settings scope · horizontal fill</h3>
						<Tabs
							items={scopeTabs}
							size={horizontalSize}
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
						<label class="activity-size">
							Size
							<select bind:value={activitySize}>
								<option value="small">Small</option>
								<option value="medium">Medium</option>
								<option value="large">Large</option>
							</select>
						</label>
						<div class="vertical-tabs">
							<Tabs
								items={settingTabs}
								size={activitySize}
								bind:value={setting}
								orientation="vertical"
								label="Preference categories"
							/>
							<div class="tab-content" role="region" aria-label="Selected preference category">
								<h4>{setting === 'editor' ? 'Editor' : 'Files'}</h4>
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
						<p class="note">
							The rounded selection moves between icons and joins the content panel. Use ↑/↓, Home
							or End to switch categories. Extensions stays disabled.
						</p>
					</div>
				</div>
			</section>
			<AdditionalComponents components={AllComponents} />
			<section aria-labelledby="usage">
				<div class="section-title">
					<h2 id="usage">
						08 <span>Make it part of your workspace.</span>
					</h2>
					<code>Getting started</code>
				</div>
				<p class="note">
					Import the theme and its components from one public entry point. Wrap the interface in
					Theme to apply the workbench palette.
				</p>
				<div class="usage-code"><CodeSnippet source={usage} label="VS Code theme usage" /></div>
				<a class="docs-link" href={resolve('themes#vscode')}>
					Installation, fonts and theme documentation <span aria-hidden="true">↗</span>
				</a>
			</section>
		</main>
		<footer class="status-bar">
			<div class="status-info">
				<span role="status">Activations: {presses}</span>
				<span>{selectedLanguage}</span>
			</div>
			<div class="footer-actions">
				<a class="back-to-docs" href={resolve('themes#vscode')} aria-label="Back to Bref-ui docs">
					<img src={asset('favicon.svg')} alt="" width="24" height="24" />
					<span>
						<strong>bref / ui</strong>
						<span>Back to docs</span>
					</span>
				</a>
				<GithubStars />
			</div>
		</footer>
		<Dialog
			bind:open
			header={{
				title: 'Save changes to workspace settings?',
				icon: { name: 'info' },
				description: 'Changes apply to this workspace only.'
			}}
			footer={{
				primary: { label: 'Save', onClick: () => (open = false) },
				secondary: { label: 'Cancel', onClick: () => (open = false) }
			}}
			size="small"
		>
			<p style="margin: 0">Unsaved changes will be lost if this dialog is cancelled.</p>
		</Dialog>
	</div>
</Theme>

<style>
	[data-vscode-gallery] {
		display: grid;
		font-size: 13px;
		line-height: 1.6;
		--workbench-title-height: 46px;
		--workbench-status-height: 40px;
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
	.theme-nav a:is(:hover, :focus-visible) {
		color: var(--color-foreground);
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
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		padding-block: 8px;
		padding-inline: 3px 1px;
		background: #2b2b2b;
		box-shadow: inset -1px 0 var(--vscode-panel);
	}
	.activity-bar:dir(rtl) {
		box-shadow: inset 1px 0 var(--vscode-panel);
	}
	.activity-bar button,
	.activity-bar a {
		position: relative;
		isolation: isolate;
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		flex-shrink: 0;
		padding: 0;
		border: 0;
		border-radius: 4px;
		background: transparent;
		color: var(--color-foreground);
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
	.activity-selection {
		--rail-join-offset: 3.5px;
		position: absolute;
		inset: 0;
		inset-inline-end: -1px;
		z-index: -1;
		border-start-start-radius: 7px;
		border-end-start-radius: 7px;
		background: var(--vscode-panel);
		pointer-events: none;
	}
	.activity-selection:dir(rtl) {
		--rail-join-offset: -3.5px;
	}
	.activity-selection::before,
	.activity-selection::after {
		content: '';
		position: absolute;
		inset-inline-end: 0;
		inline-size: 7px;
		block-size: 7px;
		clip-path: inset(0);
		pointer-events: none;
	}
	.activity-selection::before {
		inset-block-end: 100%;
		border-end-end-radius: 7px;
		box-shadow: var(--rail-join-offset) 3.5px 0 3.5px var(--vscode-panel);
	}
	.activity-selection::after {
		inset-block-start: 100%;
		border-start-end-radius: 7px;
		box-shadow: var(--rail-join-offset) -3.5px 0 3.5px var(--vscode-panel);
	}
	.activity-bar :is(button, a):focus-visible {
		outline: 1px solid var(--vscode-accent);
		outline-offset: -2px;
	}
	@media (hover: hover) {
		.activity-bar :is(button:not([aria-pressed='true']), a):hover {
			background: #ffffff0a;
		}
	}
	@media (forced-colors: active) {
		.activity-bar,
		.activity-bar:dir(rtl) {
			background: Canvas;
			box-shadow: none;
		}
		.activity-selection {
			background: Canvas;
			outline: 1px solid Highlight;
			outline-offset: -1px;
		}
		.activity-selection::before,
		.activity-selection::after {
			display: none;
		}
		.activity-bar :is(button, a) {
			color: ButtonText;
		}
		.activity-bar :is(button, a):focus-visible {
			outline-color: Highlight;
		}
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
	.explorer summary {
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
	.explorer summary:hover {
		background: #2a2d2e;
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
	.editor-tabs {
		position: sticky;
		top: var(--workbench-title-height);
		z-index: 1;
		align-self: start;
		background: #2b2b2b;
		box-shadow: inset 0 -1px var(--color-background);
	}

	header,
	main,
	.editor-tabs {
		grid-column: 3;
		min-width: 0;
	}
	main {
		padding: 0 clamp(24px, 4vw, 64px);
	}
	header {
		padding: 0 clamp(24px, 4vw, 64px) 48px;
		background: linear-gradient(120deg, #007acc0a, transparent 65%);
	}
	.breadcrumb {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		padding-block: 12px 40px;
		color: var(--color-muted);
		font-size: 12px;
	}
	.breadcrumb span {
		color: #777777;
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
		margin: 16px 0 20px;
		font-size: clamp(42px, 5vw, 64px);
		font-weight: 500;
		letter-spacing: -0.04em;
		line-height: 1.1;
		color: #f0f0f0;
	}
	h1 span {
		display: block;
		margin-top: 12px;
		color: var(--color-muted);
		font-size: clamp(20px, 2.3vw, 28px);
		letter-spacing: -0.02em;
	}
	.intro {
		max-width: 58ch;
		font-size: 15px;
		line-height: 1.8;
		color: var(--color-muted);
	}
	.hero-actions,
	.hero-meta,
	.hero-meta > span {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 12px;
	}
	.hero-actions {
		margin-top: 28px;
	}
	.hero-meta {
		gap: 24px;
		margin-top: 28px;
		font: 11px / 1.6 var(--vscode-font-mono);
		color: var(--color-muted);
	}
	.hero-meta > span {
		gap: 6px;
	}
	.status-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--color-success);
	}
	code {
		font: 12px / 1.6 var(--vscode-font-mono);
		color: var(--color-info);
		overflow-wrap: anywhere;
	}
	section {
		display: grid;
		gap: 24px;
		padding: 44px 0;
		border-top: 1px solid var(--vscode-border);
	}
	[id] {
		scroll-margin-top: calc(var(--workbench-title-height) + 20px);
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
			500 22px / 1.4 'Segoe UI',
			system-ui,
			sans-serif;
		color: var(--color-foreground);
	}
	h3 {
		font-size: 14px;
		font-weight: 500;
		margin: 0;
	}
	h4 {
		margin-bottom: 8px;
		font-size: 14px;
		font-weight: 500;
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
		gap: 40px;
	}
	form,
	.control-stack {
		display: grid;
		align-content: start;
		gap: 16px;
		min-width: 0;
	}
	section:last-child {
		padding-bottom: 80px;
	}
	.command-preview,
	.animated-pill {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 20px;
		padding: 24px;
		border: 1px solid var(--vscode-border);
		background: var(--vscode-panel);
	}
	.command-preview > div,
	.animated-pill > div {
		flex: 1 1 220px;
		display: grid;
		gap: 6px;
	}
	.action-status {
		font: 11px / 1.6 var(--vscode-font-mono);
		color: var(--color-muted);
	}
	.usage-code {
		--docs-rule: var(--vscode-border);
		--docs-rule-subtle: var(--vscode-border);
		--docs-surface: var(--vscode-panel);
		min-width: 0;
	}
	.docs-link {
		justify-self: start;
		color: var(--color-info);
		text-underline-offset: 4px;
	}
	kbd {
		padding: 2px 6px;
		border: 1px solid var(--vscode-border);
		background: var(--vscode-input);
		font: 11px / 1.6 var(--vscode-font-mono);
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
		min-height: 140px;
		padding: 20px;
		border: 1px solid var(--vscode-border);
		background: var(--vscode-panel);
		overflow-wrap: anywhere;
	}
	.tab-example:is([data-tabs-example='fit'], [data-tabs-example='fill']) .tab-content {
		border-block-start: 0;
		background: var(--color-background);
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
	.activity-size,
	.editor-density {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 12px;
		font-size: 13px;
	}
	.activity-size select,
	.editor-density select {
		padding: 4px 8px;
		border: 1px solid var(--vscode-border);
		background: var(--vscode-input);
		color: var(--color-foreground);
		font: inherit;
	}
	.activity-size select:focus-visible,
	.editor-density select:focus-visible {
		outline: 1px solid var(--vscode-accent);
	}
	.vertical-tabs {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
	}
	.vertical-tabs > .tab-content {
		border-inline-start: 0;
		background: var(--color-background);
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
		align-items: center;
		justify-content: space-between;
		gap: 4px 16px;
		min-height: var(--workbench-status-height);
		padding: 4px 12px;
		background: #007acc;
		color: white;
		font-size: 11px;
		flex-wrap: wrap;
	}
	.status-info,
	.footer-actions {
		display: flex;
		align-items: center;
		gap: 16px;
	}
	.back-to-docs {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 2px 6px;
		color: white;
		text-decoration: none;
	}
	.back-to-docs img {
		padding: 2px;
		border-radius: 2px;
		background: white;
	}
	.back-to-docs > span {
		display: grid;
		line-height: 1.2;
	}
	.back-to-docs strong {
		font-size: 13px;
	}
	.back-to-docs:hover {
		background: #ffffff20;
	}
	.back-to-docs:focus-visible {
		outline: 2px solid white;
		outline-offset: 1px;
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
	@media (max-width: 1050px) {
		.grid,
		.tabs-examples {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 680px) {
		[data-vscode-gallery],
		[data-vscode-gallery][data-sidebar-hidden] {
			--workbench-status-height: 64px;
			grid-template-columns: 48px minmax(0, 1fr);
		}
		.footer-actions {
			width: 100%;
			justify-content: space-between;
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
		section {
			padding-block: 32px;
		}
		.command-preview,
		.animated-pill {
			padding: 16px;
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
		.theme-nav {
			padding-inline: 12px;
		}
		.explorer .outline {
			margin-top: 16px;
		}
	}
	@media (max-width: 380px) {
		[data-vscode-gallery] {
			--workbench-title-height: 70px;
		}
	}
</style>
