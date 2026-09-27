<script lang="ts">
	let {
		props
	}: {
		props: {
			name: string;
			type: string;
			required: boolean | string;
			default: string;
			description: string;
		}[];
	} = $props();
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex (Allow keyboard scrolling of wide tables.) -->
<div role="region" aria-label="Component props" tabindex="0">
	<table>
		<caption>Component props</caption>
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
					<td
						>{typeof prop.required === 'boolean'
							? prop.required
								? 'Yes'
								: 'No'
							: prop.required}</td
					>
					<td><code>{prop.default}</code></td>
					<td>{prop.description}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	div {
		overflow-x: auto;
	}
</style>
