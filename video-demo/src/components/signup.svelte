<script lang="ts">
	import { Button, Switch, Theme } from 'bref-ui';
	let {
		dark = false,
		color = '#7771d9',
		step = 4,
		time = 0
	}: { dark?: boolean; color?: `#${string}`; step?: number; time?: number } = $props();
	let enabled = $state(true);
	let clicked = $state(false);
	const saved = $derived(clicked || (time > 10 && time < 12));
</script>

<Theme palette={{ primary: color }} />
<div
	class={['signup-preview', { 'signup-dark': dark }]}
	style:color-scheme={dark ? 'dark' : 'light'}
>
	<div class="preview-heading">
		<span>
			<i></i>
			LIVE PREVIEW
		</span>
		<span>{dark ? 'DARK' : 'LIGHT'} ↗</span>
	</div>
	<div class="signup-orb signup-orb-one"></div>
	<div class="signup-orb signup-orb-two"></div>
	<section class="signup-card">
		{#if step >= 1}<div class="signup-icon">✳</div>
			<h2>
				Stay in
				<br />
				the loop.
			</h2>
			<p>
				Good ideas deserve
				<br />
				a little space.
			</p>{/if}
		{#if step >= 2}<label class="signup-toggle">
				<Switch bind:checked={enabled} size="medium" />Keep me inspired
			</label>{/if}
		{#if step >= 3}<Button
				label={saved ? "You're in!" : 'Count me in'}
				color="primary"
				variant="filled"
				size="large"
				trailingIcon={{ name: saved ? 'check' : 'arrow_forward' }}
				onClick={() => (clicked = !clicked)}
			/>{/if}
		{#if step >= 4}<p class="signup-fine">A little inspiration. Zero noise.</p>{/if}
	</section>
	<div class="preview-bottom">
		<span>REAL COMPONENTS.</span>
		<span>REAL POSSIBILITIES.</span>
	</div>
</div>
