<script lang="ts">
	import AdditionalComponents from './additional-components.svelte';
	import * as AllComponents from 'bref-ui-themes/new-paris';
	import { asset, resolve } from '$app/paths';
	import { onDestroy } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import type { TabItemDataProps } from 'bref-ui/types';
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
	} from 'bref-ui-themes/new-paris';
	const variants = ['neutral', 'soft', 'filled'] as const;
	const sizes = ['x-small', 'small', 'medium', 'large', 'x-large'] as const;
	const colors = [
		'primary',
		'secondary',
		'foreground',
		'muted',
		'info',
		'success',
		'warning',
		'error'
	] as const;
	const options = [
		{ id: 'paper', label: 'Paper', icon: { name: 'article' as const } },
		{ id: 'ink', label: 'Ink', icon: { name: 'format_color_fill' as const } },
		{ id: 'archive', label: 'Archive (disabled)', disabled: true }
	];
	const choices = [
		{ id: 'edition', label: 'Edition' },
		{ id: 'journal', label: 'Journal' },
		{ id: 'notes', label: 'Notes' }
	];
	const collectionTabs: TabItemDataProps[] = [
		{ id: 'silhouette', label: 'Silhouette', icon: 'checkroom' },
		{ id: 'atelier', label: 'Atelier notes', icon: 'edit_note' },
		{ id: 'materials', label: 'Materials', icon: 'texture' },
		{ id: 'details', label: 'Finishing details', icon: 'content_cut' },
		{ id: 'care', label: 'Care guide', icon: 'dry_cleaning' },
		{ id: 'appointments', label: 'Appointments', icon: 'calendar_month' },
		{ id: 'archive', label: 'Archive (unavailable)', icon: 'inventory_2', disabled: true }
	];
	const collectionNotes: Record<string, { title: string; description: string }> = {
		silhouette: {
			title: 'A considered silhouette.',
			description:
				'Black tailoring, ivory silk and room to move. Collection No. 04 begins with proportion.'
		},
		atelier: {
			title: 'From the atelier.',
			description:
				'A hand-finished seam and a quiet line of stitching. Small decisions shape the whole.'
		},
		materials: {
			title: 'Chosen to last.',
			description: 'Wool suiting gives structure. Silk brings lightness. Both invite a closer look.'
		},
		details: {
			title: 'The final gesture.',
			description: 'Bound edges, covered buttons and a single pressed pleat complete the edition.'
		},
		care: {
			title: 'Keep the character.',
			description:
				'Air wool between wears. Entrust silk and structured tailoring to a specialist cleaner.'
		},
		appointments: {
			title: 'A moment in Paris.',
			description:
				'Private fittings take place Tuesday to Saturday. Bring a favourite piece to guide the conversation.'
		}
	};
	const chapterTabs: TabItemDataProps[] = [
		{ id: 'introduction', label: 'Introduction', icon: 'auto_stories' },
		{ id: 'process', label: 'The process', icon: 'architecture' },
		{ id: 'credits', label: 'Credits', icon: 'group' }
	];
	const chapterNotes: Record<string, string> = {
		introduction: 'An edition about restraint: fewer pieces, more attention to every line.',
		process:
			'Sketch, cut, fit and refine. Each piece returns to the worktable until the balance is right.',
		credits:
			'Conceived in Paris. Made with independent pattern cutters, tailors and textile makers.'
	};
	const finishTabs: TabItemDataProps[] = [
		{ id: 'paper', label: 'Paper', icon: 'article' },
		{ id: 'ink', label: 'Ink', icon: 'format_color_fill' },
		{ id: 'binding', label: 'Binding', icon: 'menu_book' },
		{ id: 'foil', label: 'Foil (unavailable)', icon: 'auto_awesome', disabled: true }
	];
	const finishNotes: Record<string, string> = {
		paper: 'Warm ivory stock, uncoated and softly textured. A quiet ground for the collection.',
		ink: 'Rich black ink gives the typography a decisive edge against the ivory page.',
		binding: 'An exposed thread binding lets the edition open flat and reveals how it is made.'
	};
	const indicatorFade = (node: HTMLElement) =>
		fade(node, { duration: prefersReducedMotion.current ? 0 : 160 });
	let collection = $state('silhouette');
	let chapter = $state('introduction');
	let finish = $state('paper');
	let lastCollectionChange = $state('Choose a tab to explore the collection.');
	let value = $state('');
	let email = $state('');
	let error = $state('');
	let submitted = $state(false);
	let checked = $state(true);
	let selection = $state<string | string[]>('paper');
	let multiple = $state<string | string[]>([]);
	let singleChoice = $state<string | string[]>('edition');
	let multiChoice = $state<string | string[]>(['journal']);
	let tags = $state([
		{ id: 'type', label: 'Typography' },
		{ id: 'space', label: 'Spacing' },
		{ id: 'grid', label: 'Grid' }
	]);
	let pillVisible = $state(true);
	let pillClicks = $state(0);
	let progress = $state(0.64);
	let popoverOpen = $state(false);
	let open = $state(false);
	let lockedOpen = $state(false);
	let dialogSize = $state<'small' | 'medium' | 'large'>('medium');
	let dialogStep = $state(false);
	let busy = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;
	onDestroy(() => clearTimeout(timer));
	function load() {
		busy = true;
		timer = setTimeout(() => (busy = false), 1400);
	}
	function validate(event: SubmitEvent) {
		event.preventDefault();
		error = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
			? ''
			: 'Enter an email address, such as bonjour@example.com.';
		submitted = !error;
	}
