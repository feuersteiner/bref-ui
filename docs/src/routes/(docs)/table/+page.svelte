<script lang="ts">
	/* eslint-disable max-lines -- Keep native table compositions and their interactive playground together. */
	import { Button, Checkbox, Pill, Select, Table, TextInput } from 'bref-ui';
	import Playground from '../components/playground.svelte';
	import PlaygroundField from '../components/playground-field.svelte';
	import PlaygroundGroup from '../components/playground-group.svelte';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { chapter, sections } from './sections.js';
	let caption = $state('Recent orders');
	let empty = $state(false);
	let direction = $state<'ltr' | 'rtl'>('ltr');
	let lastAction = $state('No order selected');
	const orders = [
		{ id: '1042', customer: 'North Studio', product: 'Oak dining table', status: 'Shipped' },
		{
			id: '1043',
			customer: 'A customer with a longer name',
			product: 'Linen chair',
			status: 'Pending'
		}
	];
	const source = $derived(`<script>
  import { Button, Pill, Table } from 'bref-ui';
  let lastAction = $state('No order selected');
  const orders = ${JSON.stringify(orders)};
<${'/'}script>

<Table dir="${direction}">
  <caption>{${JSON.stringify(caption || 'Orders')}}</caption>
  <thead><tr><th scope="col">Order</th><th scope="col">Customer</th><th scope="col">Status</th><th scope="col">Action</th></tr></thead>
  <tbody>${
		empty
			? '\n    <tr><td colspan="4">No orders yet.</td></tr>'
			: `
    {#each orders as order (order.id)}
      <tr>
        <th scope="row">#{order.id}</th>
        <td>{order.customer}<br /><small>{order.product}</small></td>
        <td><Pill label={order.status} color={order.status === 'Shipped' ? 'success' : 'info'} /></td>
        <td><Button label={'View #' + order.id} size="small" onClick={() => lastAction = 'Selected order #' + order.id} /></td>
      </tr>
    {/each}`
	}
  </tbody>
  <tfoot><tr><th scope="row" colspan="3">Total orders</th><td>${empty ? 0 : orders.length}</td></tr></tfoot>
</Table>
<p role="status">{lastAction}</p>`);
	const scrollSource =
		'<div role="region" aria-label="Orders" tabindex="0" style="overflow: auto">\n  <Table style="min-width: 40rem">…</Table>\n</div>';
	const reset = () => {
		caption = 'Recent orders';
		empty = false;
		direction = 'ltr';
		lastAction = 'No order selected';
	};
	const props = [
		{
			name: 'children',
			type: 'Snippet',
			required: false,
			default: 'Omitted',
			description: 'Native caption, colgroup, thead, tbody and tfoot content.'
		}
	];
</script>

{#snippet content(isEmpty = false)}
	<caption>{caption || 'Orders'}</caption>
	<thead>
		<tr>
			<th scope="col">Order</th>
			<th scope="col">Customer</th>
			<th scope="col">Status</th>
			<th scope="col">Action</th>
		</tr>
	</thead>
	<tbody>
		{#if isEmpty}<tr><td colspan="4">No orders yet.</td></tr>
		{:else}{#each orders as order (order.id)}
				<tr>
					<th scope="row">#{order.id}</th>
					<td>
						{order.customer}
						<br />
						<small>{order.product}</small>
					</td>
					<td>
						<Pill label={order.status} color={order.status === 'Shipped' ? 'success' : 'info'} />
					</td>
					<td>
						<Button
							label={`View #${order.id}`}
							size="small"
							onClick={() => (lastAction = `Selected order #${order.id}`)}
						/>
					</td>
				</tr>
			{/each}{/if}
	</tbody>
	<tfoot>
		<tr>
			<th scope="row" colspan="3">Total orders</th>
			<td>{isEmpty ? 0 : orders.length}</td>
		</tr>
	</tfoot>
{/snippet}

<Page
	title={chapter}
	description="Compose a styled native table with captions, headers and rich cells."
>
	<Section {...sections.find((section) => section.id === 'usage')!}>
		<p>
			Use native table elements inside Table. Captions name the table; scope associates column and
			row headers with their cells.
		</p>
		<Table>{@render content()}</Table>
		<p role="status">{lastAction}</p>
		<CodeSnippet {source} label="Native Table usage" />
	</Section>
	<Section {...sections.find((section) => section.id === 'playground')!}>
		<Playground {source} onReset={reset}>
			{#snippet preview()}<Table dir={direction}>{@render content(empty)}</Table>{/snippet}
			<PlaygroundGroup title="Native content">
				<PlaygroundField id="table-caption" label="Caption">
					<TextInput id="table-caption" bind:value={caption} />
				</PlaygroundField>
				<PlaygroundField id="table-empty" label="Empty content" toggle>
					<Checkbox id="table-empty" bind:checked={empty} />
				</PlaygroundField>
				<PlaygroundField id="table-direction" label="Direction">
					<Select
						id="table-direction"
						items={[
							{ id: 'ltr', label: 'Left to right' },
							{ id: 'rtl', label: 'Right to left' }
						]}
						bind:value={() => direction, (next) => (direction = next === 'rtl' ? 'rtl' : 'ltr')}
					/>
				</PlaygroundField>
			</PlaygroundGroup>
		</Playground>
	</Section>
	<Section {...sections.find((section) => section.id === 'scrolling')!}>
		<p>
			Keep scrolling on an explicitly named, keyboard-focusable container. Table keeps its native
			layout and semantics.
		</p>
		<!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users need to scroll the named overflow region.) -->
		<div data-scroll role="region" aria-label="Wide orders table" tabindex="0">
			<Table style="min-width: 40rem">{@render content()}</Table>
		</div>
		<CodeSnippet source={scrollSource} label="Scrollable table usage" />
	</Section>
	<Section {...sections.find((section) => section.id === 'props')!}>
		<PropTable {props} />
		<p>
			Accepts Svelte's HTMLTableAttributes, including class, style, dir, native events and aria
			attributes. No custom props or additional root elements. Use native buttons for sorting or row
			actions; normal Tab navigation reaches those controls.
		</p>
		<p>
			Headers, captions, empty content and responsive overflow belong to the caller. No sorting,
			pagination, selection or grid keyboard model is added.
		</p>
	</Section>
</Page>

<style>
	[data-scroll] {
		max-width: 100%;
		overflow: auto;
	}
	[data-scroll]:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 4px;
	}
	small {
		color: var(--color-muted);
	}
</style>
