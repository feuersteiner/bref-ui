<script lang="ts">
	import { onMount } from 'svelte';
	import * as paris from 'bref-ui-themes/new-paris';
	import * as glassy from 'bref-ui-themes/glassy';
	import * as crystal from 'bref-ui-themes/crystal-code';
	import * as vscode from 'bref-ui-themes/vscode';

	const themes = [
		{ name: 'New Paris', library: paris },
		{ name: 'Glassy', library: glassy },
		{ name: 'Crystal Code', library: crystal },
		{ name: 'VS Code', library: vscode }
	];
	let active = $state<string>();
	let ready = $state(false);
	onMount(() => {
		ready = true;
	});
</script>

<svelte:head><title>Theme behavior contracts</title></svelte:head>
<paris.Theme />
<main data-ready={ready}>
	<h1>Theme behavior contracts</h1>
	{#each themes as { name, library } (name)}
		<section aria-label={name}>
			<h2>{name}</h2>
			<library.TreeView
				items={[{ id: 'parent', label: 'Parent', children: [{ id: 'child', label: 'Child' }] }]}
			/>
			<library.Popover
				bind:open={() => active === name, (open) => (active = open ? name : undefined)}
			>
				{#snippet trigger()}<button onclick={() => (active = active === name ? undefined : name)}>
						Open popover
					</button>{/snippet}
				<button>Popover action</button>
			</library.Popover>
		</section>
	{/each}
</main>
