<script lang="ts">
	import { Icon } from '$lib/index.js';
	import { siteName, type AuditRun } from './audits.js';
	let {
		runs,
		activeId,
		onSelect
	}: {
		runs: AuditRun[];
		activeId?: number;
		onSelect: (run: AuditRun) => void;
	} = $props();
</script>

<nav data-agent-history aria-label="Recent audits">
	<h2>Recent runs</h2>
	<ul>
		{#each runs as run (run.id)}
			<li>
				<button
					type="button"
					aria-current={run.id === activeId ? 'true' : undefined}
					onclick={() => onSelect(run)}
				>
					<Icon
						name={run.status === 'ready'
							? 'check_circle'
							: run.status === 'running'
								? 'pending'
								: 'pause_circle'}
					/>
					<span>{siteName(run.url)}</span>
					<small>
						{run.status === 'ready' ? 'Ready' : run.status === 'running' ? 'Running' : 'Stopped'}
					</small>
				</button>
			</li>
		{/each}
	</ul>
</nav>
