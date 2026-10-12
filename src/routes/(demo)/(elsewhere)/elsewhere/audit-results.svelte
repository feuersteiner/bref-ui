<script lang="ts">
	import { Checkbox, Icon, Pill } from '$lib/index.js';
	import { fly } from 'svelte/transition';
	import { findings, type AuditRun } from './audits.js';
	let {
		run,
		motion,
		onReview
	}: {
		run: AuditRun;
		motion: number;
		onReview: (id: string, checked: boolean) => void;
	} = $props();
</script>

<section
	data-agent-results
	aria-labelledby="results-heading"
	in:fly={{ y: motion ? 10 : 0, duration: motion }}
>
	<div data-agent-results-heading>
		<h2 id="results-heading">Three ways to improve the page</h2>
		<span>{run.reviewed.length} of {findings.length} reviewed</span>
	</div>
	<ul>
		{#each findings as finding, index (finding.id)}
			<li
				data-reviewed={run.reviewed.includes(finding.id)}
				in:fly={{ y: motion ? 10 : 0, duration: motion, delay: motion ? index * 45 : 0 }}
			>
				<div data-agent-finding-heading>
					<Icon name={finding.icon} />
					<h3>{finding.title}</h3>
					<Checkbox
						aria-label={`Mark reviewed: ${finding.title}`}
						checked={run.reviewed.includes(finding.id)}
						onchange={(event) => onReview(finding.id, event.currentTarget.checked)}
					/>
				</div>
				<Pill label={finding.area} icon={{ name: finding.icon }} size="x-small" />
				<p>{finding.action}</p>
				<details>
					<summary>Sample evidence <Icon name="keyboard_arrow_down" /></summary>
					<p>{finding.evidence}</p>
				</details>
			</li>
		{/each}
	</ul>
</section>
