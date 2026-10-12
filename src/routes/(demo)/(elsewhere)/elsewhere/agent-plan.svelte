<script lang="ts">
	import { Icon, Progress, Spinner } from '$lib/index.js';
	import { fly } from 'svelte/transition';
	import { steps, type AuditRun } from './audits.js';
	let { run, motion }: { run: AuditRun; motion: number } = $props();
</script>

<aside data-agent-plan aria-label="Audit plan">
	<h2>The plan</h2>
	<ol>
		{#each steps as step, index (step.title)}
			<li
				data-complete={run.step > index}
				data-active={run.status === 'running' && run.step === index}
			>
				{#key `${run.id}-${run.step}-${run.status}`}
					<span in:fly={{ y: motion ? 4 : 0, duration: motion }}>
						{#if run.status === 'running' && run.step === index}<Spinner size="small" />
						{:else}<Icon name={run.step > index ? 'check_circle' : step.icon} />{/if}
					</span>
				{/key}
				<span>{step.title}</span>
			</li>
		{/each}
	</ol>
	<Progress label="Audit progress" value={run.step / steps.length} size="small" />
	<p>
		{run.status === 'ready'
			? 'All steps complete'
			: run.status === 'stopped'
				? 'Run stopped'
				: `Step ${run.step + 1} of ${steps.length}`}
	</p>
</aside>
