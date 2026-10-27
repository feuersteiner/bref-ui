<script lang="ts">
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import { tick } from 'svelte';
	import { Button, Select, TextArea, Checkbox, TextInput } from 'bref-ui';
	import { samples, workflows, copyLabels } from './marketing-assessment.js';
	import {
		hasScope,
		stepNameError,
		stepNameLimit,
		type Run,
		type RunConfig
	} from './run-state.svelte.js';
	let {
		run,
		onConfigure,
		onStart
	}: { run: Run; onConfigure: (config: RunConfig) => void; onStart: () => void } = $props();
	const sampleId = $props.id();
	const sample = $derived(samples[run.config.workflow]);
	const active = $derived(run.status === 'running' || run.status === 'queued');
	const stepInputId = `${sampleId}-step`;
	const stepErrorId = `${sampleId}-step-error`;
	let stepName = $state('');
	let stepError = $state('');

	async function focusStepInput() {
		await tick();
		document.getElementById(stepInputId)?.focus();
	}

	function addStep() {
		if (active) return;
		stepError = stepNameError(run.config, stepName) ?? '';
		if (!stepError) {
			onConfigure({
				...run.config,
				custom: [...run.config.custom, { name: stepName.trim(), checked: true }]
			});
			stepName = '';
		}
		focusStepInput();
	}

	function removeStep(name: string) {
		onConfigure({ ...run.config, custom: run.config.custom.filter((step) => step.name !== name) });
		stepError = '';
		focusStepInput();
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex (Scrollable setup needs keyboard access.) -->
<form
	aria-label="Assessment setup"
	tabindex="0"
	in:fly={{
		y: prefersReducedMotion.current ? 0 : 6,
		duration: prefersReducedMotion.current ? 0 : 180
	}}
	onsubmit={(event) => {
		event.preventDefault();
		onStart();
	}}
>
	<header>
		<p>Sample assessment</p>
		<h3>Setup</h3>
		<p>Choose a campaign and the copy to review.</p>
	</header>
	<div data-field>
		<label for={sampleId}>Sample campaign</label>
		<Select
			id={sampleId}
			items={samples.map((item, index) => ({ id: String(index), label: item.name }))}
			value={String(run.config.workflow)}
			disabled={active}
			onChange={(value) => onConfigure({ ...run.config, workflow: Number(value) })}
		/>
	</div>
	<div data-brief>
		<p><strong>Audience</strong>{sample.audience}</p>
		<p><strong>Campaign brief</strong>{sample.context}</p>
	</div>
	<label
		>Copy to assess<TextArea
			value={workflows[run.config.workflow].prompt}
			rows={5}
			readonly
			wide
		/></label
	>
	<fieldset disabled={active}>
		<legend>Review scope</legend>
		<p>Select at least one check.</p>
		<div data-options>
			{#each sample.insights as insight (insight.field)}<label
					><Checkbox
						bind:checked={
							() => run.config.scope.includes(insight.field),
							(checked) =>
								onConfigure({
									...run.config,
									scope: checked
										? [...run.config.scope, insight.field]
										: run.config.scope.filter((field) => field !== insight.field)
								})
						}
					/><span>{insight.title}<small>{copyLabels[insight.field]}</small></span></label
				>{/each}
			{#each run.config.custom as step (step.name)}<span data-custom-step
					><label
						><Checkbox
							bind:checked={
								() => step.checked,
								(checked) =>
									onConfigure({
										...run.config,
										custom: run.config.custom.map((item) =>
											item.name === step.name ? { ...item, checked } : item
										)
									})
							}
						/><span>{step.name}<small>Custom step</small></span></label
					><Button
						icon={{ name: 'close' }}
						aria-label={`Remove ${step.name}`}
						size="x-small"
						variant="neutral"
						onClick={() => removeStep(step.name)}
					/></span
				>{/each}
		</div>
		<div data-add-step>
			<TextInput
				id={stepInputId}
				bind:value={stepName}
				aria-label="Custom step name"
				aria-invalid={stepError ? true : undefined}
				aria-describedby={stepError ? stepErrorId : undefined}
				placeholder="Add a step, e.g. Tone of voice"
				maxlength={stepNameLimit}
				autocomplete="off"
				size="small"
				onChange={() => (stepError = '')}
				onkeydown={(event) => {
					if (event.key !== 'Enter' || event.isComposing) return;
					event.preventDefault();
					addStep();
				}}
			/><Button label="Add step" icon={{ name: 'add' }} size="small" onClick={addStep} />
		</div>
		{#if stepError}<p id={stepErrorId} role="alert" data-step-error>{stepError}</p>{/if}
	</fieldset>
	<footer>
		<Button
			type="submit"
			label={active ? 'Run in progress' : 'Start assessment'}
			icon={{ name: 'play_arrow', filled: true }}
			variant="filled"
			color="primary"
			size="small"
			disabled={active || !hasScope(run.config)}
		/>
		<p>
			{active
				? 'Inputs are locked while this run is queued or running.'
				: 'Uses the supplied sample copy. Starting a new run replaces its previous results.'}
		</p>
	</footer>
</form>

<style>
	form {
		min-width: 0;
		min-height: 0;
		overflow: auto;
		overscroll-behavior: contain;
		scroll-padding: 8px;
		border-radius: var(--run-inner-radius);
		display: grid;
		grid-template-columns: minmax(0, 720px);
		justify-content: center;
		align-content: start;
		gap: 24px;
		padding: 32px clamp(16px, 4vw, 48px);
		background: var(--run-surface);
	}
	header {
		display: grid;
		gap: 8px;
	}
	header p {
		font-size: 12px;
		color: var(--color-muted);
		line-height: 1.7;
	}
	h3 {
		font-size: 25px;
		font-weight: 550;
		letter-spacing: -0.6px;
	}
	[data-field],
	form > label {
		display: grid;
		gap: 8px;
	}
	[data-field] > label,
	form > label {
		font-size: 12px;
		font-weight: 500;
	}
	form:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: -4px;
	}
	[data-brief] {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 24px;
	}
	[data-brief] p {
		display: grid;
		gap: 4px;
		color: var(--color-muted);
		font-size: 12px;
		line-height: 1.7;
	}
	[data-brief] strong {
		color: var(--color-foreground);
		font-size: 11px;
		font-weight: 550;
	}
	fieldset {
		display: grid;
		gap: 16px;
		min-inline-size: 0;
		border: 0;
	}
	/* The rendered legend sits outside the fieldset's grid, so it keeps its own pairing gap. */
	legend {
		margin-bottom: 8px;
		font-size: 12px;
		font-weight: 550;
	}
	fieldset > p {
		font-size: 11px;
		color: var(--color-muted);
	}
	[data-options] {
		display: flex;
		flex-wrap: wrap;
		gap: 16px 24px;
	}
	[data-options] label {
		display: flex;
		align-items: start;
		gap: 8px;
		font-size: 12px;
		cursor: pointer;
	}
	[data-options] label > span {
		display: grid;
		gap: 4px;
	}
	[data-options] small {
		color: var(--color-muted);
		font-size: 10px;
	}
	fieldset:disabled label {
		cursor: default;
		opacity: 0.6;
	}
	[data-custom-step] {
		display: flex;
		align-items: start;
		gap: 4px;
	}
	[data-add-step] {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
	}
	fieldset > [data-step-error] {
		color: var(--color-error);
	}
	footer {
		display: grid;
		justify-items: start;
		gap: 12px;
	}
	footer p {
		max-width: 440px;
		color: var(--color-muted);
		font-size: 11px;
		line-height: 1.7;
	}
	@container demo (max-width: 760px) {
		form {
			padding-block: 24px;
		}
		[data-brief] {
			grid-template-columns: minmax(0, 1fr);
			gap: 16px;
		}
	}
</style>
