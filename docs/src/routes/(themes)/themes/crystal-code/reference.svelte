<script lang="ts">
	import AdditionalComponents from './additional-components.svelte';
	import Examples from './examples.svelte';
	import * as Components from 'bref-ui-themes/crystal-code';
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
	import type { TabItemDataProps } from 'bref-ui/types';
	const variants = ['neutral', 'soft', 'filled'] as const;
	const sizes = ['x-small', 'small', 'medium', 'large', 'x-large'] as const;
	let project = $state('');
	let submitted = $state(false);
	let saved = $state(false);
	let format = $state(true);
	let language = $state<string | string[]>('ts');
	let checks = $state<string | string[]>(['types']);
	let tags = $state([
		{ id: 'svelte', label: 'Svelte' },
		{ id: 'typescript', label: 'TypeScript' },
		{ id: 'css', label: 'CSS' }
	]);
	let progress = $state(0.42);
	let building = $state(false);
	let dialog = $state(false);
	let popover = $state(false);
	let panel = $state('overview');
	const panels: TabItemDataProps[] = [
		{ id: 'overview', label: 'Overview', icon: 'dashboard' },
		{ id: 'activity', label: 'Activity', icon: 'history' },
		{ id: 'settings', label: 'Settings', icon: 'tune' },
		{ id: 'remote', label: 'Remote', icon: 'cloud_off', disabled: true }
	];
	const options = [
		{ id: 'ts', label: 'TypeScript', icon: { name: 'code' as const } },
		{ id: 'js', label: 'JavaScript' },
		{ id: 'locked', label: 'Python · unavailable', disabled: true }
	];
</script>

