<script lang="ts">
	import AdditionalComponents from './additional-components.svelte';
	import GithubStars from '../../../(docs)/components/layout/github-stars.svelte';
	import { asset, resolve } from '$app/paths';
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
	} from 'bref-ui-themes/glassy';
	import type { TabItemDataProps } from 'bref-ui/types';
	let name = $state('');
	let email = $state('');
	let invalid = $state(false);
	let checked = $state(true);
	let selected = $state<string | string[]>('mist');
	let multiple = $state<string | string[]>(['mist']);
	let choice = $state<string | string[]>('clear');
	let extras = $state<string | string[]>(['blur']);
	let tags = $state([
		{ id: 'layers', label: 'Layers' },
		{ id: 'light', label: 'Light' },
		{ id: 'depth', label: 'Depth' }
	]);
	let removable = $state(true);
	let pressed = $state(false);
	let clicks = $state(0);
	let progress = $state(0.42);
	let popover = $state(false);
	let dialog = $state(false);
	let busy = $state(false);
	let feedback = $state('Ready to try.');
	const options = [
		{ id: 'mist', label: 'Morning mist', icon: { name: 'water_drop' as const } },
		{ id: 'tide', label: 'Blue tide' },
		{ id: 'dusk', label: 'Dusk', disabled: true }
	];
	const choices = [
		{ id: 'clear', label: 'Clear' },
		{ id: 'frosted', label: 'Frosted' },
		{ id: 'tinted', label: 'Tinted' }
	];
	let view = $state('overview');
	let finish = $state('clear');
	let layer = $state('blur');
	let tabFeedback = $state('Choose a view to explore the material.');
	const views: TabItemDataProps[] = [
		{ id: 'overview', label: 'Overview', icon: 'dashboard' },
		{ id: 'layers', label: 'Layers', icon: 'layers' },
		{ id: 'light', label: 'Light', icon: 'light_mode' },
		{ id: 'export', label: 'Export', icon: 'ios_share', disabled: true },
		{ id: 'details', label: 'Details', icon: 'info' }
	];
	const viewContent: Record<string, { title: string; text: string }> = {
		overview: {
			title: 'Clarity in every layer',
			text: 'A translucent surface keeps the landscape visible and the controls readable.'
		},
		layers: {
			title: 'Three layers, one surface',
			text: 'Backdrop blur, a quiet tint and a fine highlight create the glass finish.'
		},
		light: {
			title: 'Let the light through',
			text: 'Soft reflections add depth without hiding the content behind the glass.'
		},
		details: {
			title: 'Native, down to the details',
			text: 'Arrow keys, Home and End change this view. Export is disabled in this preview.'
		}
	};
	const finishes: TabItemDataProps[] = [
		{ id: 'clear', label: 'Clear', icon: 'water_drop' },
		{ id: 'frosted', label: 'Frosted', icon: 'blur_on' },
		{ id: 'tinted', label: 'Tinted', icon: 'palette' }
	];
	const layers: TabItemDataProps[] = [
		{ id: 'blur', label: 'Blur', icon: 'blur_on' },
		{ id: 'tint', label: 'Tint', icon: 'palette' },
		{ id: 'highlight', label: 'Highlight', icon: 'light_mode' }
	];
	const layerContent: Record<string, string> = {
		blur: 'Backdrop blur softens the scene behind the surface.',
		tint: 'A cool tint separates controls from the background.',
		highlight: 'A fine upper highlight defines the edge of the glass.'
	};
	const save = () => {
		invalid = !email.includes('@');
		if (invalid) {
			feedback = 'Enter an email address containing @.';
			return;
		}
		busy = true;
		feedback = 'Previewing loading state…';
	};
</script>

