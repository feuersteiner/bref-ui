<script lang="ts">
	import { PillChoiceGroup, Select, TextInput } from '$lib/index.js';
	let {
		category = $bindable('all'),
		sort = $bindable('featured'),
		query = $bindable('')
	}: { category?: string | string[]; sort?: string | string[]; query?: string } = $props();
</script>

<div data-collection-controls>
	<PillChoiceGroup
		aria-label="Product category"
		bind:selection={category}
		items={[
			{ id: 'all', label: 'All' },
			{ id: 'seating', label: 'Seating' },
			{ id: 'lighting', label: 'Lighting' },
			{ id: 'tables', label: 'Tables' }
		]}
		color="foreground"
		size="small"
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
