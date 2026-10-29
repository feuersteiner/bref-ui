<script lang="ts">
	import { Button, Checkbox, Pill, TextInput, Theme } from 'bref-ui-themes/new-paris';
	import campaign from '../../../docs/static/demos/new-paris-campaign.png';
	let { time }: { time: number } = $props();
	let booked = $state(false);
	let consent = $state(true);
	const active = $derived(booked || time > 7);
</script>

<Theme>
	<div class="paris-app">
		<nav class="paris-nav" aria-label="Atelier navigation">
			<strong>ATELIER.</strong>
			<span>THE COLLECTION</span>
			<span>OUR STORY</span>
			<span>PARIS, FRANCE ↗</span>
		</nav>
		<div class="paris-grid">
			<div class="paris-campaign">
				<img src={campaign} alt="Black tailoring and ivory silk from the New Paris collection" />
				<span>COLLECTION Nº 04 / A STUDY IN CONTRAST</span>
			</div>
			<section class="paris-editorial">
				<Pill label="THE NEW EDITION" size="small" />
				<h2>
					Quietly
					<br />
					<em>remarkable.</em>
				</h2>
				<p>
					Considered details. A lasting impression.
					<br />
					For those who see beauty in the essentials.
				</p>
				<div class="paris-divider"></div>
				<label for="atelier-email">A PRIVATE INVITATION</label>
				<TextInput
					id="atelier-email"
					value="hello@your-studio.com"
					aria-label="Email for your private invitation"
					wide
				/>
				<label class="paris-consent">
					<Checkbox bind:checked={consent} />Keep me close to the collection.
				</label>
				<Button
					label={active ? 'Your invitation is on its way' : 'Discover the collection'}
					icon={active ? { name: 'check' } : undefined}
					trailingIcon={active ? undefined : { name: 'arrow_forward' }}
					variant="filled"
					color="primary"
					onClick={() => (booked = !booked)}
					wide
				/>
				<small>DESIGNED WITH NEW PARIS. BUILT WITH BREF.</small>
			</section>
		</div>
	</div>
</Theme>
