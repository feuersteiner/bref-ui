<script lang="ts">
	import { resolve } from '$app/paths';
	import { tick } from 'svelte';
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
	} from 'bref-ui-themes/crystal-code';
	import type { Size, Variant, TabItemDataProps, IconName, SurfaceRadius } from 'bref-ui/types';
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
	let activeId = $state<string>('buttons');
	const active = $derived(files.find((file) => file.id === activeId) ?? files[0]);
	let mode = $state<'dark' | 'light'>('dark');
	let explorer = $state(true);
	let consoleVisible = $state(true);
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
	let reference = $state(false);
	let copied = $state(false);
	let events = $state(['Workbench ready · 20 exports', 'Change a property or type help below.']);
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
		{ id: 'css', label: 'theme.css', icon: 'data_object' }
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
			{ id: 'reference', label: 'Open complete component reference', icon: 'widgets' as IconName }
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
	function toggleMode() {
		mode = mode === 'dark' ? 'light' : 'dark';
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
		else if (id === 'reference') {
			reference = true;
			requestAnimationFrame(() => document.getElementById('reference')?.scrollIntoView());
		} else if (id === 'console') {
			consoleVisible = true;
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
			buttons: 'Button, Spinner',
			inputs: 'TextInput, Checkbox, Select',
			choices: 'Pill, PillGroup, PillChoiceGroup',
			feedback: 'Progress, Spinner, Icon',
			surfaces: 'Surface, Dialog, Popover, Button',
			tabs: 'Tabs, Checkbox'
		};
		const props = `variant=${JSON.stringify(variant)}\n  size=${JSON.stringify(size)}\n  color="primary"`;
		if (sourceView === 'css')
			return `/* workbench / theme.css */\n\n[data-bref-theme='crystal-code'] {\n  --color-background: ${mode === 'dark' ? '#0c0d10' : '#f0f0ee'};\n  --color-foreground: ${mode === 'dark' ? '#d9dade' : '#35373c'};\n  --color-primary: ${mode === 'dark' ? '#8aa7f8' : '#4e5969'};\n  --crystal-code-radius: ${radius};\n}\n\n/* Hover changes text and glyphs only. */\n/* Keyboard focus stays visible. */`;
		const examples: Record<string, string> = {
			buttons: `let activations = $state(0);\n</${'script'}>\n\n${controlState === 'loading' ? `<Spinner label="Loading preview" size=${JSON.stringify(size)} />\n` : ''}<Button\n  label={${JSON.stringify(label)}}\n  ${props}\n  icon={{ name: 'bolt' }}\n  disabled={${disabled}}\n  onClick={() => activations++}\n/>\n\n<p>{activations} activations</p>`,
			inputs: `let value = $state('');\n  let checked = $state(true);\n  let language = $state('ts');\n</${'script'}>\n\n<TextInput aria-label="Setting name"\n  bind:value placeholder="editor.fontSize"\n  size=${JSON.stringify(fieldSize)} disabled={${disabled}} />\n<Checkbox bind:checked aria-label="Format on save"\n  size=${JSON.stringify(size)} disabled={${disabled}} />\n<Select items={[{ id: 'ts', label: 'TypeScript' },\n  { id: 'js', label: 'JavaScript' }]}\n  bind:value={language} size=${JSON.stringify(fieldSize)}\n  disabled={${disabled}} />`,
			choices: `let selection = $state('default');\n  let tags = $state([{ id: 'svelte', label: 'Svelte' }]);\n</${'script'}>\n\n<Pill label={${JSON.stringify(label)}} ${props.replaceAll('\n  ', ' ')} />\n<PillGroup items={tags}\n  onDelete={(id) => tags = tags.filter(tag => tag.id !== id)} />\n<PillChoiceGroup bind:selection\n  items={[{ id: 'default', label: 'Default' },\n    { id: 'compact', label: 'Compact' }]}\n  size=${JSON.stringify(size)} variant=${JSON.stringify(choiceVariant)}\n  color="primary" disabled={${disabled}} />`,
			feedback: `let progress = $state(0.42);\n</${'script'}>\n\n<Progress value={progress}\n  onSeek={(next) => progress = next}\n  label="Build progress" disabled={${disabled}} />\n<Spinner label="Loading preview" size=${JSON.stringify(size)} />\n<Icon name="check_circle" color="success" label="Ready" />`,
			surfaces: `let open = $state(false);\n</${'script'}>\n\n<Surface variant=${JSON.stringify(variant)} color=${JSON.stringify(variant === 'neutral' ? 'background' : 'primary')}\n  spacing="medium" radius=${JSON.stringify(surfaceRadius)}>\n  <h3>Project settings</h3>\n  <p>Context, only when needed.</p>\n</Surface>\n<Button label="Open dialog" onClick={() => open = true} />\n<Dialog bind:open header={{ title: 'Name this preview' }}>\n  <p>Native modal focus and Escape.</p>\n</Dialog>`,
			tabs: `let view = $state('default');\n  const items = [\n    { id: 'default', label: 'Editor', icon: 'edit' },\n    { id: 'files', label: 'Files', icon: 'folder' },\n    { id: 'locked', label: 'Unavailable', icon: 'lock', disabled: true }\n  ] as const;\n</${'script'}>\n\n<Tabs {items} bind:value={view} label="Preview preferences" />\n<p>{view === 'default' ? 'Editor preferences' : 'File preferences'}</p>`
		};
		return `<script lang="ts">\n  import { ${imports[activeId]} }\n    from 'bref-ui-themes/crystal-code';\n\n  ${examples[activeId]}`;
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
<div data-crystal-code-gallery data-theme={mode}>
	<Theme>
		<div class="workbench" style:--crystal-code-radius={radius} data-explorer={explorer}>
			<a class="skip" href="#live-preview">Skip to live preview</a>
			<header class="titlebar">
				<a class="brand" href={resolve('themes')}>
					<Icon name="code" />
					<strong>bref</strong>
					<span>/ crystal-code</span>
				</a>
				<button
					class="command"
					type="button"
					onclick={() => {
						query = '';
						palette = true;
					}}
				>
					<Icon name="search" /> Find a file or command…
					<kbd>⌘ K</kbd>
				</button>
				<div class="window-actions">
					<button
						class="icon-button"
						type="button"
						aria-label="Toggle preview console"
						aria-pressed={consoleVisible}
						onclick={() => (consoleVisible = !consoleVisible)}
					>
						<Icon name="terminal" filled={consoleVisible} />
					</button>
					<button
						class="icon-button"
						type="button"
						aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} theme`}
						onclick={toggleMode}
					>
						<Icon name={mode === 'dark' ? 'light_mode' : 'dark_mode'} />
					</button>
				</div>
			</header>
			<main id="theme-content" class="body" tabindex="-1">
				<nav class="rail" aria-label="Workbench views">
					<button
						class="icon-button"
						type="button"
						aria-label="Toggle file explorer"
						aria-pressed={explorer}
						onclick={() => (explorer = !explorer)}
					>
						<Icon name="file_copy" filled={explorer} />
					</button>
					<button
						class="icon-button"
						type="button"
						aria-label="Find component"
						onclick={() => {
							query = '';
							palette = true;
						}}
					>
						<Icon name="search" />
					</button>
					<button
						class="icon-button"
						type="button"
						aria-label="Focus preview console"
						onclick={() => runCommand('console')}
					>
						<Icon name="terminal" />
					</button>
					<button
						class="icon-button manage"
						type="button"
						aria-label="Focus properties"
						onclick={() => document.getElementById('properties-heading')?.focus()}
					>
						<Icon name="tune" />
					</button>
				</nav>
				<nav class="explorer" aria-label="File explorer" hidden={!explorer}>
					<p class="sidebar-heading">
						EXPLORER <span>···</span>
					</p>
					<p class="folder"><Icon name="keyboard_arrow_down" /> crystal-code</p>
					<p class="folder nested"><Icon name="keyboard_arrow_down" /> src / components</p>
					{#each files as file (file.id)}<button
							class="file"
							type="button"
							aria-current={activeId === file.id && sourceView === 'component' ? 'true' : undefined}
							onclick={() => selectFile(file.id)}
						>
							<Icon name="description" filled={activeId === file.id} />{file.file}
						</button>{/each}
					<button
						class="file css-file"
						type="button"
						aria-current={sourceView === 'css' ? 'true' : undefined}
						onclick={() => (sourceView = 'css')}
					>
						<Icon name="data_object" />theme.css
					</button>
					<div class="sidebar-bottom">
						<span>• Local playground</span>
						<p>Explore reusable components and their properties.</p>
						<a href="#reference" onclick={() => (reference = true)}>
							Complete component reference ↗
						</a>
					</div>
				</nav>
				<section class="editor" aria-label="Component source" data-console={consoleVisible}>
					<div class="source-tabs">
						<Tabs items={sourceTabs} bind:value={sourceView} label="Source files" />
					</div>
					<div class="editor-path">
						<span>
							src › {sourceView === 'css'
								? 'lib › crystal-code › theme.svelte'
								: `components › ${active.file}`}
						</span>
						<button type="button" class="text-button" onclick={copySource}>
							<Icon name="content_copy" />{copied ? 'Copied' : 'Copy'}
						</button>
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
								<button
									type="button"
									class="icon-button"
									aria-label="Clear console"
									onclick={() => (events = [])}
								>
									<Icon name="delete" />
								</button>
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
								<input
									id="preview-command"
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
						{#each files as file (file.id)}<button
								type="button"
								aria-current={activeId === file.id ? 'true' : undefined}
								onclick={() => selectFile(file.id)}
							>
								{file.name.split(' ')[0]}
							</button>{/each}
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
								<div class="stack">
									<Tabs items={previewTabs} bind:value={previewTab} label="Preview preferences" />
									<p>{previewTab === 'default' ? 'Editor preferences' : 'File preferences'}</p>
									{#if previewTab === 'default'}<label class="check">
											<Checkbox bind:checked />Format on save
										</label>
									{:else}<label class="check">
											<Checkbox bind:checked={autoSave} />Auto save
										</label>{/if}
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
							<h2 id="properties-heading" tabindex="-1">Properties</h2>
							<button type="button" class="text-button" onclick={reset}>
								<Icon name="restart_alt" />Reset
							</button>
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
								{#each variants as item (item)}<button
										type="button"
										aria-pressed={variant === item}
										onclick={() => (variant = item)}
									>
										{item}
									</button>{/each}
							</div>
						</fieldset>
						<fieldset
							class="property"
							hidden={!['buttons', 'inputs', 'choices', 'feedback'].includes(activeId)}
						>
							<legend>size</legend>
							<div class="segments">
								{#each sizes as item, index (item)}<button
										type="button"
										aria-label={item}
										aria-pressed={size === item}
										onclick={() => (size = item)}
									>
										{['XS', 'S', 'M', 'L', 'XL'][index]}
									</button>{/each}
							</div>
						</fieldset>
						<div class="property field-row">
							<div hidden={activeId === 'tabs'}>
								<label for="preview-state">state</label>
								<select id="preview-state" bind:value={controlState}>
									<option value="ready">Ready</option>
									<option value="disabled">Disabled</option>
									{#if activeId === 'buttons'}<option value="loading">Loading</option>{/if}
								</select>
							</div>
							<div>
								<label for="preview-radius">radius</label>
								<select id="preview-radius" bind:value={radius}>
									{#each ['0px', '3px', '6px', '8px', '10px'] as item (item)}<option value={item}>
											{item}
										</option>{/each}
								</select>
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
						<a href="#reference" onclick={() => (reference = true)}>All variants and states ↗</a>
					</div>
				</aside>
			</main>
			<footer class="status">
				<span>
					<Icon name="commit" /> crystal-code
					<span class="status-file">{active.file}</span>
				</span>
				<span>
					Svelte 5 <button type="button" onclick={() => (consoleVisible = !consoleVisible)}>
						{events.length} events
					</button>
				</span>
			</footer>
		</div>
		<details class="reference-panel" id="reference" bind:open={reference}>
			<summary>Complete component reference · all 20 exports</summary>
			{#if reference}<Reference />{/if}
		</details>
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
					{#each commands as command (command.id)}<button
							type="button"
							data-result
							onclick={() => runCommand(command.id)}
						>
							<Icon name={command.icon} />{command.label}
							<kbd>{files.some((file) => file.id === command.id) ? 'open' : 'command'}</kbd>
						</button>{/each}{#if !commands.length}<p>No matching files or commands.</p>{/if}
				</div>
				<p class="property-help">↑ ↓ to navigate · Enter to open · Escape to close</p>
			</div>
		</Dialog>
	</Theme>
</div>

<style>
	.workbench {
		height: 100dvh;
		min-height: 600px;
		display: grid;
		grid-template-rows: 52px minmax(0, 1fr) 28px;
		background: var(--color-background);
	}
	button,
	a,
	input,
	select {
		touch-action: manipulation;
	}
	button {
		cursor: pointer;
		color: inherit;
		font: inherit;
	}
	button:disabled {
		cursor: default;
	}
	button {
		border: 0;
		background: transparent;
	}
	a {
		color: inherit;
		text-decoration: none;
	}
	button:hover,
	a:hover {
		color: var(--crystal-code-bright);
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
		padding: 0 12px;
		height: 30px;
		border-radius: 9px;
		background: var(--crystal-code-panel);
		color: var(--color-muted);
		font-size: 12px;
		text-align: left;
		box-shadow: var(--crystal-code-widget-shadow);
	}
	.command kbd {
		margin-left: auto;
		white-space: nowrap;
	}
	.icon-button {
		width: 30px;
		height: 30px;
		display: grid;
		place-items: center;
		padding: 0;
		color: var(--color-muted);
		font-size: 18px;
	}
	.icon-button[aria-pressed='true'] {
		color: var(--crystal-code-bright);
	}
	.body {
		display: grid;
		grid-template-columns: 42px 176px minmax(0, 1fr) 330px;
		gap: 12px;
		min-height: 0;
		padding: 0 14px 10px 2px;
	}
	.workbench[data-explorer='false'] .body {
		grid-template-columns: 42px minmax(0, 1fr) 330px;
	}
	.rail {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 19px;
		padding: 20px 0 12px;
	}
	.rail .manage {
		margin-top: auto;
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
	.folder {
		display: flex;
		align-items: center;
		gap: 5px;
		height: 30px;
		padding-left: 7px;
		color: var(--color-muted);
		font-size: 12px;
	}
	.folder.nested {
		padding-left: 17px;
	}
	.file {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		min-height: 34px;
		padding: 0 8px 0 24px;
		text-align: left;
		color: var(--color-muted);
		font-size: 12px;
		white-space: nowrap;
	}
	.file[aria-current] {
		color: var(--crystal-code-bright);
	}
	.css-file {
		margin-top: 12px;
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
	.source-tabs :global([role='tab'] > i) {
		display: none;
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
	.text-button {
		display: flex;
		align-items: center;
		gap: 7px;
		padding: 0;
		min-height: 28px;
		font-size: 11px;
		color: var(--color-muted);
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
		grid-template-rows: 36px minmax(0, 1fr) 33px;
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
		padding: 0 18px;
		gap: 10px;
		font: 12px var(--crystal-code-font-mono);
	}
	.prompt > span {
		color: var(--color-primary);
	}
	.prompt input {
		width: 100%;
		min-width: 0;
		border: 0;
		background: transparent;
		color: var(--color-foreground);
		font: 11px var(--crystal-code-font-mono);
		padding: 4px 0;
	}
	.prompt input::placeholder {
		color: var(--color-muted);
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
		justify-content: space-between;
		gap: 7px;
	}
	.segments button {
		padding: 4px 0;
		min-width: 24px;
		min-height: 28px;
		color: var(--color-muted);
		font-size: 11px;
		position: relative;
	}
	.segments button[aria-pressed='true'] {
		color: var(--crystal-code-bright);
	}
	.segments button[aria-pressed='true']::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: var(--color-primary);
	}
	.field-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 18px;
	}
	select {
		width: 100%;
		min-width: 0;
		background: var(--crystal-code-input);
		border: 0;
		border-radius: 8px;
		min-height: 36px;
		padding: 8px 11px;
		font-size: 12px;
		color: var(--color-foreground);
		box-shadow: var(--crystal-code-widget-shadow);
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
	.status button {
		font-size: 10px;
		padding: 0;
	}
	.mobile-files {
		display: none;
	}
	.reference-panel {
		margin: 12px 14px 30px 56px;
		background: var(--crystal-code-panel);
		border-radius: 14px;
	}
	.reference-panel summary {
		cursor: pointer;
		padding: 18px 24px;
		color: var(--color-muted);
		font-size: 12px;
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
	.palette-results button {
		display: flex;
		align-items: center;
		gap: 10px;
		text-align: left;
		padding: 10px 5px;
		min-height: 38px;
		color: var(--color-muted);
		font-size: 12px;
	}
	.palette-results kbd {
		margin-left: auto;
	}
	.palette-results button:focus-visible {
		outline-offset: -1px;
	}
	.skip {
		position: fixed;
		left: 12px;
		top: -60px;
		z-index: 10;
		background: var(--crystal-code-input);
		padding: 10px;
	}
	.skip:focus {
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
			grid-template-columns: 37px 139px minmax(0, 1fr) 280px;
		}
		.workbench[data-explorer='false'] .body {
			grid-template-columns: 37px minmax(0, 1fr) 280px;
		}
		.titlebar {
			grid-template-columns: 162px minmax(160px, 1fr) auto;
			gap: 12px;
		}
		.file {
			font-size: 11px;
			padding-left: 17px;
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
			min-height: 100dvh;
			grid-template-rows: 52px 1fr 28px;
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
		.brand span {
			display: none;
		}
		.window-actions {
			gap: 2px;
		}
		.command {
			font-size: 11px;
			height: 28px;
		}
		.command kbd {
			display: none;
		}
		.body,
		.workbench[data-explorer='false'] .body {
			grid-template-columns: 32px minmax(0, 1fr);
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
		.rail .manage {
			margin-top: 20px;
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
			grid-template-rows: 32px minmax(0, 1fr) 29px;
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
		.property-help {
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
		.mobile-files button {
			font-size: 11px;
			color: var(--color-muted);
			padding: 3px 0;
			min-height: 28px;
		}
		.mobile-files button[aria-current] {
			color: var(--crystal-code-bright);
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
		.reference-panel {
			margin-left: 38px;
		}
	}
	@media (max-width: 380px) {
		.properties {
			grid-template-columns: 1fr;
		}
		.property {
			grid-column: 1/-1;
		}
		.brand strong {
			display: none;
		}
	}
	@media (pointer: coarse) {
		.icon-button,
		.segments button,
		.file,
		.mobile-files button,
		.text-button,
		.command,
		.palette-results button {
			min-height: 44px;
		}
		.segments button {
			min-width: 34px;
		}
		.icon-button {
			width: 34px;
		}
		.titlebar .command {
			min-height: 36px;
		}
	}
</style>
