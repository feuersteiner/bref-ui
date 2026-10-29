<script lang="ts">
	import { Button, Checkbox, Pill, Progress, Surface, Switch, Theme } from 'bref-ui-themes/glassy';
	let { time }: { time: number } = $props();
	let playing = $state(true);
	let focused = $state(true);
	let checked = $state(false);
	const done = $derived(checked || time > 7);
</script>

<Theme>
	<div class="glass-app">
		<div class="glass-shape glass-shape-one" style:transform={`rotate(${-18 + time * 2}deg)`}></div>
		<div
			class="glass-shape glass-shape-two"
			style:transform={`translateY(${Math.sin(time / 2) * 22}px)`}
		></div>
		<nav class="glass-nav" aria-label="Daydream navigation">
			<strong>✳ daydream</strong>
			<div><Pill label="YOUR LITTLE CORNER OF THE INTERNET" glass variant="soft" /></div>
			<span>THURSDAY, 9:41 AM · ☀</span>
		</nav>
		<div class="glass-greeting">
			<p>A LITTLE SPACE TO FEEL GOOD.</p>
			<h2>
				Make room for
				<br />
				<em>the good stuff.</em>
			</h2>
		</div>
		<div class="glass-widgets">
			<Surface glass variant="soft" radius="x-large" spacing="large" class="music-widget">
				<div class="widget-heading">
					<span>NOW PLAYING</span>
					<span>♫</span>
				</div>
				<div class="record"><div>✳</div></div>
				<h3>Somewhere softer</h3>
				<p>The slow mornings playlist</p>
				<Progress value={0.3 + time / 40} label="Track progress" />
				<div class="music-controls">
					<Button
						icon={{ name: 'skip_previous' }}
						aria-label="Previous track"
						rounded
						glass
					/><Button
						icon={{ name: playing ? 'pause' : 'play_arrow' }}
						aria-label={playing ? 'Pause music' : 'Play music'}
						rounded
						variant="filled"
						color="primary"
						onClick={() => (playing = !playing)}
					/><Button icon={{ name: 'skip_next' }} aria-label="Next track" rounded glass />
				</div>
			</Surface>
			<div class="glass-right-widgets">
				<Surface glass variant="soft" radius="x-large" spacing="large" class="focus-widget">
					<div class="widget-heading">
						<span>A MOMENT FOR YOU</span>
						<span>☀</span>
					</div>
					<h3>
						Less rush.
						<br />
						More presence.
					</h3>
					<label><Switch bind:checked={focused} />A little focus mode</label>
					<Pill label="Take it at your own pace" color="primary" glass variant="soft" />
				</Surface><Surface
					glass
					variant="soft"
					radius="x-large"
					spacing="large"
					class="todo-widget"
				>
					<div class="widget-heading">
						<span>SMALL WINS</span>
						<span>♡</span>
					</div>
					<label>
						<Checkbox checked={done} onchange={() => (checked = !checked)} />
						<span class:checked={done}>Make something lovely</span>
					</label>
					<label><Checkbox checked />Step outside for a minute</label>
					<Progress value={done ? 1 : 0.5} label="Small wins completed" />
				</Surface>
			</div>
		</div>
	</div>
</Theme>