<Theme>
	<div data-glassy-gallery>
		<a data-skip href="#buttons">Skip to components</a>
		<nav aria-label="Glassy gallery">
			<span class="brand">
				<Icon name="blur_on" size="large" />
				<strong>
					Glassy <span>/</span>
					Bref
				</strong>
			</span>
			<a href="#usage">Use this theme <Icon name="south_east" /></a>
		</nav>
		<main id="theme-content" tabindex="-1">
			<header class="intro">
				<div>
					<p class="eyebrow">GLASSY / BREF COMPONENTS</p>
					<h1>
						Clarity,
						<br />
						in layers.
					</h1>
					<p class="lede">Translucent surfaces, soft highlights and native controls for Svelte.</p>
					<div data-actions>
						<Pill label="Glassy theme" icon={{ name: 'blur_on' }} color="primary" variant="soft" />
						<span class="version">20 exports · Svelte 5</span>
					</div>
				</div>
				<div class="material" aria-label="Layered glass material example">
					<div class="orb orb-blue"></div>
					<div class="orb orb-peach"></div>
					<Surface
						radius="large"
						spacing="large"
						shadow="large"
						glass
						style="padding: clamp(20px, 2.5vw, 32px); --glassy-opacity: 34%;"
					>
						<div class="specimen-top">
							<span class="eyebrow">MATERIAL / 001</span>
							<Icon name="water_drop" size="large" color="primary" />
						</div>
						<h2>
							A little depth.
							<br />
							A lot of clarity.
						</h2>
						<p>
							Light passes through.
							<br />
							The essentials stay sharp.
						</p>
						<Surface
							variant="soft"
							spacing="medium"
							radius="medium"
							orientation="horizontal"
							glass
							style="gap: 12px;"
						>
							<Icon name="layers" size="large" color="primary" />
							<div>
								<strong>Layered by design</strong>
								<p>Blur · tint · highlight</p>
							</div>
							<Icon name="check_circle" color="success" size="medium" />
						</Surface>
						<div data-actions>
							<Button
								label="Explore components"
								href="#buttons"
								color="primary"
								variant="filled"
								trailingIcon={{ name: 'arrow_downward' }}
							/><Pill label="Native CSS" size="small" />
						</div>
					</Surface>
					<span class="material-caption">TRANSLUCENCY WITH PURPOSE</span>
				</div>
			</header>
			<div class="collection-heading">
				<h2>The building blocks</h2>
				<p>Explore actions, inputs, feedback and layers.</p>
			</div>
			<div class="grid">
				<section id="buttons" aria-labelledby="buttons-title">
					<Surface radius="medium" spacing="large" glass>
						<div class="section-heading">
							<h2 id="buttons-title">Buttons</h2>
							<span>01 / ACTION</span>
						</div>
						<p data-muted>Three finishes, five sizes. Clear focus at every step.</p>
						{#each ['neutral', 'soft', 'filled'] as const as variant (variant)}
							<div data-actions>
								<span class="row-label">{variant}</span>
								<Button label="Primary" {variant} color="primary" onClick={() => clicks++} /><Button
									label="Secondary"
									{variant}
									color="secondary"
									onClick={() => clicks++}
								/><Button
									icon={{ name: 'add', label: `Add, ${variant}` }}
									{variant}
									color="primary"
									onClick={() => clicks++}
								/>
							</div>
						{/each}
						<div data-actions>
							{#each ['x-small', 'small', 'medium', 'large', 'x-large'] as const as size (size)}<Button
									label={size}
									{size}
									onClick={() => clicks++}
								/>{/each}
						</div>
						<div data-actions>
							<Button label="Disabled" disabled /><Button
								label={pressed ? 'Pinned' : 'Pin'}
								icon={{ name: 'bookmark' }}
								aria-pressed={pressed}
								onClick={() => (pressed = !pressed)}
							/><Button
								icon={{ name: 'favorite', label: 'Favorite' }}
								rounded
								onClick={() => clicks++}
							/><Button
								href="#controls"
								label="Link button"
								trailingIcon={{ name: 'arrow_downward' }}
							/>
						</div>
						<p role="status" class="note">
							{clicks} button activations · {pressed ? 'Pinned' : 'Unpinned'}
						</p>
					</Surface>
				</section>
				<section id="controls" aria-labelledby="controls-title">
					<Surface radius="medium" spacing="large" glass>
						<div class="section-heading">
							<h2 id="controls-title">Text & choice</h2>
							<span>02 / INPUT</span>
						</div>
						<div class="form-grid">
							<label>
								<span>Display name</span>
								<TextInput
									bind:value={name}
									placeholder="A little clarity"
									icon={{ name: 'person' }}
									wide
								/>
							</label>
							<div>
								<label for="finish">Finish</label>
								<Select id="finish" items={options} bind:value={selected} />
							</div>
							<label>
								<span>Small / neutral</span>
								<TextInput size="small" variant="neutral" placeholder="Compact input" wide />
							</label>
							<label>
								<span>Large / soft</span>
								<TextInput size="large" variant="soft" value="A brighter layer" wide />
							</label>
							<label>
								<span>Disabled input</span>
								<TextInput value="Read only preview" disabled wide />
							</label>
							<div>
								<label for="disabled-finish">Disabled select</label>
								<Select id="disabled-finish" items={options} value="mist" disabled />
							</div>
							<div>
								<label for="multiple-finish">Multiple finishes</label>
								<Select id="multiple-finish" items={options} bind:value={multiple} size="large" />
							</div>
							<div>
								<label for="empty-finish">Empty options</label>
								<Select
									id="empty-finish"
									items={[]}
									size="small"
									emptyMessage={{ message: 'No finishes available' }}
								/>
							</div>
						</div>
						<form
							onsubmit={(event) => {
								event.preventDefault();
								save();
							}}
							novalidate
						>
							<label>
								<span>Email / validation</span>
								<TextInput
									type="email"
									bind:value={email}
									placeholder="you@example.com"
									aria-invalid={invalid}
									aria-describedby="email-feedback"
									wide
								/>
							</label>
							<p id="email-feedback" role={invalid ? 'alert' : 'status'} class:error={invalid}>
								{feedback}
							</p>
							<div data-actions>
								<Button
									type="submit"
									label={busy ? 'Loading…' : 'Validate email'}
									disabled={busy}
									aria-busy={busy}
									color="primary"
									variant="filled"
								/>{#if busy}<Spinner label="Preview loading" /><Button
										label="Finish preview"
										onClick={() => {
											busy = false;
											feedback = 'Preview complete. No data sent.';
										}}
									/>{/if}
							</div>
						</form>
					</Surface>
				</section>
				<section aria-labelledby="selection-title">
					<Surface radius="medium" spacing="large" glass>
						<div class="section-heading">
							<h2 id="selection-title">Selection</h2>
							<span>03 / NATIVE</span>
						</div>
						<div data-actions>
							<label class="check">
								<Checkbox bind:checked />
								<span>Keep it clear</span>
							</label>
							<label class="check">
								<Checkbox disabled checked />
								<span>Disabled</span>
							</label>
							<label class="check">
								<Checkbox aria-invalid="true" />
								<span>Required choice</span>
							</label>
						</div>

						<div>
							<p class="field-title">Single choice / arrow keys</p>
							<PillChoiceGroup
								items={choices}
								bind:selection={choice}
								color="primary"
								variant="soft"
								animateSelected
								aria-label="Glass finish"
							/>
						</div>
						<div>
							<p class="field-title">Multiple choice / Space</p>
							<PillChoiceGroup
								items={[
									{ id: 'blur', label: 'Blur' },
									{ id: 'highlight', label: 'Highlight' },
									{ id: 'tint', label: 'Tint' }
								]}
								bind:selection={extras}
								color="secondary"
								aria-label="Material effects"
							/>
						</div>
						<PillChoiceGroup
							items={choices}
							selection="clear"
							disabled
							aria-label="Disabled finishes"
						/>
					</Surface>
				</section>
				<section aria-labelledby="pills-title">
					<Surface radius="medium" spacing="large" glass>
						<div class="section-heading">
							<h2 id="pills-title">Pills & icons</h2>
							<span>04 / DETAIL</span>
						</div>
						<div data-actions>
							<Pill label="Neutral" color="primary" /><Pill
								label="Soft"
								color="secondary"
								variant="soft"
							/><Pill label="Filled" color="primary" variant="filled" />
							<Pill label="Swoosh" swoosh color="primary" variant="soft" />
						</div>
						<div data-actions>
							{#each ['info', 'success', 'warning', 'error', 'muted'] as const as color (color)}<Pill
									label={color}
									{color}
									variant="soft"
								/>{/each}
						</div>

						<div data-actions>
							<Pill
								label="Activate pill"
								onClick={() => clicks++}
								icon={{ name: 'touch_app' }}
							/>{#if removable}<Pill
									label="Removable"
									onDelete={() => (removable = false)}
								/>{:else}<Button
									label="Restore pill"
									size="small"
									onClick={() => (removable = true)}
								/>{/if}
						</div>
						<PillGroup
							items={tags}
							onDelete={(id) => (tags = tags.filter((tag) => tag.id !== id))}
							variant="soft"
							color="primary"
							aria-label="Removable layers"
						/>
						<Button
							label="Restore layers"
							size="small"
							onClick={() =>
								(tags = [
									{ id: 'layers', label: 'Layers' },
									{ id: 'light', label: 'Light' },
									{ id: 'depth', label: 'Depth' }
								])}
						/>
						<div data-actions>
							<Icon name="water_drop" label="Water drop" color="primary" />
							<Icon name="favorite" filled label="Filled heart" color="secondary" />
						</div>
					</Surface>
				</section>
				<section aria-labelledby="feedback-title">
					<Surface radius="medium" spacing="medium" glass>
						<div class="section-heading">
							<h2 id="feedback-title">Progress & loading</h2>
							<span>05 / FEEDBACK</span>
						</div>
						<p class="field-title">Determinate / 68%</p>
						<Progress value={0.68} label="Determinate progress" size="large" />
						<p class="field-title">Indeterminate</p>
						<Progress label="Indeterminate progress" size="small" />
						<label for="seek">Seekable / {Math.round(progress * 100)}%</label>
						<Progress id="seek" value={progress} onSeek={(value) => (progress = value)} />
						<Progress value={0.35} onSeek={() => {}} disabled label="Disabled progress" />
						<Spinner label="Loading preview" />
						<p class="note">Loading stays visible with reduced motion enabled.</p>
					</Surface>
				</section>
				<section aria-labelledby="overlays-title">
					<Surface radius="medium" spacing="large" glass>
						<div class="section-heading">
							<h2 id="overlays-title">Surfaces & overlays</h2>
							<span>06 / DEPTH</span>
						</div>
						<div class="surface-samples">
							{#each ['neutral', 'soft', 'filled'] as const as variant (variant)}<Surface
									{variant}
									color="primary"
									radius="medium"
									spacing="medium"
									shadow="small"
								>
									<Icon name="layers" size="large" />
									<strong>{variant}</strong>
								</Surface>{/each}
						</div>
						<Surface
							variant="soft"
							radius="medium"
							spacing="medium"
							orientation="horizontal"
							shadow="medium"
						>
							<Icon name="filter_drama" size="large" />
							<div>
								<strong>Nested glass</strong>
								<p>Readable surfaces at every depth.</p>
							</div>
						</Surface>
						<div data-actions>
							<Popover bind:open={popover} radius="medium" spacing="large" shadow="large">
								{#snippet trigger()}<Button
										label="Open popover"
										color="primary"
										variant="soft"
										aria-expanded={popover}
										onClick={() => (popover = !popover)}
									/>{/snippet}
								<strong>A floating layer</strong>
								<p>Native popover. Escape or click outside to close.</p>
								<Button label="Close popover" size="small" onClick={() => (popover = false)} />
							</Popover>
							<Button
								label="Open dialog"
								color="primary"
								variant="filled"
								onClick={() => (dialog = true)}
							/>
						</div>
						<p class="note">The native dialog traps focus and restores it on close.</p>
					</Surface>
				</section>
				<section id="tabs" aria-labelledby="tabs-title">
					<Surface radius="medium" spacing="large" glass>
						<div class="section-heading">
							<h2 id="tabs-title">Tabs</h2>
							<span>07 / NAVIGATION</span>
						</div>
						<p data-muted>Fit, fill or vertical. The selected view owns its content.</p>
						<div class="tab-example">
							<p class="field-title">Horizontal / fit</p>
							<Tabs
								items={views}
								bind:value={view}
								label="Material views"
								onChange={(id) =>
									(tabFeedback = `${views.find((item) => item.id === id)?.label} view selected.`)}
							/>
							<div class="tab-content" aria-live="polite">
								<strong>{viewContent[view].title}</strong>
								<p>{viewContent[view].text}</p>
							</div>
							<p class="note">{tabFeedback} Swipe the strip when space is narrow.</p>
						</div>
						<div class="tab-example">
							<p class="field-title">Horizontal / fill · filled icons</p>
							<Tabs
								items={finishes}
								bind:value={finish}
								width="fill"
								filled
								label="Glass finish preview"
							/>
							<div class="finish-preview" data-finish={finish} aria-live="polite">
								<Icon
									name={finishes.find((item) => item.id === finish)?.icon ?? 'water_drop'}
									size="large"
								/>
								<strong>{finishes.find((item) => item.id === finish)?.label} glass</strong>
							</div>
						</div>
						<div class="tab-example">
							<p class="field-title">Vertical / arrow up and down</p>
							<div class="vertical-tabs">
								<Tabs
									items={layers}
									bind:value={layer}
									orientation="vertical"
									label="Glass layers"
								/>
								<div class="tab-content" aria-live="polite">
									<strong>{layers.find((item) => item.id === layer)?.label}</strong>
									<p>{layerContent[layer]}</p>
								</div>
							</div>
						</div>
					</Surface>
				</section>
			</div>
			<AdditionalComponents />
			<section id="usage" class="usage" aria-labelledby="usage-title">
				<div>
					<p class="eyebrow">USE GLASSY</p>
					<h2 id="usage-title">One theme. Native controls.</h2>
					<p>Wrap the components in Theme. Material Symbols load automatically.</p>
					<p>
						Inter is optional. <a href={resolve('themes#glassy')}>
							View setup in the docs <Icon name="north_east" />
						</a>
					</p>
				</div>
				<pre><code>&lt;script&gt;
  import &#123; Theme, Button &#125;
    from 'bref-ui-themes/glassy';
&lt;/script&gt;

&lt;Theme&gt;
  &lt;Button label="Continue" variant="filled" /&gt;
&lt;/Theme&gt;</code></pre>
			</section>
		</main>
		<footer>
			<div>
				<p class="eyebrow">GLASSY / BREF</p>
				<h2>Build with Glassy.</h2>
			</div>
			<div class="footer-actions">
				<a class="back-to-docs" href={resolve('themes#glassy')} aria-label="Back to Bref-ui docs">
					<img src={asset('favicon.svg')} alt="" width="40" height="40" />
					<span>
						<strong>bref / ui</strong>
						<span>Back to docs</span>
					</span>
				</a>
				<GithubStars />
			</div>
		</footer>
		<Dialog
			bind:open={dialog}
			header={{
				title: 'A clearer layer',
				icon: { name: 'layers' },
				description: 'Native dialog, glass styling. Try Tab, Shift+Tab and Escape.'
			}}
			footer={{
				primary: { label: 'Done', onClick: () => (dialog = false) },
				secondary: { label: 'Cancel', onClick: () => (dialog = false) }
			}}
		>
			<div class="dialog-content">
				<Pill label="Focus stays here" color="primary" variant="soft" />
				<label>
					<span>Layer name</span>
					<TextInput placeholder="Untitled layer" wide />
				</label>
				<Surface variant="soft" spacing="medium" radius="medium">
					<p>The stronger overlay tint keeps text readable above every surface.</p>
				</Surface>
			</div>
		</Dialog>
	</div>
</Theme>

<style>
	main {
		min-width: 0;
		scroll-behavior: smooth;
		scroll-padding-block: 24px;
	}
	h2 {
		font-weight: 500;
		line-height: 1.15;
	}
	label {
		display: grid;
		gap: 8px;
	}
	p {
		line-height: 1.7;
	}
	[data-muted] {
		color: var(--color-muted);
	}
	[data-actions] {
		display: flex;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
	}
	@media (prefers-reduced-motion: reduce) {
		main {
			scroll-behavior: auto;
		}
	}

	[data-glassy-gallery] {
		display: flow-root;
		overflow-x: clip;
		max-width: 1280px;
		padding: 0 40px;
		margin: auto;
	}
	nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		padding: 16px 20px;
		margin-top: 20px;
		border: 1px solid #ffffff80;
		border-radius: 24px;
		background: #ffffff40;
		-webkit-backdrop-filter: blur(24px);
		backdrop-filter: blur(24px);
	}
	a {
		color: inherit;
		text-decoration: none;
	}
	.brand,
	nav > a {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.brand strong {
		font-size: 20px;
		font-weight: 600;
		letter-spacing: -0.035em;
	}
	.brand span {
		padding: 0 4px;
		font-weight: 300;
	}
	.intro {
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: center;
		gap: 64px;
		padding: 56px 0 48px;
	}
	.intro > div {
		min-width: 0;
	}
	.eyebrow {
		font-size: 10px;
		letter-spacing: 0.15em;
		font-weight: 650;
	}
	h1 {
		font-size: clamp(56px, 5vw, 72px);
		letter-spacing: -0.06em;
		margin: 20px 0;
		line-height: 1.05;
		font-weight: 600;
	}
	.lede {
		max-width: 360px;
		color: var(--color-muted);
		font-size: 16px;
		margin-bottom: 24px;
	}
	.version,
	.material-caption {
		font-size: 11px;
		color: var(--color-muted);
	}
	pre {
		display: block;
		font-size: 11px;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
		padding: 12px 14px;
		border-radius: 12px;
		background: #ffffff30;
		border: 1px solid #ffffff50;
		margin-top: 24px;
		color: var(--color-muted);
	}
	.material {
		box-sizing: border-box;
		position: relative;
		padding: 28px 24px;
		isolation: isolate;
	}
	.orb {
		position: absolute;
		border-radius: 45% 55% 50% 50%;
		z-index: -1;
	}
	.orb-blue {
		width: 260px;
		height: 340px;
		right: 0;
		top: -24px;
		transform: rotate(-24deg);
		background: linear-gradient(155deg, #d7e8ec, #88a8b8 55%, #607f93);
		box-shadow:
			inset 8px 12px 24px #ffffff50,
			0 24px 48px #607f9320;
	}
	.orb-peach {
		width: 220px;
		height: 160px;
		left: -20px;
		bottom: 16px;
		transform: rotate(18deg);
		background: linear-gradient(145deg, #f4eee2, #baa993);
	}
	.specimen-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.material h2 {
		font-size: 30px;
		font-weight: 600;
		letter-spacing: -0.04em;
	}
	.material p {
		font-size: 13px;
		color: var(--color-muted);
	}
	.material-caption {
		display: block;
		text-align: center;
		letter-spacing: 0.12em;
		margin-top: 24px;
	}
	.collection-heading {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 20px;
		border-top: 1px solid #24344212;
		padding: 30px 0 24px;
	}
	.collection-heading h2 {
		font-size: 24px;
		letter-spacing: -0.04em;
	}
	.collection-heading p {
		font-size: 12px;
		color: var(--color-muted);
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		align-items: start;
		gap: 40px;
	}
	section {
		margin: 0;
		min-width: 0;
		scroll-margin-top: 20px;
	}
	.section-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}
	.section-heading h2 {
		font-size: 19px;
		font-weight: 600;
		letter-spacing: -0.03em;
	}
	.section-heading > span {
		font-size: 9px;
		color: var(--color-muted);
		letter-spacing: 0.1em;
	}
	#tabs {
		grid-column: 1 / -1;
	}
	section p {
		font-size: 12px;
	}
	section [data-actions] {
		gap: 10px;
	}
	.row-label {
		width: 54px;
		color: var(--color-muted);
		font-size: 11px;
	}
	.form-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 20px 16px;
	}
	label,
	.field-title {
		font-size: 12px;
		font-weight: 500;
	}
	.form-grid > div > label {
		margin-bottom: 8px;
	}
	form {
		display: grid;
		gap: 12px;
		border-top: 1px solid #24344212;
		padding-top: 20px;
	}
	.error {
		color: var(--color-error);
	}
	.check {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}
	.field-title {
		margin-bottom: 12px;
	}
	.note {
		color: var(--color-muted);
	}
	.surface-samples {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 12px;
		font-size: 12px;
	}
	.tab-example {
		min-width: 0;
	}
	.tab-content {
		min-width: 0;
		padding: 16px 4px 0;
	}
	.tab-content strong {
		font-size: 13px;
	}
	.tab-content p {
		margin-block: 8px 0;
		color: var(--color-muted);
	}
	.vertical-tabs {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: 16px;
		align-items: start;
	}
	.finish-preview {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 20px;
		margin-top: 16px;
		border: 1px solid #ffffff99;
		border-radius: 1rem;
		background: #ffffff44;
		font-size: 13px;
	}
	.finish-preview[data-finish='frosted'] {
		background: #ffffffb8;
	}
	.finish-preview[data-finish='tinted'] {
		background: #a4c9e070;
	}
	.dialog-content {
		display: grid;
		gap: 24px;
	}
	footer {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 16px;
		align-items: center;
		border-top: 1px solid #24344212;
		padding: 48px 0;
	}
	.usage {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 48px;
		align-items: center;
		padding-block: 64px;
		border-top: 1px solid #24344212;
	}
	.usage > div {
		display: grid;
		gap: 16px;
	}
	.usage h2,
	footer h2 {
		font-size: clamp(24px, 3vw, 36px);
		letter-spacing: -0.04em;
	}
	.usage p {
		font-size: 14px;
		color: var(--color-muted);
	}
	.usage a {
		color: var(--color-primary);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.usage pre {
		margin: 0;
		padding: 24px;
		font-size: 13px;
		line-height: 1.7;
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
		border-radius: 16px;
		background: #1d4ed8;
		color: white;
	}
	.back-to-docs img {
		padding: 3px;
		border-radius: 6px;
		background: white;
	}
	.back-to-docs > span {
		display: grid;
		gap: 4px;
		font-size: 13px;
	}
	.back-to-docs strong {
		font-size: 22px;
		font-weight: 700;
		line-height: 1;
		letter-spacing: -0.04em;
	}
	.back-to-docs:hover {
		background: #1e40af;
	}
	a:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 4px;
	}
	[data-skip] {
		position: fixed;
		top: 8px;
		left: 8px;
		padding: 12px;
		background: var(--color-background);
		z-index: 10;
		transform: translateY(-160%);
	}
	[data-skip]:focus {
		transform: none;
	}
	@media (max-width: 1000px) {
		.intro {
			gap: 24px;
		}
	}
	@media (max-width: 760px) {
		[data-glassy-gallery] {
			padding: 0 20px;
		}
		nav {
			flex-wrap: wrap;
			padding: 16px;
		}
		.intro {
			grid-template-columns: 1fr;
			padding: 40px 0 32px;
			gap: 32px;
		}
		.material {
			max-width: 520px;
			margin: auto;
			width: 100%;
		}
		.orb-blue {
			width: 230px;
			height: 280px;
			right: 24px;
			transform: rotate(-14deg);
		}
		.grid,
		.usage {
			grid-template-columns: 1fr;
		}
		.collection-heading {
			flex-direction: column;
			gap: 10px;
		}
	}
	@media (max-width: 420px) {
		.form-grid {
			grid-template-columns: 1fr;
		}
		.material {
			padding: 16px 8px;
		}
		.section-heading {
			align-items: flex-start;
		}
		.section-heading > span {
			white-space: nowrap;
		}
		.row-label {
			width: 100%;
		}
	}
	@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
		nav {
			background: var(--color-background);
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
	}
	@media (forced-colors: active) {
		nav {
			background: Canvas;
			border-color: CanvasText;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
	}
</style>
