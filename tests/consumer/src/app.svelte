<script lang="ts">
	import { onMount } from 'svelte';
	import * as core from 'bref-ui';
	import * as copied from '#bref';
	import * as paris from 'bref-ui-themes/new-paris';
	import * as glassy from 'bref-ui-themes/glassy';
	import * as crystal from 'bref-ui-themes/crystal-code';
	import * as vscode from 'bref-ui-themes/vscode';
	import type { SelectOptionDataProps, TabItemDataProps } from 'bref-ui/types';

	let { source = 'package' }: { source?: string } = $props();
	const ui = $derived(source === 'copy' ? copied : core);
	const options: SelectOptionDataProps[] = [
		{ id: 'a', label: 'Alpha' },
		{ id: 'blocked', label: 'Blocked', disabled: true },
		{ id: 'b', label: 'Beta' }
	];
	const tabs: TabItemDataProps[] = options.map((item) => ({ ...item, icon: 'home' }));
	let ready = $state(false);
	let destination = $state<string | string[] | undefined>('a');
	let tags = $state<string | string[] | undefined>(['a']);
	let tab = $state('a');
	let open = $state(false);
	let popover = $state(false);
	let dismissible = $state(true);
	let submitted = $state('');
	let reopened = $state(0);
	onMount(() => {
		ready = true;
	});
</script>

<svelte:head><title>Bref consumer</title></svelte:head>
<ui.Theme />
<main data-ready={ready}>
	<h1>Bref consumer</h1>
	<p data-testid="exports">
		{[core, copied, paris, glassy, crystal, vscode]
			.map((library) => Object.keys(library).length)
			.join(',')}
	</p>
	<form
		onsubmit={(event) => {
			event.preventDefault();
			submitted = JSON.stringify([...new FormData(event.currentTarget)]);
		}}
	>
		<label for="title">Title</label>
		<ui.TextInput id="title" name="title" required value="Initial" />
		<label for="notes">Notes</label>
		<ui.TextArea id="notes" name="notes" value="Notes" />
		<label><ui.Checkbox name="agree" value="yes" /> Agree</label>
		<label><ui.Switch name="notify" value="yes" /> Notify</label>
		<label for="destination">Destination</label>
		<ui.Combobox
			id="destination"
			aria-label="Destination"
			name="destination"
			required
			items={options}
			bind:value={destination}
		/>
		<label for="tags">Tags</label>
		<ui.Combobox id="tags" aria-label="Tags" name="tags" items={options} bind:value={tags} />
		<label for="locked">Locked</label>
		<ui.Combobox id="locked" disabled items={options} value="a" />
		<label for="readonly">Read only</label>
		<ui.Combobox id="readonly" readonly items={options} value="a" />
		<button type="submit">Submit</button>
		<button type="reset">Reset</button>
		<button type="button" onclick={() => (destination = undefined)}>Clear destination</button>
	</form>
	<output data-testid="submitted">{submitted}</output>
	<section aria-label="Navigation">
		<ui.Tabs items={tabs} bind:value={tab} />
		<p data-testid="tab-value">{tab}</p>
	</section>
	<section aria-label="Overlays">
		<button
			onclick={() => {
				dismissible = true;
				open = true;
			}}
		>
			Open dialog
		</button>
		<button
			onclick={() => {
				dismissible = false;
				open = true;
			}}
		>
			Open locked dialog
		</button>
		<ui.Dialog
			bind:open
			{dismissible}
			header={{ title: 'Confirmation', description: 'Confirm the action.' }}
		>
			<button onclick={() => (open = false)}>Confirm</button>
			<button
				onclick={() => {
					open = false;
					setTimeout(() => {
						open = true;
						reopened++;
					}, 30);
				}}
			>
				Reopen dialog
			</button>
		</ui.Dialog>
		<ui.Popover bind:open={popover}>
			{#snippet trigger()}<button onclick={() => (popover = !popover)}>
					Open popover
				</button>{/snippet}
			<button onclick={() => (popover = false)}>Popover action</button>
		</ui.Popover>
	</section>
	<output data-testid="reopened">{reopened}</output>
	<ui.TreeView
		items={[{ id: 'parent', label: 'Parent', children: [{ id: 'child', label: 'Child' }] }]}
	/>
</main>

<style>
	main {
		max-width: 50rem;
		margin: 2rem auto;
		font: 1rem/1.5 system-ui;
	}
	form {
		display: grid;
		gap: 0.75rem;
	}
	section {
		margin-block: 2rem;
	}
</style>
