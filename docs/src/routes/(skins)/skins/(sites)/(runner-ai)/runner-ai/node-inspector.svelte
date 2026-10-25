<script lang="ts">
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import { surface, Icon, Spinner, Progress } from 'bref-ui';
	import { copyLabels, samples } from './marketing-assessment.js';
	import { nodeStatus, type Run } from './run-state.svelte.js';
	let { run, selectedIndex }: { run: Run; selectedIndex: number } = $props();
	const node = $derived(run.nodes[selectedIndex]);
	const state = $derived(nodeStatus(run, selectedIndex));
	const sample = $derived(samples[run.workflow]);
	const insight = $derived(
		node.insightIndex === undefined ? undefined : sample.insights[node.insightIndex]
	);
	const applied = $derived(!!insight && run.applied.includes(insight.field));
	let inspector: HTMLElement;
	$effect(() => {
		if (node && inspector) inspector.scrollTop = 0;
	});
	const labels = {
		done: 'Review complete',
		running: 'Reviewing copy',
		queued: 'Waiting to review',
		cancelled: 'Assessment stopped'
	};
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex (Scrollable inspector needs keyboard access.) -->
<aside
	in:fly={{
		y: prefersReducedMotion.current ? 0 : 6,
		duration: prefersReducedMotion.current ? 0 : 180
	}}
	class={surface({ color: 'background', variant: 'filled', shadow: 'small' })}
	id="node-inspector"
	aria-label="Node inspector"
	data-inspector
	tabindex="0"
	bind:this={inspector}
>
	<p data-inspector-label>Inspector</p>
	<div data-working>
		<span data-status-icon aria-hidden="true">
			<span data-visible={state === 'running'}><Spinner size="small" /></span>
			<span data-visible={state !== 'running'}
				><Icon
					name={state === 'done' ? 'check_circle' : state === 'cancelled' ? 'close' : 'schedule'}
				/></span
			>
		</span>
		<span data-status aria-label={labels[state]}
			>{#each Object.entries(labels) as [value, label] (value)}<span
					data-visible={state === value}
					aria-hidden="true">{label}</span
				>{/each}</span
		>
		<span data-percentage>{node.progress}%</span>
	</div>
	<div data-review-progress>
		<Progress value={node.progress / 100} label={`${node.name} review progress`} size="small" />
	</div>
	<p data-step>Step {selectedIndex + 1}</p>
	<h3 tabindex="-1">{node.name}</h3>
	<section data-result>
		<Icon name="format_quote" />
		<div>
			<h4>Original {insight ? copyLabels[insight.field].toLowerCase() : 'draft'}</h4>
			<blockquote>
				{insight
					? sample.copy[insight.field]
					: `${sample.copy.headline} ${sample.copy.body} ${sample.copy.cta}`}
			</blockquote>
		</div>
	</section>
	{#if state === 'done'}
		<section data-result>
			<Icon name={insight?.icon ?? 'checklist'} />
			<div>
				<h4>{insight ? 'What needs attention' : 'Review result'}</h4>
				<p>{node.output}</p>
			</div>
		</section>
		{#if insight}
			<section data-result>
				<Icon name={applied ? 'check_circle' : 'edit_note'} />
				<div>
					<h4>{applied ? 'Applied to the draft' : 'Suggested edit'}</h4>
					<p>{applied ? run.copy[insight.field] : insight.rewrite}</p>
				</div>
			</section>
		{/if}
	{:else}
		<section data-result>
			<Icon name={insight?.icon ?? 'checklist'} />
			<div>
				<h4>{state === 'cancelled' ? 'Review paused' : 'Review focus'}</h4>
				<p>
					{state === 'cancelled'
						? 'Retry this assessment to finish the copy review.'
						: node.purpose}
				</p>
			</div>
		</section>
	{/if}
</aside>

<style>
	aside {
		min-height: 0;
		min-width: 0;
		overflow: auto;
		scroll-padding: 12px;
		padding: 22px 20px;

		border: 0;
		border-radius: var(--run-region-radius, 20px);
		scrollbar-width: thin;
		overscroll-behavior: contain;
	}
	[data-inspector-label] {
		margin: 0 0 24px;
		color: var(--color-muted);
		font-size: 11px;
		line-height: 1.4;
		font-weight: 500;
	}
	[data-working] {
		display: flex;
		align-items: center;
		gap: 8px;
		min-height: 20px;
		font-size: 11px;
		color: var(--color-primary);
	}
	[data-status-icon],
	[data-status] {
		display: grid;
	}
	[data-status-icon] {
		font-size: 16px;
	}
	[data-status-icon] > span,
	[data-status] > span {
		grid-area: 1 / 1;
		opacity: 0;
		transition: opacity 220ms ease;
	}
	[data-status-icon] > span {
		display: flex;
	}
	[data-status-icon] > [data-visible='true'],
	[data-status] > [data-visible='true'] {
		opacity: 1;
	}
	[data-percentage] {
		margin-left: auto;
		color: var(--color-muted);
		font-variant-numeric: tabular-nums;
	}
	[data-step] {
		margin: 0 0 5px;
		font-size: 10px;
		color: var(--color-muted);
	}
	h3 {
		margin: 0;
		font-size: 18px;
		line-height: 1.4;
		letter-spacing: -0.4px;
		font-weight: 550;
	}
	h3:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 4px;
	}
	aside:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: -4px;
	}
	section {
		display: grid;
		grid-template-columns: 17px minmax(0, 1fr);
		gap: 10px;
		margin-top: 26px;
		color: var(--color-primary);
	}
	h4 {
		margin: 0 0 8px;
		color: var(--color-foreground);
		font-size: 11px;
		font-weight: 600;
	}
	section p,
	blockquote {
		margin: 0;
		color: var(--color-muted);
		font-size: 12px;
		line-height: 1.75;
		overflow-wrap: anywhere;
	}
	blockquote {
		color: var(--color-foreground);
	}
	@media (prefers-reduced-motion: reduce) {
		[data-status-icon] > span,
		[data-status] > span {
			transition: none;
		}
	}
	[data-review-progress] {
		margin: 10px 0 28px;
	}
</style>
