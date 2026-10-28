<script lang="ts">
	import { Button, Icon } from 'bref-ui';
	import { samples } from './marketing-assessment.js';
	import type { Run } from './run-state.svelte.js';
	let {
		run,
		onApply,
		onInspect
	}: { run: Run; onApply: (index: number) => void; onInspect: (index: number) => void } = $props();
	const sample = $derived(samples[run.workflow]);
	const insights = $derived(
		// Custom review steps have no sample insight, so they add no suggested edit.
		run.nodes.flatMap(({ insightIndex: index }) =>
			index === undefined ? [] : [{ insight: sample.insights[index], index }]
		)
	);
	const pending = $derived(insights.filter(({ insight }) => !run.applied.includes(insight.field)));
	const remaining = $derived(pending.length);
	// Bulk feedback stays visible until a later edit changes the run's own feedback.
	let bulk = $state<{ run: Run; text: string; after: string }>();
	const feedback = $derived(
		bulk && bulk.run === run && bulk.after === run.feedback
			? bulk.text
			: run.feedback || 'Edits apply to this local draft.'
	);

	function applyAll() {
		const targets = remaining ? pending : insights;
		for (const { index } of targets) onApply(index);
		const count = targets.length;
		bulk = {
			run,
			after: run.feedback,
			text: remaining
				? `${count} edit${count === 1 ? '' : 's'} applied to this local draft.`
				: 'All edits undone. Original copy restored.'
		};
	}
</script>

<article aria-label="Marketing assessment" data-report>
	<header>
		<div>
			<h3 tabindex="-1">{sample.reportTitle}</h3>
			<p data-count>
				{!insights.length
					? 'No suggested edits for the selected steps'
					: remaining
						? `${remaining} suggested edit${remaining === 1 ? '' : 's'}`
						: 'All edits applied'}
			</p>
		</div>
		{#if insights.length}<Button
				label={remaining ? 'Apply all edits' : 'Restore original'}
				icon={{ name: remaining ? 'done_all' : 'undo' }}
				size="small"
				variant={remaining ? 'filled' : 'neutral'}
				color={remaining ? 'primary' : 'foreground'}
				onClick={applyAll}
			/>{/if}
	</header>
	<p data-feedback role="status">{feedback}</p>
	<div data-assessment-layout>
		<section data-copy aria-label="Campaign draft">
			<p data-label>{run.applied.length ? 'Edited draft' : 'Original draft'}</p>
			<p data-headline>{run.copy.headline}</p>
			<p data-body>{run.copy.body}</p>
			<p data-cta><Icon name="arrow_forward" /> {run.copy.cta}</p>
			<details>
				<summary>Campaign brief</summary>
				<p>
					<strong>Audience</strong>
					{sample.audience}
				</p>
				<p>{sample.context}</p>
			</details>
		</section>
		<section data-insights aria-label="Suggested edits">
			{#each insights as { insight, index } (insight.field)}
				{@const applied = run.applied.includes(insight.field)}
				<section data-insight data-applied={applied}>
					<span data-icon><Icon name={applied ? 'check_circle' : insight.icon} /></span>
					<div>
						<h4>
							{insight.title}
							{#if applied}<span data-applied-label>Applied</span>{/if}
						</h4>
						<blockquote>{insight.rewrite}</blockquote>
						<details>
							<summary>Why</summary>
							<p>{insight.rationale}</p>
						</details>
						<div data-actions>
							<Button
								label={applied ? 'Undo edit' : 'Apply edit'}
								aria-label={`${applied ? 'Undo' : 'Apply'} ${insight.title.toLowerCase()} edit`}
								size="x-small"
								variant={applied ? 'neutral' : 'soft'}
								color={applied ? 'foreground' : 'primary'}
								onClick={() => onApply(index)}
							/><Button
								label="Inspect"
								aria-label={`Inspect ${insight.title.toLowerCase()} copy`}
								size="x-small"
								variant="neutral"
								onClick={() => onInspect(index)}
							/>
						</div>
					</div>
				</section>
			{/each}
		</section>
	</div>
</article>

<style>
	article {
		container-type: inline-size;
		overflow-wrap: anywhere;
	}
	[data-copy],
	[data-insights] {
		min-width: 0;
	}
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
	}
	h3 {
		margin: 0;
		max-width: 26ch;
		font-size: clamp(21px, 2vw, 26px);
		line-height: 1.3;
		font-weight: 550;
		letter-spacing: -0.7px;
	}
	[data-count] {
		margin: 8px 0 0;
		color: var(--color-muted);
		font-size: 12px;
	}
	[data-feedback] {
		margin: 16px 0 40px;
		min-height: 1.6em;
		color: var(--color-muted);
		font-size: 12px;
		line-height: 1.6;
	}
	[data-assessment-layout] {
		display: grid;
		grid-template-columns: minmax(220px, 0.85fr) minmax(0, 1.3fr);
		gap: 56px;
		align-items: start;
	}
	[data-label] {
		margin: 0 0 20px;
		color: var(--color-muted);
		font-size: 11px;
		font-weight: 500;
	}
	[data-copy] {
		padding: 32px;
		border: 1px solid color-mix(in srgb, var(--color-foreground) 8%, transparent);
		border-radius: var(--run-inner-radius, 16px);
		background: color-mix(in srgb, var(--color-foreground) 3%, transparent);
	}
	[data-headline] {
		margin: 0;
		max-width: 22ch;
		font-size: 21px;
		line-height: 1.4;
		font-weight: 550;
		letter-spacing: -0.4px;
	}
	[data-body] {
		margin: 16px 0 0;
		max-width: 60ch;
		color: var(--color-muted);
		font-size: 14px;
		line-height: 1.7;
	}
	[data-cta] {
		display: flex;
		align-items: center;
		gap: 8px;
		margin: 24px 0 0;
		color: var(--color-primary);
		font-size: 13px;
		font-weight: 550;
	}
	details {
		color: var(--color-muted);
		font-size: 12px;
		line-height: 1.7;
	}
	[data-copy] details {
		margin-top: 32px;
	}
	summary {
		cursor: pointer;
		width: fit-content;
		padding-block: 4px;
	}
	details p {
		margin: 8px 0 0;
		max-width: 60ch;
	}
	strong {
		display: block;
		color: var(--color-foreground);
		font-weight: 500;
	}
	[data-insights] {
		display: grid;
		gap: 40px;
	}
	[data-insight] {
		display: grid;
		grid-template-columns: 20px minmax(0, 1fr);
		gap: 16px;
	}
	[data-icon] {
		color: var(--color-primary);
		font-size: 18px;
	}
	[data-applied] [data-icon] {
		color: var(--color-success);
	}
	h4 {
		margin: 0;
		font-size: 14px;
		font-weight: 600;
		line-height: 1.5;
	}
	[data-applied-label] {
		margin-left: 8px;
		color: var(--color-success);
		font-size: 11px;
		font-weight: 500;
	}
	blockquote {
		margin: 10px 0 12px;
		max-width: 60ch;
		padding-left: 14px;
		border-left: 2px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
		font-size: 14px;
		line-height: 1.6;
	}
	[data-actions] {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 16px;
	}
	h3:focus-visible,
	summary:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 3px;
	}
	@container (max-width: 620px) {
		[data-assessment-layout] {
			grid-template-columns: minmax(0, 1fr);
			gap: 40px;
		}
		[data-copy] {
			padding: 24px;
		}
		header {
			align-items: start;
			flex-direction: column;
			gap: 16px;
		}
	}
</style>