</script>

<Theme>
	<div data-new-paris-showcase>
		<a class="skip" href="#collection">Skip to components</a>
		<nav class="masthead" aria-label="Theme demonstrations">
			<a href={resolve('themes')} class="brand">
				bref-ui
				<span>/</span>
				themes
			</a>
			<a class="wordmark" href={resolve('themes/new-paris')}>New Paris</a>
			<div class="theme-links">
				{#each ['relay', 'forma', 'elsewhere'] as theme (theme)}
					<a href={resolve(`demo/themes/${theme}`)}>
						{theme[0].toUpperCase() + theme.slice(1)}
					</a>
				{/each}
				<a href={resolve('themes/new-paris')} aria-current="page">New Paris</a>
			</div>
		</nav>
		<main id="theme-content" tabindex="-1">
			<header class="hero">
				<div class="hero-art">
					<img
						src={asset('demos/new-paris-campaign.png')}
						alt="Black tailoring and ivory silk in a sunlit Parisian atelier"
						width="1536"
						height="1024"
						fetchpriority="high"
					/>
				</div>
				<div class="hero-copy">
					<p data-eyebrow>Paris / Collection No. 04</p>
					<h1>New Paris.</h1>
					<p class="dek">An editorial study in black and ivory.</p>
					<Button
						label="Explore the collection"
						href="#collection"
						variant="filled"
						color="primary"
						wide
					/>
				</div>
			</header>
			<div class="collection-intro">
				<h2>
					Details make
					<br />
					<em>the difference.</em>
				</h2>
				<p>
					Twenty components.
					<br />
					One visual language.
				</p>
			</div>
			<div class="index-bar">
				<span>The collection</span>
				<span>01 — 09</span>
				<a href="#usage">Import this theme <Icon name="south_east" /></a>
			</div>
			<div class="specimen-grid" id="collection" tabindex="-1">
				<section aria-labelledby="actions" class="actions-panel">
					<div class="section-title">
						<span>01</span>
						<h2 id="actions">The gesture.</h2>
						<small>Button</small>
						<p data-caption>Three treatments. One clear intention.</p>
					</div>
					<div class="section-content">
						{#each variants as variant (variant)}
							<div class="specimen-row">
								<span class="row-label">{variant}</span>
								<Button
									label="Continue"
									{variant}
									color="primary"
									trailingIcon={{ name: 'arrow_forward' }}
									onClick={() => (pillClicks += 1)}
								/><Button
									{variant}
									icon={{ name: 'add', label: `Add (${variant})` }}
									color="foreground"
									onClick={() => (pillClicks += 1)}
								/>
							</div>
						{/each}
						<div class="row-divider"></div>
						<div class="row">
							<Button
								label={busy ? 'Loading…' : 'Try loading'}
								disabled={busy}
								aria-busy={busy}
								onClick={load}
								variant="filled"
								color="foreground"
							/>{#if busy}<Spinner label="Loading button example" size="small" />{/if}<Button
								label="Disabled"
								disabled
							/><Button label="Disabled link" href="#usage" disabled />
						</div>
						<div class="row">
							<Button label="Link button" href="#usage" icon={{ name: 'north_east' }} /><Button
								label="Pressed"
								aria-pressed="true"
								variant="soft"
								color="primary"
							/>
						</div>
						<p data-caption role="status">Actions activated: {pillClicks}</p>
					</div>
				</section>
				<section aria-labelledby="inputs">
					<div class="section-title">
						<span>02</span>
						<h2 id="inputs">A personal note.</h2>
						<small>TextInput</small>
						<p data-caption>Honest labels. Visible focus. Helpful feedback.</p>
					</div>
					<div class="section-content">
						<form novalidate onsubmit={validate}>
							<label for="np-name">Edition name</label>
							<TextInput
								id="np-name"
								bind:value
								placeholder="Something worth keeping"
								wide
								icon={{ name: 'edit' }}
							/>
							<label for="np-email">
								Email address <small>Required</small>
							</label>
							<TextInput
								id="np-email"
								type="email"
								bind:value={email}
								placeholder="bonjour@example.com"
								wide
								aria-invalid={error ? 'true' : undefined}
								aria-describedby="np-email-help"
								required
								oninput={() => {
									error = '';
									submitted = false;
								}}
							/>
							<p
								id="np-email-help"
								class:error={!!error}
								data-caption
								role={error ? 'alert' : undefined}
							>
								{error || 'Submit to try the error and success states.'}
							</p>
							<div class="row">
								<Button
									type="submit"
									label="Validate email"
									variant="filled"
									color="foreground"
								/>{#if submitted}<Pill label="Looks good" color="success" variant="soft" />{/if}
							</div>
						</form>
						<div class="row-divider"></div>
						<label for="np-readonly">Read only</label>
						<TextInput id="np-readonly" value="Édition Nº 04" readonly wide variant="neutral" />
						<label for="np-disabled">Disabled</label>
						<TextInput id="np-disabled" value="Archived edition" disabled wide size="small" />
					</div>
				</section>
				<section aria-labelledby="selection">
					<div class="section-title">
						<span>03</span>
						<h2 id="selection">The selection.</h2>
						<small>Select · Checkbox</small>
					</div>
					<div class="section-content">
						<div class="select-grid">
							<div>
								<label for="np-material">Material</label>
								<Select id="np-material" items={options} bind:value={selection} />
								<p data-caption>Selected: {selection}</p>
							</div>
							<div>
								<label for="np-multiple">Multiple selection</label>
								<Select
									id="np-multiple"
									items={options}
									bind:value={multiple}
									placeholder="Choose materials"
								/>
							</div>
							<div>
								<label for="np-empty">Empty options</label>
								<Select
									id="np-empty"
									items={[]}
									emptyMessage={{ message: 'No editions available', icon: { name: 'inbox' } }}
									size="small"
								/>
							</div>
							<div>
								<label for="np-unavailable">Disabled select</label>
								<Select id="np-unavailable" size="small" items={options} value="ink" disabled />
							</div>
						</div>
						<div class="row-divider"></div>
						<div class="checkboxes">
							<label>
								<Checkbox bind:checked />
								<span>Ready for review</span>
							</label>
							<label>
								<Checkbox />
								<span>Unchecked</span>
							</label>
							<label>
								<Checkbox checked disabled />
								<span>Disabled, checked</span>
							</label>
							<label>
								<Checkbox disabled />
								<span>Disabled, unchecked</span>
							</label>
							<label>
								<Checkbox aria-invalid="true" aria-describedby="np-consent-error" />
								<span>Required consent</span>
							</label>
						</div>
						<p id="np-consent-error" class="caption error">Error specimen: consent is required.</p>
					</div>
				</section>
				<section aria-labelledby="pills">
					<div class="section-title">
						<span>04</span>
						<h2 id="pills">Signatures.</h2>
						<small>Pill · Groups</small>
					</div>
					<div class="section-content">
						<div class="row">
							{#each variants as variant (variant)}<Pill
									label={variant}
									{variant}
									color="primary"
								/>{/each}<Pill
								label="Activate pill"
								icon={{ name: 'bolt' }}
								onClick={() => (pillClicks += 1)}
							/>{#if pillVisible}<Pill
									label="Removable"
									onDelete={() => (pillVisible = false)}
								/>{:else}<Button
									label="Restore pill"
									size="small"
									onClick={() => (pillVisible = true)}
								/>{/if}
						</div>
						<h3>Single choice</h3>
						<PillChoiceGroup
							items={choices}
							bind:selection={singleChoice}
							aria-label="Edition format"
							color="primary"
						/>
						<p data-caption>Selected: {singleChoice}</p>
						<h3>Multiple choice</h3>
						<PillChoiceGroup
							items={choices}
							bind:selection={multiChoice}
							aria-label="Included sections"
							variant="soft"
							color="secondary"
						/>
						<h3>Disabled choice</h3>
						<PillChoiceGroup
							items={choices}
							selection="edition"
							disabled
							aria-label="Archived format"
							size="small"
						/>
						<h3>Removable group</h3>
						<PillGroup
							items={tags}
							onDelete={(id) => (tags = tags.filter((tag) => tag.id !== id))}
							aria-label="Design tags"
							size="small"
						/>{#if tags.length < 3}<Button
								label="Restore tags"
								size="small"
								onClick={() =>
									(tags = [
										{ id: 'type', label: 'Typography' },
										{ id: 'space', label: 'Spacing' },
										{ id: 'grid', label: 'Grid' }
									])}
							/>{/if}
					</div>
				</section>
				<section aria-labelledby="surfaces" class="wide-panel">
					<div class="section-title">
						<span>05</span>
						<h2 id="surfaces">The composition.</h2>
						<small>Surface</small>
					</div>
					<div class="section-content">
						<div class="surface-grid">
							{#each variants as variant, index (variant)}<Surface
									{variant}
									color={index === 2 ? 'foreground' : 'background'}
									spacing="large"
									shadow={index === 1 ? 'small' : false}
								>
									<span data-eyebrow>0{index + 1} / {variant}</span>
									<h3>{['The quiet frame.', 'A softer ground.', 'A bold conclusion.'][index]}</h3>
									<p>
										Space does the work.
										<br />
										Every edge has a purpose.
									</p>
								</Surface>{/each}
						</div>
						<div class="row">
							<a href="#usage">
								<Surface
									variant="soft"
									color="primary"
									spacing="medium"
									width="fit"
									hover="medium"
									orientation="horizontal"
								>
									<span>Interactive surface</span>
									<Icon name="arrow_outward" />
								</Surface>
							</a>
							<Surface variant="neutral" glass spacing="medium" width="fit">
								<span>Opaque glass treatment</span>
							</Surface>
						</div>
						<Surface
							spacing="medium"
							scroll
							style="max-height: 100px"
							aria-label="Scrollable surface"
						>
							<p>A scrollable surface with keyboard access.</p>
							<p>Use the arrow keys to read the remaining content.</p>
							<p>Consistent borders, spacing and contrast.</p>
						</Surface>
					</div>
				</section>
				<section aria-labelledby="feedback">
					<div class="section-title">
						<span>06</span>
						<h2 id="feedback">In motion.</h2>
						<small>Progress · Spinner</small>
					</div>
					<div class="section-content">
						<label for="np-progress">Determinate / 64%</label>
						<Progress id="np-progress" value={0.64} size="large" />
						<p class="field-label">Indeterminate</p>
						<Progress label="Indeterminate progress" size="small" />
						<label for="np-seek">Seekable / {Math.round(progress * 100)}%</label>
						<Progress id="np-seek" value={progress} onSeek={(value) => (progress = value)} />
						<Progress label="Disabled seekable progress" value={0.32} onSeek={() => {}} disabled />
						<div class="row">
							<Spinner label="Loading (inherited size)" />
							{#each sizes as size (size)}<Spinner {size} label={`Loading (${size})`} />{/each}
						</div>
						<div class="row">
							{#each ['info', 'success', 'warning', 'error'] as color (color)}<Pill
									label={color}
									color={color as 'info' | 'success' | 'warning' | 'error'}
									variant="soft"
								/>{/each}
						</div>
					</div>
				</section>
				<section aria-labelledby="overlays">
					<div class="section-title">
						<span>07</span>
						<h2 id="overlays">A closer look.</h2>
						<small>Dialog · Popover</small>
						<p data-caption>Native top layers. Try Tab, Shift+Tab and Escape.</p>
					</div>
					<div class="section-content">
						<div class="row">
							{#each ['small', 'medium', 'large'] as size (size)}<Button
									label={`${size[0].toUpperCase() + size.slice(1)} dialog`}
									size="small"
									onClick={() => {
										dialogSize = size as 'small' | 'medium' | 'large';
										dialogStep = false;
										open = true;
									}}
								/>{/each}
						</div>
						<div class="row">
							<Button
								label="Non-dismissible dialog"
								size="small"
								onClick={() => (lockedOpen = true)}
							/>
						</div>
						<div class="row">
							<Popover bind:open={popoverOpen} spacing="large" shadow width="fit">
								{#snippet trigger()}<Button
										label="Open popover"
										aria-expanded={popoverOpen}
										onClick={() => (popoverOpen = !popoverOpen)}
										trailingIcon={{ name: 'add' }}
										variant="filled"
										color="foreground"
									/>{/snippet}
								<div class="popover-content">
									<p data-eyebrow>A small aside</p>
									<h3>Details matter.</h3>
									<p>Click outside or press Escape to dismiss.</p>
									<Button
										label="Close popover"
										size="small"
										onClick={() => (popoverOpen = false)}
									/>
								</div>
							</Popover><Popover disabled open={false}>
								{#snippet trigger()}<Button label="Disabled popover" disabled />{/snippet}
								<p>Unavailable</p>
							</Popover>
						</div>
					</div>
				</section>
				<section aria-labelledby="tabs" class="wide-panel">
					<div class="section-title">
						<span>08</span>
						<h2 id="tabs">The chapters.</h2>
						<small>Tabs</small>
						<p data-caption>
							One collection. Several perspectives. Arrow keys, Home and End move through the
							available tabs.
						</p>
					</div>
					<div class="section-content">
						<h3>Fit / collection notes</h3>
						<Tabs
							items={collectionTabs}
							bind:value={collection}
							label="Collection notes"
							onChange={(id) =>
								(lastCollectionChange = `Opened ${collectionTabs.find((item) => item.id === id)?.label}.`)}
						/>
						<div
							class="tab-content"
							role="region"
							aria-label="Collection preview"
							aria-live="polite"
						>
							<p data-eyebrow>Collection No. 04</p>
							<h3>{collectionNotes[collection].title}</h3>
							<p>{collectionNotes[collection].description}</p>
						</div>
						<p data-caption>{lastCollectionChange} The strip scrolls when space is limited.</p>
						<div class="row-divider"></div>
						<h3>Fill / editorial chapters</h3>
						<Tabs
							items={chapterTabs}
							bind:value={chapter}
							width="fill"
							transitionIn={indicatorFade}
							transitionOut={indicatorFade}
							filled
							label="Editorial chapters"
						/>
						<div class="tab-content" role="region" aria-label="Chapter preview" aria-live="polite">
							<p>{chapterNotes[chapter]}</p>
						</div>
						<div class="row-divider"></div>
						<h3>Vertical / edition details</h3>
						<div class="vertical-tabs">
							<Tabs
								items={finishTabs}
								bind:value={finish}
								orientation="vertical"
								label="Edition details"
							/>
							<div
								class="tab-content"
								role="region"
								aria-label="Edition detail preview"
								aria-live="polite"
							>
								<p data-eyebrow>{finishTabs.find((item) => item.id === finish)?.label}</p>
								<p>{finishNotes[finish]}</p>
							</div>
						</div>
						<p data-caption>
							On narrow screens, icons keep every choice available. The selected horizontal tab
							keeps its label. Indicator motion follows the system preference.
						</p>
					</div>
				</section>
				<section aria-labelledby="scale" class="wide-panel">
					<div class="section-title">
						<span>09</span>
						<h2 id="scale">The finishing touch.</h2>
						<small>Sizes · Palette · Icon</small>
						<p data-caption>Every size, from the smallest annotation to a confident action.</p>
					</div>
					<div class="section-content">
						<div class="row">
							{#each sizes as size (size)}<Button
									label={size}
									{size}
									variant="filled"
									color="foreground"
								/>{/each}
						</div>
						<div class="row">
							{#each sizes as size (size)}<Pill
									label={size}
									{size}
									variant="soft"
									color="secondary"
								/>{/each}
						</div>
						<div class="row">
							{#each sizes as size (size)}<label class="checkbox-size">
									<Checkbox {size} aria-label={`${size} checkbox`} />
									<span>{size}</span>
								</label>{/each}
						</div>
						<div class="input-sizes">
							{#each ['small', 'medium', 'large'] as size (size)}<label>
									<span>{size} input</span>
									<TextInput
										size={size as 'small' | 'medium' | 'large'}
										placeholder="Édition"
										wide
										variant={size === 'small' ? 'neutral' : 'soft'}
									/>
								</label>{/each}
						</div>
						<div class="input-sizes">
							{#each ['small', 'medium', 'large'] as size (size)}<div>
									<label for={`np-select-${size}`}>{size} select</label>
									<Select
										id={`np-select-${size}`}
										size={size as 'small' | 'medium' | 'large'}
										items={options}
										value="paper"
									/>
								</div>{/each}
						</div>
						<div class="row">
							{#each colors as color (color)}<Button
									label={color}
									{color}
									variant="soft"
									size="small"
								/>{/each}
						</div>
						<div class="icon-row">
							{#each sizes as size (size)}<Icon
									name="asterisk"
									{size}
									label={`${size} asterisk`}
								/>{/each}<Icon
								name="favorite"
								filled
								color="primary"
								size="large"
								label="Filled favorite"
							/><Icon name="arrow_outward" size="large" label="Arrow outward" /><Icon
								name="check"
								color="success"
								size="large"
								label="Success check"
							/>
						</div>
					</div>
				</section>
			</div>
			<section id="usage" class="usage" aria-labelledby="usage-heading">
				<div>
					<p data-eyebrow>Built to be used</p>
					<h2 id="usage-heading">Make it yours.</h2>
					<p>Wrap the components in one Theme per document.</p>
					<p><a href={resolve('themes#new-paris')}>Optional font setup</a></p>
				</div>
				<pre><code>&lt;script&gt;
  import '@fontsource-variable/inter/index.css';
  import '@fontsource-variable/material-symbols-outlined/fill.css';
  import &#123; Theme, Button &#125;
    from 'bref-ui-themes/new-paris';
&lt;/script&gt;

&lt;Theme&gt;
  &lt;Button label="Bonjour" variant="filled" /&gt;
&lt;/Theme&gt;</code></pre>
			</section>
			<AdditionalComponents components={AllComponents} />
		</main>
		<footer class="colophon">
			<a href={resolve('themes')}>← Back to showcase</a>
			<span>NEW PARIS / BREF / COMPONENT COLLECTION 04</span>
		</footer>
		<Dialog
			bind:open
			size={dialogSize}
			header={{
				title: dialogStep ? 'Consider it done.' : 'A moment of focus.',
				icon: { name: dialogStep ? 'check' : 'article' },
				description: 'New Paris / Native dialog specimen'
			}}
			footer={{
				primary: {
					label: dialogStep ? 'Done' : 'Continue',
					onClick: () => {
						if (dialogStep) open = false;
						else dialogStep = true;
					}
				},
				secondary: { label: 'Cancel', onClick: () => (open = false) }
			}}
		>
			<p>
				{dialogStep
					? 'The title, icon and action update together.'
					: 'Sharp edges, warm paper and a little room to think. Keyboard focus stays inside this dialog.'}
			</p>
			<label class="dialog-note" for="np-dialog-note">A short note</label>
			<TextInput id="np-dialog-note" placeholder="Write something thoughtful" wide />
		</Dialog>
		<Dialog
			bind:open={lockedOpen}
			dismissible={false}
			header={{ title: 'Stay a moment.', description: 'Non-dismissible dialog specimen' }}
			footer={{
				primary: { label: 'Finish example', onClick: () => (lockedOpen = false) },
				secondary: { label: 'Close example', onClick: () => (lockedOpen = false) }
			}}
		>
			<p>Escape and outside clicks keep this dialog open. Use an explicit action to close it.</p>
		</Dialog>
	</div>
</Theme>

<style>
	[data-new-paris-showcase] {
		--np-page-gutter: clamp(24px, 5vw, 80px);
		margin: auto;
	}
	a {
		color: inherit;
		text-decoration: none;
	}
	.masthead {
		min-height: 108px;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 32px;
		padding-inline: var(--np-page-gutter);
		background: var(--np-paper);
	}
	.brand {
		font-size: 12px;
		letter-spacing: 0.06em;
	}
	.brand span {
		margin: 0 4px;
		color: var(--color-muted);
	}
	.wordmark {
		font: 400 46px / 1 var(--font-display);
		letter-spacing: -0.04em;
	}
	.theme-links {
		display: flex;
		justify-content: flex-end;
		flex-wrap: wrap;
		gap: 18px;
		font-size: 12px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	.theme-links a {
		padding-block: 8px;
	}
	.theme-links [aria-current] {
		text-decoration: underline;
		text-underline-offset: 6px;
	}
	.hero {
		position: relative;
		height: min(700px, 76svh);
		min-height: 540px;
	}
	.hero-art,
	.hero-art img {
		width: 100%;
		height: 100%;
	}
	.hero-art img {
		object-fit: cover;
		object-position: 35% top;
	}
	.hero-copy {
		position: absolute;
		right: var(--np-page-gutter);
		bottom: 48px;
		width: 440px;
		padding: 40px;
		background: var(--np-paper);
	}
	h1 {
		font-size: 76px;
		line-height: 1;
		margin: 20px 0 18px;
	}
	.dek {
		font-size: 14px;
		color: var(--color-muted);
		margin-bottom: 28px;
	}
	.collection-intro,
	.index-bar,
	.specimen-grid,
	.usage,
	.colophon {
		max-width: 1320px;
		margin-inline: auto;
		padding-inline: var(--np-page-gutter);
	}
	.collection-intro {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 40px;
		padding-block: 88px 64px;
	}
	.collection-intro h2 {
		font-size: 48px;
		line-height: 1.08;
	}
	.collection-intro p {
		color: var(--color-muted);
		font-size: 14px;
		margin-right: 8%;
	}
	.index-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 12px;
		padding-block: 24px;
		font-size: 12px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}
	.index-bar > span:nth-child(2) {
		color: var(--color-muted);
	}
	.index-bar a {
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: 32px;
	}
	section {
		min-width: 0;
	}
	.specimen-grid > section {
		display: grid;
		grid-template-columns: minmax(180px, 0.9fr) minmax(0, 2fr);
		gap: 64px;
		padding-block: 64px;
		border-top: 1px solid var(--np-rule);
	}
	.section-title {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 16px;
	}
	.section-title > span {
		font-size: 12px;
		color: var(--color-muted);
		letter-spacing: 0.1em;
	}
	h2 {
		font-size: 42px;
	}
	.section-title small {
		font-size: 12px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.section-title [data-caption] {
		max-width: 240px;
	}
	.section-content {
		display: flex;
		flex-direction: column;
		gap: 24px;
		min-width: 0;
	}
	.row,
	.specimen-row,
	.icon-row {
		display: flex;
		align-items: center;
		gap: 16px;
		flex-wrap: wrap;
	}
	.row-label {
		font-size: 12px;
		min-width: 78px;
		color: var(--color-muted);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.row-divider {
		border-top: 1px solid var(--np-rule);
		margin-block: 4px;
	}
	.specimen-row {
		padding-block: 4px;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	label,
	.field-label {
		font-size: 12px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	label {
		display: flex;
		justify-content: space-between;
		gap: 12px;
	}
	label small {
		color: var(--color-muted);
		font-size: 12px;
	}
	.error {
		color: var(--color-error);
	}
	.select-grid,
	.input-sizes {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 24px;
	}
	.select-grid label,
	.input-sizes > div > label {
		margin-bottom: 10px;
	}
	.select-grid [data-caption] {
		margin-top: 10px;
	}
	.checkboxes {
		display: grid;
		gap: 20px;
	}
	.checkboxes label,
	.checkbox-size {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 12px;
		text-transform: none;
		letter-spacing: 0;
		font-size: 14px;
	}
	h3 {
		font-size: 28px;
	}
	.surface-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
	}
	.surface-grid p {
		font-size: 14px;
	}
	.tab-content {
		display: grid;
		align-content: start;
		gap: 12px;
		min-width: 0;
		padding: 24px;
		border: 1px solid var(--np-rule);
		background: var(--np-paper);
	}
	.tab-content p {
		max-width: 60ch;
	}
	.vertical-tabs {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: 24px;
		align-items: start;
	}
	.popover-content {
		max-width: 260px;
		display: grid;
		gap: 20px;
	}
	.popover-content p {
		font-size: 14px;
	}
	.input-sizes {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	.input-sizes label {
		display: grid;
		justify-content: stretch;
	}
	.icon-row {
		gap: 26px;
		padding: 12px 0;
	}
	.usage {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 64px;
		padding-block: 72px 96px;
		align-items: center;
	}
	.usage h2 {
		font-size: 48px;
		margin: 20px 0;
	}
	.usage p:last-child {
		font-size: 14px;
		color: var(--color-muted);
	}
	pre {
		border: 1px solid var(--np-rule);
		padding: 32px;
		font-size: 13px;
		line-height: 1.6;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
		background: var(--np-paper);
	}
	.colophon {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 24px;
		border-top: 1px solid var(--np-rule);
		padding-block: 32px;
		font-size: 12px;
		letter-spacing: 0.06em;
	}
	.colophon a {
		display: inline-flex;
		align-items: center;
		min-height: 32px;
	}
	.dialog-note {
		margin-top: 24px;
		margin-bottom: 8px;
	}
	.colophon span {
		color: var(--color-muted);
	}
	.skip {
		position: fixed;
		top: 8px;
		left: 8px;
		translate: 0 -200%;
		padding: 12px;
		background: var(--np-paper);
		z-index: 10;
	}
	.skip:focus {
		translate: none;
	}
	@media (max-width: 1050px) {
		.masthead {
			gap: 20px;
		}
		.theme-links {
			gap: 12px;
		}
		.specimen-grid > section {
			grid-template-columns: 1fr;
			gap: 32px;
		}
		.section-title [data-caption] {
			max-width: none;
		}
	}
	@media (max-width: 800px) {
		.masthead {
			grid-template-columns: 1fr auto;
			padding-block: 24px;
			gap: 24px;
		}
		.wordmark {
			grid-column: 1 / -1;
			grid-row: 1;
			justify-self: center;
		}
		.hero {
			height: auto;
			min-height: 0;
		}
		.hero-art {
			height: 520px;
		}
		.hero-copy {
			position: static;
			width: auto;
			padding: 36px var(--np-page-gutter);
		}
		h1 {
			font-size: clamp(48px, 8vw, 64px);
		}
		.collection-intro {
			padding-block: 56px 40px;
		}
		.collection-intro h2,
		.usage h2 {
			font-size: 40px;
		}
	}
	@media (max-width: 640px) {
		.masthead {
			grid-template-columns: 1fr;
			gap: 16px;
			text-align: center;
		}
		.brand {
			justify-self: center;
		}
		.theme-links {
			justify-content: center;
			gap: 18px;
		}
		.hero-art {
			height: 460px;
		}
		.collection-intro {
			align-items: flex-start;
			flex-direction: column;
			gap: 24px;
		}
		.index-bar > span:nth-child(2) {
			display: none;
		}
		.specimen-grid > section {
			padding-block: 40px;
		}
		.specimen-row {
			display: grid;
			grid-template-columns: 64px minmax(0, 1fr) 44px;
			gap: 8px;
		}
		.row-label {
			min-width: 0;
		}
		h2 {
			font-size: 36px;
		}
		.surface-grid,
		.input-sizes,
		.select-grid,
		.usage {
			grid-template-columns: 1fr;
		}
		.usage {
			gap: 32px;
			padding-block: 48px 64px;
		}
	}
</style>
