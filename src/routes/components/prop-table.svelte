<script lang="ts">
	let {
		props,
		label = 'Component props'
	}: {
		label?: string;
		props: {
			name: string;
			type: string;
			required: boolean | string;
			default: string;
			description: string;
		}[];
	} = $props();
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex (The overflow region needs keyboard scrolling.) -->
<div role="region" aria-label={label} tabindex={0}>
	<table>
		<caption>{label}</caption>
		<thead>
			<tr>
				<th scope="col">Prop</th>
				<th scope="col">Type</th>
				<th scope="col">Required</th>
				<th scope="col">Default</th>
				<th scope="col">Description</th>
			</tr>
		</thead>
		<tbody>
			{#each props as prop (prop.name)}
				<tr>
					<th scope="row"><code>{prop.name}</code></th>
					<td><code>{prop.type}</code></td>
					<td>
						{typeof prop.required === 'boolean' ? (prop.required ? 'Yes' : 'No') : prop.required}
					</td>
					<td><code>{prop.default}</code></td>
					<td>{prop.description}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	div {
		max-width: 100%;
		overflow: auto;
		border-block: 1px solid var(--docs-rule);
	}
	div:focus-visible {
		outline: 2px solid var(--color-primary, currentColor);
		outline-offset: 3px;
	}
	table {
		width: 100%;
		min-width: 48rem;
		border-collapse: collapse;
		text-align: left;
	}
	caption {
		padding: 24px 0;
		color: var(--color-muted);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-align: left;
		text-transform: uppercase;
	}
	th,
	td {
		padding: 18px 24px;
		border-top: 1px solid var(--docs-rule-subtle);
		vertical-align: top;
	}
	thead th {
		background: var(--docs-surface);
		color: var(--color-muted);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	tbody th {
		font-weight: 600;
	}
	tbody tr:hover {
		background: var(--docs-surface);
	}
	code {
		white-space: nowrap;
	}
	th:last-child,
	td:last-child {
		min-width: 18rem;
	}
	@media (max-width: 575px) {
		th,
		td {
			padding-inline: 16px;
		}
	}
</style>
