<script lang="ts">
	import { Tabs, Select, TextInput } from 'bref-ui';
	let {
		category = $bindable('all'),
		sort = $bindable('featured'),
		query = $bindable('')
	}: { category?: string; sort?: string | string[]; query?: string } = $props();
</script>

<div data-collection-controls>
	<Tabs
		label="Product category"
		bind:value={category}
		items={[
			{ id: 'all', label: 'All', icon: 'grid_view' },
			{ id: 'seating', label: 'Seating', icon: 'chair' },
			{ id: 'lighting', label: 'Lighting', icon: 'light' },
			{ id: 'tables', label: 'Tables', icon: 'table_restaurant' }
		]}
	/>
	<div data-collection-tools>
		<TextInput
			aria-label="Search furniture"
			type="search"
			placeholder="Search furniture"
			icon={{ name: 'search' }}
			bind:value={query}
			size="small"
		/>
		<label for="product-sort">
			<span data-visually-hidden>Sort products</span>
			<Select
				id="product-sort"
				bind:value={sort}
				items={[
					{ id: 'featured', label: 'Featured' },
					{ id: 'price-asc', label: 'Price: Low to high' },
					{ id: 'price-desc', label: 'Price: High to low' }
				]}
				size="small"
			/>
		</label>
	</div>
</div>

<style>
	label {
		display: grid;
		gap: 8px;
	}
	[data-visually-hidden] {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
		border: 0;
	}
	[data-collection-controls] {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 24px;
		padding-block: 24px 32px;
	}
	[data-collection-tools] {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	[data-collection-controls] label {
		width: 196px;
	}
	@container demo (max-width: 900px) {
		[data-collection-controls] {
			align-items: start;
			flex-direction: column;
		}

		[data-collection-tools] {
			width: 100%;
		}
	}
	@container demo (max-width: 600px) {
		[data-collection-controls] {
			align-items: start;
			flex-direction: column;
			gap: 20px;
		}

		[data-collection-tools] {
			flex-direction: column;
			align-items: stretch;
		}

		[data-collection-tools] label {
			width: 100%;
		}
	}
</style>
