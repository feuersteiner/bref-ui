<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import { tick } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import GithubStars from '../../../(docs)/components/layout/github-stars.svelte';
	import {
		Theme,
		ThemeModeToggle,
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
	} from 'bref-ui-themes/crystal-code';
	import type {
		Size,
		Variant,
		TabItemDataProps,
		IconName,
		SurfaceRadius,
		TreeItemProps,
		ThemeMode
	} from 'bref-ui/types';
	import Reference from './reference.svelte';

	const files = [
		{ id: 'buttons', file: 'button.svelte', name: 'Button', icon: 'bolt' },
		{ id: 'inputs', file: 'input.svelte', name: 'Inputs & selection', icon: 'input' },
		{ id: 'choices', file: 'choice.svelte', name: 'Tags & choices', icon: 'label' },
		{
			id: 'feedback',
			file: 'feedback.svelte',
			name: 'Feedback & icons',
			icon: 'progress_activity'
		},
		{ id: 'surfaces', file: 'surface.svelte', name: 'Surfaces & overlays', icon: 'layers' },
		{ id: 'tabs', file: 'tabs.svelte', name: 'Tabs', icon: 'tab' }
	] as const;
	const explorerFiles: TreeItemProps[] = [
		{
			id: 'project',
			label: 'crystal-code',
			children: [
				{
					id: 'components',
					label: 'src / components',
					children: files.map((file) => ({
						id: file.id,
						label: file.file,
						icon: { name: 'description' }
					}))
				},
				{ id: 'setup', label: 'setup.svelte', icon: { name: 'data_object' } }
			]
		}
	];
	let activeId = $state<string>('buttons');
	const active = $derived(files.find((file) => file.id === activeId) ?? files[0]);
	let mode = $state<ThemeMode>('dark');
	const systemDark = new MediaQuery('(prefers-color-scheme: dark)', true);
	const resolvedMode = $derived(mode === 'auto' ? (systemDark.current ? 'dark' : 'light') : mode);
	let explorer = $state(true);
	let railView = $state<string | undefined>('explorer');
	const railViews: TabItemDataProps[] = [
		{ id: 'explorer', label: 'File explorer', icon: 'file_copy' },
		{ id: 'search', label: 'Find component', icon: 'search' },
		{ id: 'console', label: 'Focus preview console', icon: 'terminal' },
		{ id: 'properties', label: 'Focus properties', icon: 'tune' }
	];
	let consoleVisible = $state(false);
	let sourceView = $state('component');
	let label = $state('Run example');
	let variant = $state<Variant>('neutral');
	let size = $state<Size>('medium');
	let controlState = $state('ready');
	let radius = $state('8px');
	const surfaceRadius = $derived<SurfaceRadius>(`${parseFloat(radius) / 16}rem`);
	const fieldSize = $derived(size === 'x-small' ? 'small' : size === 'x-large' ? 'large' : size);
	const choiceVariant = $derived(variant === 'filled' ? 'soft' : variant);
	$effect(() => {
		if (palette)
			tick().then(() =>
				document
					.querySelector<HTMLInputElement>('[aria-label="Search files and commands"]')
					?.focus()
			);
	});
	let value = $state('');
	let checked = $state(true);
	let autoSave = $state(false);
	let language = $state<string | string[]>('ts');
	let selection = $state<string | string[]>('default');
	let progress = $state(0.42);
	let activations = $state(0);
	let tags = $state([
		{ id: 'svelte', label: 'Svelte' },
		{ id: 'typescript', label: 'TypeScript' }
	]);
	let dialog = $state(false);
	let previewName = $state('Default');
	let draftName = $state('Default');
	let popover = $state(false);
	let palette = $state(false);
	let pendingFocus = '';
	let query = $state('');
	let consoleCommand = $state('');
	let copied = $state(false);
	let events = $state(['Ready. Choose a component to explore.']);
	const disabled = $derived(controlState !== 'ready');
	const options = [
		{ id: 'ts', label: 'TypeScript' },
		{ id: 'js', label: 'JavaScript' },
		{ id: 'locked', label: 'Unavailable', disabled: true }
	];
	const sizes: Size[] = ['x-small', 'small', 'medium', 'large', 'x-large'];
	const variants: Variant[] = ['neutral', 'soft', 'filled'];
	const sourceTabs = $derived<TabItemDataProps[]>([
		{ id: 'component', label: active.file, icon: 'description' },
		{ id: 'setup', label: 'setup.svelte', icon: 'data_object' }
	]);
	const previewTabs: TabItemDataProps[] = [
		{ id: 'default', label: 'Editor', icon: 'edit' },
		{ id: 'files', label: 'Files', icon: 'folder' },
		{ id: 'locked', label: 'Unavailable', icon: 'lock', disabled: true }
	];
	let previewTab = $state('default');
	const commands = $derived(
		[
			...files.map((file) => ({ id: file.id, label: file.file, icon: file.icon })),
			{ id: 'theme', label: 'Toggle light / dark theme', icon: 'contrast' as IconName },
			{ id: 'reset', label: 'Reset preview properties', icon: 'restart_alt' as IconName },
			{ id: 'console', label: 'Focus preview console', icon: 'terminal' as IconName },
			{ id: 'reference', label: 'Browse component examples', icon: 'widgets' as IconName }
		].filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
	);
	const log = (message: string) => {
		events = [...events.slice(-9), message];
	};
	function selectFile(id: string) {
		if (controlState === 'loading') controlState = 'ready';
		activeId = id;
		sourceView = 'component';
		log(`Opened ${files.find((file) => file.id === id)?.file}`);
	}
	function selectRailView(id: string) {
		if (id === 'explorer') explorer = true;
		else if (id === 'search') {
			query = '';
			palette = true;
		} else if (id === 'console') runCommand('console');
		else if (id === 'properties') document.getElementById('properties-heading')?.focus();
	}
	function toggleExplorer() {
		explorer = !explorer;
		if (explorer) railView = 'explorer';
		else if (railView === 'explorer') railView = undefined;
	}
	function toggleConsole() {
		consoleVisible = !consoleVisible;
		if (!consoleVisible && railView === 'console') railView = explorer ? 'explorer' : undefined;
	}
	function toggleMode() {
		mode = resolvedMode === 'dark' ? 'light' : 'dark';
		log(`Theme → ${mode}`);
	}
	function reset() {
		label = 'Run example';
		variant = 'neutral';
		size = 'medium';
		controlState = 'ready';
		radius = '8px';
		log('Preview properties reset');
	}
	function runCommand(id: string) {
		const fromPalette = palette;
		palette = false;
		if (id === 'theme') toggleMode();
		else if (id === 'reset') reset();
		else if (id === 'reference')
			requestAnimationFrame(() => document.getElementById('reference')?.scrollIntoView());
		else if (id === 'console') {
			consoleVisible = true;
			railView = 'console';
			if (fromPalette) pendingFocus = 'preview-command';
			else requestAnimationFrame(() => document.getElementById('preview-command')?.focus());
		} else selectFile(id);
	}
	function submitCommand() {
		const command = consoleCommand.trim().toLowerCase();
		consoleCommand = '';
		if (command === 'help') log('Commands: open inputs · theme · reset · clear');
		else if (command === 'clear') events = [];
		else if (command === 'theme') toggleMode();
		else if (command === 'reset') reset();
		else if (command.startsWith('open ') && files.some((file) => file.id === command.slice(5)))
			selectFile(command.slice(5));
		else if (command) log(`Unknown command: ${command}. Type help.`);
	}
	function paletteKeys(event: KeyboardEvent) {
		const targets = [
			...(event.currentTarget as HTMLElement).querySelectorAll<
				HTMLInputElement | HTMLButtonElement
			>('.palette-content input, button[data-result]')
		];
		const index = targets.indexOf(event.target as HTMLInputElement | HTMLButtonElement);
		if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			event.preventDefault();
			targets[
				(index + (event.key === 'ArrowDown' ? 1 : targets.length - 1)) % targets.length
			]?.focus();
		} else if (event.key === 'Enter' && event.target === targets[0] && commands[0]) {
			event.preventDefault();
			runCommand(commands[0].id);
		}
	}
	const source = $derived.by(() => {
		const imports: Record<string, string> = {
			buttons: controlState === 'loading' ? 'Button, Spinner' : 'Button',
			inputs: 'TextInput, Checkbox, Select',
			choices: 'Pill, PillGroup, PillChoiceGroup',
			feedback: 'Progress, Spinner, Icon',
			surfaces: 'Surface, Dialog, Button',
			tabs: 'Tabs, Checkbox'
		};
		const props = `variant=${JSON.stringify(variant)}\n  size=${JSON.stringify(size)}\n  color="primary"`;
		if (sourceView === 'setup')
			return `<script lang="ts">\n  // Optional text font. Icons are included by the theme.\n  import '@fontsource-variable/inter';\n  import { Theme, Button } from 'bref-ui-themes/crystal-code';\n</${'script'}>\n\n<Theme>\n  <Button label="Build something" icon={{ name: 'bolt' }} />\n</Theme>`;
		const examples: Record<string, string> = {
			buttons: `let activations = $state(0);\n</${'script'}>\n\n${controlState === 'loading' ? `<Spinner label="Loading preview" size=${JSON.stringify(size)} />\n` : ''}<Button\n  label={${JSON.stringify(label)}}\n  ${props}\n  icon={{ name: 'bolt' }}\n  disabled={${disabled}}\n  onClick={() => activations++}\n/>\n\n<p>{activations} activations</p>`,
			inputs: `let value = $state('');\n  let checked = $state(true);\n  let language = $state<string | string[]>('ts');\n</${'script'}>\n\n<TextInput aria-label="Setting name"\n  bind:value placeholder="editor.fontSize"\n  size=${JSON.stringify(fieldSize)} disabled={${disabled}} />\n<Checkbox bind:checked aria-label="Format on save"\n  size=${JSON.stringify(size)} disabled={${disabled}} />\n<Select items={[{ id: 'ts', label: 'TypeScript' },\n  { id: 'js', label: 'JavaScript' }]}\n  bind:value={language} size=${JSON.stringify(fieldSize)}\n  disabled={${disabled}} />`,
			choices: `let selection = $state<string | string[]>('default');\n  let tags = $state([{ id: 'svelte', label: 'Svelte' }]);\n</${'script'}>\n\n<Pill label={${JSON.stringify(label)}} ${props.replaceAll('\n  ', ' ')} />\n<PillGroup items={tags}\n  onDelete={(id) => tags = tags.filter(tag => tag.id !== id)} />\n<PillChoiceGroup bind:selection\n  items={[{ id: 'default', label: 'Default' },\n    { id: 'compact', label: 'Compact' }]}\n  size=${JSON.stringify(size)} variant=${JSON.stringify(choiceVariant)}\n  color="primary" disabled={${disabled}} />`,
			feedback: `let progress = $state(0.42);\n</${'script'}>\n\n<Progress value={progress}\n  onSeek={(next) => progress = next}\n  label="Build progress" size=${JSON.stringify(fieldSize)} disabled={${disabled}} />\n<Spinner label="Loading preview" size=${JSON.stringify(size)} />\n<Icon name="check_circle" color="success" label="Ready" />`,
			surfaces: `let open = $state(false);\n</${'script'}>\n\n<Surface variant=${JSON.stringify(variant)} color=${JSON.stringify(variant === 'neutral' ? 'background' : 'primary')}\n  spacing="medium" radius=${JSON.stringify(surfaceRadius)}>\n  <h3>Project settings</h3>\n  <p>Context, only when needed.</p>\n</Surface>\n<Button label="Open dialog" onClick={() => open = true} />\n<Dialog bind:open header={{ title: 'Name this preview' }}>\n  <p>Native modal focus and Escape.</p>\n</Dialog>`,
			tabs: `let view = $state('default');\n  let format = $state(true);\n  let autoSave = $state(false);\n  const items: TabItemDataProps[] = [\n    { id: 'default', label: 'Editor', icon: 'edit' },\n    { id: 'files', label: 'Files', icon: 'folder' },\n    { id: 'locked', label: 'Unavailable', icon: 'lock', disabled: true }\n  ];\n</${'script'}>\n\n<div style="display:grid;grid-template-columns:auto minmax(0,1fr);gap:16px">\n  <Tabs {items} orientation="vertical" bind:value={view} label="Preview preferences" />\n  <div role="region" aria-label="Selected preview preferences">\n    <p>{view === 'default' ? 'Editor preferences' : 'File preferences'}</p>\n    {#if view === 'default'}\n      <label><Checkbox bind:checked={format} /> Format on save</label>\n    {:else}\n      <label><Checkbox bind:checked={autoSave} /> Auto save</label>\n    {/if}\n  </div>\n</div>`
		};
		return `<script lang="ts">\n  import { Theme, ${imports[activeId]} }\n    from 'bref-ui-themes/crystal-code';\n${activeId === 'tabs' ? "  import type { TabItemDataProps } from 'bref-ui/types';\n" : ''}\n  ${examples[activeId].replace('</' + 'script>\n\n', '</' + 'script>\n\n<Theme>\n')}\n</Theme>`;
	});
	$effect(() => {
		void source;
		copied = false;
	});
	function tokens(line: string) {
		return line.split(
			/("(?:[^"\\]|\\.)*"|'[^']*'|<\/?[\w-]+|\b(?:import|from|let|const|true|false)\b|\/\/.*)/g
		);
	}
	async function copySource() {
		try {
			await navigator.clipboard.writeText(source);
			copied = true;
			log('Source copied');
		} catch {
			copied = false;
			log('Copy unavailable. Select the source to copy.');
		}
	}
