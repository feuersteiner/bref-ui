<script lang="ts">
	import { Button, Pill, Select, Tabs, Theme } from 'bref-ui-themes/new-paris';
	import MiniForm from '../components/mini-form.svelte';
	import campaign from '../../../docs/static/demos/new-paris-campaign.png';
	let { time }: { time: number } = $props();
	let collection = $state('new');
	let size = $state('m');
	const products = [
		{
			name: 'The wool coat',
			price: '€390',
			color: '#baa995',
			path: 'M60 28 35 47 18 112 42 120 54 80 49 200h103l-6-120 12 40 24-8-17-65-25-19-24 14H84z'
		},
		{
			name: 'The silk shirt',
			price: '€145',
			color: '#e6dfd1',
			path: 'M66 35 36 52 17 98 46 111 57 83 53 190h94l-4-107 11 28 29-13-19-46-30-17-19 16H85z'
		},
		{
			name: 'The city bag',
			price: '€210',
			color: '#383330',
			path: 'M48 80h104l13 110H35z M72 80V57q0-34 28-34t28 34v23'
		}
	];
</script>

<Theme>
	<div class="paris-app">
		<nav class="paris-nav" aria-label="Atelier">
			<strong>ATELIER.</strong>
			<span>COLLECTION 04 · PARIS</span>
			<Button
				icon={{ name: 'shopping_bag' }}
				aria-label="Shopping bag"
				label={time >= 8 ? 'Bag (1)' : 'Bag (0)'}
			/>
		</nav>
		<div class="paris-campaign">
			<img src={campaign} alt="Black tailoring and ivory silk" />
			<span>LESS, BUT BETTER.</span>
		</div>
		<section class="paris-editorial">
			<Pill label="THE NEW COLLECTION" size="small" />
			<h2>
				Quietly <em>remarkable.</em>
			</h2>
			{#if time < 11.8}
				<Tabs
					items={[
						{ id: 'new', label: 'New arrivals', icon: 'fiber_new' },
						{ id: 'tailoring', label: 'Tailoring', icon: 'checkroom' },
						{ id: 'essentials', label: 'Essentials', icon: 'styler' }
					]}
					bind:value={collection}
					label="Fashion collection"
				/>
				<div class="fashion-grid">
					{#each products as product (product.name)}<article>
							<div class="fashion-art">
								<svg viewBox="0 0 200 220" role="img" aria-label={product.name}>
									<path
										d={product.path}
										fill={product.color}
										stroke="#655d51"
										stroke-width="2"
										stroke-linejoin="round"
									/>
								</svg>
							</div>
							<h3>{product.name}</h3>
							<p>{product.price}</p>
						</article>{/each}
				</div>
				<div class="fashion-actions">
					<label class="sr-only" for="garment-size">Garment size</label>
					<Select
						items={[
							{ id: 's', label: 'Small' },
							{ id: 'm', label: 'Medium' },
							{ id: 'l', label: 'Large' }
						]}
						bind:value={size}
						id="garment-size"
					/><Button
						label={time >= 8 ? 'Added to bag' : 'Add to bag'}
						icon={{ name: time >= 8 ? 'check' : 'add' }}
						variant="filled"
						color="primary"
					/>
				</div>
			{:else}<div class="paris-build">
					<MiniForm theme="paris" time={time - 2} interactive />
				</div>{/if}
		</section>
	</div>
</Theme>
