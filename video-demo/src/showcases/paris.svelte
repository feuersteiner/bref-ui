<script lang="ts">
	import { Pill, Theme } from 'bref-ui-themes/new-paris';
	import MiniForm from '../components/mini-form.svelte';
	import campaign from '../../../docs/static/demos/new-paris-campaign.png';
	import { smooth } from '../timeline.js';
	let { time }: { time: number } = $props();
	const scroll = $derived(smooth((time - 2) / 5) * 720);
</script>

<Theme>
	<div class="paris-scroll" style:transform={`translateY(${-scroll}px)`}>
		<div class="paris-app">
			<nav class="paris-nav" aria-label="Atelier">
				<strong>ATELIER.</strong>
				<span>NEW PARIS</span>
			</nav>
			<div class="paris-grid">
				<div class="paris-campaign" style:transform={`translateY(${scroll}px)`}>
					<img src={campaign} alt="Black tailoring and ivory silk" />
				</div>
				<section class="paris-editorial">
					<Pill label="Nº 04" size="small" />
					<h2>
						Quietly
						<br />
						<em>remarkable.</em>
					</h2>
					<div class="paris-materials">
						<span>Italian wool & silk</span>
						<span>Made to measure</span>
						<span>Paris, France</span>
					</div>
				</section>
			</div>
			<section class="paris-build">
				<div></div>
				<MiniForm theme="paris" time={time - 2} interactive />
			</section>
		</div>
	</div>
</Theme>
