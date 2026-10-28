<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import { surface, Button, Spinner, Tabs } from 'bref-ui';
	import type { TabItemDataProps } from 'bref-ui/types';
	import { createRuns } from './run-state.svelte.js';
	import RunOutput from './run-output.svelte';
	import NodeInspector from './node-inspector.svelte';
	import RunReport from './run-report.svelte';
	import RunInput from './run-input.svelte';

	const regionSurface = surface({ color: 'background', variant: 'filled', shadow: 'small' });
	const workspace = createRuns();
	let workspaceWidth = $state(864);
	const desktop = $derived(workspaceWidth > 760);
	let run = $derived(workspace.selected);
	let historyOpen = $state(false);
	const motion = $derived({
		y: prefersReducedMotion.current ? 0 : 6,
		duration: prefersReducedMotion.current ? 0 : 180
	});
	const tabs = $derived([
		{ id: 'input', label: 'Setup', icon: 'tune' },
		{ id: 'run', label: 'Run', icon: 'account_tree' },
		{
			id: 'assessment',
			label: 'Results',
			icon: 'fact_check',
			disabled: run.status !== 'completed'
		}
	] satisfies readonly TabItemDataProps[]);
	const panelLabel = $derived(tabs.find((tab) => tab.id === run.view)?.label ?? 'Run');
	let workspaceElement: HTMLElement;
	const active = $derived(run.status === 'running' || run.status === 'queued');
	const navigationRuns = $derived(
		workspace.runs.toSorted(
			(a, b) =>
				Number(b.status === 'running' || b.status === 'queued') -
				Number(a.status === 'running' || a.status === 'queued')
		)
	);
	const labels = {
		draft: 'Draft',
		queued: 'Queued',
		running: 'Running',
		completed: 'Completed',
		cancelled: 'Cancelled'
	};

	async function selectNode(index: number, focusInspector = false) {
		if (index < 0 || !run.nodes[index]) return;
		run.selectedNode = index;
		run.view = 'run';
		run.inspectorOpen = true;
		if (!desktop || focusInspector) {
			await tick();
			workspaceElement.querySelector<HTMLElement>('[data-inspector] h3')?.focus();
		}
	}

	async function selectRun(id: number) {
		workspace.select(id);
		historyOpen = false;
		if (!desktop) {
			await tick();
			workspaceElement.querySelector<HTMLElement>('[data-lifecycle-panel]')?.focus();
		}
	}

	async function newAssessment() {
		if (!workspace.createDraft()) return;
		historyOpen = false;
		await tick();
		workspaceElement.querySelector<HTMLElement>('[data-lifecycle-panel]')?.focus();
	}

	async function startAssessment() {
		if (!workspace.startRun(run)) return;
		await tick();
		workspaceElement
			.querySelector<HTMLElement>('[data-lifecycle-panel]')
			?.focus({ preventScroll: true });
	}

	async function showHistory() {
		historyOpen = !historyOpen;
		if (historyOpen) {
			await tick();
			workspaceElement.querySelector<HTMLElement>('[data-sidebar] [aria-current="true"]')?.focus();
		}
	}

	async function showWorkflow() {
		run.inspectorOpen = false;
		await tick();
		workspaceElement.querySelector<HTMLElement>('[data-node][aria-pressed="true"]')?.focus();
	}

	async function openInput() {
		run.view = 'input';
		await tick();
		workspaceElement
			.querySelector<HTMLElement>('[data-lifecycle-panel]')
			?.focus({ preventScroll: true });
	}

	onMount(() => {
		workspace.start();
		return () => workspace.stop();
	});
</script>

<svelte:head>
	<title>RunnerAI — Copy & marketing assessment</title>
	<meta
		name="description"
		content="Assess sample marketing copy for audience clarity, value proposition and a useful call to action."
	/>
</svelte:head>

<div
	data-demo-content
	id="demo-content"
	tabindex="-1"
	data-run-workspace
	data-history-open={historyOpen}
	bind:this={workspaceElement}
	bind:clientWidth={workspaceWidth}