<div class="collection">
	<div class="collection-heading">
		<p class="eyebrow">THE COMPONENT COLLECTION</p>
		<h2>
			Small details.
			<br />
			A complete workspace.
		</h2>
		<p class="lede">Familiar controls, composed for the everyday work of building.</p>
	</div>
	<section aria-labelledby="actions-title">
		<div class="section-heading">
			<div>
				<p class="eyebrow">01 / ACTIONS</p>
				<h3 id="actions-title">One action. Three expressions.</h3>
			</div>
			<code>Button</code>
		</div>
		<div class="actions-surface">
			<div class="row">
				{#each variants as variant (variant)}
					<Button
						label="Save workspace"
						{variant}
						color="primary"
						icon={{ name: 'save' }}
						onClick={() => (saved = true)}
					/>
				{/each}
			</div>
			<div class="row" role="group" aria-label="Button sizes">
				{#each sizes as size, index (size)}
					<Button
						label={['XS', 'S', 'M', 'L', 'XL'][index]}
						{size}
						variant="soft"
						color="primary"
						icon={{ name: 'save' }}
					/>
				{/each}
			</div>
			<div class="row secondary-actions">
				<Button label="Deploy unavailable" disabled icon={{ name: 'cloud_upload' }} />
				<Button
					href="#workspace-settings"
					label="Workspace settings"
					icon={{ name: 'arrow_downward' }}
				/>
				<span role="status">
					{saved ? 'Workspace saved for this preview.' : 'Choose a save action to try it.'}
				</span>
			</div>
		</div>
		<Examples section="actions" />
	</section>
	<section id="workspace-settings" aria-labelledby="settings-title">
		<div class="section-heading">
			<div>
				<p class="eyebrow">02 / PREFERENCES</p>
				<h3 id="settings-title">Make the workspace feel right.</h3>
			</div>
			<code>TextInput · Checkbox · Select</code>
		</div>
		<div class="two-columns">
			<form
				class="panel stack"
				novalidate
				onsubmit={(event) => {
					event.preventDefault();
					submitted = true;
				}}
			>
				<h4>Project settings</h4>
				<label for="project-name">Project name</label>
				<TextInput
					id="project-name"
					bind:value={project}
					required
					placeholder="A new idea"
					wide
					aria-invalid={submitted && !project.trim()}
					aria-describedby="project-feedback"
				/>
				<p
					id="project-feedback"
					class:error={submitted && !project.trim()}
					role={submitted && !project.trim() ? 'alert' : 'status'}
				>
					{submitted
						? project.trim()
							? `Settings saved for ${project}.`
							: 'Enter a project name.'
						: 'Give this workspace a name.'}
				</p>
				<label for="project-language">Language</label>
				<Select id="project-language" items={options} bind:value={language} />
				<label class="check"><Checkbox bind:checked={format} /> Format on save</label>
				<Button type="submit" label="Save settings" variant="soft" color="primary" />
			</form>
			<div class="panel stack">
				<h4>Managed preferences</h4>
				<label for="readonly-path">Workspace path · read only</label>
				<TextInput id="readonly-path" value="~/projects/crystal-code" readonly wide />
				<label for="managed-value">Remote sync · disabled</label>
				<TextInput id="managed-value" value="Managed by the workspace" disabled wide />
				<label class="check"><Checkbox checked disabled /> Policy enabled</label>
				<label class="check"><Checkbox disabled /> Remote access unavailable</label>
				<p class="muted">Changes stay local to this preview.</p>
			</div>
		</div>
		<Examples section="forms" />
	</section>
	<section aria-labelledby="organize-title">
		<div class="section-heading">
			<div>
				<p class="eyebrow">03 / ORGANIZE</p>
				<h3 id="organize-title">Keep the useful things close.</h3>
			</div>
			<code>Pill · PillGroup · PillChoiceGroup</code>
		</div>
		<div class="two-columns">
			<div class="panel stack">
				<h4>Project labels</h4>
				<div class="row">
					{#each variants as variant (variant)}<Pill
							label={variant}
							{variant}
							color="secondary"
							icon={{ name: 'label' }}
						/>{/each}
				</div>
				<PillGroup items={tags} onDelete={(id) => (tags = tags.filter((tag) => tag.id !== id))} />
				<Button
					label="Restore labels"
					icon={{ name: 'restart_alt' }}
					onClick={() =>
						(tags = [
							{ id: 'svelte', label: 'Svelte' },
							{ id: 'typescript', label: 'TypeScript' },
							{ id: 'css', label: 'CSS' }
						])}
				/>
			</div>
			<div class="panel stack">
				<h4>Checks before a build</h4>
				<PillChoiceGroup
					items={[
						{ id: 'types', label: 'Types' },
						{ id: 'lint', label: 'Lint' },
						{ id: 'tests', label: 'Tests' }
					]}
					bind:selection={checks}
					variant="soft"
					color="primary"
					aria-label="Build checks"
				/>
				<p class="muted">
					{Array.isArray(checks) && checks.length
						? `${checks.length} checks selected.`
						: 'No checks selected.'}
				</p>
				<Pill label="Remote checks unavailable" aria-disabled="true" icon={{ name: 'lock' }} />
			</div>
		</div>
		<Examples section="organize" />
	</section>
	<section aria-labelledby="feedback-title">
		<div class="section-heading">
			<div>
				<p class="eyebrow">04 / FEEDBACK</p>
				<h3 id="feedback-title">Progress, at a glance.</h3>
			</div>
			<code>Progress · Spinner · Icon</code>
		</div>
		<div class="panel build-panel">
			<div class="stack">
				<div class="row">
					<Icon name="terminal" color="primary" />
					<h4>Workspace build</h4>
				</div>
				<p class="muted">Seek with the pointer or arrow keys to inspect progress.</p>
				<Progress value={progress} onSeek={(value) => (progress = value)} label="Build progress" />
				<p class="mono">{Math.round(progress * 100)}% complete</p>
			</div>
			<div class="stack">
				<div class="row" role="status">
					{#if building}<Spinner label="Build running" />
						<span>Building workspace…</span>{:else}<Icon
							name="check_circle"
							color="success"
							label="Ready"
						/>
						<span>Ready for the next build.</span>{/if}
				</div>
				<Button
					label={building ? 'Finish preview build' : 'Run preview build'}
					variant="soft"
					color="primary"
					icon={{ name: building ? 'stop' : 'play_arrow' }}
					onClick={() => {
						building = !building;
						if (!building) progress = 1;
					}}
				/>
			</div>
		</div>
		<Examples section="feedback" />
	</section>
	<section aria-labelledby="context-title">
		<div class="section-heading">
			<div>
				<p class="eyebrow">05 / CONTEXT</p>
				<h3 id="context-title">A place for every detail.</h3>
			</div>
			<code>Surface · Popover · Dialog · Tabs</code>
		</div>
		<div class="two-columns">
			<Surface spacing="large" radius="large">
				<div class="stack">
					<div class="row">
						<Icon name="folder_open" color="primary" />
						<h4>crystal-code</h4>
					</div>
					<Tabs items={panels} bind:value={panel} label="Workspace views" />
					<div class="tab-content" role="region" aria-label="Selected workspace view">
						{#if panel === 'overview'}<p>A quiet workspace for the next idea.</p>
							<p class="muted">3 files · TypeScript · Local</p>
						{:else if panel === 'activity'}<p>Workspace created.</p>
							<p class="muted">No changes waiting to sync.</p>
						{:else}<label class="check"><Checkbox bind:checked={format} /> Format on save</label>
							<p class="muted">Formatting is {format ? 'enabled' : 'off'}.</p>{/if}
					</div>
				</div>
			</Surface>
			<div class="panel stack">
				<h4>Just enough context</h4>
				<p class="muted">
					An inline detail for quick answers. A dialog when the task needs more room.
				</p>
				<div class="row">
					<Popover bind:open={popover} spacing="medium">
						{#snippet trigger()}<Button
								label="Workspace details"
								icon={{ name: 'info' }}
								aria-expanded={popover}
								onClick={() => (popover = !popover)}
							/>{/snippet}
						<div class="stack">
							<h4>Local workspace</h4>
							<p>Files stay in this preview. Nothing is uploaded.</p>
							<Button label="Close details" onClick={() => (popover = false)} />
						</div>
					</Popover>
					<Button
						label="Review workspace"
						variant="soft"
						color="primary"
						onClick={() => (dialog = true)}
					/>
				</div>
			</div>
		</div>
		<Examples section="context" />
	</section>
	<AdditionalComponents components={Components} />
</div>
<Dialog
	bind:open={dialog}
	size="small"
	header={{ title: 'Workspace review', description: 'Everything is ready for the next idea.' }}
	footer={{
		primary: { label: 'Done', onClick: () => (dialog = false) },
		secondary: { label: 'Cancel', onClick: () => (dialog = false) }
	}}
>
	<div class="stack">
		<p>Project: {project.trim() || 'Untitled workspace'}</p>
		<p>Format on save: {format ? 'enabled' : 'off'}</p>
		<p>Use Escape to close and return to the review button.</p>
	</div>
</Dialog>

<style>
	.collection {
		display: grid;
		gap: 72px;
	}
	.collection-heading {
		max-width: 600px;
	}
	.eyebrow,
	code,
	.mono {
		font: 10px/1.7 var(--crystal-code-font-mono);
		color: var(--color-muted);
	}
	.eyebrow {
		letter-spacing: 0.06em;
	}
	h2 {
		margin: 20px 0;
		font-size: clamp(30px, 4vw, 48px);
		font-weight: 500;
		letter-spacing: -0.05em;
		line-height: 1.15;
	}
	h3 {
		margin-top: 12px;
		font-size: 20px;
		font-weight: 500;
		letter-spacing: -0.03em;
	}
	h4 {
		font-size: 13px;
		font-weight: 500;
	}
	p {
		font-size: 12px;
		line-height: 1.8;
	}
	.lede {
		color: var(--color-muted);
		font-size: 15px;
	}
	section {
		display: grid;
		gap: 24px;
		min-width: 0;
		scroll-margin-top: 32px;
	}
	.section-heading {
		display: flex;
		justify-content: space-between;
		align-items: end;
		flex-wrap: wrap;
		gap: 16px;
	}
	.section-heading code {
		font-size: 11px;
	}
	.two-columns {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 24px;
	}
	.panel,
	.actions-surface {
		padding: clamp(24px, 3vw, 40px);
		background: var(--crystal-code-panel);
		border-radius: 14px;
		box-shadow: var(--crystal-code-pane-shadow);
		min-width: 0;
	}
	.stack {
		display: flex;
		flex-direction: column;
		align-items: start;
		gap: 16px;
		min-width: 0;
	}
	.stack > h4 {
		margin-bottom: 8px;
	}
	.row,
	.check {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
	}
	.check {
		font-size: 12px;
	}
	.actions-surface {
		display: grid;
		gap: 24px;
	}
	.secondary-actions > span {
		color: var(--color-muted);
		font-size: 11px;
	}
	label {
		font-size: 12px;
	}
	.error {
		color: var(--color-error);
	}
	.muted {
		color: var(--color-muted);
	}
	.build-panel {
		display: grid;
		grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
		gap: 40px;
		align-items: center;
	}
	.build-panel > .stack {
		align-items: stretch;
	}
	.build-panel :global(.button) {
		align-self: start;
	}
	.tab-content {
		display: grid;
		gap: 12px;
		min-height: 90px;
		padding-block: 12px;
	}
	@media (max-width: 760px) {
		.collection {
			gap: 48px;
		}
		.two-columns,
		.build-panel {
			grid-template-columns: 1fr;
		}
		.build-panel {
			gap: 32px;
		}
	}
</style>
