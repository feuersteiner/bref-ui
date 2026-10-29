<script lang="ts">
	import { Button, Pill, Select, Tabs, Theme } from 'bref-ui-themes/new-paris';
	import ParisLogin from './paris-login.svelte';
	import { smooth } from '../timeline.js';
	import campaign from '../../../docs/static/demos/new-paris-campaign.png';
	let { time }: { time: number } = $props();
	let collection = $state('new');
	let size = $state('m');
	const shopping = $derived(smooth((time - 9) / 2));
	const products = [
		{ name: 'The trench coat', price: '€390', image: './fashion/coat.jpg' },
		{ name: 'The silk shirt', price: '€145', image: './fashion/silk.jpg' },
		{ name: 'The city bag', price: '€210', image: './fashion/bag.jpg' }
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
				label={time >= 17 ? 'Bag (1)' : 'Bag (0)'}
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
			<div class="paris-panels">
				<div
					class="paris-login"
					style:opacity={1 - shopping}
					style:transform={`translateX(${-shopping * 120}px)`}
					style:pointer-events={shopping < 0.5 ? 'auto' : 'none'}
				>
					<ParisLogin {time} />
				</div>
				<div
					class="paris-shop"
					style:opacity={shopping}
					style:transform={`translateX(${(1 - shopping) * 120}px)`}
					style:pointer-events={shopping >= 0.5 ? 'auto' : 'none'}
				>
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
									<img src={product.image} alt={product.name} />
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
							label={time >= 17 ? 'Added to bag' : 'Add to bag'}
							icon={{ name: time >= 17 ? 'check' : 'add' }}
							variant="filled"
							color="primary"
						/>
					</div>
				</div>
			</div>
		</section>
	</div>
</Theme>