>
	{#if desktop || historyOpen}
		<!-- svelte-ignore a11y_no_noninteractive_tabindex (Scrollable history needs keyboard access.) -->
		<aside
			tabindex="0"
			class={regionSurface}
			id="assessment-history"
			aria-label="Agent runs"
			data-sidebar
			in:fly={motion}
		>
			<a href="#demo-content" data-brand>
				<svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
					<path d="M8 21V7h7a4.5 4.5 0 0 1 0 9H8m7 0 5 5" />
				</svg>
				<h1>
					Runner
					<span>AI</span>
				</h1>
			</a>
			<Button
				label="New assessment"
				icon={{ name: 'add' }}
				data-new-run-trigger
				onClick={newAssessment}
				disabled={!workspace.canCreate}
				size="small"
				wide
			/>
			<h2 data-history-heading>Assessments</h2>
			<nav aria-label="Run history">
				<ul>
					{#each navigationRuns as item (item.id)}
						{@const isActive = item.status === 'running' || item.status === 'queued'}
						<li>
							<Button
								label={item.title}
								size="small"
								wide
								variant={run.id === item.id ? 'soft' : 'neutral'}
								aria-current={run.id === item.id ? 'true' : undefined}
								aria-label={`${item.title}, ${labels[item.status]}`}
								onClick={() => selectRun(item.id)}
							/>
							<!-- TODO(bref-ui#70): Button trailing content/loading. Overlay the status inside the item until Button supports it. -->
							{#if isActive}<span data-run-status={item.status} aria-hidden="true">
									{#if item.status === 'running'}<Spinner size="small" />{:else}{labels[
											item.status
										]}{/if}
								</span>{/if}
						</li>
					{/each}
				</ul>
			</nav>
			<p data-simulation>Local sample assessments</p>
		</aside>
	{/if}

	<!-- The main shell fades; child surfaces own the offset to avoid compounded fly movement. -->
	<div class={regionSurface} data-main in:fly={{ ...motion, y: 0 }}>
		<header class={regionSurface} data-run-header in:fly={motion}>
			<div data-header-title>
				<div data-history-trigger>
					<Button
						icon={{ name: 'menu' }}
						aria-label="Show assessment history"
						aria-expanded={historyOpen}
						aria-controls="assessment-history"
						size="small"
						onClick={showHistory}
					/>
				</div>
				<div>
					<p data-run-kicker>
						Run {String(run.id).padStart(2, '0')}
						<span>/</span>
						{labels[run.status]}
					</p>
					<h2>{run.title}</h2>
				</div>
			</div>
			{#if run.status !== 'draft'}<Button
					label={active ? 'Cancel run' : 'Retry run'}
					icon={{ name: active ? 'stop' : 'replay', filled: active }}
					size="small"
					variant="filled"
					color="primary"
					onClick={() => (active ? workspace.cancel(run) : workspace.retry(run))}
				/>{/if}
		</header>
		<div data-lifecycle-tabs in:fly={motion}>
			<Tabs
				items={tabs}
				bind:value={run.view}
				label="Assessment lifecycle"
				size="small"
				filled={false}
			/>
		</div>
		<div role="tabpanel" aria-label={panelLabel} tabindex="0" data-lifecycle-panel>
			{#key run.id}
				{#if run.view === 'input'}
					<RunInput
						{run}
						onConfigure={(config) => workspace.configure(run, config)}
						onStart={startAssessment}
					/>
				{:else if run.view === 'assessment' && run.status === 'completed'}
					<!-- svelte-ignore a11y_no_noninteractive_tabindex (Scrollable results need keyboard access.) -->
					<div
						role="region"
						aria-label="Assessment results"
						tabindex="0"
						data-assessment-view
						in:fly={motion}
					>
						<RunReport
							{run}
							onApply={(index) => workspace.applyEdit(run, index)}
							onInspect={(index) =>
								selectNode(
									run.nodes.findIndex((node) => node.insightIndex === index),
									true
								)}
						/>
					</div>
				{:else if run.status === 'draft'}
					<div data-run-empty in:fly={motion}>
						<h3>Run not started</h3>
						<p>Choose the copy and review scope in Setup.</p>
						<Button label="Open setup" icon={{ name: 'tune' }} size="small" onClick={openInput} />
					</div>
				{:else}
					<div data-work-area data-inspector-open={run.inspectorOpen}>
						{#if desktop || !run.inspectorOpen}
							<div data-workflow-view>
								<RunOutput {run} selectedIndex={run.selectedNode} onSelect={selectNode} />
							</div>
						{/if}
						{#if desktop || run.inspectorOpen}
							<div data-inspector-view>
								<div data-inspector-back>
									<Button
										label="Back to workflow"
										icon={{ name: 'arrow_back' }}
										size="small"
										onClick={showWorkflow}
									/>
								</div>
								{#key run.selectedNode}<NodeInspector
										{run}
										selectedIndex={run.selectedNode}
									/>{/key}
							</div>
						{/if}
					</div>
				{/if}
			{/key}
		</div>
	</div>
	<p role="status" data-visually-hidden>
		Run {run.id}: {labels[run.status]}.
		{run.status === 'draft'
			? 'Configure the assessment in Setup.'
			: `${run.step} of ${run.nodes.length} steps completed.`}
		{run.status === 'completed' ? 'Results are ready in the Results tab.' : ''}
	</p>
</div>

<style>
	[data-demo-content] {
		--run-region-radius: 20px;
		--run-inner-radius: 16px;
		display: grid;
		grid-template-columns: 224px minmax(0, 1fr);
		gap: 16px;
		padding: 16px;
		height: max(480px, calc(100dvh - var(--demo-footer-height, 57px)));
		min-height: 0;
		max-width: 1680px;
		margin: auto;
		background: var(--color-background);
	}
	[data-sidebar] {
		overflow: auto;
		overscroll-behavior: contain;
		scroll-padding: 8px;
		scrollbar-width: thin;
		min-width: 0;
		display: flex;
		flex-direction: column;
		min-height: 0;
		padding: 22px 12px 18px;

		border: 0;
		border-radius: var(--run-region-radius);
	}
	[data-brand] {
		display: flex;
		align-items: center;
		gap: 10px;
		width: fit-content;
		margin: 0 8px 24px;
		color: color-mix(in srgb, var(--color-primary) 55%, black);
		text-decoration: none;
	}
	[data-brand] svg {
		width: 30px;
		height: 30px;
		border-radius: 8px;
		background: var(--color-primary);
		stroke: color-mix(in srgb, var(--color-primary) 10%, white);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	h1 {
		margin: 0;
		font:
			600 21px/1.2 'Inter Variable',
			sans-serif;
		letter-spacing: -0.9px;
	}
	h1 span {
		font-weight: 400;
		color: var(--color-primary);
	}
	[data-history-heading] {
		margin: 24px 10px 8px;
		color: var(--color-muted);
		font-size: 12px;
		font-weight: 500;
	}
	[data-sidebar] > * {
		flex-shrink: 0;
	}
	[data-sidebar] nav {
		flex: 1 0 auto;
		padding: 4px;
		margin-inline: -4px;
	}
	[data-sidebar] ul {
		display: grid;
		gap: 2px;
		list-style: none;
		padding: 0;
		margin: 0;
	}
	[data-run-status] {
		position: absolute;
		inset-block: 0;
		inset-inline-end: 0.75rem;
		display: flex;
		align-items: center;
		pointer-events: none;
		color: var(--color-muted);
		font-size: 11px;
		white-space: nowrap;
	}
	[data-simulation] {
		color: var(--color-muted);
		font-size: 12px;
		margin: 16px 10px 0;
		padding-top: 8px;
	}
	[data-main] {
		padding: 12px;
		gap: 8px;
		border: 0;
		border-radius: var(--run-region-radius);
		display: flex;
		flex-direction: column;
		min-width: 0;
		min-height: 0;
	}
	[data-run-header] {
		flex-shrink: 0;
		min-height: 82px;
		padding: 16px 20px;

		border: 0;
		border-radius: var(--run-inner-radius);
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
	}
	[data-run-kicker] {
		margin: 0 0 5px;
		color: var(--color-muted);
		font-size: 12px;
	}
	[data-run-kicker] span {
		padding-inline: 7px;
		opacity: 0.5;
	}
	[data-run-header] h2 {
		margin: 0;
		font-size: clamp(18px, 1.8vw, 23px);
		font-weight: 550;
		line-height: 1.35;
		letter-spacing: -0.6px;
	}
	[data-work-area] {
		display: grid;
		flex: 1;
		grid-template-columns: minmax(0, 1fr) 280px;
		grid-template-rows: minmax(0, 1fr);
		min-height: 0;
		gap: 12px;
		background: transparent;
	}
	[data-workflow-view],
	[data-inspector-view] {
		display: grid;
		min-height: 0;
		min-width: 0;
	}
	[data-inspector-view] {
		grid-column: 2;
		grid-row: 1 / -1;
		margin: 0;
		background: transparent;
	}
	[data-lifecycle-tabs] {
		flex-shrink: 0;
		min-width: 0;
		padding: 2px 4px;
	}
	[data-lifecycle-panel] {
		border-radius: var(--run-inner-radius);
		display: grid;
		grid-template-rows: minmax(0, 1fr);
		flex: 1;
		min-width: 0;
		min-height: 0;
	}
	[data-lifecycle-panel]:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: -4px;
	}
	[data-assessment-view]:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: -4px;
	}
	[data-assessment-view] {
		min-width: 0;
		min-height: 0;
		overflow: auto;
		overscroll-behavior: contain;
		scroll-padding: 8px;
		padding: 28px;
		background: var(--run-surface);
		scrollbar-width: thin;
	}
	[data-workflow-view] {
		border-radius: var(--run-inner-radius);
		grid-template-rows: minmax(0, 1fr);
	}
	[data-run-empty] {
		min-height: 0;
		overflow: auto;
		padding: 64px 32px;
		max-width: 600px;
	}
	[data-run-empty] h3 {
		margin: 0 0 14px;
		font-size: 24px;
		font-weight: 550;
	}
	[data-run-empty] p {
		color: var(--color-muted);
		font-size: 13px;
		line-height: 1.8;
		margin-bottom: 24px;
	}
	[data-history-trigger],
	[data-inspector-back] {
		display: none;
	}
	[data-header-title] {
		display: flex;
		align-items: center;
		gap: 12px;
		min-width: 0;
	}
	@container demo (max-width: 1150px) {
		[data-demo-content] {
			grid-template-columns: 200px minmax(0, 1fr);
		}
		[data-sidebar] {
			padding-inline: 12px;
		}
		[data-work-area] {
			grid-template-columns: minmax(0, 1fr) 260px;
		}
	}
	@container demo (max-width: 900px) and (min-width: 761px) {
		[data-demo-content] {
			grid-template-columns: 180px minmax(0, 1fr);
		}
		[data-work-area] {
			grid-template-columns: minmax(0, 1fr) 250px;
		}
		[data-brand] {
			gap: 7px;
			margin-inline: 2px;
		}
		h1 {
			font-size: 19px;
		}
		[data-run-header] {
			padding-inline: 20px;
		}
	}
	@container demo (max-width: 760px) {
		[data-demo-content] {
			--run-region-radius: 18px;
			--run-inner-radius: 14px;
			padding: 10px;
			gap: 10px;
			display: flex;
			flex-direction: column;
		}
		[data-sidebar] {
			display: none;
			order: 2;
			padding: 20px 14px;
		}
		[data-run-header] {
			flex-wrap: wrap;
			padding: 14px;
			gap: 10px;
			min-height: 82px;
		}
		[data-run-header] h2 {
			font-size: 18px;
			overflow-wrap: anywhere;
		}
		[data-main] {
			flex: 1;
			padding: 8px;
		}
		[data-header-title] {
			flex: 1 1 180px;
			gap: 8px;
		}
		[data-header-title] > div {
			min-width: 0;
		}
		[data-history-trigger] {
			flex-shrink: 0;
		}
		[data-history-trigger],
		[data-inspector-back] {
			display: block;
		}
		[data-lifecycle-tabs] {
			padding: 2px 4px;
		}
		[data-assessment-view] {
			padding: 24px 18px;
		}
		[data-work-area] {
			grid-template-columns: minmax(0, 1fr);
		}
		[data-inspector-view] {
			grid-column: 1;
			grid-template-rows: auto minmax(0, 1fr);
			margin: 0;
		}
		[data-inspector-back] {
			margin-bottom: 8px;
		}
		[data-history-open='true'] [data-lifecycle-panel],
		[data-history-open='true'] [data-lifecycle-tabs] {
			display: none;
		}
		[data-history-open='true'] [data-main] {
			flex: none;
		}
		[data-history-open='true'] [data-sidebar] {
			display: flex;
			flex: 1;
			min-height: 0;
		}
		[data-simulation] {
			margin-top: 28px;
		}
	}
	[data-sidebar] li {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
	}
	/* TODO(bref-ui#69): drop this override once Button supports an align prop.
	   Approved exception: bref-ui Button has no alignment prop, so sidebar items start-align here. */
	[data-sidebar] :global(:is([data-new-run-trigger], li > button)) {
		justify-content: flex-start;
		text-align: start;
	}
	/* TODO(bref-ui#70): Button trailing content/loading. Reserve room for the overlaid run status. */
	[data-sidebar] li:has([data-run-status='running']) > :global(button) {
		padding-inline-end: 2.25rem;
	}
	[data-sidebar] li:has([data-run-status='queued']) > :global(button) {
		padding-inline-end: 3.75rem;
	}
	[data-visually-hidden] {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
</style>
