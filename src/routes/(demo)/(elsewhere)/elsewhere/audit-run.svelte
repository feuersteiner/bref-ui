<script lang="ts">
	import { Button, Icon, Pill, Spinner } from '$lib/index.js';
	import { fly } from 'svelte/transition';
	import { siteName, type AuditRun } from './audits.js';
	import AgentPlan from './agent-plan.svelte';
	import AuditResults from './audit-results.svelte';
	let {
		run,
		motion,
		onRerun,
		onClear,
		onReview
	}: {
		run: AuditRun;
		motion: number;
		onRerun: () => void;
		onClear: () => void;
		onReview: (id: string, checked: boolean) => void;
	} = $props();
	const pending = $derived(run.status === 'running');
</script>

{#key run.id}
	<section data-agent-run in:fly={{ y: motion ? 12 : 0, duration: motion }}>
		<header data-agent-run-heading>
			<div>
				<h2>{siteName(run.url)}</h2>
				<Pill
					label={pending ? 'Running' : run.status === 'ready' ? 'Sample review ready' : 'Stopped'}
					icon={{
						name: pending ? 'pending' : run.status === 'ready' ? 'check_circle' : 'pause_circle'
					}}
					color={run.status === 'ready' ? 'success' : 'muted'}
					size="x-small"
				/>
			</div>
			<div data-agent-run-actions>
				<Button
					label="Rerun"
					icon={{ name: 'refresh' }}
					size="small"
					disabled={pending}
					onClick={onRerun}
				/><Button
					aria-label="Clear current run"
					icon={{ name: 'delete' }}
					rounded
					size="small"
					disabled={pending}
					onClick={onClear}
				/>
			</div>
		</header>
		<div data-agent-body>
			<AgentPlan {run} {motion} />
			{#if run.status === 'ready'}<AuditResults {run} {motion} {onReview} />
			{:else}<div data-agent-working>
					{#if pending}<Spinner label="Preparing sample suggestions" size="large" />
						<h2>
							{run.step === 0
								? 'Reading the sample page'
								: run.step === 1
									? 'Checking the buying flow'
									: 'Preparing suggestions'}
						</h2>{:else}<Icon name="pause_circle" />
						<h2>This run was stopped</h2>
						<p>Rerun the audit to prepare its suggestions.</p>{/if}
				</div>{/if}
		</div>
	</section>
{/key}