</script>

<svelte:window
	onkeydown={(event) => {
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k' && !dialog) {
			event.preventDefault();
			query = '';
			palette = !palette;
		}
	}}
/>
<ThemeModeToggle {mode} />
<div data-crystal-code-gallery data-theme={resolvedMode}>
	<Theme>
		<header class="intro">
			<div class="intro-title">
				<p class="theme-name">Crystal Code</p>
				<h1>Futuristic. Minimal. Built for developers.</h1>
			</div>
			<nav class="intro-links" aria-label="Preview navigation">
				<Button
					href="#live-preview"
					label="Workbench"
					size="small"
					trailingIcon={{ name: 'south_east' }}
				/>
				<Button
					href="#reference"
					label="Components"
					size="small"
					trailingIcon={{ name: 'arrow_downward' }}
				/>
				<div class="theme-choice">
					<label for="preview-theme">Theme</label>
					<Select
						id="preview-theme"
						size="small"
						items={[
							{ id: 'auto', label: 'System' },
							{ id: 'light', label: 'Light' },
							{ id: 'dark', label: 'Dark' }
						]}
						bind:value={
							() => mode,
							(next) => {
								if (next === 'auto' || next === 'light' || next === 'dark') mode = next;
							}
						}
					/>
				</div>
			</nav>
		</header>
		<div class="workbench" style:--crystal-code-radius={radius} data-explorer={explorer}>
			<div class="skip">
				<Button href="#live-preview" label="Skip to live preview" size="small" />
			</div>
			<header class="titlebar">
				<div class="brand">
					<Button
						href={resolve('themes#crystal-code')}
						icon={{ name: 'code' }}
						size="small"
						aria-label="Back to Crystal Code docs"
					/>
					<strong>bref</strong>
					<span>/ crystal-code</span>
				</div>
				<div class="command">
					<Button
						label="Find…"
						aria-label="Find a file or command"
						icon={{ name: 'search' }}
						size="small"
						wide
						onClick={() => {
							query = '';
							palette = true;
						}}
					/>
					<kbd>⌘ K</kbd>
				</div>
				<div class="window-actions">
					<div class="explorer-toggle">
						<Button
							icon={{ name: 'file_copy', filled: explorer }}
							size="small"
							aria-label="Toggle file explorer"
							aria-pressed={explorer}
							onClick={toggleExplorer}
						/>
					</div>
					<Button
						icon={{ name: 'terminal', filled: consoleVisible }}
						size="small"
						aria-label="Toggle preview console"
						aria-pressed={consoleVisible}
						onClick={toggleConsole}
					/>
					<Button
						icon={{ name: resolvedMode === 'dark' ? 'light_mode' : 'dark_mode' }}
						size="small"
						aria-label={`Switch to ${resolvedMode === 'dark' ? 'light' : 'dark'} theme`}
						onClick={toggleMode}
					/>
				</div>
			</header>
			<main id="theme-content" class="body" tabindex="-1">
				<nav class="rail" aria-label="Workbench views">
					<Tabs
						items={railViews}
						orientation="vertical"
						bind:value={railView}
						onChange={selectRailView}
						label="Workbench views"
					/>
				</nav>
				<nav class="explorer" aria-label="File explorer" hidden={!explorer}>
					<p class="sidebar-heading">
						EXPLORER <span>···</span>
					</p>
					<TreeView
						items={explorerFiles}
						defaultExpanded
						label="Project files"
						bind:selection={
							() => (sourceView === 'setup' ? 'setup' : activeId),
							(id) => {
								if (id === 'setup') sourceView = 'setup';
								else if (typeof id === 'string' && files.some((file) => file.id === id))
									selectFile(id);
							}
						}
					/>
					<div class="sidebar-bottom">
						<span>• Local playground</span>
						<p>Explore reusable components and their properties.</p>
						<Button
							href="#reference"
							label="Examples"
							size="x-small"
							trailingIcon={{ name: 'arrow_outward' }}
						/>
					</div>
				</nav>
				<section class="editor" aria-label="Component source" data-console={consoleVisible}>
					<div class="source-tabs">
						<Tabs items={sourceTabs} bind:value={sourceView} label="Source files" />
					</div>
					<div class="editor-path">
						<span>
							src › {sourceView === 'setup' ? 'setup.svelte' : `components › ${active.file}`}
						</span>
						<Button
							label={copied ? 'Copied' : 'Copy'}
							icon={{ name: 'content_copy' }}
							size="x-small"
							onClick={copySource}
						/>
					</div>
					<div
						class="source-scroll"
						tabindex="0"
						role="textbox"
						aria-readonly="true"
						aria-multiline="true"
						aria-label="Svelte usage example"
					>
						<pre><code>{#each source.split('\n') as line, index (index)}<span
										class="code-line"><span class="line-number" aria-hidden="true">{index +
												1}</span><span>{#each tokens(line) as token, t (t)}<span
													class:syntax-string={/^['"]/.test(token)}
													class:syntax-tag={token.startsWith('<')}
													class:syntax-key={/^(import|from|let|const|true|false)$/.test(
														token
													)}>{token}</span>{/each}</span></span>{/each}</code></pre>
					</div>
					{#if consoleVisible}<section class="console" aria-label="Preview console">
							<div class="console-head">
								<span>
									Preview console <small>{events.length} events</small>
								</span>
								<Button
									icon={{ name: 'delete' }}
									size="x-small"
									aria-label="Clear console"
									onClick={() => (events = [])}
								/>
							</div>
							<div class="logs" role="log" aria-label="Preview events">
								{#each events as event, index (index)}<p>
										<span>{String(index + 1).padStart(2, '0')}</span>
										{event}
									</p>{/each}
							</div>
							<form
								class="prompt"
								onsubmit={(event) => {
									event.preventDefault();
									submitCommand();
								}}
							>
								<span aria-hidden="true">›</span>
								<TextInput
									id="preview-command"
									size="small"
									wide
									aria-label="Preview command"
									placeholder="help · open inputs · theme"
									bind:value={consoleCommand}
									autocomplete="off"
								/>
							</form>
						</section>{/if}
				</section>
				<aside class="right" aria-label="Live component preview and properties">
					<div class="pane-heading">
						<span>Preview</span>
						<small>• Live</small>
					</div>
					<nav class="mobile-files" aria-label="Components">
						{#each files as file (file.id)}<Button
								label={file.name.split(' ')[0]}
								size="small"
								variant={activeId === file.id ? 'soft' : 'neutral'}
								aria-current={activeId === file.id ? 'true' : undefined}
								onClick={() => selectFile(file.id)}
							/>{/each}
					</nav>
					<section class="preview" id="live-preview" aria-label="Live preview" tabindex="-1">
						<div class="preview-caption">
							<span>{active.name}</span>
							<span>
								{activeId === 'tabs'
									? 'native selection'
									: `${variant} / ${activeId === 'inputs' ? fieldSize : size}`}
							</span>
						</div>
						<div class="preview-stage">
							{#if activeId === 'buttons'}
								{#if controlState === 'loading'}<Spinner label="Loading preview" {size} />{/if}
								<Button
									{label}
									{variant}
									{size}
									color="primary"
									icon={{ name: 'bolt' }}
									{disabled}
									onClick={() => {
										activations++;
										log(`Button activated · ${activations}`);
									}}
								/>
							{:else if activeId === 'inputs'}
								<div class="stack">
									<label for="live-input">Setting name</label>
									<TextInput
										id="live-input"
										size={fieldSize}
										bind:value
										placeholder="editor.fontSize"
										{disabled}
										wide
									/>
									<label class="check">
										<Checkbox bind:checked {size} {disabled} />Format on save
									</label>
									<label for="live-language">Language</label>
									<Select
										size={fieldSize}
										id="live-language"
										items={options}
										bind:value={language}
										{disabled}
									/>
								</div>
							{:else if activeId === 'choices'}
								<div class="stack">
									<Pill {label} {size} {variant} color="primary" /><PillGroup
										items={tags}
										{size}
										onDelete={disabled
											? undefined
											: (id) => (tags = tags.filter((tag) => tag.id !== id))}
									/><PillChoiceGroup
										items={[
											{ id: 'default', label: 'Default' },
											{ id: 'compact', label: 'Compact' }
										]}
										bind:selection
										{size}
										variant={choiceVariant}
										color="primary"
										{disabled}
									/><Button
										label="Restore tags"
										size="small"
										{disabled}
										onClick={() =>
											(tags = [
												{ id: 'svelte', label: 'Svelte' },
												{ id: 'typescript', label: 'TypeScript' }
											])}
									/>
								</div>
							{:else if activeId === 'feedback'}
								<div class="stack">
									<label for="live-progress">Build progress · {Math.round(progress * 100)}%</label>
									<Progress
										id="live-progress"
										size={fieldSize}
										value={progress}
										onSeek={(next) => (progress = next)}
										{disabled}
									/>
									<div class="feedback-row">
										<Spinner label="Loading preview" {size} />
										<span>Loading indicator</span>
										<Icon name="check_circle" color="success" label="Ready" />
									</div>
								</div>
							{:else if activeId === 'surfaces'}
								<div class="stack">
									<Surface
										{variant}
										color={variant === 'neutral' ? 'background' : 'primary'}
										spacing="medium"
										radius={surfaceRadius}
									>
										<h3>Project settings</h3>
										<p>Context, only when needed.</p>
									</Surface>
									<div class="overlay-actions">
										<Button
											label="Open dialog"
											size="small"
											{disabled}
											onClick={() => {
												draftName = previewName;
												dialog = true;
											}}
										/><Popover bind:open={popover} spacing="medium">
											{#snippet trigger()}<Button
													label="Open popover"
													size="small"
													{disabled}
													aria-expanded={popover}
													onClick={() => (popover = !popover)}
												/>{/snippet}
											<h3>Preview context</h3>
											<p>Click outside or press Escape to dismiss.</p>
											<Button label="Dismiss" size="small" onClick={() => (popover = false)} />
										</Popover>
									</div>
								</div>
							{:else}
								<div class="vertical-preview">
									<Tabs
										items={previewTabs}
										orientation="vertical"
										bind:value={previewTab}
										label="Preview preferences"
									/>
									<div class="stack" role="region" aria-label="Selected preview preferences">
										<p>{previewTab === 'default' ? 'Editor preferences' : 'File preferences'}</p>
										{#if previewTab === 'default'}<label class="check">
												<Checkbox bind:checked />Format on save
											</label>
										{:else}<label class="check">
												<Checkbox bind:checked={autoSave} />Auto save
											</label>{/if}
									</div>
								</div>
							{/if}
						</div>
						<div class="preview-foot">
							<span>
								{previewName !== 'Default'
									? previewName
									: activeId === 'buttons'
										? `${activations} activations`
										: 'Native controls · live state'}
							</span>
							<span>Tab ↹</span>
						</div>
					</section>
					<section class="properties" aria-labelledby="properties-heading">
						<div class="properties-head">
							<h2
								id="properties-heading"
								tabindex="-1"
								onblur={() => {
									if (railView === 'properties') railView = explorer ? 'explorer' : undefined;
								}}
							>
								Properties
							</h2>
							<Button label="Reset" icon={{ name: 'restart_alt' }} size="x-small" onClick={reset} />
						</div>
						<div class="property" hidden={!['buttons', 'choices'].includes(activeId)}>
							<label for="preview-label">label</label>
							<TextInput id="preview-label" bind:value={label} wide />
						</div>
						<fieldset
							class="property"
							hidden={!['buttons', 'choices', 'surfaces'].includes(activeId)}
						>
							<legend>variant</legend>
							<div class="segments">
								{#each variants as item (item)}<Button
										label={item}
										size="x-small"
										variant={variant === item ? 'soft' : 'neutral'}
										aria-pressed={variant === item}
										onClick={() => (variant = item)}
									/>{/each}
							</div>
						</fieldset>
						<fieldset
							class="property"
							hidden={!['buttons', 'inputs', 'choices', 'feedback'].includes(activeId)}
						>
							<legend>size</legend>
							<div class="segments">
								{#each sizes as item, index (item)}<Button
										label={['XS', 'S', 'M', 'L', 'XL'][index]}
										size="x-small"
										variant={size === item ? 'soft' : 'neutral'}
										aria-label={item}
										aria-pressed={size === item}
										onClick={() => (size = item)}
									/>{/each}
							</div>
						</fieldset>
						<div class="property field-row">
							<div hidden={activeId === 'tabs'}>
								<label for="preview-state">state</label>
								<Select
									id="preview-state"
									size="small"
									items={[
										{ id: 'ready', label: 'Ready' },
										{ id: 'disabled', label: 'Disabled' },
										...(activeId === 'buttons' ? [{ id: 'loading', label: 'Loading' }] : [])
									]}
									bind:value={
										() => controlState,
										(next) => {
											if (typeof next === 'string') controlState = next;
										}
									}
								/>
							</div>
							<div>
								<label for="preview-radius">radius</label>
								<Select
									id="preview-radius"
									size="small"
									items={['0px', '3px', '6px', '8px', '10px'].map((radius) => ({
										id: radius,
										label: radius
									}))}
									bind:value={
										() => radius,
										(next) => {
											if (typeof next === 'string') radius = next;
										}
									}
								/>
							</div>
						</div>
						<p class="property-help">
							Change a property to update the preview and usage example. Native form state persists.
						</p>
					</section>
					<div class="bottom-note">
						Native Svelte 5 components
						<br />
						Tab to focus. Enter or Space to activate.
						<br />
						<Button
							href="#reference"
							label="Examples"
							size="x-small"
							trailingIcon={{ name: 'arrow_outward' }}
						/>
					</div>
				</aside>
			</main>
			<footer class="status">
				<span>
					<Icon name="commit" /> crystal-code
					<span class="status-file">{active.file}</span>
				</span>
				<span>
					Svelte 5 <Button
						label={`${events.length} events`}
						size="x-small"
						onClick={toggleConsole}
					/>
				</span>
			</footer>
		</div>
		<section class="reference-panel" id="reference" aria-label="Component collection">
			<Reference />
		</section>
		<footer class="gallery-footer">
			<div>
				<p>CRYSTAL CODE / BREF</p>
				<h2>Build with Crystal Code.</h2>
			</div>
			<div class="footer-actions">
				<div class="back-to-docs">
					<img src={asset('favicon.svg')} alt="" width="40" height="40" />
					<span>
						<strong>bref / ui</strong>
						<Button href={resolve('themes#crystal-code')} label="Back to docs" size="small" />
					</span>
				</div>
				<GithubStars />
			</div>
		</footer>
		<Dialog
			bind:open={dialog}
			header={{ title: 'Name this preview', description: 'Native modal focus and Escape.' }}
			footer={{
				primary: {
					label: 'Apply name',
					onClick: () => {
						dialog = false;
						previewName = draftName;
						log(`Preview named: ${previewName}`);
					}
				},
				secondary: { label: 'Cancel', onClick: () => (dialog = false) }
			}}
			size="small"
		>
			<label for="dialog-name">Preview name</label>
			<TextInput id="dialog-name" bind:value={draftName} wide />
		</Dialog>
		<Dialog
			bind:open={palette}
			onclose={() => {
				if (railView === 'search') railView = explorer ? 'explorer' : undefined;
				if (pendingFocus) {
					const id = pendingFocus;
					pendingFocus = '';
					requestAnimationFrame(() => document.getElementById(id)?.focus());
				}
			}}
			header={{ title: 'Find file or command' }}
			size="small"
			onkeydown={paletteKeys}
		>
			<div class="palette-content" role="group" aria-label="Files and commands">
				<TextInput
					aria-label="Search files and commands"
					bind:value={query}
					placeholder="Find a file or command…"
					wide
				/>
				<div class="palette-results">
					{#each commands as command (command.id)}<div class="palette-result">
							<Button
								label={command.label}
								icon={{ name: command.icon }}
								size="small"
								wide
								data-result
								onClick={() => runCommand(command.id)}
							/>
							<kbd>{files.some((file) => file.id === command.id) ? 'open' : 'command'}</kbd>
						</div>{/each}{#if !commands.length}<p>No matching files or commands.</p>{/if}
				</div>
				<p class="property-help">↑ ↓ to navigate · Enter to open · Escape to close</p>
			</div>
		</Dialog>
	</Theme>
</div>

<style>
	.workbench {
		display: grid;
		grid-template-rows: 52px minmax(620px, 72dvh) minmax(28px, auto);
		margin-inline: clamp(12px, 3vw, 48px);
		border: 1px solid color-mix(in srgb, var(--color-foreground) 18%, transparent);
		border-radius: 12px;
		background: var(--color-background);
		box-shadow: var(--crystal-code-pane-shadow);
		overflow: clip;
	}
	p,
	h2,
	h3 {
		margin: 0;
	}
	h2,
	h3 {
		font-size: 12px;
	}
	kbd {
		font: 10px var(--crystal-code-font-mono);
		color: var(--color-muted);
	}
	.titlebar {
		display: grid;
		grid-template-columns: 215px minmax(170px, 400px) 1fr;
		align-items: center;
		gap: 20px;
		padding: 0 21px;
	}
	.brand,
	.window-actions {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.brand {
		font-size: 13px;
	}
	.brand span {
		color: var(--color-muted);
		font-size: 12px;
	}
	.window-actions {
		justify-self: end;
	}
	.command {
		display: flex;
		align-items: center;
		gap: 8px;
		min-width: 0;
	}
	.command kbd {
		margin-left: auto;
		white-space: nowrap;
	}
	.body {
		display: grid;
		grid-template-columns: 52px 166px minmax(0, 1fr) 350px;
		gap: 12px;
		min-height: 0;
		padding: 0 14px 10px 2px;
	}
	.workbench[data-explorer='false'] .body {
		grid-template-columns: 52px minmax(0, 1fr) 350px;
	}
	.rail {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 19px;
		padding: 20px 0 12px;
	}
	.explorer {
		display: flex;
		flex-direction: column;
		min-width: 0;
		padding: 21px 8px 15px 0;
		overflow: auto;
	}
	.explorer[hidden] {
		display: none;
	}
	.sidebar-heading {
		display: flex;
		justify-content: space-between;
		font-size: 11px;
		color: var(--color-muted);
		padding: 0 9px 17px;
	}
	.sidebar-bottom {
		margin-top: auto;
		padding: 26px 10px 4px;
		font-size: 11px;
		color: var(--color-muted);
		line-height: 1.8;
	}
	.sidebar-bottom p {
		margin: 7px 0 14px;
	}
	.editor {
		display: grid;
		grid-template-rows: 44px 38px minmax(0, 1fr) 184px;
		min-width: 0;
		min-height: 0;
		background: var(--crystal-code-panel);
		border-radius: 14px;
		box-shadow: var(--crystal-code-pane-shadow);
		overflow: hidden;
	}
	.editor[data-console='false'] {
		grid-template-rows: 44px 38px minmax(0, 1fr);
	}
	.source-tabs {
		padding-left: 14px;
		min-width: 0;
	}
	.editor-path {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		padding: 0 24px;
		font-size: 11px;
		color: var(--color-muted);
	}
	.editor-path > span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.source-scroll {
		overflow: auto;
		min-height: 0;
		padding: 19px 8px 31px;
		scrollbar-color: var(--crystal-code-border) transparent;
	}
	.source-scroll pre {
		margin: 0;
		min-width: max-content;
	}
	.source-scroll code {
		font: 12.5px/26px var(--crystal-code-font-mono);
	}
	.code-line {
		display: grid;
		grid-template-columns: 54px minmax(0, 1fr);
		min-height: 26px;
		white-space: pre;
		padding-right: 34px;
	}
	.line-number {
		text-align: right;
		padding-right: 20px;
		font-size: 10px;
		color: var(--color-muted);
		user-select: none;
	}
	.syntax-string {
		color: var(--color-success);
	}
	.syntax-key {
		color: var(--color-secondary);
	}
	.syntax-tag {
		color: var(--color-primary);
	}
	.console {
		display: grid;
		grid-template-rows: minmax(36px, auto) minmax(0, 1fr) auto;
		min-height: 0;
		background: var(--crystal-code-well);
		margin: 10px 14px 14px;
		border-radius: 10px;
		box-shadow: var(--crystal-code-widget-shadow);
		animation: appear 100ms ease-out;
	}
	.console-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 15px 0 18px;
		font-size: 11px;
	}
	.console-head small {
		font: 10px var(--crystal-code-font-mono);
		margin-left: 16px;
		color: var(--color-muted);
	}
	.logs {
		padding: 3px 18px;
		overflow: auto;
		font: 11px/23px var(--crystal-code-font-mono);
		color: var(--color-muted);
	}
	.logs p {
		display: flex;
		gap: 10px;
	}
	.prompt {
		display: flex;
		align-items: center;
		padding: 4px 18px;
		gap: 10px;
		font: 12px var(--crystal-code-font-mono);
	}
	.prompt > span {
		color: var(--color-primary);
	}
	.right {
		display: flex;
		flex-direction: column;
		overflow: auto;
		min-height: 0;
		min-width: 0;
		background: var(--crystal-code-panel);
		border-radius: 14px;
		box-shadow: var(--crystal-code-pane-shadow);
		scrollbar-color: var(--crystal-code-border) transparent;
	}
	.pane-heading {
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-height: 44px;
		padding: 0 25px;
		font-size: 11px;
	}
	.pane-heading small {
		font-size: 10px;
		color: var(--color-muted);
	}
	.preview {
		padding: 27px 25px 30px;
		min-height: 266px;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}
	.preview-caption {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		color: var(--color-muted);
		font: 10px var(--crystal-code-font-mono);
	}
	.preview-stage {
		min-height: 105px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		gap: 12px;
	}
	.preview-foot {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		color: var(--color-muted);
		font-size: 11px;
	}
	.vertical-preview {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: 16px;
		width: 100%;
	}
	.stack {
		display: grid;
		gap: 14px;
		width: 100%;
		min-width: 0;
		animation: appear 100ms ease-out;
	}
	.stack label {
		font-size: 11px;
		color: var(--color-muted);
	}
	.stack p {
		font-size: 12px;
	}
	.check,
	.feedback-row {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.check {
		margin-block: 14px;
		font-size: 12px;
	}
	.feedback-row {
		color: var(--color-muted);
		font-size: 11px;
	}
	.overlay-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.properties {
		padding: 24px 25px 29px;
		margin-top: 7px;
	}
	.properties-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 25px;
	}
	.property {
		margin: 0 0 24px;
		min-width: 0;
		padding: 0;
		border: 0;
	}
	.property label,
	.property legend {
		display: block;
		color: var(--color-muted);
		font-size: 11px;
		margin-bottom: 9px;
	}
	.segments {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 7px;
	}
	.field-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 18px;
	}
	.property-help {
		font-size: 11px;
		color: var(--color-muted);
		line-height: 1.65;
	}
	.bottom-note {
		margin-top: auto;
		padding: 27px 25px 23px;
		font-size: 11px;
		color: var(--color-muted);
		line-height: 1.8;
	}
	.status {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 15px;
		font-size: 10px;
		color: var(--color-muted);
	}
	.status > span {
		display: flex;
		align-items: center;
		gap: 15px;
	}
	.status-file {
		color: var(--color-foreground);
	}
	.mobile-files {
		display: none;
	}
	.intro {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		padding: 32px clamp(24px, 3vw, 48px);
	}
	.intro-title {
		max-width: 34rem;
	}
	.theme-name {
		margin-bottom: 8px;
		color: var(--color-muted);
		font-size: 12px;
	}
	h1 {
		margin: 0;
		font-size: 24px;
		font-weight: 500;
		letter-spacing: -0.04em;
	}
	.intro-links {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 24px;
	}
	.theme-choice {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 12px;
	}
	.reference-panel {
		padding: clamp(48px, 7vw, 96px) clamp(24px, 5vw, 80px);
	}
	.gallery-footer {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		padding: 32px clamp(20px, 4vw, 56px);
		border-top: 1px solid var(--crystal-code-border);
		background: var(--color-background);
	}
	.gallery-footer p {
		margin-bottom: 8px;
		color: var(--color-muted);
		font: 10px var(--crystal-code-font-mono);
	}
	.gallery-footer h2 {
		font-size: clamp(20px, 3vw, 28px);
		letter-spacing: -0.04em;
	}
	.footer-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 24px;
	}
	.back-to-docs {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 14px 20px;
		border: 1px solid var(--crystal-code-border);
		border-radius: 8px;
		background: var(--crystal-code-panel);
		color: var(--color-foreground);
	}
	.back-to-docs img {
		padding: 3px;
		border-radius: 6px;
		background: white;
	}
	.back-to-docs > span {
		display: grid;
		gap: 4px;
		font-size: 12px;
	}
	.back-to-docs strong {
		font-size: 22px;
		font-weight: 700;
		line-height: 1;
		letter-spacing: -0.04em;
	}
	.palette-content {
		display: grid;
		gap: 16px;
	}
	.palette-results {
		display: grid;
		gap: 5px;
		max-height: 40dvh;
		overflow: auto;
	}
	.palette-result {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 10px;
	}
	.palette-results kbd {
		margin-left: auto;
	}
	.skip {
		position: fixed;
		left: 12px;
		top: -60px;
		z-index: 10;
		background: var(--crystal-code-input);
		padding: 10px;
	}
	.skip:focus-within {
		top: 10px;
	}
	@keyframes appear {
		from {
			opacity: 0;
			transform: translateY(3px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	@media (max-width: 1100px) {
		.body {
			grid-template-columns: 52px 139px minmax(0, 1fr) 280px;
		}
		.workbench[data-explorer='false'] .body {
			grid-template-columns: 52px minmax(0, 1fr) 280px;
		}
		.titlebar {
			grid-template-columns: 162px minmax(160px, 1fr) auto;
			gap: 12px;
		}
		.preview,
		.properties {
			padding-inline: 17px;
		}
		.brand {
			gap: 7px;
		}
	}
	@media (max-width: 760px) {
		.workbench {
			height: auto;
			grid-template-rows: 52px 1fr minmax(28px, auto);
		}
		.titlebar {
			position: sticky;
			top: 0;
			z-index: 3;
			grid-template-columns: auto minmax(110px, 1fr) auto;
			background: var(--color-background);
			padding: 0 12px;
			gap: 10px;
		}
		.explorer-toggle,
		.brand span,
		.brand strong {
			display: none;
		}
		.window-actions {
			gap: 2px;
		}
		.command kbd {
			display: none;
		}
		.body,
		.workbench[data-explorer='false'] .body {
			grid-template-columns: 52px minmax(0, 1fr);
			grid-template-rows: auto 1fr;
			gap: 12px 6px;
			padding: 2px 10px 12px 0;
		}
		.explorer {
			display: none;
		}
		.rail {
			grid-column: 1;
			grid-row: 1/3;
			gap: 18px;
			padding-top: 13px;
		}
		.editor {
			grid-column: 2;
			grid-row: 1;
			height: 54dvh;
			min-height: 485px;
			grid-template-rows: 40px 34px minmax(0, 1fr) 136px;
		}
		.editor[data-console='false'] {
			grid-template-rows: 40px 34px minmax(0, 1fr);
		}
		.right {
			grid-column: 2;
			grid-row: 2;
			overflow: visible;
		}
		.console {
			grid-template-rows: minmax(32px, auto) minmax(0, 1fr) auto;
			margin: 8px 10px 10px;
		}
		.console-head,
		.logs,
		.prompt {
			padding-inline: 12px;
		}
		.properties {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 0 22px;
		}
		.properties-head,
		.property-help,
		.properties fieldset {
			grid-column: 1/-1;
		}
		.field-row {
			grid-column: 1/-1;
		}
		.bottom-note {
			display: none;
		}
		.preview {
			min-height: 205px;
		}
		.mobile-files {
			display: flex;
			gap: 14px;
			overflow: auto;
			padding: 9px 17px;
			white-space: nowrap;
		}
		.source-scroll {
			padding-top: 10px;
		}
		.source-scroll code {
			font-size: 12px;
		}
		.editor-path {
			padding-inline: 16px;
		}
		.status {
			position: sticky;
			bottom: 0;
			z-index: 2;
			background: var(--color-background);
		}
		.status-file {
			display: none;
		}
	}
	@media (max-width: 380px) {
		.properties {
			grid-template-columns: 1fr;
		}
		.property {
			grid-column: 1/-1;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.stack,
		.console {
			animation: none;
		}
	}
</style>
